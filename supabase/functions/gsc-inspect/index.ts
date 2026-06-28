// Inspects a URL via Google Search Console URL Inspection API and caches the
// result into public.indexation_status. Admin-only.

import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GATEWAY = "https://connector-gateway.lovable.dev/google_search_console";
const SITE_URL = "https://cognitionx.cloud/";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const GSC_API_KEY = Deno.env.get("GOOGLE_SEARCH_CONSOLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!LOVABLE_API_KEY || !GSC_API_KEY || !SUPABASE_URL || !SERVICE_KEY) {
      return json({ error: "Server misconfigured" }, 500);
    }

    // Auth: require admin
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace(/^Bearer\s+/i, "");
    if (!token) return json({ error: "Unauthorized" }, 401);

    const sb = createClient(SUPABASE_URL, SERVICE_KEY);
    const { data: userData, error: userErr } = await sb.auth.getUser(token);
    if (userErr || !userData?.user) return json({ error: "Unauthorized" }, 401);

    const { data: roles } = await sb
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .eq("role", "admin");
    if (!roles || roles.length === 0) return json({ error: "Forbidden" }, 403);

    // Input
    let body: { url?: string } = {};
    try { body = await req.json(); } catch { /* noop */ }
    const url = String(body.url ?? "").trim();
    if (!url || !/^https?:\/\//.test(url) || url.length > 2000) {
      return json({ error: "Invalid url" }, 400);
    }

    // Call GSC
    const gscRes = await fetch(`${GATEWAY}/v1/urlInspection/index:inspect`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": GSC_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inspectionUrl: url, siteUrl: SITE_URL }),
    });

    const text = await gscRes.text();
    if (!gscRes.ok) {
      console.error("GSC error", gscRes.status, text);
      return json({ error: "GSC request failed", status: gscRes.status, detail: text.slice(0, 500) }, 502);
    }

    let raw: Record<string, unknown> = {};
    try { raw = JSON.parse(text); } catch { /* noop */ }
    const ir = (raw?.inspectionResult ?? {}) as Record<string, unknown>;
    const idx = (ir?.indexStatusResult ?? {}) as Record<string, unknown>;

    const row = {
      url,
      coverage_state: (idx.coverageState as string) ?? null,
      verdict: (idx.verdict as string) ?? null,
      indexing_state: (idx.indexingState as string) ?? null,
      robots_state: (idx.robotsTxtState as string) ?? null,
      fetch_state: (idx.pageFetchState as string) ?? null,
      google_canonical: (idx.googleCanonical as string) ?? null,
      user_canonical: (idx.userCanonical as string) ?? null,
      last_crawl_time: (idx.lastCrawlTime as string) ?? null,
      checked_at: new Date().toISOString(),
      raw,
    };

    const { error: upsertErr } = await sb
      .from("indexation_status")
      .upsert(row, { onConflict: "url" });
    if (upsertErr) {
      console.error("Upsert error", upsertErr);
      return json({ error: "DB error" }, 500);
    }

    return json({ success: true, row });
  } catch (e) {
    console.error(e);
    return json({ error: "Internal error" }, 500);
  }
});

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
