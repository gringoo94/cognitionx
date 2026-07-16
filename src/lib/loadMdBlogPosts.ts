// Load Markdown blog posts at build time via Vite raw glob import.
// Each file must have YAML frontmatter (title, description, date, tags, image, updatedAt?).
// Body is exposed as a single ContentBlock of type "markdown" and rendered
// by BlogPost.tsx with react-markdown (rehype-raw enabled).
import type { BlogPost, ContentBlock } from "@/data/blogPosts";

const files = import.meta.glob("/src/content/blog/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

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

export const mdBlogPosts: BlogPost[] = Object.entries(files)
  .map(([path, raw]) => {
    const { data, body } = parseFrontmatter(raw);
    const slug = (data.slug as string) || slugFromPath(path);
    const content: ContentBlock[] = [{ type: "markdown", text: body }];
    return {
      id: slug,
      slug,
      title: (data.title as string) || slug,
      description: (data.description as string) || "",
      image: (data.image as string) || "/blog/ontologiya-psihoterapii.png",
      date: (data.date as string) || "",
      updatedAt: (data.updatedAt as string) || undefined,
      tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
      content,
    } as BlogPost;
  })
  .sort((a, b) => (b.date || "").localeCompare(a.date || ""));
