// JSON-LD для бесплатных онлайн-инструментов (WebApplication).
import { SITE_URL } from "@/lib/globalSchema";

export interface ToolSchemaInput {
  name: string;
  description: string;
  /** root-relative путь, напр. "/tools/day-planner" */
  path: string;
  /** Категория приложения (по умолчанию HealthApplication). */
  category?: string;
  featureList?: string[];
}

export function buildToolSchema({
  name,
  description,
  path,
  category = "HealthApplication",
  featureList,
}: ToolSchemaInput) {
  const url = `${SITE_URL}${path}`;
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    description,
    url,
    applicationCategory: category,
    operatingSystem: "Any (web browser)",
    browserRequirements: "Требуется JavaScript",
    inLanguage: "ru-RU",
    isAccessibleForFree: true,
    ...(featureList ? { featureList } : {}),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    },
    provider: {
      "@type": "Person",
      name: "Дмитрий Яцко",
      url: `${SITE_URL}/about`,
    },
  };
}
