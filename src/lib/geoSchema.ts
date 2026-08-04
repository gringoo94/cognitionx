// Unified JSON-LD helpers for geo pages (city / country / landing).
// Ensures the same shape & validation rules everywhere so we don't
// drift into Rich Results errors per page.

export interface FaqItem {
  question: string;
  answer: string;
}

export const SITE_URL = "https://cognitionx.cloud";
const PERSON_ID = `${SITE_URL}/#person`;
const ORG_ID = `${SITE_URL}/#organization`;

/** Current public pricing — keep in sync with the Pricing component. */
export const SESSION_PRICE_SINGLE = 40;
export const SESSION_PRICE_PACKAGE = 35;

export interface GeoPlace {
  /** City name in nominative, e.g. "Берлин". Omitted for country/region pages. */
  city?: string;
  /** Country name in nominative, e.g. "Германия". */
  country?: string;
  /** Extra served places (regions, additional countries), e.g. ["Юго-Восточная Азия"]. */
  places?: string[];
}

export interface GeoSchemaInput extends GeoPlace {
  /** Absolute canonical URL of the geo page. */
  url: string;
  /** Business/service name with the local wording. */
  name: string;
  description: string;
  /** Languages sessions are held in. Defaults to Russian. */
  languages?: string[];
  /** Local timezone label, e.g. "CET / CEST". */
  timezone?: string;
}

function areaServed({ city, country, places }: GeoPlace) {
  const area: Record<string, string>[] = [];
  if (city) area.push({ "@type": "City", name: city });
  if (country) area.push({ "@type": "Country", name: country });
  for (const p of places || []) area.push({ "@type": "Place", name: p });
  return area.length === 1 ? area[0] : area;
}

/**
 * LocalBusiness-family node for a geo page.
 * Uses `OnlineBusiness` (a LocalBusiness subtype) because the practice is
 * online-only: it carries the local signals (areaServed, language, currency,
 * price range) without inventing a street address, which would be a policy
 * violation for a practice with no public premises in that city.
 */
export function buildGeoBusinessSchema(input: GeoSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "OnlineBusiness",
    "@id": `${input.url}#business`,
    name: input.name,
    description: input.description,
    url: input.url,
    image: `${SITE_URL}/og-default.webp`,
    email: "digitalgringoo@gmail.com",
    telephone: "+447599880865",
    parentOrganization: { "@id": ORG_ID },
    founder: { "@id": PERSON_ID },
    employee: { "@id": PERSON_ID },
    areaServed: areaServed(input),
    availableLanguage: input.languages || ["Russian"],
    knowsLanguage: input.languages || ["Russian"],
    currenciesAccepted: "EUR",
    paymentAccepted: "Банковская карта, банковский перевод",
    priceRange: `€${SESSION_PRICE_PACKAGE}–€${SESSION_PRICE_SINGLE}`,
    isAccessibleForFree: false,
    ...(input.timezone ? { slogan: `Сессии по местному времени (${input.timezone})` } : {}),
  };
}

/**
 * Service node for a geo page: what is offered, where, in which language and
 * at which price. Provider is linked to the global Person node by @id so the
 * knowledge graph stays a single entity across all geo pages.
 */
export function buildGeoServiceSchema(input: GeoSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${input.url}#service`,
    name: input.name,
    description: input.description,
    url: input.url,
    serviceType: ["Онлайн-психотерапия", "КПТ-терапия", "Схема-терапия"],
    category: "Психотерапия",
    provider: { "@id": PERSON_ID },
    brand: { "@id": ORG_ID },
    areaServed: areaServed(input),
    availableLanguage: input.languages || ["Russian"],
    availableChannel: {
      "@type": "ServiceChannel",
      serviceType: "Online",
      serviceUrl: input.url,
      availableLanguage: input.languages || ["Russian"],
    },
    offers: [
      {
        "@type": "Offer",
        name: "Разовая консультация (50 минут)",
        price: String(SESSION_PRICE_SINGLE),
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        url: input.url,
      },
      {
        "@type": "Offer",
        name: "Пакет из 4 консультаций — цена за сессию",
        price: String(SESSION_PRICE_PACKAGE),
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        url: input.url,
      },
      {
        "@type": "Offer",
        name: "Первая ознакомительная встреча (20 минут)",
        price: "0",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        url: `${SITE_URL}/free-consultation`,
      },
    ],
  };
}

const stripHtml = (s: string): string =>
  s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

/**
 * Build a schema.org FAQPage from a list of Q&A.
 * - Returns null when list is empty (Google rejects empty FAQPage).
 * - Trims and strips HTML from answers (validator requires plain text or limited HTML; we normalize to plain).
 * - Drops items with empty question or answer.
 * - De-duplicates by question text (case-insensitive).
 */
export function buildFaqSchema(faq: FaqItem[] | undefined | null) {
  if (!faq || faq.length === 0) return null;
  const seen = new Set<string>();
  const mainEntity = faq
    .map((f) => ({
      question: (f.question || "").trim(),
      answer: stripHtml(f.answer || ""),
    }))
    .filter((f) => {
      if (!f.question || !f.answer) return false;
      const key = f.question.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((f) => ({
      "@type": "Question" as const,
      name: f.question,
      acceptedAnswer: { "@type": "Answer" as const, text: f.answer },
    }));

  if (mainEntity.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Build a schema.org BreadcrumbList.
 * SEOHead already emits this from its `breadcrumbs` prop — exported here for
 * pages that need to merge it into a custom schema array.
 */
export function buildBreadcrumbSchema(items: BreadcrumbItem[] | undefined | null) {
  if (!items || items.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: b.name,
      item: b.url,
    })),
  };
}
