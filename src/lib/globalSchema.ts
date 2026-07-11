// Global structured data shared across all pages.
// Provides Person (the practitioner), Organization (the brand), and
// WebSite (with SearchAction for Google sitelinks search box).

export const SITE_URL = "https://cognitionx.cloud";

const SAME_AS = [
  "https://t.me/gringoo94",
  "https://www.instagram.com/gringo.journal",
  "https://www.linkedin.com/in/dmitrii-iatco/",
  "https://www.b17.ru/",
];

export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}/#person`,
  name: "Дмитрий Яцко",
  alternateName: "Dmitrii Iatco",
  jobTitle: "Психолог, КПТ и схема-терапевт",
  description:
    "Психолог, специалист по когнитивно-поведенческой и схема-терапии. Работаю онлайн с русскоязычными клиентами по всему миру.",
  url: `${SITE_URL}/about`,
  mainEntityOfPage: { "@id": `${SITE_URL}/about#profile` },
  image: `${SITE_URL}/og-default.webp`,
  email: "digitalgringoo@gmail.com",
  telephone: "+447599880865",
  knowsLanguage: ["ru", "ro", "en"],
  knowsAbout: [
    "Когнитивно-поведенческая терапия",
    "Схема-терапия",
    "Депрессия",
    "Тревожные расстройства",
    "Панические атаки",
    "Выгорание",
    "Созависимость",
    "Низкая самооценка",
    "Синдром самозванца",
  ],
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Молдавский государственный университет",
  },
  hasCredential: [
    {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "degree",
      educationalLevel: "Master's degree",
      name: "Магистр клинической психологии",
      recognizedBy: { "@type": "CollegeOrUniversity", name: "Молдавский государственный университет" },
    },
    {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "certificate",
      name: "Когнитивно-поведенческая терапия (базовый курс + специализация по депрессии)",
      recognizedBy: { "@type": "Organization", name: "CBTLAB" },
    },
    {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "certificate",
      name: "Схема-терапия",
    },
  ],
  memberOf: {
    "@type": "Organization",
    name: "EABCT — European Association for Behavioural and Cognitive Therapies",
  },
  worksFor: { "@id": `${SITE_URL}/#organization` },
  sameAs: SAME_AS,
};

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "CognitionX",
  alternateName: "Психолог Дмитрий Яцко",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/favicon.png`,
  },
  image: `${SITE_URL}/og-default.webp`,
  email: "digitalgringoo@gmail.com",
  founder: { "@id": `${SITE_URL}/#person` },
  sameAs: SAME_AS,
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: "CognitionX — Психолог Дмитрий Яцко",
  description:
    "Когнитивно-поведенческая и схема-терапия онлайн на русском языке.",
  inLanguage: "ru-RU",
  publisher: { "@id": `${SITE_URL}/#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/blog?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export const globalSchema = [personSchema, organizationSchema, websiteSchema];
