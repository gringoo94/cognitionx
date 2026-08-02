// Vite plugin: generates public/sitemap.xml and public/llms-full.txt
// from the same data sources the app uses (seo-routes.ts + src/data/blogPosts.ts).
//
// Runs at:
//   - configResolved (dev server) — so dev preview serves fresh files
//   - buildStart (vite build)     — so the build output has fresh files
//
// Both files land in public/ which is served by Vite in dev and copied to
// dist/ at build time.
//
// Sitemap entries get a real <lastmod> based on blog post `updatedAt || date`,
// or a build-day timestamp for static routes. AI/search crawlers use this to
// prioritise recrawls.
//
// llms-full.txt follows the llmstxt.org convention: front-matter style header
// + every blog post as a "## Title" block with plain-text body. This lets
// ChatGPT / Claude / Perplexity ingest the full corpus in one request.

import type { Plugin } from "vite";
import * as fs from "fs";
import * as path from "path";

const SITE_URL = "https://cognitionx.cloud";

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<li[^>]*>/gi, "- ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&laquo;/g, "«")
    .replace(/&raquo;/g, "»")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function priorityFor(p: string): string {
  if (p === "/") return "1.0";
  if (/^\/blog\//.test(p)) return "0.7";
  if (/^\/tools(\/|$)/.test(p)) return "0.8";
  if (/^\/psiholog-/.test(p)) return "0.7";
  return "0.6";
}

function changefreqFor(p: string): string {
  if (p === "/" || p === "/blog") return "weekly";
  if (/^\/blog\//.test(p)) return "monthly";
  return "monthly";
}

async function generate() {
  // Dynamic imports so this works in TS without esbuild config tweaks
  const { seoRoutes } = await import("./seo-routes");
  const { blogPosts } = await import("./src/data/blogPosts");

  const today = new Date().toISOString().slice(0, 10);

  // ---- Sitemap -----------------------------------------------------------
  // <lastmod> is emitted ONLY when we have an authoritative, page-specific
  // timestamp. Blog posts have one (`updatedAt || date`). Static routes do
  // not — stamping them with the build date would rewrite 80 lastmods on
  // every deploy and destroy the value of the signal for crawlers, so we
  // omit the element entirely for those URLs.
  const blogLastmod = new Map<string, string>();
  for (const post of blogPosts) {
    const lastmod = (post as any).updatedAt || post.date;
    blogLastmod.set(`/blog/${post.slug}`, lastmod);
  }

  const urls = seoRoutes
    .filter((r) => !r.noindex)
    .map((r) => {
      const lastmod = blogLastmod.get(r.path);
      return [
        "  <url>",
        `    <loc>${SITE_URL}${r.path}</loc>`,
        lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
        `    <changefreq>${changefreqFor(r.path)}</changefreq>`,
        `    <priority>${priorityFor(r.path)}</priority>`,
        "  </url>",
      ]
        .filter(Boolean)
        .join("\n");
    });


  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    "</urlset>",
    "",
  ].join("\n");

  fs.writeFileSync(path.resolve("public/sitemap.xml"), sitemap);

  // ---- llms-full.txt -----------------------------------------------------
  // Sorted newest-first; LLM ingestion tends to weigh earlier content higher.
  const sortedPosts = [...blogPosts].sort((a, b) =>
    (b.date || "").localeCompare(a.date || ""),
  );

  const header = [
    "# CognitionX — полный корпус блога",
    "",
    `> Психолог Дмитрий Яцко (КПТ и схема-терапия). Полные тексты статей блога в plain-text для ИИ-агентов и LLM. Каталог сайта: ${SITE_URL}/llms.txt. Источник правды: ${SITE_URL}`,
    "",
    `Сайт: ${SITE_URL}`,
    `Автор: Дмитрий Яцко (психолог, КПТ и схема-терапия)`,
    `Язык: ru-RU`,
    `Обновлено: ${today}`,
    `Всего статей: ${sortedPosts.length}`,
    "",
    "---",
    "",
  ].join("\n");

  const articles = sortedPosts.map((post) => {
    const url = `${SITE_URL}/blog/${post.slug}`;
    const dateModified = (post as any).updatedAt || post.date;
    const body = post.content
      .map((b: any) => {
        if (b.type === "heading") {
          const hashes = "#".repeat((b.level || 2) + 1);
          return `${hashes} ${stripHtml(b.text)}`;
        }
        if (b.type === "quote") {
          return `> ${stripHtml(b.text)}`;
        }
        if (b.type === "component") {
          return `_[интерактивный компонент: ${b.componentId}]_`;
        }
        return stripHtml(b.text);
      })
      .filter(Boolean)
      .join("\n\n");

    return [
      `## ${post.title}`,
      "",
      `URL: ${url}`,
      `Опубликовано: ${post.date}`,
      ...(dateModified !== post.date ? [`Обновлено: ${dateModified}`] : []),
      `Теги: ${post.tags.join(", ")}`,
      "",
      post.description,
      "",
      body,
      "",
      "---",
      "",
    ].join("\n");
  });

  const llmsFull = header + articles.join("");
  fs.writeFileSync(path.resolve("public/llms-full.txt"), llmsFull);

  // eslint-disable-next-line no-console
  console.log(
    `[llm-assets] sitemap.xml (${urls.length} urls) + llms-full.txt (${sortedPosts.length} posts) written`,
  );
}

export function llmAssetsPlugin(): Plugin {
  return {
    name: "vite-plugin-llm-assets",
    async configResolved() {
      try {
        await generate();
      } catch (e) {
        console.warn("[llm-assets] generation failed:", e);
      }
    },
    async buildStart() {
      try {
        await generate();
      } catch (e) {
        console.warn("[llm-assets] generation failed:", e);
      }
    },
  };
}
