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

  // ---- Geo assets --------------------------------------------------------
  const geoCount = await generateGeo(seoRoutes, today);

  // eslint-disable-next-line no-console
  console.log(
    `[llm-assets] sitemap.xml (${urls.length} urls) + llms-full.txt (${sortedPosts.length} posts) + llms-geo.txt (${geoCount} pages) written`,
  );
}

const GEO_START = "<!-- GEO:AUTO-START -->";
const GEO_END = "<!-- GEO:AUTO-END -->";

const GEO_FACTS = [
  "Язык консультаций: русский (единственный язык работы).",
  "Формат: онлайн из любой страны и часового пояса; очно — только в Кишинёве (Молдова).",
  "Цены: разовая консультация 40 €, пакет из 4 сессий 140 € (35 € за сессию).",
  "Бесплатное знакомство: 20 минут, без оплаты и обязательств.",
  "Методы: когнитивно-поведенческая терапия (КПТ) и схема-терапия.",
  "Специалист: Дмитрий Яцко, психолог, практика CognitionX.",
];

function clip(s: string, max = 200): string {
  const t = String(s || "").replace(/\s+/g, " ").trim();
  return t.length <= max ? t : t.slice(0, max - 1).replace(/[\s,.;:—-]+$/, "") + "…";
}

/**
 * Rebuilds the geo section of public/llms.txt (between GEO:AUTO markers) and
 * writes public/llms-geo.txt — a compact plain-text corpus of every geo
 * landing (city / country hub / region), so LLMs can cite local specifics
 * instead of a generic "онлайн, русский язык" stub.
 *
 * Sources of truth: seo-routes.ts (which /psiholog-* routes exist) enriched
 * with src/data/cityPages.ts and src/data/countryHubs.ts.
 */
