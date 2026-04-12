import { Plugin } from "vite";
import { seoRoutes } from "./seo-routes";
import * as fs from "fs";
import * as path from "path";

const SITE_URL = "https://cognitionx.cloud";
const OG_IMAGE = `${SITE_URL}/og-default.webp`;

/**
 * Generates a synchronous inline <script> that runs before React hydrates.
 * It reads window.location.pathname, looks up SEO data from a baked-in map,
 * and injects <title>, <meta>, <link rel="canonical"> into <head>.
 * 
 * This works with SPA hosting because the script runs in the single index.html
 * that the server returns for every route.
 */
export function seoPlugin(): Plugin {
  return {
    name: "vite-plugin-seo-inline",
    apply: "build",
    closeBundle() {
      const distDir = path.resolve(process.cwd(), "dist");
      const indexPath = path.join(distDir, "index.html");
      let html = fs.readFileSync(indexPath, "utf-8");

      // Build the route map as a compact JSON object
      const routeMap: Record<string, { t: string; d: string }> = {};
      for (const r of seoRoutes) {
        routeMap[r.path] = { t: r.title, d: r.description };
      }

      const script = `<script>
(function(){
  var S="${SITE_URL}",I="${OG_IMAGE}",R=${JSON.stringify(routeMap)};
  var p=location.pathname.replace(/\\/$/,"") || "/";
  var m=R[p];
  if(!m)return;
  var u=S+p,h=document.head;
  document.title=m.t;
  function a(tag,attrs){var e=document.createElement(tag);for(var k in attrs)e.setAttribute(k,attrs[k]);h.appendChild(e);}
  function meta(n,c){a("meta",{name:n,content:c});}
  function og(n,c){a("meta",{property:n,content:c});}
  a("link",{rel:"canonical",href:u});
  meta("description",m.d);
  meta("robots","index, follow");
  og("og:type","website");
  og("og:url",u);
  og("og:title",m.t);
  og("og:description",m.d);
  og("og:image",I);
  og("og:locale","ru_RU");
  og("og:site_name","Психолог Дмитрий Яцко");
  meta("twitter:card","summary_large_image");
  meta("twitter:title",m.t);
  meta("twitter:description",m.d);
  meta("twitter:image",I);
})();
</script>`;

      // Insert the script right after <head> so it runs before anything else
      html = html.replace("<head>", "<head>\n" + script);

      fs.writeFileSync(indexPath, html);
      console.log(`[seo-plugin] Injected inline SEO script with ${seoRoutes.length} routes into index.html`);
    },
  };
}
