import { Plugin } from "vite";
import { seoRoutes } from "./seo-routes";
import * as fs from "fs";
import * as path from "path";

const SITE_URL = "https://cognitionx.cloud";

function generateMetaTags(route: typeof seoRoutes[0]): string {
  const url = `${SITE_URL}${route.path}`;
  const image = `${SITE_URL}/og-default.webp`;

  return `
    <title>${route.title}</title>
    <meta name="description" content="${route.description}" />
    <link rel="canonical" href="${url}" />
    <meta name="robots" content="index, follow" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${route.title}" />
    <meta property="og:description" content="${route.description}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:locale" content="ru_RU" />
    <meta property="og:site_name" content="Психолог Дмитрий Яцко" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${route.title}" />
    <meta name="twitter:description" content="${route.description}" />
    <meta name="twitter:image" content="${image}" />`;
}

export function seoPlugin(): Plugin {
  return {
    name: "vite-plugin-seo-prerender",
    apply: "build",
    closeBundle() {
      const distDir = path.resolve(process.cwd(), "dist");
      const indexHtml = fs.readFileSync(path.join(distDir, "index.html"), "utf-8");

      for (const route of seoRoutes) {
        if (route.path === "/") continue; // index.html already exists

        // Inject meta tags into <head> of index.html
        const metaTags = generateMetaTags(route);
        const modifiedHtml = indexHtml.replace("</head>", `${metaTags}\n  </head>`);

        // Create directory structure: /depression -> /depression/index.html
        const routePath = route.path.startsWith("/") ? route.path.slice(1) : route.path;
        const dir = path.join(distDir, routePath);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, "index.html"), modifiedHtml);
      }

      // Also inject meta for homepage into root index.html
      const homeRoute = seoRoutes.find((r) => r.path === "/");
      if (homeRoute) {
        const metaTags = generateMetaTags(homeRoute);
        const modifiedHome = indexHtml.replace("</head>", `${metaTags}\n  </head>`);
        fs.writeFileSync(path.join(distDir, "index.html"), modifiedHome);
      }

      console.log(`[seo-plugin] Generated ${seoRoutes.length} SEO-optimized HTML files`);
    },
  };
}