async function generateGeo(seoRoutes: any[], today: string): Promise<number> {
  const { cityPages } = await import("./src/data/cityPages");
  const { countryHubs } = await import("./src/data/countryHubs");

  const cityBySlug = new Map<string, any>(cityPages.map((c: any) => [c.slug, c]));
  const hubBySlug = new Map<string, any>(countryHubs.map((h: any) => [h.slug, h]));

  const geoRoutes = seoRoutes.filter(
    (r) => !r.noindex && /^\/psiholog-[^/]+$/.test(r.path),
  );

  type Row = { path: string; label: string; desc: string };
  const countries: Row[] = [];
  const cities: Row[] = [];
  const audiences: Row[] = [];

  for (const r of geoRoutes) {
    const slug = r.path.slice(1);
    const city = cityBySlug.get(slug);
    const hub = hubBySlug.get(slug);
    if (city) {
      const tz = city.utcOffset ? ` Часовой пояс: ${city.timezone} (${city.utcOffset}).` : "";
      cities.push({
        path: r.path,
        label: `Психолог ${city.cityIn}`,
        desc: clip(`${city.metaDescription}${tz}`, 260),
      });
    } else if (hub) {
      const tz = hub.utcOffset ? ` Часовой пояс: ${hub.timezone} (${hub.utcOffset}).` : "";
      countries.push({
        path: r.path,
        label: `Психолог ${hub.countryIn}`,
        desc: clip(`${hub.metaDescription}${tz}`, 260),
      });
    } else {
      const bucket = /dlya-/.test(slug)
        ? audiences
        : slug === "psiholog-moskva"
          ? cities
          : countries;
      const label = r.title.split("|")[0].replace(/\s*—\s*КПТ\s*$/, "").trim();
      bucket.push({ path: r.path, label, desc: clip(r.description, 260) });
    }
  }

  const section = (title: string, rows: Row[]) =>
    rows.length
      ? [
          `### ${title}`,
          "",
          ...rows.map((x) => `- [${x.label}](${SITE_URL}${x.path}): ${x.desc}`),
          "",
        ]
      : [];

  const block = [
    GEO_START,
    "",
    "## География и форматы работы",
    "",
    ...GEO_FACTS.map((f) => `- ${f}`),
    "",
    `Полные тексты гео-страниц (местный контекст, частые запросы, FAQ): ${SITE_URL}/llms-geo.txt`,
    "",
    ...section("Страны и регионы", countries),
    ...section("Города", cities),
    ...section("Отдельные аудитории", audiences),
    GEO_END,
  ].join("\n");

  const llmsPath = path.resolve("public/llms.txt");
  if (fs.existsSync(llmsPath)) {
    let text = fs.readFileSync(llmsPath, "utf-8");
    const re = new RegExp(
      `${GEO_START.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[\\s\\S]*?${GEO_END.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`,
    );
    if (re.test(text)) {
      text = text.replace(re, block);
    } else {
      const optIdx = text.indexOf("\n## Optional");
      text =
        optIdx >= 0
          ? text.slice(0, optIdx) + "\n\n" + block + "\n" + text.slice(optIdx)
          : text.replace(/\s*$/, "\n\n" + block + "\n");
    }
    fs.writeFileSync(llmsPath, text);
  }

  // ---- llms-geo.txt ------------------------------------------------------
  const parts: string[] = [
    "# CognitionX — гео-страницы (полный текст)",
    "",
    `> Психолог Дмитрий Яцко (КПТ и схема-терапия). Локальный контекст по странам и городам: местная система психологической помощи, частые запросы, FAQ. Каталог сайта: ${SITE_URL}/llms.txt`,
    "",
    `Обновлено: ${today}`,
    `Всего гео-страниц: ${geoRoutes.length}`,
    "",
    ...GEO_FACTS.map((f) => `- ${f}`),
    "",
    "---",
    "",
  ];

  for (const r of geoRoutes) {
    const slug = r.path.slice(1);
    const city = cityBySlug.get(slug);
    const hub = hubBySlug.get(slug);
    const lines: string[] = [];

    if (city) {
      lines.push(`## ${city.h1}`, "", `URL: ${SITE_URL}${r.path}`);
      lines.push(`Город: ${city.city} (${city.country}, ${city.countryCode})`);
      lines.push(`Часовой пояс: ${city.timezone} (${city.utcOffset})`);
      lines.push("", stripHtml(city.subtitle || ""), "", stripHtml(city.intro || ""));
      if (city.painPoints?.length) {
        lines.push("", "### С чем обращаются");
        for (const p of city.painPoints) lines.push(`- ${p.title}: ${stripHtml(p.text)}`);
      }
      if (city.localSystem) {
        lines.push(
          "",
          "### Местная система помощи",
          `- Страховка: ${stripHtml(city.localSystem.insurance)}`,
          `- Государственный путь: ${stripHtml(city.localSystem.publicRoute)}`,
          `- Частный путь: ${stripHtml(city.localSystem.privateRoute)}`,
        );
      }
      if (city.faq?.length) {
        lines.push("", "### FAQ");
        for (const f of city.faq) lines.push(`**${f.question}**`, stripHtml(f.answer), "");
      }
      if (city.localKeywords?.length) lines.push(`Ключевые запросы: ${city.localKeywords.join(", ")}`);
    } else if (hub) {
      lines.push(`## ${hub.h1}`, "", `URL: ${SITE_URL}${r.path}`);
      lines.push(`Страна: ${hub.country} (${hub.countryCode}), местный язык: ${hub.language}`);
      lines.push(`Часовой пояс: ${hub.timezone} (${hub.utcOffset})`);
      lines.push("", stripHtml(hub.subtitle || ""), "", stripHtml(hub.intro || ""));
      if (hub.systemOverview?.length) {
        lines.push("", "### Система психологической помощи");
        for (const s of hub.systemOverview) lines.push(`- ${s.title}: ${stripHtml(s.text)}`);
      }
      if (hub.expatContext?.length) {
        lines.push("", "### Контекст эмиграции");
        for (const t of hub.expatContext) lines.push(`- ${stripHtml(t)}`);
      }
      if (hub.whyOnline?.length) {
        lines.push("", "### Почему онлайн на русском");
        for (const t of hub.whyOnline) lines.push(`- ${stripHtml(t)}`);
      }
      if (hub.cities?.length) {
        lines.push(
          "",
          `Города: ${hub.cities.map((s: string) => `${SITE_URL}/${s}`).join(", ")}`,
        );
      }
      if (hub.faq?.length) {
        lines.push("", "### FAQ");
        for (const f of hub.faq) lines.push(`**${f.question}**`, stripHtml(f.answer), "");
      }
    } else {
      lines.push(`## ${r.title.split("|")[0].trim()}`, "", `URL: ${SITE_URL}${r.path}`, "", clip(r.description, 400));
    }

    parts.push(lines.filter((l) => l !== undefined).join("\n").replace(/\n{3,}/g, "\n\n"), "", "---", "");
  }

  fs.writeFileSync(path.resolve("public/llms-geo.txt"), parts.join("\n"));
  return geoRoutes.length;
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
