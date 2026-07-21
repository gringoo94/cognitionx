import { Plugin } from "vite";
import { seoRoutes } from "./seo-routes";
import { concreteRedirects } from "./src/lib/redirects";
import * as fs from "fs";
import * as path from "path";
import { marked } from "marked";

const SITE_URL = "https://cognitionx.cloud";
const OG_IMAGE = `${SITE_URL}/og-default.webp`;

/**
 * Pre-renders per-route HTML files with static SEO meta tags.
 * For each route in seoRoutes, creates a copy of index.html at the
 * corresponding path (e.g. /about → dist/about/index.html) with
 * baked-in <title>, <meta description>, OG tags, and canonical link.
 *
 * This gives crawlers that don't execute JS all the SEO signals they need.
 */
export function seoPlugin(): Plugin {
  return {
    name: "vite-plugin-seo-prerender",
    apply: "build",
    async closeBundle() {
      const distDir = path.resolve(process.cwd(), "dist");
      const indexPath = path.join(distDir, "index.html");
      if (!fs.existsSync(indexPath)) {
        console.warn("[seo-plugin] dist/index.html not found, skipping SEO pre-render");
        return;
      }
      const baseHtml = fs.readFileSync(indexPath, "utf-8");

      // Load blog posts so we can inline article HTML into prerendered /blog/:slug pages.
      // main.tsx uses createRoot (not hydrateRoot), so injected children inside #root are
      // safely discarded on first client render — no hydration mismatch.
      let blogPostsBySlug = new Map<string, any>();
      try {
        const mod: any = await import("./src/data/blogPosts");
        for (const p of mod.blogPosts) blogPostsBySlug.set(p.slug, p);
      } catch (err) {
        console.warn("[seo-plugin] could not load blogPosts for article prerender:", err);
      }

      // Build the effective route list: seoRoutes + auto-generated entries for
      // any published blog post that lacks an explicit seo-routes.ts row. This
      // makes new .md posts fully self-serve — no need to hand-edit seo-routes
      // or sitemap.xml.
      const explicitPaths = new Set(seoRoutes.map((r) => r.path.replace(/\/$/, "") || "/"));
      const autoBlogRoutes: typeof seoRoutes = [];
      for (const [slug, post] of blogPostsBySlug) {
        const p = `/blog/${slug}`;
        if (!explicitPaths.has(p)) {
          autoBlogRoutes.push({
            path: p,
            title: post.title,
            description: post.description || post.title,
            ogType: "article",
          });
        }
      }
      if (autoBlogRoutes.length) {
        console.log(`[seo-plugin] Auto-registered ${autoBlogRoutes.length} blog routes missing from seo-routes.ts`);
      }
      const effectiveRoutes = [...seoRoutes, ...autoBlogRoutes];

      let count = 0;
      let blogCount = 0;

      let overrideCount = 0;
      for (const route of effectiveRoutes) {
        const routePath = route.path;
        const canonicalUrl = `${SITE_URL}${route.canonicalPath || routePath}`;
        const url = `${SITE_URL}${routePath}`;

        // Soft redirect: when canonicalPath differs from path (legacy URL
        // consolidating onto a new target), emit a <meta http-equiv=refresh>
        // so browsers navigate to the destination without JS. Combined with
        // noindex + canonical-to-target this behaves like a static 301 for
        // crawlers on plain static hosting.
        const isSoftRedirect = !!route.canonicalPath && route.canonicalPath !== route.path;

        // Phase 5: for any /blog/<slug> route (non-redirect), the unified
        // registry (blogPosts.ts merges MD + legacy JSON + DB) is the source
        // of truth for title/description/ogType. Overrides seo-routes.ts so
        // stale hand-edited metadata cannot drift from the actual post.
        let effTitle = route.title;
        let effDescription = route.description;
        let effOgType: string = route.ogType || "website";
        const blogSlugMatch = !isSoftRedirect && routePath.match(/^\/blog\/([^/]+)$/);
        if (blogSlugMatch) {
          const post = blogPostsBySlug.get(blogSlugMatch[1]);
          if (post) {
            if (post.title && post.title !== effTitle) overrideCount++;
            effTitle = post.title;
            effDescription = post.description || post.title;
            effOgType = "article";
          }
        }
        const ogImage = route.ogImage || OG_IMAGE;

        // Build static meta tags
        const metaTags = [
          `<title>${escapeHtml(effTitle)}</title>`,
          `<meta name="description" content="${escapeAttr(effDescription)}" />`,
          `<link rel="canonical" href="${canonicalUrl}" />`,
          `<link rel="alternate" hreflang="ru" href="${canonicalUrl}" />`,
          `<link rel="alternate" hreflang="x-default" href="${canonicalUrl}" />`,
          `<meta name="robots" content="${route.noindex ? "noindex, nofollow" : "index, follow"}" />`,
          `<meta name="theme-color" content="#0F172A" />`,
          `<meta property="og:type" content="${ogType}" />`,
          `<meta property="og:url" content="${canonicalUrl}" />`,
          `<meta property="og:title" content="${escapeAttr(route.title)}" />`,
          `<meta property="og:description" content="${escapeAttr(route.description)}" />`,
          `<meta property="og:image" content="${ogImage}" />`,
          `<meta property="og:image:width" content="1200" />`,
          `<meta property="og:image:height" content="630" />`,
          `<meta property="og:locale" content="ru_RU" />`,
          `<meta property="og:site_name" content="Психолог Дмитрий Яцко" />`,
          `<meta name="twitter:card" content="summary_large_image" />`,
          `<meta name="twitter:title" content="${escapeAttr(route.title)}" />`,
          `<meta name="twitter:description" content="${escapeAttr(route.description)}" />`,
          `<meta name="twitter:image" content="${ogImage}" />`,
        ];
        if (isSoftRedirect) {
          metaTags.push(
            `<meta http-equiv="refresh" content="0; url=${canonicalUrl}" />`,
            `<link rel="preload" as="fetch" href="${canonicalUrl}" />`
          );
        }

        let html = baseHtml;

        // Strip every tag we re-emit so we don't end up with duplicates
        // from the static index.html fallback head.
        const stripPatterns: RegExp[] = [
          /<title>[\s\S]*?<\/title>\s*/gi,
          /<meta\s+name="description"[^>]*>\s*/gi,
          /<link\s+rel="canonical"[^>]*>\s*/gi,
          /<link\s+rel="alternate"\s+hreflang="[^"]*"[^>]*>\s*/gi,
          /<meta\s+name="robots"[^>]*>\s*/gi,
          /<meta\s+name="theme-color"[^>]*>\s*/gi,
          /<meta\s+property="og:(?:type|url|title|description|image|image:width|image:height|locale|site_name)"[^>]*>\s*/gi,
          /<meta\s+name="twitter:(?:card|title|description|image)"[^>]*>\s*/gi,
        ];
        for (const re of stripPatterns) html = html.replace(re, "");

        // Append BlogPosting JSON-LD for blog post routes.
        if (route.path.startsWith("/blog/") && route.path !== "/blog/") {
          const slug = route.path.replace(/^\/blog\//, "").replace(/\/$/, "");
          const post = blogPostsBySlug.get(slug);
          if (post) {
            const blogPosting = {
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: route.title,
              description: route.description,
              image: ogImage,
              datePublished: post.date,
              dateModified: post.dateModified || post.updatedAt || post.date,
              mainEntityOfPage: { "@type": "WebPage", "@id": url },
              author: { "@type": "Person", name: "Дмитрий Яцко", url: `${SITE_URL}/` },
              publisher: { "@id": `${SITE_URL}/#organization` },
              inLanguage: "ru-RU",
            };
            metaTags.push(
              `<script type="application/ld+json">${JSON.stringify(blogPosting)}</script>`
            );
          }
        }

        const metaBlock = metaTags.join("\n    ");

        // Inject full meta block after <head> opening + charset + viewport
        html = html.replace(
          /(<meta\s+name="viewport"[^>]*>)/,
          `$1\n    ${metaBlock}`
        );

        // For blog post routes, inline the article body into #root so crawlers
        // that don't execute JS see the full content (not just meta tags).
        const slugMatch = routePath.match(/^\/blog\/([^/]+)$/);
        if (slugMatch) {
          const post = blogPostsBySlug.get(slugMatch[1]);
          if (post) {
            const articleHtml = renderArticleHtml(post, url);
            html = html.replace(
              /<div id="root"><\/div>/,
              `<div id="root">${articleHtml}</div>`
            );
            blogCount++;
          }
        }

        // Determine output path
        if (routePath === "/") {
          // Overwrite the root index.html
          fs.writeFileSync(indexPath, html);
        } else {
          // Create dist/about/index.html, dist/blog/post/index.html, etc.
          const dir = path.join(distDir, routePath);
          fs.mkdirSync(dir, { recursive: true });
          fs.writeFileSync(path.join(dir, "index.html"), html);
        }
        count++;
      }

      console.log(`[seo-plugin] Generated ${count} pre-rendered HTML files (${blogCount} with inlined blog article body)`);

      // Emit soft-redirect/410 pages from the unified redirects registry.
      const redirectPaths = new Set<string>();
      const routePaths = new Set(effectiveRoutes.map((r) => r.path));
      let redirectCount = 0;
      for (const entry of concreteRedirects()) {
        if (routePaths.has(entry.from)) continue; // a real route wins
        const targetUrl = entry.type === "301" ? `${SITE_URL}${entry.to}` : "";
        const html = renderRedirectHtml(baseHtml, entry, targetUrl);
        const dir = path.join(distDir, entry.from);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, "index.html"), html);
        redirectPaths.add(entry.from);
        redirectCount++;
      }
      console.log(`[seo-plugin] Generated ${redirectCount} redirect/gone pre-rendered HTML files`);

      // Regenerate dist/sitemap.xml from the effective route list so newly added
      // .md posts appear automatically and lastmod tracks each post's updatedAt.
      writeSitemap(distDir, effectiveRoutes, blogPostsBySlug, redirectPaths);
    },
  };
}

