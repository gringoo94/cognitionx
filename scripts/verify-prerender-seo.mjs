#!/usr/bin/env node
/**
 * Verify SEO meta tags in pre-rendered dist/*.html files.
 * Checks that each prerendered route has exactly one of each required tag,
 * an absolute https og:image, and (for blog posts) BlogPosting JSON-LD.
 *
 * Usage: node scripts/verify-prerender-seo.mjs
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const DIST = resolve(process.cwd(), "dist");
const SITE = "https://cognitionx.cloud";

if (!existsSync(DIST)) {
  console.error("✖ dist/ not found — run `npm run build` first.");
  process.exit(1);
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
  // Find content="..." values for tags matched by `name` regex
  const out = [];
  const re = new RegExp(`<meta[^>]+${name}[^>]*content=["']([^"']+)["']`, "gi");
  let m;
  while ((m = re.exec(str))) out.push(m[1]);
  return out;
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
let totalWarns = 0;
const failed = [];

for (const file of files) {
  const rel = "/" + relative(DIST, file).replace(/\\/g, "/").replace(/index\.html$/, "");
  const html = readFileSync(file, "utf-8");
  const head = extractHead(html);
  const errs = [];

  for (const r of REQUIRED) {
    const n = countMatches(r.re, head);
    if (r.min !== undefined && n < r.min) errs.push(`${r.id}: missing (got ${n})`);
    if (r.max !== undefined && n > r.max) errs.push(`${r.id}: duplicated (got ${n})`);
  }

  // og:image must be absolute https URL
  const ogImg = attr("property=[\"']og:image[\"']", head)[0];
  if (ogImg && !/^https:\/\//i.test(ogImg)) {
    errs.push(`og:image: not absolute https (${ogImg})`);
  }

  // Blog post: og:type=article + BlogPosting schema
  const isBlogPost = /^\/blog\/[^/]+\/?$/.test(rel);
  if (isBlogPost) {
    const ogType = attr("property=[\"']og:type[\"']", head)[0];
    if (ogType !== "article") errs.push(`og:type: expected "article", got "${ogType ?? "missing"}"`);
    if (!/"@type"\s*:\s*"BlogPosting"/.test(head)) errs.push(`BlogPosting JSON-LD: missing`);
  }

  if (errs.length) {
    totalErrors += errs.length;
    failed.push({ rel, errs });
  }
}

console.log(`Scanned ${files.length} prerendered HTML files in dist/`);
if (failed.length === 0) {
  console.log(`✓ All pages passed SEO prerender checks.`);
  process.exit(0);
}

console.log(`\n✖ ${failed.length} file(s) failed (${totalErrors} issue(s)):\n`);
for (const f of failed) {
  console.log(`  ${f.rel}`);
  for (const e of f.errs) console.log(`    - ${e}`);
}
process.exit(1);
