import { Helmet } from "react-helmet-async";

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

const SITE_URL = "https://cognitionx.cloud";

const SEOHead = ({ title, description, path, ogImage, ogType = "website", schema, noindex, breadcrumbs }: SEOHeadProps) => {
  const url = `${SITE_URL}${path}`;
  const image = ogImage || `${SITE_URL}/og-default.webp`;

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

  const allSchema = [
    ...(schema ? (Array.isArray(schema) ? schema : [schema]) : []),
    ...(breadcrumbSchema ? [breadcrumbSchema] : []),
  ];

  return (
    <Helmet>
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
      <meta property="og:locale" content="ru_RU" />
      <meta property="og:site_name" content="Психолог Дмитрий Яцко" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {allSchema.length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify(allSchema.length === 1 ? allSchema[0] : allSchema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;