function renderRedirectHtml(
  baseHtml: string,
  entry: { from: string; to?: string; type: "301" | "410" },
  targetUrl: string
): string {
  let html = baseHtml;
  const stripPatterns: RegExp[] = [
    /<title>[\s\S]*?<\/title>\s*/gi,
    /<meta\s+name="description"[^>]*>\s*/gi,
    /<link\s+rel="canonical"[^>]*>\s*/gi,
    /<link\s+rel="alternate"\s+hreflang="[^"]*"[^>]*>\s*/gi,
    /<meta\s+name="robots"[^>]*>\s*/gi,
    /<meta\s+property="og:(?:type|url|title|description|image|image:width|image:height|locale|site_name)"[^>]*>\s*/gi,
    /<meta\s+name="twitter:(?:card|title|description|image)"[^>]*>\s*/gi,
  ];
  for (const re of stripPatterns) html = html.replace(re, "");

  const isGone = entry.type === "410";
  const title = isGone ? "Страница удалена" : "Перенаправление…";
  const description = isGone
    ? "Эта страница больше не доступна."
    : `Эта страница переехала на ${entry.to}.`;
  const canonical = isGone ? `${SITE_URL}${entry.from}` : targetUrl;

  const meta = [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeAttr(description)}" />`,
    `<link rel="canonical" href="${canonical}" />`,
    `<meta name="robots" content="${isGone ? "noindex, nofollow" : "noindex, follow"}" />`,
    isGone
      ? ``
      : `<meta http-equiv="refresh" content="0; url=${targetUrl}" />`,
    isGone ? `` : `<link rel="preload" as="fetch" href="${targetUrl}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:title" content="${escapeAttr(title)}" />`,
    `<meta property="og:description" content="${escapeAttr(description)}" />`,
  ]
    .filter(Boolean)
    .join("\n    ");

  html = html.replace(/(<meta\s+name="viewport"[^>]*>)/, `$1\n    ${meta}`);

  // Visible fallback body for crawlers that ignore meta refresh and for humans
  // hitting the URL with JS disabled.
  const body = isGone
    ? `<main><h1>Страница удалена (410 Gone)</h1><p>Эта публикация больше не поддерживается. Возможно, вам подойдёт <a href="/blog">блог</a>.</p></main>`
    : `<main><h1>Страница переехала</h1><p>Открываем новую страницу: <a href="${entry.to}">${escapeHtml(entry.to || "")}</a></p></main>`;
  html = html.replace(/<div id="root"><\/div>/, `<div id="root">${body}</div>`);

  return html;
}

