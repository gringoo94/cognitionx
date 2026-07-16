/// <reference types="vite/client" />
// Load Markdown blog posts at build time via Vite raw glob import.
// Each file must have YAML frontmatter (title, description, date, tags, image, updatedAt?).
// Body is exposed as a single ContentBlock of type "markdown" and rendered
// by BlogPost.tsx with react-markdown (rehype-raw enabled).
import type { BlogPost, ContentBlock } from "../data/blogPosts";

// `import.meta.glob(...)` MUST appear as a direct call expression for Vite's
// static analyser to replace it with an object literal at build/serve time.
// Wrapping it in a ternary or guard prevents the transform and returns {}.
// Under plain Node ESM (vite-plugin-seo importing this at build closeBundle),
// the untransformed call throws — we swallow it and fall back to {}.
let files: Record<string, string> = {};
try {
  files = import.meta.glob("/src/content/blog/*.md", {
    eager: true,
    query: "?raw",
    import: "default",
  }) as Record<string, string>;
} catch {
  files = {};
}

/**
 * Minimal frontmatter parser. Supports:
 *   key: "value"     |  key: value
 *   key:
 *     - "item"       |    - item
 * Values may be quoted with " or '. No nested objects.
 */
function parseFrontmatter(src: string): { data: Record<string, any>; body: string } {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: src };
  const [, yaml, body] = m;
  const data: Record<string, any> = {};
  const lines = yaml.split(/\r?\n/);
  let currentKey: string | null = null;
  for (const raw of lines) {
    if (!raw.trim()) continue;
    const listMatch = raw.match(/^\s*-\s+(.*)$/);
    if (listMatch && currentKey) {
      const v = stripQuotes(listMatch[1].trim());
      if (!Array.isArray(data[currentKey])) data[currentKey] = [];
      data[currentKey].push(v);
      continue;
    }
    const kv = raw.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*:\s*(.*)$/);
    if (kv) {
      const key = kv[1];
      const val = kv[2].trim();
      if (val === "") {
        currentKey = key;
        data[key] = [];
      } else {
        currentKey = key;
        data[key] = stripQuotes(val);
      }
    }
  }
  return { data, body: body ?? "" };
}

function stripQuotes(s: string): string {
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    return s.slice(1, -1);
  }
  return s;
}

function slugFromPath(path: string): string {
  const base = path.split("/").pop() || "";
  return base.replace(/\.md$/i, "");
}

/**
 * Validate frontmatter. Throws a readable error (fails Vite build) on any
 * missing/malformed required field so authors get immediate feedback.
 *
 * Required: title, slug, date (YYYY-MM-DD), tags (non-empty list), cover (or image).
 * Optional: description, updatedAt.
 */
function validate(path: string, data: Record<string, any>): void {
  const errors: string[] = [];
  const rel = path.replace(/^.*\/src\/content\/blog\//, "src/content/blog/");

  const isNonEmptyStr = (v: any) => typeof v === "string" && v.trim().length > 0;

  if (!isNonEmptyStr(data.title)) errors.push('missing or empty "title"');
  if (!isNonEmptyStr(data.slug)) errors.push('missing or empty "slug"');
  else if (!/^[a-z0-9-]+$/.test(data.slug))
    errors.push(`"slug" must be lowercase kebab-case (got "${data.slug}")`);

  if (!isNonEmptyStr(data.date)) errors.push('missing "date"');
  else if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date))
    errors.push(`"date" must be YYYY-MM-DD (got "${data.date}")`);

  if (data.updatedAt !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(String(data.updatedAt)))
    errors.push(`"updatedAt" must be YYYY-MM-DD (got "${data.updatedAt}")`);

  if (!Array.isArray(data.tags) || data.tags.length === 0)
    errors.push('"tags" must be a non-empty YAML list');
  else if (!data.tags.every(isNonEmptyStr))
    errors.push('"tags" entries must all be non-empty strings');

  const cover = data.cover ?? data.image;
  if (!isNonEmptyStr(cover)) errors.push('missing "cover" (or "image")');

  const slugFile = slugFromPath(path);
  if (isNonEmptyStr(data.slug) && data.slug !== slugFile)
    errors.push(`"slug" (${data.slug}) must match filename (${slugFile}.md)`);

  if (errors.length) {
    throw new Error(
      `[blog-md] Invalid frontmatter in ${rel}:\n  - ${errors.join("\n  - ")}\n` +
        `Required fields: title, slug, date (YYYY-MM-DD), tags (list), cover.`
    );
  }
}

export const mdBlogPosts: BlogPost[] = Object.entries(files)
  .map(([path, raw]) => {
    const { data, body } = parseFrontmatter(raw);
    validate(path, data);
    const slug = data.slug as string;
    const content: ContentBlock[] = [{ type: "markdown", text: body }];
    return {
      id: slug,
      slug,
      title: data.title as string,
      description: (data.description as string) || "",
      image: (data.cover ?? data.image) as string,
      date: data.date as string,
      updatedAt: (data.updatedAt as string) || undefined,
      tags: data.tags as string[],
      content,
    } as BlogPost;
  })
  .sort((a, b) => (b.date || "").localeCompare(a.date || ""));
