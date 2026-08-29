import { test, expect } from "@playwright/test";
import { cityPages } from "../src/data/cityPages";
import { countryHubs } from "../src/data/countryHubs";
import {
  SESSION_PRICE_SINGLE,
  SESSION_PRICE_REGULAR,
} from "../src/lib/geoSchema";

/**
 * End-to-end guard for geo pages structured data.
 * Renders every geo route in a real browser and validates that every
 * schema.org Offer node carries the current public pricing.
 */

const LANDING_ROUTES = [
  "/psiholog-europa",
  "/psiholog-dlya-it",
  "/psiholog-aziya",
  "/psiholog-usa",
  "/psiholog-kishinev",
];

const GEO_ROUTES = [
  ...LANDING_ROUTES,
  ...cityPages.map((c) => `/${c.slug}`),
  ...countryHubs.map((c) => `/${c.slug}`),
];

const EXPECTED_PRICES = new Set([
  String(SESSION_PRICE_SINGLE),
  String(SESSION_PRICE_REGULAR),
  "0",
]);

const EXPECTED_PRICE_RANGE = `€${SESSION_PRICE_REGULAR}–€${SESSION_PRICE_SINGLE}`;

type JsonLdNode = Record<string, unknown>;

function flatten(node: unknown, out: JsonLdNode[] = []): JsonLdNode[] {
  if (Array.isArray(node)) {
    node.forEach((n) => flatten(n, out));
  } else if (node && typeof node === "object") {
    const obj = node as JsonLdNode;
    out.push(obj);
    Object.values(obj).forEach((v) => {
      if (v && typeof v === "object") flatten(v, out);
    });
  }
  return out;
}

const typeOf = (n: JsonLdNode) => {
  const t = n["@type"];
  return Array.isArray(t) ? t.map(String) : t ? [String(t)] : [];
};

test.describe("geo pages: Offer nodes match current pricing", () => {
  for (const route of GEO_ROUTES) {
    test(`${route} exposes valid pricing in JSON-LD`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));

      await page.goto(route, { waitUntil: "domcontentloaded" });
      await page.waitForSelector('script[type="application/ld+json"]');

      const raw = await page.$$eval(
        'script[type="application/ld+json"]',
        (els) => els.map((e) => e.textContent || ""),
      );

      const nodes: JsonLdNode[] = [];
      for (const text of raw) {
        let parsed: unknown;
        expect(
          () => {
            parsed = JSON.parse(text);
          },
          `JSON-LD on ${route} must be valid JSON`,
        ).not.toThrow();
        flatten(parsed, nodes);
      }

      // 1. Service node with offers must exist
      const services = nodes.filter((n) => typeOf(n).includes("Service"));
      expect(services.length, `${route}: Service node missing`).toBeGreaterThan(0);

      const offers = nodes.filter((n) => typeOf(n).includes("Offer"));
      expect(offers.length, `${route}: no Offer nodes found`).toBeGreaterThan(0);

      // 2. Every Offer has a current price in EUR and availability
      for (const offer of offers) {
        const price = String(offer.price ?? "");
        expect(
          EXPECTED_PRICES.has(price),
          `${route}: unexpected Offer price "${price}" (${String(offer.name)})`,
        ).toBe(true);
        expect(offer.priceCurrency, `${route}: Offer currency`).toBe("EUR");
        expect(String(offer.availability || ""), `${route}: Offer availability`)
          .toContain("schema.org/");
      }

      // 3. Both paid tiers must be present
      const prices = offers.map((o) => String(o.price ?? ""));
      expect(prices, `${route}: single session price missing`).toContain(
        String(SESSION_PRICE_SINGLE),
      );
      expect(prices, `${route}: regular session price missing`).toContain(
        String(SESSION_PRICE_REGULAR),
      );

      // 4. Business node priceRange must match the offers
      const business = nodes.filter((n) =>
        typeOf(n).some((t) => t.includes("Business")),
      );
      for (const b of business) {
        if (b.priceRange !== undefined) {
          expect(b.priceRange, `${route}: priceRange drift`).toBe(
            EXPECTED_PRICE_RANGE,
          );
        }
      }

      // 5. Visible page must render (no blank body / runtime crash)
      const bodyText = (await page.locator("main, body").first().innerText()).trim();
      expect(bodyText.length, `${route}: page body is empty`).toBeGreaterThan(200);
      expect(errors, `${route}: runtime errors`).toEqual([]);
    });
  }
});
