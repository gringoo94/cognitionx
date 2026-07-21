#!/usr/bin/env node
/**
 * Verify SEO meta tags in pre-rendered dist/*.html files.
 * Checks that each prerendered route has exactly one of each required tag,
 * an absolute https og:image, and (for blog posts) BlogPosting JSON-LD.
 *
 * On failure, prints a diff of expected vs actual metadata
 * (title/description/canonical/og:url/og:title/og:description) sourced from
 * seo-routes.ts to speed up investigation.
 *
 * Usage: node scripts/verify-prerender-seo.mjs
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import esbuild from "esbuild";

const DIST = resolve(process.cwd(), "dist");
const SITE = "https://cognitionx.cloud";

if (!existsSync(DIST)) {
  console.error("✖ dist/ not found — run `npm run build` first.");
  process.exit(1);
}

// ---------- Load expected metadata from seo-routes.ts ----------
async function loadTs(relPath, exportName) {
  const src = readFileSync(resolve(process.cwd(), relPath), "utf-8");
  const { code } = await esbuild.transform(src, { loader: "ts", format: "esm" });
  const mod = await import(
    "data:text/javascript;base64," + Buffer.from(code).toString("base64")
  );
  return mod[exportName];
}

// Bundle a TS entry with all its imports resolved (needed for the blog
// registry, which imports the MD loader / manifest).
async function loadBundled(relPath, exportName) {
  const result = await esbuild.build({
    entryPoints: [resolve(process.cwd(), relPath)],
    bundle: true,
    write: false,
    format: "esm",
    platform: "node",
    target: "es2022",
    logLevel: "silent",
    // `import.meta.glob` is Vite-only; under Node it's undefined and the
    // loader's try/catch falls back to the generated manifest.
  });
  const code = result.outputFiles[0].text;
  const mod = await import(
    "data:text/javascript;base64," + Buffer.from(code).toString("base64")
  );
  return mod[exportName];
}

const seoRoutes = await loadTs("seo-routes.ts", "seoRoutes");
const redirects = (await loadTs("src/lib/redirects.ts", "redirects")) ?? [];
const redirectFromPaths = new Set(
  redirects
    .filter((r) => !r.wildcard)
    .map((r) => (r.from.replace(/\/$/, "") || "/"))
);

// Phase 5: unified blog registry is the source of truth for /blog/* metadata.
// Overrides seo-routes.ts so stale hand-edited titles/descriptions can't drift.
const blogPosts = (await loadBundled("src/data/blogPosts.ts", "blogPosts")) ?? [];
const postBySlug = new Map(blogPosts.map((p) => [p.slug, p]));

/** @type {Map<string, {title:string,description:string,canonical:string,ogUrl:string}>} */
const expectedByPath = new Map();
for (const r of seoRoutes) {
  const canonicalPath = r.canonicalPath ?? r.path;
  const canonical = `${SITE}${canonicalPath === "/" ? "/" : canonicalPath.replace(/\/$/, "")}`;
  let title = r.title;
  let description = r.description;
  const isSoftRedirect = !!r.canonicalPath && r.canonicalPath !== r.path;
  const m = !isSoftRedirect && r.path.match(/^\/blog\/([^/]+)$/);
  if (m) {
    const post = postBySlug.get(m[1]);
    if (post) {
      title = post.title;
      description = post.description || post.title;
    }
  }
  expectedByPath.set(r.path.replace(/\/$/, "") || "/", {
    title,
    description,
    canonical,
    ogUrl: canonical,
  });
}
// Also register auto-prerendered blog posts (those not present in seo-routes.ts).
for (const post of blogPosts) {
  const key = `/blog/${post.slug}`;
  if (expectedByPath.has(key)) continue;
  const canonical = `${SITE}${key}`;
  expectedByPath.set(key, {
    title: post.title,
    description: post.description || post.title,
    canonical,
    ogUrl: canonical,
  });
}

/** Recursively list every index.html under dist/. */
function listIndexHtml(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory()) out.push(...listIndexHtml(full));
    else if (entry === "index.html") out.push(full);
  }
  return out;
}

function extractHead(html) {
  const m = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  return m ? m[1] : html;
}

function countMatches(re, str) {
  return (str.match(re) || []).length;
}

function attr(name, str) {
  const out = [];
  const re = new RegExp(`<meta[^>]+${name}[^>]*content=["']([^"']+)["']`, "gi");
  let m;
  while ((m = re.exec(str))) out.push(m[1]);
  return out;
}

function firstTitle(str) {
  const m = str.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? m[1].trim() : undefined;
}

function firstMeta(nameAttr, str) {
  return attr(nameAttr, str)[0];
}

