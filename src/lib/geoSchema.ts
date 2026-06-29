// Unified JSON-LD helpers for geo pages (city / country / landing).
// Ensures the same shape & validation rules everywhere so we don't
// drift into Rich Results errors per page.

export interface FaqItem {
  question: string;
  answer: string;
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
