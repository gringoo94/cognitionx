import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronRight,
  MessageCircle,
  Clock,
  MapPin,
  Globe,
  Send,
  Sparkles,
  Star,
  CheckCircle2,
  Users,
  GraduationCap,
  Award,
  Brain,
  Heart,
  Compass,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SEOHead from "@/components/SEOHead";
import { buildGeoAlternates } from "@/lib/geoAlternates";
import TelegramCTA from "@/components/TelegramCTA";
import Pricing from "@/components/Pricing";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomeBookingOffer from "@/components/HomeBookingOffer";
import Approach from "@/components/Approach";
import About from "@/components/About";
import AboutDetailed from "@/components/AboutDetailed";
import AboutEvidence from "@/components/AboutEvidence";
import Specializations from "@/components/Specializations";
import Expectations from "@/components/Expectations";
import Testimonials, { testimonialsSchema } from "@/components/Testimonials";
import Blog from "@/components/Blog";
import heroPhoto from "@/assets/hero-photo.webp";
import { getCityBySlug } from "@/data/cityPages";
import NotFound from "@/pages/NotFound";
import { buildFaqSchema, buildGeoBusinessSchema, buildGeoServiceSchema } from "@/lib/geoSchema";


// Hour offset for "min" side of utcOffset string (e.g. "UTC+1/+2" -> 1).
// Used for the "session times in your timezone" mini-table.
function minOffsetHours(utcOffset: string): number {
  const m = utcOffset.match(/UTC([+-]\d+)/);
  return m ? parseInt(m[1], 10) : 0;
}
// Kishinev (host) min offset is +2 (winter). We compute diff = clientMin - hostMin.
function shiftToKishinev(clientHour: number, clientUtcOffset: string): number {
  const diff = minOffsetHours(clientUtcOffset) - 2;
  let h = clientHour - diff;
  if (h < 0) h += 24;
  if (h >= 24) h -= 24;
  return h;
}
const fmtH = (h: number) => `${String(h).padStart(2, "0")}:00`;


const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.45, delay },
});

