/**
 * Single source of truth for URL redirects and gone pages.
 *
 * Consumed by:
 *   - src/App.tsx — renders <Navigate/> or <Gone/> at runtime for the SPA
 *   - vite-plugin-seo.ts — emits static HTML with meta-refresh + canonical
 *     + noindex for each entry, so crawlers see a soft-301/410 without JS
 *
 * Types:
 *   301 — permanent redirect (SEO signal: consolidate onto `to`)
 *   410 — gone (SEO signal: drop from index)
 *
 * Notes on paths:
 *   - Concrete paths (no wildcards) get a prerendered HTML file
 *   - Wildcard paths (ending in /*) are wired only in App.tsx
 */

export type RedirectEntry =
  | { from: string; to: string; type: "301"; wildcard?: boolean }
  | { from: string; type: "410" };

export const redirects: RedirectEntry[] = [
  // Old Tilda URLs
  { from: "/about_cognitionx", to: "/about", type: "301" },
  { from: "/cognitionx", to: "/", type: "301" },
  { from: "/cognitionx/", to: "/", type: "301" },
  { from: "/oursolution", to: "/", type: "301" },
  { from: "/practice/generator", to: "/tools", type: "301" },
  { from: "/tpost/*", to: "/blog", type: "301", wildcard: true },
  { from: "/it-specialist", to: "/psiholog-dlya-it", type: "301" },
  { from: "/css/*", to: "/", type: "301", wildcard: true },

  // Lost Tilda URLs with active impressions in GSC
  { from: "/dehumanization", to: "/blog/dehumanizaciya-chto-eto", type: "301" },
  { from: "/popcornbrain", to: "/blog/trevoga-bez-prichiny", type: "301" },

  // Merged/renamed blog posts
  { from: "/blog/who-5-blagopoluchie", to: "/tools/tests/who-5", type: "301" },
  { from: "/blog/tri-karty-realnosti-v-psihoterapii", to: "/blog/ontologiya-psihoterapii", type: "301" },
  { from: "/blog/lovushka-yarlykov-kategorii", to: "/blog/lovushka-yarlykov", type: "301" },
  { from: "/blog/kak-vybrat-kpt-psihologa", to: "/blog/kak-vybrat-psihologa", type: "301" },
  { from: "/blog/vygoranie-ili-ustalost", to: "/blog/vygoranie-simptomy-vosstanovlenie", type: "301" },
  { from: "/blog/postoyannaya-trevoga-bez-prichiny", to: "/blog/trevoga-bez-prichiny", type: "301" },
  { from: "/blog/simptomy-trevozhnogo-rasstrojstva", to: "/blog/povyshennaya-trevozhnost", type: "301" },
  { from: "/blog/kak-spravitsya-s-trevozhnostyu", to: "/blog/kak-izbavitsya-ot-trevogi", type: "301" },
  { from: "/blog/priznaki-depressii", to: "/blog/kak-ponyat-chto-u-menya-depressiya", type: "301" },
  { from: "/blog/chto-takoe-kpt", to: "/blog/kpt-polnyj-gajd", type: "301" },

  // Legacy in-body slug variants (typos/renames surfaced by seo:check)
  { from: "/blog/cena-bezdejstvija", to: "/blog/tsena-bezdejstviya", type: "301" },
  { from: "/blog/cena-bezdejstviya", to: "/blog/tsena-bezdejstviya", type: "301" },
  { from: "/blog/tsena-bezdeystviya", to: "/blog/tsena-bezdejstviya", type: "301" },
  { from: "/blog/dva-stilya-myshleniya-pri-ruminacii", to: "/blog/rfcbt-dva-stilya-myshleniya", type: "301" },
  { from: "/blog/ruminaciya-myslennaya-zhvachka", to: "/blog/rfcbt-dva-stilya-myshleniya", type: "301" },
  { from: "/blog/fomo-i-vybor", to: "/blog/fomo-strah-upustit-vybor", type: "301" },
  { from: "/blog/strah-upustit-luchshij-variant", to: "/blog/fomo-strah-upustit-vybor", type: "301" },
  { from: "/blog/kak-bystro-uspokoitsya", to: "/blog/kak-uspokoitsya", type: "301" },
  { from: "/blog/koleso-emocij-brene-braun", to: "/blog/koleso-emocij", type: "301" },
  { from: "/blog/kolelso-emocij-brenne-braun-katalog", to: "/blog/koleso-emocij", type: "301" },
  { from: "/blog/odinochestvo", to: "/blog/odinochestvo-kak-faktor-zdorovya", type: "301" },
  { from: "/blog/pochemu-strashno-prosit-o-pomoshhi", to: "/blog/pochemu-my-boimsya-prosit-o-pomoshchi", type: "301" },
  { from: "/blog/pochemu-strashno-prosit-o-pomoshi", to: "/blog/pochemu-my-boimsya-prosit-o-pomoshchi", type: "301" },
  { from: "/blog/prosit-o-pomoshi", to: "/blog/pochemu-my-boimsya-prosit-o-pomoshchi", type: "301" },
  { from: "/blog/utrennyaya-trevoga", to: "/blog/utrom-net-sil-zhit", type: "301" },
  { from: "/blog/vygoranie-na-rabote-kak-raspoznat", to: "/blog/vygoranie-simptomy-vosstanovlenie", type: "301" },

  // Tools old paths
  { from: "/koleso-emocij", to: "/tools/emotion-wheel", type: "301" },
  { from: "/abc-analysis", to: "/tools/abc-analysis", type: "301" },
  { from: "/schema-quiz", to: "/tools/schema-quiz", type: "301" },
  { from: "/emotion-wheel", to: "/tools/emotion-wheel", type: "301" },

  // Old Tilda URLs from GSC 404s
  { from: "/etonormalno", to: "/anxiety", type: "301" },
  { from: "/oprosnikbeka", to: "/tools/tests/phq-9", type: "301" },
  { from: "/mnetakskazali", to: "/blog/kto-tebe-eto-skazal", type: "301" },
  { from: "/uspeh", to: "/thank-you", type: "301" },
  { from: "/insomnia", to: "/anxiety", type: "301" },
  { from: "/cbt_depression", to: "/blog/kpt-pri-depressii", type: "301" },
  { from: "/Contact Us", to: "/contact", type: "301" },
  { from: "/Contact%20Us", to: "/contact", type: "301" },
  { from: "/problems/self-esteem", to: "/self-esteem", type: "301" },
  { from: "/problems/stress", to: "/stress", type: "301" },
  { from: "/problems/burnout", to: "/burnout", type: "301" },
  { from: "/problems/co-dependency", to: "/co-dependency", type: "301" },
  { from: "/problems/depression", to: "/depression", type: "301" },
  { from: "/problems/anxiety", to: "/anxiety", type: "301" },
  { from: "/tproduct/*", to: "/blog", type: "301", wildcard: true },

  // 410 Gone: permanently removed
  { from: "/blog/ponchik-i-prestuplenie", type: "410" },
];

/** Paths that resolve to concrete prerender-able HTML (no wildcards). */
export function concreteRedirects(): RedirectEntry[] {
  return redirects.filter((r) => !("wildcard" in r) || !r.wildcard);
}
