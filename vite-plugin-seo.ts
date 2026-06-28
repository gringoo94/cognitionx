import { Plugin } from "vite";
import { seoRoutes } from "./seo-routes";
import * as fs from "fs";
import * as path from "path";

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

      let count = 0;
      let blogCount = 0;

      for (const route of seoRoutes) {
        const routePath = route.path;
        const canonicalUrl = `${SITE_URL}${route.canonicalPath || routePath}`;
        const url = `${SITE_URL}${routePath}`;
        const ogType = route.ogType || "website";
        const ogImage = route.ogImage || OG_IMAGE;

        // Build static meta tags
        const metaTags = [
          `<title>${escapeHtml(route.title)}</title>`,
          `<meta name="description" content="${escapeAttr(route.description)}" />`,
          `<link rel="canonical" href="${url}" />`,
          `<link rel="alternate" hreflang="ru" href="${url}" />`,
          `<link rel="alternate" hreflang="x-default" href="${url}" />`,
          `<meta name="robots" content="${route.noindex ? "noindex, nofollow" : "index, follow"}" />`,
          `<meta name="theme-color" content="#0F172A" />`,
          `<meta property="og:type" content="${ogType}" />`,
          `<meta property="og:url" content="${url}" />`,
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
              dateModified: post.dateModified || post.date,
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
    },
  };
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
