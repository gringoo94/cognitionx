import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, MessageCircle, Clock, MapPin, Globe, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingForm from "@/components/BookingForm";
import Approach from "@/components/Approach";
import Specializations from "@/components/Specializations";
import Testimonials, { testimonialsSchema } from "@/components/Testimonials";
import Ethics from "@/components/Ethics";
import { getCityBySlug, cityPages } from "@/data/cityPages";
import NotFound from "@/pages/NotFound";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.45, delay },
});

const CityLandingPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const page = getCityBySlug(slug || "");

  if (!page) return <NotFound />;

  const url = `https://cognitionx.cloud/${page.slug}`;

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${url}#service`,
    name: `Русскоязычный психолог онлайн ${page.cityFor} — Дмитрий Яцко`,
    description: page.metaDescription,
    url,
    provider: { "@id": "https://cognitionx.cloud/#person" },
    areaServed: [
      { "@type": "City", name: page.city },
      { "@type": "Country", name: page.country },
    ],
    serviceType: ["Онлайн-психотерапия", "КПТ-терапия", "Схема-терапия"],
    availableLanguage: "Russian",
    availableChannel: { "@type": "ServiceChannel", serviceType: "Online", serviceUrl: url },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  // Suggest other city pages for internal linking
  const otherCities = cityPages.filter((c) => c.slug !== page.slug);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title={page.metaTitle}
        description={page.metaDescription}
        path={`/${page.slug}`}
        schema={[serviceSchema, faqSchema, testimonialsSchema]}
        breadcrumbs={[
          { name: "Главная", url: "https://cognitionx.cloud/" },
          { name: `Психолог ${page.cityIn}`, url },
        ]}
      />
      <Navbar />

      <main>
        {/* Hero */}
        <section className="max-w-5xl mx-auto px-6 pt-20 md:pt-28 pb-16">
          <motion.nav {...fade()} className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground transition-colors">Главная</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/psiholog-europa" className="hover:text-foreground transition-colors">Европа</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground">Психолог {page.cityIn}</span>
          </motion.nav>

          <motion.div
            {...fade(0.05)}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-xs font-medium text-primary mb-6"
          >
            <MapPin className="w-3.5 h-3.5" />
            {page.country} · {page.timezone} ({page.utcOffset})
          </motion.div>

          <motion.h1
            {...fade(0.1)}
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-5"
          >
            {page.h1}
          </motion.h1>

          <motion.p
            {...fade(0.15)}
            className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed"
          >
            {page.subtitle}
          </motion.p>

          <motion.div {...fade(0.2)} className="mt-9 flex flex-col sm:flex-row gap-3">
            <Button size="lg" className="gap-2" asChild>
              <a href="#booking">
                Бесплатная встреча — 20 мин <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="https://t.me/gringoo94" target="_blank" rel="noopener noreferrer">
                <Send className="w-4 h-4 mr-2" /> Написать в Telegram
              </a>
            </Button>
          </motion.div>
        </section>

        {/* Intro */}
        <section className="bg-card border-y border-border">
          <div className="max-w-3xl mx-auto px-6 py-16 md:py-20">
            <motion.p {...fade()} className="text-base md:text-lg leading-relaxed text-muted-foreground">
              {page.intro}
            </motion.p>
          </div>
        </section>

        {/* Pain points */}
        <section className="max-w-5xl mx-auto px-6 py-20 md:py-24">
          <motion.h2 {...fade()} className="text-2xl sm:text-3xl font-bold mb-3 text-center">
            С чем приходят клиенты {page.cityIn}
          </motion.h2>
          <motion.p {...fade(0.05)} className="text-sm md:text-base text-muted-foreground text-center max-w-xl mx-auto mb-12">
            Узнаёте себя? Это не «слабость» и не «лень» — это типичные запросы экспата.
          </motion.p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {page.painPoints.map((p, i) => (
              <motion.div
                key={i}
                {...fade(i * 0.04)}
                className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors"
              >
                <h3 className="text-sm font-bold mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Practical info */}
        <section className="bg-foreground text-background">
          <div className="max-w-3xl mx-auto px-6 py-16 md:py-20">
            <motion.div {...fade()} className="grid sm:grid-cols-3 gap-6 text-center sm:text-left">
              <div className="flex flex-col items-center sm:items-start gap-2">
                <Clock className="w-6 h-6 opacity-70" />
                <p className="text-xs uppercase tracking-wider opacity-60">Часовой пояс</p>
                <p className="text-sm font-semibold">{page.timezone}</p>
                <p className="text-xs opacity-70">{page.utcOffset}</p>
              </div>
              <div className="flex flex-col items-center sm:items-start gap-2">
                <Globe className="w-6 h-6 opacity-70" />
                <p className="text-xs uppercase tracking-wider opacity-60">Формат</p>
                <p className="text-sm font-semibold">Онлайн · Zoom</p>
                <p className="text-xs opacity-70">На русском языке</p>
              </div>
              <div className="flex flex-col items-center sm:items-start gap-2">
                <MessageCircle className="w-6 h-6 opacity-70" />
                <p className="text-xs uppercase tracking-wider opacity-60">Оплата</p>
                <p className="text-sm font-semibold">{page.currency}</p>
                <p className="text-xs opacity-70">Wise, Revolut, перевод</p>
              </div>
            </motion.div>
          </div>
        </section>

        <Specializations />
        <Approach />
        <Testimonials />

        {/* FAQ */}
        <section className="max-w-3xl mx-auto px-6 py-20 md:py-24">
          <motion.h2 {...fade()} className="text-2xl sm:text-3xl font-bold tracking-tight text-center">
            Частые вопросы {page.cityFor}
          </motion.h2>
          <motion.div {...fade(0.1)} className="mt-10">
            <Accordion type="single" collapsible className="space-y-3">
              {page.faq.map((faq, i) => (
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

        <Ethics />
        <BookingForm />

        {/* Other cities (internal linking) */}
        <section className="max-w-5xl mx-auto px-6 py-16">
          <motion.h2 {...fade()} className="text-lg font-semibold text-center mb-6">
            Психолог в других городах
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-3xl mx-auto">
            {otherCities.map((c) => (
              <Link
                key={c.slug}
                to={`/${c.slug}`}
                className="rounded-xl border border-border bg-card px-4 py-3 text-center hover:border-primary/40 transition-colors group"
              >
                <span className="text-sm font-medium group-hover:text-primary transition-colors">
                  {c.city}
                </span>
                <span className="block text-xs text-muted-foreground mt-0.5">{c.country}</span>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link to="/psiholog-europa" className="text-sm text-primary hover:underline">
              Все направления — Европа →
            </Link>
          </div>
        </section>

        {/* SEO footer */}
        <section className="max-w-3xl mx-auto px-6 py-12 text-center border-t border-border">
          <h2 className="text-base font-semibold text-muted-foreground mb-3">
            Русскоязычный психолог {page.cityIn} онлайн
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{page.seoFooter}</p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CityLandingPage;
