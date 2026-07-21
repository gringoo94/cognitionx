#!/usr/bin/env node
/**
 * Rewrite legacy /blog/<old-slug> links inside content sources to their
 * current canonical slug, using src/lib/redirects.ts as the source of truth.
 *
 * Scans:
 *   - src/content/blog/**\/*.md
 *   - src/data/blogPosts.ts
 *
 * By default, prints a dry-run diff. Pass --write to persist changes.
 *
 * Usage:
 *   node scripts/rewrite-legacy-links.mjs           # dry-run
 *   node scripts/rewrite-legacy-links.mjs --write   # apply
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import esbuild from "node:module";
import esbuildPkg from "esbuild";

const WRITE = process.argv.includes("--write");

async function loadRedirects() {
  const src = readFileSync(resolve("src/lib/redirects.ts"), "utf-8");
  const { code } = await esbuildPkg.transform(src, { loader: "ts", format: "esm" });
  const mod = await import(
    "data:text/javascript;base64," + Buffer.from(code).toString("base64")
  );
  return mod.redirects;
}

function walk(dir) {
  const out = [];
  for (const e of readdirSync(dir)) {
    const full = join(dir, e);
    const s = statSync(full);
    if (s.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

const redirects = await loadRedirects();
// Only concrete /blog/... → /blog/... 301 redirects are relevant for content rewrites.
const blogMap = new Map();
for (const r of redirects) {
  if (r.type !== "301") continue;
  if (r.wildcard) continue;
  if (!r.from.startsWith("/blog/")) continue;
  if (!r.to.startsWith("/blog/")) continue;
  blogMap.set(r.from, r.to);
}

if (!blogMap.size) {
  console.log("No blog → blog redirects to rewrite.");
  process.exit(0);
}

const targets = [
  ...walk("src/content/blog").filter((f) => f.endsWith(".md")),
  "src/data/blogPosts.ts",
];

let totalHits = 0;
const perFile = [];

for (const file of targets) {
  const original = readFileSync(file, "utf-8");
  let updated = original;
  const hits = [];
  for (const [from, to] of blogMap) {
    // Match /blog/<slug> as a whole path segment (avoid partial matches).
    const re = new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(?![a-z0-9-])", "g");
    const count = (updated.match(re) || []).length;
    if (count) {
      updated = updated.replace(re, to);
      hits.push({ from, to, count });
      totalHits += count;
    }
  }
  if (hits.length) {
    perFile.push({ file, hits, changed: updated !== original });
    if (WRITE && updated !== original) writeFileSync(file, updated);
  }
}

if (!totalHits) {
  console.log("✓ No legacy /blog/* links found in content.");
  process.exit(0);
}

console.log(`${WRITE ? "Rewrote" : "Would rewrite"} ${totalHits} legacy link(s) in ${perFile.length} file(s):\n`);
for (const { file, hits } of perFile) {
  console.log(`  ${file}`);
  for (const h of hits) console.log(`    ${h.from} → ${h.to}  (${h.count})`);
}
if (!WRITE) console.log(`\nDry-run only. Re-run with --write to persist.`);
