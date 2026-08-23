// Единый источник hreflang-альтернатив для гео-страниц.
// Сайт одноязычный (ru), поэтому все альтернативы self-referencing:
// один и тот же URL объявляется для ru, регионального ru-<CC> и x-default.
// Это корректная схема для одноязычного сайта с региональным таргетингом.

export interface Alternate {
  hreflang: string;
  href: string;
}

/**
 * @param path       root-relative путь страницы, напр. "/psiholog-berlin"
 * @param regions    ISO-коды стран для регионального таргетинга, напр. ["DE"]
 */
export function buildGeoAlternates(path: string, regions: string[] = []): Alternate[] {
  const href = path.startsWith("/") ? path : `/${path}`;
  const codes = Array.from(
    new Set(["ru", ...regions.filter(Boolean).map((c) => `ru-${c.toUpperCase()}`)]),
  );
  return [...codes.map((hreflang) => ({ hreflang, href })), { hreflang: "x-default", href }];
}