function firstLinkHref(rel, str) {
  const re = new RegExp(`<link[^>]+rel=["']${rel}["'][^>]*href=["']([^"']+)["']`, "i");
  const m = str.match(re);
  return m ? m[1] : undefined;
}

const REQUIRED = [
  { id: "title", re: /<title[ >]/gi, max: 1, min: 1 },
  { id: "description", re: /<meta[^>]+name=["']description["']/gi, max: 1, min: 1 },
  { id: "canonical", re: /<link[^>]+rel=["']canonical["']/gi, max: 1, min: 1 },
  { id: "robots", re: /<meta[^>]+name=["']robots["']/gi, max: 1, min: 1 },
  { id: "og:title", re: /property=["']og:title["']/gi, max: 1, min: 1 },
  { id: "og:description", re: /property=["']og:description["']/gi, max: 1, min: 1 },
  { id: "og:image", re: /property=["']og:image["'][^>]*>/gi, max: 1, min: 1 },
  { id: "twitter:image", re: /name=["']twitter:image["']/gi, max: 1, min: 1 },
  { id: "ld+json", re: /application\/ld\+json/gi, min: 1 },
];

const files = listIndexHtml(DIST).sort();
let totalErrors = 0;
const failed = [];

// ---------- Cross-file corpus: known blog slugs + sitemap URLs ----------
const knownBlogSlugs = new Set();
for (const f of files) {
  const rel = "/" + relative(DIST, f).replace(/\\/g, "/").replace(/index\.html$/, "");
  const norm = rel.replace(/\/$/, "");
  const m = norm.match(/^\/blog\/([^/]+)$/);
  if (!m) continue;
  if (redirectFromPaths.has(norm)) continue;
  knownBlogSlugs.add(m[1]);
}

const sitemapPath = join(DIST, "sitemap.xml");
const sitemapUrls = new Set();
if (existsSync(sitemapPath)) {
  const xml = readFileSync(sitemapPath, "utf-8");
  const re = /<loc>([^<]+)<\/loc>/g;
  let m;
  while ((m = re.exec(xml))) {
    const u = m[1].replace(/^https?:\/\/[^/]+/, "").replace(/\/$/, "") || "/";
    sitemapUrls.add(u);
  }
}

function extractRoot(html) {
  const m = html.match(/<div id="root">([\s\S]*?)<\/div>\s*(?:<script|<\/body)/i);
  return m ? m[1] : "";
}

function stripTags(str) {
  return str.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

const MIN_BODY_CHARS = 400;

function norm(u) {
  if (!u) return u;
  return u.replace(/\/$/, "") || "/";
}

function buildDiff(rel, head) {
  const key = norm(rel);
  const exp = expectedByPath.get(key) || expectedByPath.get(rel);
  if (!exp) return null;
  const actual = {
    title: firstTitle(head),
    description: firstMeta(`name=["']description["']`, head),
    canonical: firstLinkHref("canonical", head),
    "og:url": firstMeta(`property=["']og:url["']`, head),
    "og:title": firstMeta(`property=["']og:title["']`, head),
    "og:description": firstMeta(`property=["']og:description["']`, head),
  };
  const expected = {
    title: exp.title,
    description: exp.description,
    canonical: exp.canonical,
    "og:url": exp.ogUrl,
    "og:title": exp.title,
    "og:description": exp.description,
  };
  const rows = [];
  for (const k of Object.keys(expected)) {
    const e = expected[k];
    const a = actual[k];
    const eq =
      k === "canonical" || k === "og:url"
        ? norm(a) === norm(e)
        : (a ?? "") === (e ?? "");
    if (!eq) rows.push({ field: k, expected: e, actual: a });
  }
  return rows;
}

for (const file of files) {
  const rel = "/" + relative(DIST, file).replace(/\\/g, "/").replace(/index\.html$/, "");
  const html = readFileSync(file, "utf-8");
  const head = extractHead(html);
  const errs = [];

  // Redirect/gone pages are prerendered from src/lib/redirects.ts and
  // deliberately lack blog metadata, og:image, and JSON-LD.
  const isRedirectPage = redirectFromPaths.has(norm(rel));

  const skipTags = new Set(
    isRedirectPage ? ["og:image", "twitter:image", "ld+json"] : []
  );

  for (const r of REQUIRED) {
    if (skipTags.has(r.id)) continue;
    const n = countMatches(r.re, head);
    if (r.min !== undefined && n < r.min) errs.push(`${r.id}: missing (got ${n})`);
    if (r.max !== undefined && n > r.max) errs.push(`${r.id}: duplicated (got ${n})`);
  }

  const ogImg = attr("property=[\"']og:image[\"']", head)[0];
  if (ogImg && !/^https:\/\//i.test(ogImg)) {
    errs.push(`og:image: not absolute https (${ogImg})`);
  }

  const canonicalHref = (head.match(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i) || [])[1];
  // Soft-redirect pages intentionally point canonical at their destination
  // (see seo-routes.ts `canonicalPath`). Detect them and skip the self-ref check.
  const isSoftRedirect = /<meta[^>]+http-equiv=["']refresh["']/i.test(head) || isRedirectPage;
  if (canonicalHref && !isSoftRedirect) {
    const expected = `${SITE}${rel === "/" ? "/" : rel.replace(/\/$/, "")}`;
    const actual = canonicalHref.replace(/\/$/, "") || `${SITE}/`;
    const expectedNorm = expected.replace(/\/$/, "") || `${SITE}/`;
    if (actual !== expectedNorm && actual !== expected) {
      errs.push(`canonical: mismatch (page ${rel} → ${canonicalHref})`);
    }
    const ogUrl = attr("property=[\"']og:url[\"']", head)[0];
    if (ogUrl && ogUrl.replace(/\/$/, "") !== actual) {
      errs.push(`og:url: does not match canonical (${ogUrl} vs ${canonicalHref})`);
    }
  }

  const isBlogPost = /^\/blog\/[^/]+\/?$/.test(rel) && !isRedirectPage;
  if (isBlogPost) {
    const ogType = attr("property=[\"']og:type[\"']", head)[0];
    if (ogType !== "article") errs.push(`og:type: expected "article", got "${ogType ?? "missing"}"`);
    if (!/"@type"\s*:\s*"BlogPosting"/.test(head)) errs.push(`BlogPosting JSON-LD: missing`);

    const rootHtml = extractRoot(html);
    const bodyText = stripTags(rootHtml);
    if (!/<article[\s>]/i.test(rootHtml)) {
      errs.push(`body: <article> missing from #root (empty prerender)`);
    } else if (bodyText.length < MIN_BODY_CHARS) {
      errs.push(`body: too short — ${bodyText.length} chars (min ${MIN_BODY_CHARS})`);
    } else {
      const h1 = (rootHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1];
      if (!h1 || stripTags(h1).length < 5) {
        errs.push(`body: missing meaningful <h1>`);
      }
    }

    // Internal /blog link integrity: every /blog/<slug> href in the body
    // must resolve to a real prerendered slug (no legacy links, no typos).
    const hrefRe = /href=["']\/blog\/([a-z0-9-]+)(?:\/|["'#?])/gi;
    const seen = new Set();
    let hm;
    while ((hm = hrefRe.exec(rootHtml))) {
      const slug = hm[1];
      if (seen.has(slug)) continue;
      seen.add(slug);
      if (!knownBlogSlugs.has(slug)) {
        errs.push(`body: broken /blog link → /blog/${slug} (no prerender)`);
      }
    }

    // Sitemap presence for canonical blog pages.
    if (sitemapUrls.size && !sitemapUrls.has(rel.replace(/\/$/, ""))) {
      errs.push(`sitemap: missing ${rel}`);
    }
  }

  // Redirect sources must NOT appear in the sitemap.
  if (isRedirectPage && sitemapUrls.has(rel.replace(/\/$/, ""))) {
    errs.push(`sitemap: redirect source ${rel} should not be listed`);
  }

  if (errs.length) {
    totalErrors += errs.length;
    const diff = isRedirectPage ? null : buildDiff(rel, head);
    failed.push({ rel, errs, diff, isRedirectPage });
  }
}

console.log(`Scanned ${files.length} prerendered HTML files in dist/`);
if (failed.length === 0) {
  console.log(`✓ All pages passed SEO prerender checks.`);
  process.exit(0);
}

function truncate(v, n = 120) {
  if (v == null) return "<missing>";
  const s = String(v);
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

console.log(`\n✖ ${failed.length} file(s) failed (${totalErrors} issue(s)):\n`);
for (const f of failed) {
  console.log(`  ${f.rel}`);
  for (const e of f.errs) console.log(`    - ${e}`);
  if (f.diff && f.diff.length) {
    console.log(`    diff vs seo-routes.ts:`);
    for (const row of f.diff) {
      console.log(`      ${row.field}`);
      console.log(`        expected: ${truncate(row.expected)}`);
      console.log(`        actual:   ${truncate(row.actual)}`);
    }
  } else if (f.diff === null) {
    console.log(`    (no seo-routes.ts entry for ${f.rel} — cannot diff metadata)`);
  }
}
process.exit(1);
