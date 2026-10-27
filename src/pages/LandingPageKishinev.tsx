import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { buildLandingFaq } from "@/lib/geoFaq";
import { getCityBySlug } from "@/data/cityPages";
import SEOHead from "@/components/SEOHead";
import { buildFaqSchema, buildGeoBusinessSchema, buildGeoServiceSchema } from "@/lib/geoSchema";
import TelegramCTA from "@/components/TelegramCTA";
import Pricing from "@/components/Pricing";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomeBookingOffer from "@/components/HomeBookingOffer";
import Testimonials, { testimonialsSchema } from "@/components/Testimonials";
import { Badge } from "@/components/ui/badge";
import Blog from "@/components/Blog";
import Approach from "@/components/Approach";
import AboutEvidence from "@/components/AboutEvidence";
import About from "@/components/About";
import AboutDetailed from "@/components/AboutDetailed";
import Specializations from "@/components/Specializations";
import Expectations from "@/components/Expectations";
import heroPhoto from "@/assets/hero-photo.webp";
import {
  ArrowRight,
  Sparkles,
  Users,
  Briefcase,
  HeartCrack,
  Clock,
  ShieldCheck,
  Brain,
  GraduationCap,
  Award,
  MapPin,
  Send,
  CheckCircle2,
  Star,
  MessageCircle,
  Globe,
} from "lucide-react";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, delay },
});

/* ─── Kishinev-specific data ─── */

const cityCopy = getCityBySlug("psiholog-kishinev");
const visibleFaq = buildLandingFaq(cityCopy?.faq ?? []);
const localFaqSchema = buildFaqSchema(visibleFaq);

const kishinevGeoInput = {
  url: "https://cognitionx.cloud/psiholog-kishinev",
  name: "Психолог в Кишинёве — Дмитрий Яцко",
  description:
    cityCopy?.metaDescription ?? "Психолог в Кишинёве. КПТ и схема-терапия онлайн.",
  city: "Кишинёв",
  country: "Молдова",
  languages: ["Russian", "Romanian"],
};

const businessSchema = buildGeoBusinessSchema(kishinevGeoInput);
const serviceSchema = buildGeoServiceSchema(kishinevGeoInput);

const LandingPageKishinev = () => (
  <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
    <SEOHead
      title={cityCopy?.metaTitle ?? "Психолог в Кишинёве онлайн — Дмитрий Яцко"}
      description={kishinevGeoInput.description}
      path="/psiholog-kishinev"
      schema={[businessSchema, serviceSchema, ...(localFaqSchema ? [localFaqSchema] : []), testimonialsSchema]}
      alternates={[
        { hreflang: "ru", href: "/psiholog-kishinev" },
        { hreflang: "ro-MD", href: "/psiholog-kishinev" },
        { hreflang: "ro", href: "/psiholog-kishinev" },
        { hreflang: "x-default", href: "/psiholog-kishinev" },
      ]}
      breadcrumbs={[
        { name: "Главная", url: "https://cognitionx.cloud/" },
        { name: "Психолог в Кишинёве", url: "https://cognitionx.cloud/psiholog-kishinev" },
      ]}
    />
    <Navbar />
    <main>
      {/* ── Hero ── */}
      <section className="max-w-7xl mx-auto px-6 pt-20 md:pt-32 pb-24">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="text-center md:text-left order-2 md:order-1">
            <motion.div
              {...fade(0)}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-xs font-medium text-primary mb-7"
            >
              <MapPin className="w-3.5 h-3.5" />
              Психотерапия онлайн
            </motion.div>

            <motion.h1
              {...fade(0.05)}
              className="text-4xl sm:text-5xl md:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.08]"
            >
              Психолог
              <br />
              <span className="text-primary">в Кишинёве</span>
            </motion.h1>

            <motion.p
              {...fade(0.1)}
              className="mt-6 text-base md:text-lg text-muted-foreground max-w-lg leading-relaxed"
            >
              {cityCopy?.subtitle}
            </motion.p>

            <motion.div
              {...fade(0.15)}
              className="mt-9 flex flex-col sm:flex-row items-center md:items-start gap-3"
            >
              <Button size="lg" className="gap-2 text-base px-8 hover:scale-[1.02] hover:shadow-lg transition-all" asChild>
                <a href="/booking">
                  Записаться на консультацию <ArrowRight className="w-4 h-4" />
                </a>
              </Button>
              <Button variant="outline" size="lg" className="text-base px-8 hover:scale-[1.02] hover:shadow-md transition-all" asChild>
                <a href="#approach">Как я работаю</a>
              </Button>
            </motion.div>

            <motion.div
              {...fade(0.25)}
              className="mt-8 flex items-center justify-center md:justify-start gap-6 text-sm text-muted-foreground"
            >
              {[
                { value: "200+", label: "клиентов" },
                { value: "5 лет", label: "опыта" },
                { value: "Кишинёв", label: "родной город" },
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
                  alt="Психолог Дмитрий Яцко — КПТ-терапевт в Кишинёве, Молдова"
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

      {/* ── About ── */}
      <About />

      <div id="about-detailed" className="scroll-mt-20">
        <AboutDetailed />
      </div>

      <AboutEvidence />

      <Approach />

      <Specializations />

      <Expectations />

      <Testimonials />

      <Pricing />

      <Blog />

      {/* ── FAQ ── */}
      <section id="faq" className="max-w-3xl mx-auto px-6 py-20 md:py-28">
        <motion.h2
          {...fade()}
          className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-center"
        >
          Вопросы <span className="text-primary">перед встречей</span>
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

export default LandingPageKishinev;
