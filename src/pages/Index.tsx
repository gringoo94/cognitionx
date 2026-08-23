import { lazy } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TelegramCTA from "@/components/TelegramCTA";
import SEOHead from "@/components/SEOHead";
import LazySection from "@/components/LazySection";
import { testimonialsSchema, homeFaqSchema } from "@/data/homeSchemas";

// Below-the-fold sections are code-split and mounted only when they approach
// the viewport → smaller initial bundle, less main-thread work, lower TBT.
const About = lazy(() => import("@/components/About"));
const AboutDetailed = lazy(() => import("@/components/AboutDetailed"));
const AboutEvidence = lazy(() => import("@/components/AboutEvidence"));
const Approach = lazy(() => import("@/components/Approach"));
const Specializations = lazy(() => import("@/components/Specializations"));
const Expectations = lazy(() => import("@/components/Expectations"));
const Testimonials = lazy(() => import("@/components/Testimonials"));
const Pricing = lazy(() => import("@/components/Pricing"));
const Ethics = lazy(() => import("@/components/Ethics"));
const Projects = lazy(() => import("@/components/Projects"));
const SessionPrep = lazy(() => import("@/components/SessionPrep"));
const Blog = lazy(() => import("@/components/Blog"));
const HomeFAQ = lazy(() => import("@/components/HomeFAQ"));
const BookingForm = lazy(() => import("@/components/BookingForm"));
const Footer = lazy(() => import("@/components/Footer"));


// MedicalBusiness — более специфичная разметка для health-вертикали,
// чем общий ProfessionalService. Google и AI-краулеры используют
// medicalSpecialty и availableService для классификации практики.
const medicalBusinessSchema = {
  "@context": "https://schema.org",
  "@type": ["MedicalBusiness", "LocalBusiness", "ProfessionalService"],
  "@id": "https://cognitionx.cloud/#medicalbusiness",
  name: "CognitionX — Психолог Дмитрий Яцко",
  alternateName: "Кабинет КПТ и схема-терапии Дмитрия Яцко",
  url: "https://cognitionx.cloud",
  image: "https://cognitionx.cloud/og-default.webp",
  logo: "https://cognitionx.cloud/favicon.png",
  description:
    "Онлайн-практика психолога Дмитрия Яцко: когнитивно-поведенческая и схема-терапия. Депрессия, тревога, панические атаки, выгорание, низкая самооценка, созависимость.",
  priceRange: "€€",
  email: "digitalgringoo@gmail.com",
  telephone: "+447599880865",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Кишинёв",
    addressRegion: "Chișinău",
    addressCountry: "MD",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 47.0105,
    longitude: 28.8638,
  },
  hasMap: "https://www.google.com/maps/place/Chișinău",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "20:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday"],
      opens: "10:00",
      closes: "15:00",
    },
  ],
  currenciesAccepted: "EUR, MDL, USD",
  paymentAccepted: "Bank transfer, Card, Crypto",
  medicalSpecialty: ["Psychiatric", "Psychological"],
  areaServed: [
    { "@type": "Country", name: "Молдова" },
    { "@type": "Country", name: "Германия" },
    { "@type": "Country", name: "Нидерланды" },
    { "@type": "Country", name: "Португалия" },
    { "@type": "Country", name: "Грузия" },
    { "@type": "Place", name: "Онлайн / по всему миру" },
  ],
  availableLanguage: ["ru", "ro", "en"],
  founder: { "@id": "https://cognitionx.cloud/#person" },
  employee: { "@id": "https://cognitionx.cloud/#person" },
  parentOrganization: { "@id": "https://cognitionx.cloud/#organization" },

  availableService: [
    {
      "@type": "MedicalTherapy",
      name: "Когнитивно-поведенческая терапия (КПТ)",
      alternateName: "Cognitive Behavioral Therapy",
      relevantSpecialty: "Psychological",
    },
    {
      "@type": "MedicalTherapy",
      name: "Схема-терапия",
      alternateName: "Schema Therapy",
      relevantSpecialty: "Psychological",
    },
    {
      "@type": "MedicalTherapy",
      name: "Терапия тревожных расстройств",
      relevantSpecialty: "Psychological",
    },
    {
      "@type": "MedicalTherapy",
      name: "Терапия депрессии",
      relevantSpecialty: "Psychological",
    },
  ],
};

// Physician — отдельная сущность, описывающая Дмитрия как практикующего
// специалиста. Связывается с MedicalBusiness через @id из globalSchema.
const physicianSchema = {
  "@context": "https://schema.org",
  "@type": "Physician",
  "@id": "https://cognitionx.cloud/#physician",
  name: "Дмитрий Яцко",
  alternateName: "Dmitrii Iatco",
  url: "https://cognitionx.cloud",
  image: "https://cognitionx.cloud/og-default.webp",
  medicalSpecialty: "Psychological",
  availableService: { "@id": "https://cognitionx.cloud/#medicalbusiness" },
  worksFor: { "@id": "https://cognitionx.cloud/#medicalbusiness" },
  knowsLanguage: ["ru", "ro", "en"],
  sameAs: [
    "https://t.me/gringoo94",
    "https://www.instagram.com/gringo.journal",
    "https://www.linkedin.com/in/dmitrii-iatco/",
    "https://www.b17.ru/",
  ],
};

const Index = () => (
  <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
    <SEOHead
      title="CognitionX — психолог Дмитрий Яцко | КПТ онлайн"
      description="CognitionX — практика психолога Дмитрия Яцко. КПТ и схема-терапия онлайн: депрессия, тревога, панические атаки, выгорание. Запишитесь."
      path="/"
      schema={[medicalBusinessSchema, physicianSchema, testimonialsSchema, homeFaqSchema]}
    />
    <Navbar />
    <main>
      <Hero />
      <TelegramCTA />
      <About />
      <AboutDetailed />
      <AboutEvidence />
      <Approach />
      <Specializations />
      
      <Expectations />
      <Testimonials />
      <Pricing />
      <Ethics />
      <Projects />
      <SessionPrep />
      <Blog />
      <HomeFAQ />
      <BookingForm />
    </main>
    <Footer />
  </div>
);

export default Index;
