import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { globalSchema, SITE_URL } from "@/lib/globalSchema";

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface SEOHeadProps {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  ogType?: string;
  schema?: object | object[];
  noindex?: boolean;
  breadcrumbs?: BreadcrumbItem[];
}

const SEOHead = ({ title, description, path, ogImage, ogType = "website", schema, noindex, breadcrumbs }: SEOHeadProps) => {
  const url = `${SITE_URL}${path}`;
  const image = ogImage || `${SITE_URL}/og-default.webp`;

  // Remove any pre-rendered static canonical/hreflang tags so Helmet remains the
  // single source of truth at runtime and we don't end up with duplicate tags
  // in the DOM after hydration (prerender injects them for crawlers without JS).
  useEffect(() => {
    document
      .querySelectorAll(
        'link[rel="canonical"]:not([data-rh]), link[rel="alternate"][hreflang]:not([data-rh])'
      )
      .forEach((el) => el.parentNode?.removeChild(el));
  }, [url]);

  const breadcrumbSchema = breadcrumbs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((b, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: b.name,
          item: b.url,
        })),
      }
    : null;

  // Merge: global schema (Person/Org/WebSite) + page-specific + breadcrumbs.
  // noindex pages (privacy, informed consent) skip global schema to avoid noise.
  const allSchema = [
    ...(noindex ? [] : globalSchema),
    ...(schema ? (Array.isArray(schema) ? schema : [schema]) : []),
    ...(breadcrumbSchema ? [breadcrumbSchema] : []),
  ];

  return (
    <Helmet>
      <html lang="ru" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <link rel="alternate" hrefLang="ru" href={url} />
      <link rel="alternate" hrefLang="x-default" href={url} />

      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}

      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="ru_RU" />
      <meta property="og:site_name" content="Психолог Дмитрий Яцко" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {allSchema.length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify(allSchema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;

