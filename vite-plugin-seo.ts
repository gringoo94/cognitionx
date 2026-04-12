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
    closeBundle() {
      const distDir = path.resolve(process.cwd(), "dist");
      const indexPath = path.join(distDir, "index.html");
      const baseHtml = fs.readFileSync(indexPath, "utf-8");

      let count = 0;

      for (const route of seoRoutes) {
        const routePath = route.path;
        const url = `${SITE_URL}${routePath}`;

        // Build static meta tags block
        const metaBlock = [
          `<title>${escapeHtml(route.title)}</title>`,
          `<meta name="description" content="${escapeAttr(route.description)}" />`,
          `<link rel="canonical" href="${url}" />`,
          `<meta name="robots" content="index, follow" />`,
          `<meta property="og:type" content="website" />`,
          `<meta property="og:url" content="${url}" />`,
          `<meta property="og:title" content="${escapeAttr(route.title)}" />`,
          `<meta property="og:description" content="${escapeAttr(route.description)}" />`,
          `<meta property="og:image" content="${OG_IMAGE}" />`,
          `<meta property="og:locale" content="ru_RU" />`,
          `<meta property="og:site_name" content="Психолог Дмитрий Яцко" />`,
          `<meta name="twitter:card" content="summary_large_image" />`,
          `<meta name="twitter:title" content="${escapeAttr(route.title)}" />`,
          `<meta name="twitter:description" content="${escapeAttr(route.description)}" />`,
          `<meta name="twitter:image" content="${OG_IMAGE}" />`,
        ].join("\n    ");

        // Replace fallback title/description/canonical in the base HTML
        let html = baseHtml;

        // Remove existing fallback <title> and replace
        html = html.replace(/<title>[^<]*<\/title>/, "");
        // Remove existing fallback meta description
        html = html.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/, "");
        // Remove existing fallback canonical
        html = html.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/, "");

        // Inject full meta block after <head> opening + charset + viewport
        html = html.replace(
          /(<meta\s+name="viewport"[^>]*>)/,
          `$1\n    ${metaBlock}`
        );

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

      console.log(`[seo-plugin] Generated ${count} pre-rendered HTML files with static SEO meta tags`);
    },
  };
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeAttr(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