const CityLandingPage = () => {
  const { pathname } = useLocation();
  const slug = pathname.replace(/^\/+/, "").split("/")[0];
  const page = getCityBySlug(slug);

  if (!page) return <NotFound />;

  const url = `https://cognitionx.cloud/${page.slug}`;
  const isEurope = ["DE", "NL", "PT"].includes(page.countryCode);

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://cognitionx.cloud/#person",
    name: "Дмитрий Яцко",
    jobTitle: "Психолог, КПТ и схема-терапевт",
    url,
  };

  const geoInput = {
    url,
    name: `Русскоязычный психолог онлайн ${page.cityFor} — Дмитрий Яцко`,
    description: page.metaDescription,
    city: page.city,
    country: page.country,
    languages: page.countryCode === "MD" ? ["Russian", "Romanian"] : ["Russian"],
    timezone: page.timezone,
  };

  const businessSchema = buildGeoBusinessSchema(geoInput);
  const serviceSchema = buildGeoServiceSchema(geoInput);

  // Only practical questions (time, payment, insurance, first session); max 4.
  const outdatedFaq = /\/start|остр|кризис|параллельно|формата лучше|не уверен/i;
  const visibleFaq = page.faq.filter((f) => !outdatedFaq.test(f.question + " " + f.answer)).slice(0, 4);
  // FAQPage разметка соответствует видимому FAQ-блоку ниже.
  const faqSchema = buildFaqSchema(visibleFaq);








  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SEOHead
        title={page.metaTitle}
        description={page.metaDescription}
        path={`/${page.slug}`}
        alternates={buildGeoAlternates(`/${page.slug}`, [page.countryCode])}
        schema={[personSchema, businessSchema, serviceSchema, testimonialsSchema, ...(faqSchema ? [faqSchema] : [])]}
        breadcrumbs={[
          { name: "Главная", url: "https://cognitionx.cloud/" },
          ...(page.countryPageSlug
            ? [{ name: `Психолог — ${page.country}`, url: `https://cognitionx.cloud/${page.countryPageSlug}` }]
            : isEurope
              ? [{ name: "Психолог в Европе", url: "https://cognitionx.cloud/psiholog-europa" }]
              : []),
          { name: `Психолог ${page.cityIn}`, url },
        ]}
      />
      <Navbar />

      <main>
        {/* ── Hero ── */}
        <section className="max-w-7xl mx-auto px-6 pt-20 md:pt-32 pb-24">
          <motion.nav
            {...fade()}
            className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8"
          >
            <Link to="/" className="hover:text-foreground transition-colors">Главная</Link>
            <ChevronRight className="w-3 h-3" />
            {page.countryPageSlug ? (
              <>
                <Link
                  to={`/${page.countryPageSlug}`}
                  className="hover:text-foreground transition-colors"
                >
                  {page.country}
                </Link>
                <ChevronRight className="w-3 h-3" />
              </>
            ) : isEurope && (
              <>
                <Link to="/psiholog-europa" className="hover:text-foreground transition-colors">
                  Европа
                </Link>
                <ChevronRight className="w-3 h-3" />
              </>
            )}
            <span className="text-foreground">Психолог {page.cityIn}</span>
          </motion.nav>

          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="text-center md:text-left order-2 md:order-1">
              <motion.div
                {...fade(0)}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-xs font-medium text-primary mb-7"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Онлайн · {page.country} · {page.utcOffset}
              </motion.div>

              <motion.h1
                {...fade(0.05)}
                className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08]"
              >
                {(() => {
                  // Render the city-specific H1 from cityPages, highlighting the city part.
                  const idx = page.h1.indexOf(page.cityIn);
                  if (idx === -1) return page.h1;
                  return (
                    <>
                      {page.h1.slice(0, idx)}
                      <br />
                      <span className="text-primary">{page.cityIn}</span>
                      {page.h1.slice(idx + page.cityIn.length)}
                    </>
                  );
                })()}
              </motion.h1>


              <motion.p
                {...fade(0.1)}
                className="mt-6 text-base md:text-lg text-muted-foreground max-w-lg leading-relaxed"
              >
                {page.subtitle}
              </motion.p>

              <motion.div
                {...fade(0.15)}
                className="mt-9 flex flex-col sm:flex-row items-center md:items-start gap-3"
              >
                <Button size="lg" className="gap-2 text-base px-8 hover:scale-[1.02] hover:shadow-lg transition-all" asChild>
                  <Link to="/booking">
                    Записаться на консультацию <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="text-base px-8 hover:scale-[1.02] hover:shadow-md transition-all" asChild>
                  <a href="https://t.me/gringoo94" target="_blank" rel="noopener noreferrer">Написать в Telegram</a>
                </Button>
              </motion.div>


              <motion.div
                {...fade(0.25)}
                className="mt-8 flex items-center justify-center md:justify-start gap-6 text-sm text-muted-foreground"
              >
                {[
                  { value: "200+", label: "клиентов" },
                  { value: "5 лет", label: "опыта" },
                  { value: "Онлайн", label: "на русском" },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <span className="block text-lg font-bold text-foreground">{s.value}</span>
                    <span className="text-xs">{s.label}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.div {...fade(0.2)} className="flex justify-center order-1 md:order-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl scale-110" />
                <div className="relative w-72 h-80 sm:w-80 sm:h-[22rem] md:w-[22rem] md:h-[28rem] lg:w-[26rem] lg:h-[32rem] rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src={heroPhoto}
                    alt={`Психолог Дмитрий Яцко — русскоязычный КПТ-терапевт ${page.cityFor}, ${page.country}`}
                    className="w-full h-full object-cover object-top"
                    loading="eager"
                    {...({ fetchpriority: "high" } as any)}
                  width={1080}
                  height={1350}
                  decoding="async"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

      <TelegramCTA />







        <About />

        <div id="about-detailed" className="scroll-mt-20">
          <AboutDetailed />
        </div>

        {/* ── Why Russian online ── */}
        {page.whyRussianOnline && page.whyRussianOnline.length > 0 && (
          <section className="bg-background">
            <div className="max-w-4xl mx-auto px-6 py-20 md:py-24">
              <motion.div {...fade()} className="text-center mb-12">
                <Heart className="w-8 h-8 text-primary mx-auto mb-4 opacity-80" />
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                  Почему русскоязычная терапия онлайн<br className="hidden sm:block" /> может быть удобнее {page.cityFor}
                </h2>
                <p className="text-muted-foreground mt-3 text-sm md:text-base max-w-xl mx-auto">
                  Не «лучше местной системы» — а другой формат, который подходит части людей.
                </p>
              </motion.div>
              <div className="grid sm:grid-cols-2 gap-4">
                {page.whyRussianOnline.map((point, i) => (
                  <motion.div
                    key={i}
                    {...fade(0.05 * i)}
                    className="flex items-start gap-3 rounded-xl border border-border bg-card p-5"
                  >
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <p className="text-sm leading-relaxed text-muted-foreground">{point}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Local pain points ── */}
        {page.painPoints.length > 0 && (
          <section className="bg-card border-y border-border">
            <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
              <motion.h2 {...fade()} className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-center mb-10">
                С чем часто приходят {page.cityFor.replace(/^для /, "из ")}
              </motion.h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {page.painPoints.map((p, i) => (
                  <motion.div key={i} {...fade(0.04 * i)} className="rounded-xl border border-border bg-background p-5">
                    <h3 className="text-sm font-semibold mb-1.5">{p.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{p.text}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}









        <AboutEvidence />
        <Approach />
        <Specializations />




        <Expectations />
        <Testimonials />

      <Pricing />

        <Blog />


        {/* ── FAQ ── */}
        <section id="faq" className="max-w-3xl mx-auto px-6 py-20 md:py-28">
          <motion.h2 {...fade()} className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-center">
            Частые <span className="text-primary">вопросы</span> {page.cityFor}
          </motion.h2>
          <motion.div {...fade(0.1)} className="mt-10">
            <Accordion type="single" collapsible className="space-y-3">
              {visibleFaq.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="border border-border rounded-xl px-5 data-[state=open]:border-primary/20 transition-colors"
                >
                  <AccordionTrigger className="text-sm font-medium text-left py-4 hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </section>

        <HomeBookingOffer />
      </main>
      <Footer />
    </div>
  );
};

export default CityLandingPage;
