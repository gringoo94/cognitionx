import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, RefreshCw, Play, ExternalLink } from "lucide-react";

interface Row {
  url: string;
  coverage_state: string | null;
  verdict: string | null;
  indexing_state: string | null;
  robots_state: string | null;
  fetch_state: string | null;
  google_canonical: string | null;
  user_canonical: string | null;
  last_crawl_time: string | null;
  checked_at: string;
}

type StatusBucket = "indexed" | "crawled-not-indexed" | "excluded" | "error" | "unchecked";

function bucket(r?: Row): StatusBucket {
  if (!r) return "unchecked";
  const v = (r.verdict ?? "").toUpperCase();
  const c = (r.coverage_state ?? "").toLowerCase();
  if (v === "PASS") return "indexed";
  if (c.includes("crawled - currently not indexed") || c.includes("discovered")) return "crawled-not-indexed";
  if (v === "FAIL" || v === "NEUTRAL") return "excluded";
  return "error";
}

const bucketStyle: Record<StatusBucket, string> = {
  indexed: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
  "crawled-not-indexed": "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
  excluded: "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30",
  error: "bg-muted text-muted-foreground border-border",
  unchecked: "bg-muted text-muted-foreground border-border",
};

const bucketLabel: Record<StatusBucket, string> = {
  indexed: "Indexed",
  "crawled-not-indexed": "Crawled · not indexed",
  excluded: "Excluded",
  error: "Error",
  unchecked: "Not checked",
};

const ORIGIN = "https://cognitionx.cloud";

