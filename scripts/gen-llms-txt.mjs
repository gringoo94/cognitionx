#!/usr/bin/env node
/**
 * Guard `public/llms.txt` against forgotten blog posts.
 *
 * Sources of truth (unified registry):
 *   - src/content/blog/_manifest.generated.ts  (Markdown posts)
 *   - src/data/blogPosts.ts                    (legacy JSON posts, regex parse)
 *   - src/data/dbBlogPosts.generated.ts        (published DB posts, regex parse)
 *
 * Behaviour:
 *   - Missing slugs (in registry, not linked from llms.txt) are inserted into
 *     an autoblock between `<!-- BLOG:AUTO-START -->` and `<!-- BLOG:AUTO-END -->`.
 *     The autoblock is created if the markers are absent.
 *   - Stale slugs (linked from llms.txt but absent from the registry, and not
 *     covered by src/lib/redirects.ts) → fatal error.
 *
 * Run automatically via `predev`/`prebuild`.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = process.cwd();
const LLMS = resolve(ROOT, "public/llms.txt");
const SITE = "https://cognitionx.cloud";
const START = "<!-- BLOG:AUTO-START -->";
const END = "<!-- BLOG:AUTO-END -->";

// ---------- Frontmatter parser (matches loadMdBlogPosts.ts) ----------
function parseFrontmatter(src) {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return null;
  const data = {};
  let key = null;
  for (const raw of m[1].split(/\r?\n/)) {
    if (!raw.trim()) continue;
    const li = raw.match(/^\s*-\s+(.*)$/);
    if (li && key) {
      const v = strip(li[1].trim());
      if (!Array.isArray(data[key])) data[key] = [];
      data[key].push(v);
      continue;
    }
    const kv = raw.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*:\s*(.*)$/);
    if (!kv) continue;
    key = kv[1];
    const val = kv[2].trim();
    data[key] = val === "" ? [] : strip(val);
  }
  return data;
}
function strip(v) {
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    return v.slice(1, -1);
  }
  return v;
}

// ---------- Load registry ----------
const registry = new Map(); // slug -> {title, description}

// 1. Markdown manifest
const manifestPath = resolve(ROOT, "src/content/blog/_manifest.generated.ts");
if (existsSync(manifestPath)) {
  const src = readFileSync(manifestPath, "utf-8");
  const re = /"(\/src\/content\/blog\/[^"]+\.md)":\s*"((?:\\.|[^"\\])*)"/g;
  let m;
  while ((m = re.exec(src))) {
    const raw = m[2].replace(/\\n/g, "\n").replace(/\\"/g, '"').replace(/\\\\/g, "\\");
    const fm = parseFrontmatter(raw);
    if (!fm || !fm.slug) continue;
    registry.set(fm.slug, {
      title: fm.title || fm.slug,
      description: fm.description || "",
    });
  }
}

// 2. Legacy JSON posts (regex over top-level fields)
const legacyPath = resolve(ROOT, "src/data/blogPosts.ts");
if (existsSync(legacyPath)) {
  const src = readFileSync(legacyPath, "utf-8");
  // Each post starts with `{\n    id: "...",`; capture slug/title/description.
  const re = /\{\s*id:\s*"[^"]+",\s*slug:\s*"([^"]+)",\s*title:\s*"([^"]+)",\s*description:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(src))) {
    if (!registry.has(m[1])) {
      registry.set(m[1], { title: m[2], description: m[3] });
    }
  }
}

// 3. DB-generated catalog
const dbPath = resolve(ROOT, "src/data/dbBlogPosts.generated.ts");
if (existsSync(dbPath)) {
  const src = readFileSync(dbPath, "utf-8");
  const re = /slug:\s*"([^"]+)"[\s\S]*?title:\s*"([^"]+)"[\s\S]*?description:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(src))) {
    if (!registry.has(m[1])) {
      registry.set(m[1], { title: m[2], description: m[3] });
    }
  }
}

// ---------- Load redirect sources so their old slugs are not treated as stale ----------
const redirectSlugs = new Set();
const redirectsPath = resolve(ROOT, "src/lib/redirects.ts");
if (existsSync(redirectsPath)) {
  const src = readFileSync(redirectsPath, "utf-8");
  const re = /from:\s*"\/blog\/([a-z0-9-]+)"/g;
  let m;
  while ((m = re.exec(src))) redirectSlugs.add(m[1]);
}

// ---------- Read llms.txt, find linked slugs ----------
if (!existsSync(LLMS)) {
  console.error(`✖ ${LLMS} not found`);
  process.exit(1);
}
let text = readFileSync(LLMS, "utf-8");
const linked = new Set();
const slugRe = /\/blog\/([a-z0-9-]+)/g;
let hit;
while ((hit = slugRe.exec(text))) linked.add(hit[1]);

// ---------- Diff ----------
const missing = [...registry.keys()].filter((s) => !linked.has(s)).sort();
const stale = [...linked].filter(
  (s) => !registry.has(s) && !redirectSlugs.has(s)
);

if (stale.length) {
  console.error(
    `✖ public/llms.txt links ${stale.length} slug(s) missing from the registry and not covered by redirects.ts:`
  );
  for (const s of stale) console.error(`    /blog/${s}`);
  process.exit(1);
}

// ---------- Rebuild autoblock ----------
const lines = missing.length
  ? [
      START,
      "",
      "### Дополнительно (авто)",
      "",
      ...missing.map((slug) => {
        const { title, description } = registry.get(slug);
        const desc = description ? `: ${description}` : "";
        return `- [${title}](${SITE}/blog/${slug})${desc}`;
      }),
      "",
      END,
    ].join("\n")
  : `${START}\n${END}`;

const blockRe = new RegExp(`${escapeRe(START)}[\\s\\S]*?${escapeRe(END)}`);
if (blockRe.test(text)) {
  text = text.replace(blockRe, lines);
} else {
  // Insert just before "## Optional" if present, otherwise append.
  const optIdx = text.indexOf("\n## Optional");
  if (optIdx >= 0) {
    text = text.slice(0, optIdx) + "\n\n" + lines + "\n" + text.slice(optIdx);
  } else {
    text = text.replace(/\s*$/, "\n\n" + lines + "\n");
  }
}
function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

writeFileSync(LLMS, text);
console.log(
  `✓ llms.txt guard: ${registry.size} registry posts, ${linked.size} linked, ${missing.length} appended to autoblock, 0 stale.`
);