function writeSitemap(
  distDir: string,
  routes: { path: string; noindex?: boolean; canonicalPath?: string }[],
  blogPostsBySlug: Map<string, any>,
  redirectPaths: Set<string>
) {
  const today = new Date().toISOString().slice(0, 10);
  const seen = new Set<string>();
  const urls: string[] = [];
  for (const r of routes) {
    if (r.noindex) continue;
    const p = r.canonicalPath || r.path;
    if (seen.has(p)) continue;
    if (redirectPaths.has(p)) continue; // never advertise a redirected URL
    seen.add(p);
    const isBlogPost = /^\/blog\/[^/]+$/.test(p);
    const slug = isBlogPost ? p.replace(/^\/blog\//, "") : "";
    const post = slug ? blogPostsBySlug.get(slug) : null;
    const lastmod = post?.updatedAt || post?.date || today;
    const priority = p === "/" ? "1.0" : isBlogPost ? "0.7" : "0.6";
    const changefreq = p === "/" || p === "/blog" ? "weekly" : "monthly";
    urls.push(
      `  <url>\n    <loc>${SITE_URL}${p}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`
    );
  }
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
  fs.writeFileSync(path.join(distDir, "sitemap.xml"), xml);
  console.log(`[seo-plugin] Wrote sitemap.xml (${urls.length} URLs)`);
}

/**
 * Render a blog post into static HTML for crawler-visible prerender.
 * Uses semantic tags so Google, GPTBot, ClaudeBot, PerplexityBot can ingest
 * the article without executing JavaScript. Content is replaced on hydration
 * since main.tsx uses createRoot (no hydration mismatch).
 */
function renderArticleHtml(post: any, url: string): string {
  const dateIso = post.date;
  const dateLabel = new Date(post.date).toLocaleDateString("ru", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const blocks: string[] = [];
  for (const block of post.content || []) {
    if (block.type === "preface") {
      blocks.push(`<p data-speakable>${block.text}</p>`);
    } else if (block.type === "heading") {
      const tag = block.level === 2 ? "h2" : "h3";
      blocks.push(`<${tag}>${block.text}</${tag}>`);
    } else if (block.type === "quote") {
      blocks.push(`<blockquote>${block.text}</blockquote>`);
    } else if (block.type === "text") {
      blocks.push(`<div>${block.text}</div>`);
    } else if (block.type === "markdown") {
      // Strip custom directives (:::preface, ::component{#id}) so marked
      // renders plain markdown for crawlers; the interactive React path
      // handles them at runtime.
      const cleaned = String(block.text || "")
        .replace(/^::[a-zA-Z][\w-]*\{[^}]*\}\s*$/gm, "")
        .replace(/^:::\s*[a-zA-Z][\w-]*\s*$/gm, "")
        .replace(/^:::\s*$/gm, "");
      blocks.push(marked.parse(cleaned, { async: false }) as string);
    }
    // "component" blocks are interactive — skipped in static prerender.
  }

  const tags = (post.tags || [])
    .map((t: string) => `<span>${escapeHtml(t)}</span>`)
    .join(" ");

  return [
    `<main>`,
    `<article>`,
    `<header>`,
    `<time datetime="${dateIso}">${dateLabel}</time>`,
    `<h1>${escapeHtml(post.title)}</h1>`,
    `<p>${escapeHtml(post.description)}</p>`,
    tags ? `<div>${tags}</div>` : ``,
    `</header>`,
    blocks.join(""),
    `<footer><p><a href="${url}">${url}</a></p></footer>`,
    `</article>`,
    `</main>`,
  ].join("");
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeAttr(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