export default function AdminIndexation() {
  const [urls, setUrls] = useState<string[]>([]);
  const [rows, setRows] = useState<Record<string, Row>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusBucket | "all">("all");
  const [busy, setBusy] = useState<string | null>(null);
  const [batchRunning, setBatchRunning] = useState(false);
  const [batchProgress, setBatchProgress] = useState<{ done: number; total: number } | null>(null);

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const [sitemapRes, dbRes] = await Promise.all([
        fetch("/sitemap.xml").then((r) => r.text()),
        supabase.from("indexation_status").select("*"),
      ]);
      const urlList = Array.from(sitemapRes.matchAll(/<loc>([^<]+)<\/loc>/g))
        .map((m) => m[1].trim())
        .filter(Boolean);
      setUrls(urlList);
      const map: Record<string, Row> = {};
      for (const r of (dbRes.data ?? []) as Row[]) map[r.url] = r;
      setRows(map);
    } finally {
      setLoading(false);
    }
  }

  async function inspectOne(url: string) {
    setBusy(url);
    try {
      const { data, error } = await supabase.functions.invoke("gsc-inspect", { body: { url } });
      if (error) throw error;
      if (data?.row) setRows((p) => ({ ...p, [url]: data.row as Row }));
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(null);
    }
  }

  async function batchInspect(targetUrls: string[]) {
    setBatchRunning(true);
    setBatchProgress({ done: 0, total: targetUrls.length });
    for (let i = 0; i < targetUrls.length; i++) {
      const u = targetUrls[i];
      try {
        const { data } = await supabase.functions.invoke("gsc-inspect", { body: { url: u } });
        if (data?.row) setRows((p) => ({ ...p, [u]: data.row as Row }));
      } catch (e) {
        console.error("inspect failed", u, e);
      }
      setBatchProgress({ done: i + 1, total: targetUrls.length });
      // GSC quota: ~600/min. Throttle to 1 req/sec to be safe.
      await new Promise((r) => setTimeout(r, 1100));
    }
    setBatchRunning(false);
    setBatchProgress(null);
  }

  const enriched = useMemo(
    () => urls.map((u) => ({ url: u, row: rows[u], status: bucket(rows[u]) })),
    [urls, rows]
  );

  const counts = useMemo(() => {
    const c: Record<StatusBucket, number> = {
      indexed: 0,
      "crawled-not-indexed": 0,
      excluded: 0,
      error: 0,
      unchecked: 0,
    };
    for (const e of enriched) c[e.status]++;
    return c;
  }, [enriched]);

  const visible = useMemo(() => {
    const f = filter.trim().toLowerCase();
    return enriched.filter((e) => {
      if (statusFilter !== "all" && e.status !== statusFilter) return false;
      if (f && !e.url.toLowerCase().includes(f)) return false;
      return true;
    });
  }, [enriched, filter, statusFilter]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground text-sm py-8">
        <Loader2 className="w-4 h-4 animate-spin" /> Загружаю sitemap и кэш…
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {(["indexed", "crawled-not-indexed", "excluded", "error", "unchecked"] as StatusBucket[]).map((b) => (
          <button
            key={b}
            onClick={() => setStatusFilter(statusFilter === b ? "all" : b)}
            className={`rounded-lg border px-3 py-2 text-left transition ${bucketStyle[b]} ${
              statusFilter === b ? "ring-2 ring-primary" : ""
            }`}
          >
            <div className="text-xs opacity-80">{bucketLabel[b]}</div>
            <div className="text-lg font-bold">{counts[b]}</div>
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder="Фильтр по URL…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-xs"
        />
        <Button size="sm" variant="outline" onClick={load} disabled={batchRunning}>
          <RefreshCw className="w-4 h-4 mr-1" /> Обновить кэш
        </Button>
        <Button
          size="sm"
          onClick={() => batchInspect(visible.map((v) => v.url))}
          disabled={batchRunning || visible.length === 0}
        >
          <Play className="w-4 h-4 mr-1" />
          Проверить видимые ({visible.length})
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => batchInspect(enriched.filter((e) => e.status === "unchecked").map((e) => e.url))}
          disabled={batchRunning || counts.unchecked === 0}
        >
          <Play className="w-4 h-4 mr-1" />
          Проверить непроверенные ({counts.unchecked})
        </Button>
        {batchProgress && (
          <span className="text-xs text-muted-foreground">
            {batchProgress.done}/{batchProgress.total} · ~1 URL/сек
          </span>
        )}
        <span className="text-xs text-muted-foreground ml-auto">
          Всего {urls.length} URL · квота GSC ~2000 проверок/сутки
        </span>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-3 px-4 py-2 text-xs font-medium text-muted-foreground border-b border-border bg-muted/40">
          <div>URL</div>
          <div className="w-44">Статус</div>
          <div className="w-32">Проверено</div>
          <div className="w-20 text-right">Действие</div>
        </div>
        {visible.length === 0 && (
          <div className="px-4 py-8 text-sm text-muted-foreground text-center">Ничего не найдено</div>
        )}
        {visible.map(({ url, row, status }) => {
          const path = url.replace(ORIGIN, "") || "/";
          return (
            <div
              key={url}
              className="grid grid-cols-[1fr_auto_auto_auto] gap-3 px-4 py-2 text-sm border-b border-border last:border-b-0 items-center"
            >
              <div className="truncate flex items-center gap-2 min-w-0">
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-foreground truncate"
                  title={url}
                >
                  {path}
                </a>
                <ExternalLink className="w-3 h-3 text-muted-foreground shrink-0" />
              </div>
              <div className="w-44">
                <span
                  className={`inline-block rounded-md border px-2 py-0.5 text-xs ${bucketStyle[status]}`}
                  title={
                    row
                      ? `coverage: ${row.coverage_state ?? "—"}\nverdict: ${row.verdict ?? "—"}\nindexing: ${row.indexing_state ?? "—"}`
                      : "Не проверено"
                  }
                >
                  {bucketLabel[status]}
                </span>
              </div>
              <div className="w-32 text-xs text-muted-foreground">
                {row?.checked_at
                  ? new Date(row.checked_at).toLocaleDateString("ru-RU", {
                      day: "numeric",
                      month: "short",
                    })
                  : "—"}
              </div>
              <div className="w-20 text-right">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => inspectOne(url)}
                  disabled={busy === url || batchRunning}
                >
                  {busy === url ? <Loader2 className="w-3 h-3 animate-spin" /> : "Check"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
