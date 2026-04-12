import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle2, ChevronRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getPageBySlug, problemPages } from "@/data/problemPages";
import { blogPosts } from "@/data/blogPosts";
import NotFound from "@/pages/NotFound";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.45, delay },
});

const ProblemPage = () => {
  const location = useLocation();
  const slug = location.pathname.replace("/", "");
  const page = getPageBySlug(slug);

  if (!page) return <NotFound />;

  const relatedPages = page.relatedPages
    .map((s) => problemPages.find((p) => p.slug === s))
    .filter(Boolean);

  const relatedArticles = page.relatedArticles
    .map((s) => blogPosts.find((p) => p.slug === s))
    .filter(Boolean);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Дмитрий Яцко",
    jobTitle: "Психолог, КПТ и схема-терапевт",
    url: "https://cognitionx.cloud",
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: "https://cognitionx.cloud/" },
      { "@type": "ListItem", position: 2, name: page.title, item: `https://cognitionx.cloud/${page.slug}` },
    ],
  };

  const geoSchemas: Record<string, object> = {
    "in-person-therapy": {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": "https://cognitionx.cloud/in-person-therapy#business",
      name: "Психолог Дмитрий Яцко — КПТ и схема-терапия в Кишинёве",
      description: "Очные консультации психолога в Кишинёве. Когнитивно-поведенческая и схема-терапия: депрессия, тревога, панические атаки, выгорание.",
      url: "https://cognitionx.cloud/in-person-therapy",
      telephone: "+447599880865",
      email: "digitalgringoo@gmail.com",
      image: "https://cognitionx.cloud/placeholder.svg",
      priceRange: "$$",
      address: { "@type": "PostalAddress", addressLocality: "Кишинёв", addressRegion: "Кишинёв", addressCountry: "MD" },
      geo: { "@type": "GeoCoordinates", latitude: 47.0105, longitude: 28.8638 },
      areaServed: [{ "@type": "City", name: "Кишинёв" }, { "@type": "Country", name: "Молдова" }],
      serviceType: ["Психологическая консультация", "КПТ-терапия", "Схема-терапия"],
      openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "19:00" }],
      sameAs: ["https://t.me/gringoo94", "https://www.instagram.com/gringo.journal", "https://www.linkedin.com/in/dmitrii-iatco/"],
    },
    "psiholog-moskva": {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "@id": "https://cognitionx.cloud/psiholog-moskva#service",
      name: "Психолог онлайн для Москвы и России — Дмитрий Яцко",
      description: "Онлайн-психолог для клиентов из Москвы и России. КПТ и схема-терапия: депрессия, тревога, выгорание. Сессии по московскому времени.",
      url: "https://cognitionx.cloud/psiholog-moskva",
      telephone: "+447599880865",
      email: "digitalgringoo@gmail.com",
      priceRange: "$$",
      areaServed: [{ "@type": "City", name: "Москва" }, { "@type": "Country", name: "Россия" }],
      serviceType: ["Онлайн-психотерапия", "КПТ-терапия", "Схема-терапия"],
      availableChannel: { "@type": "ServiceChannel", serviceType: "Online", serviceUrl: "https://cognitionx.cloud/psiholog-moskva" },
      sameAs: ["https://t.me/gringoo94", "https://www.instagram.com/gringo.journal", "https://www.linkedin.com/in/dmitrii-iatco/"],
    },
    "psiholog-europa": {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "@id": "https://cognitionx.cloud/psiholog-europa#service",
      name: "Русскоязычный психолог онлайн для экспатов в Европе — Дмитрий Яцко",
      description: "Русскоязычный психолог для экспатов в Европе. КПТ и схема-терапия на русском языке: адаптация, одиночество, тревога.",
      url: "https://cognitionx.cloud/psiholog-europa",
      telephone: "+447599880865",
      email: "digitalgringoo@gmail.com",
      priceRange: "$$",
      areaServed: [{ "@type": "Continent", name: "Европа" }],
      serviceType: ["Онлайн-психотерапия", "КПТ-терапия", "Схема-терапия"],
      availableChannel: { "@type": "ServiceChannel", serviceType: "Online", serviceUrl: "https://cognitionx.cloud/psiholog-europa" },
      sameAs: ["https://t.me/gringoo94", "https://www.instagram.com/gringo.journal", "https://www.linkedin.com/in/dmitrii-iatco/"],
    },
  };

  const localBusinessSchema = geoSchemas[slug] || null;

  const schemas = [faqSchema, personSchema, breadcrumbSchema, ...(localBusinessSchema ? [localBusinessSchema] : [])];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title={page.metaTitle}
        description={page.metaDescription}
        path={`/${page.slug}`}
        schema={schemas}
      />
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        {/* Breadcrumb */}
        <motion.nav {...fade()} className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground transition-colors">Главная</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">{page.title}</span>
        </motion.nav>

        {/* H1 */}
        <motion.div {...fade(0.05)}>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-4">
            {page.h1}
          </h1>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-12">
            {page.subtitle}
          </p>
        </motion.div>

        {/* 1. Symptoms */}
        <motion.section {...fade(0.1)} className="mb-14">
          <h2 className="text-xl font-bold mb-5">{page.symptomsTitle || "Знакомо?"}</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {page.symptoms.map((s, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                <CheckCircle2 className="w-4.5 h-4.5 text-primary mt-0.5 shrink-0" />
                <span className="text-sm leading-relaxed">{s.text}</span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* 2. CBT conceptualization */}
        <motion.section {...fade(0.1)} className="mb-14">
          <h2 className="text-xl font-bold mb-5">{page.conceptTitle || "Как это работает: модель КПТ"}</h2>
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            {[
              { label: page.conceptLabels?.situation || "Ситуация", value: page.cbtExample.situation },
              { label: page.conceptLabels?.thoughts || "Мысли", value: page.cbtExample.thoughts },
              { label: page.conceptLabels?.emotions || "Эмоции", value: page.cbtExample.emotions },
              { label: page.conceptLabels?.behavior || "Поведение", value: page.cbtExample.behavior },
            ].map((item, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary shrink-0 w-24">
                  {item.label}
                </span>
                <span className="text-sm text-muted-foreground leading-relaxed">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* 2b. Schema Domains (optional) */}
        {page.schemaDomains && (
          <motion.section {...fade(0.1)} className="mb-14">
            <h2 className="text-xl font-bold mb-5">18 ранних дезадаптивных схем</h2>
            <div className="space-y-4">
              {page.schemaDomains.map((d, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-5">
                  <h3 className="text-sm font-semibold text-primary mb-3">{d.domain}</h3>
                  <div className="flex flex-wrap gap-2">
                    {d.schemas.map((s, j) => (
                      <span key={j} className="text-xs bg-muted px-3 py-1.5 rounded-full text-foreground">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* 2c. Coping Styles (optional) */}
        {page.copingStyles && (
          <motion.section {...fade(0.1)} className="mb-14">
            <h2 className="text-xl font-bold mb-5">Три копинговые стратегии</h2>
            <div className="grid gap-4">
              {page.copingStyles.map((cs, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-5">
                  <h3 className="text-sm font-semibold mb-2">{cs.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{cs.description}</p>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* 3. Psychoeducation */}
        <motion.section {...fade(0.1)} className="mb-14">
          <h2 className="text-xl font-bold mb-5">Что происходит</h2>
          <div className="space-y-4">
            {page.psychoeducation.map((p, i) => (
              <p key={i} className="text-sm text-muted-foreground leading-relaxed pl-4 border-l-2 border-primary/20">
                {p}
              </p>
            ))}
          </div>
        </motion.section>

        {/* 4. How I work */}
        <motion.section {...fade(0.1)} className="mb-14">
          <h2 className="text-xl font-bold mb-5">Как я работаю</h2>
          <div className="space-y-3">
            {page.howIWork.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-xs font-bold text-primary bg-primary/10 rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* 5. Outcomes */}
        <motion.section {...fade(0.1)} className="mb-14">
          <h2 className="text-xl font-bold mb-5">Что вы получите</h2>
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
            <ul className="space-y-3">
              {page.outcomes.map((o, i) => (
                <li key={i} className="flex items-start gap-3 text-sm leading-relaxed">
                  <ArrowRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  {o}
                </li>
              ))}
            </ul>
          </div>
        </motion.section>

        {/* 6. FAQ */}
        <motion.section {...fade(0.1)} className="mb-14">
          <h2 className="text-xl font-bold mb-5">Частые вопросы</h2>
          <Accordion type="single" collapsible className="rounded-xl border border-border bg-card overflow-hidden">
            {page.faq.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-border px-5">
                <AccordionTrigger className="text-sm text-left font-medium">
                  {f.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  {f.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.section>

        {/* 7. CTA */}
        <motion.section {...fade(0.1)} className="mb-14 text-center">
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 md:p-10">
            <MessageCircle className="w-8 h-8 text-primary mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Запишитесь на консультацию</h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              Первая сессия — знакомство и диагностика. Вы получите понимание проблемы и план работы.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild>
                <a href="https://t.me/gringoo94">Написать в Telegram</a>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/#booking">Заполнить форму</Link>
              </Button>
            </div>
          </div>
        </motion.section>

        {/* Internal links */}
        {(relatedPages.length > 0 || relatedArticles.length > 0) && (
          <motion.section {...fade(0.1)} className="mb-8">
            {relatedPages.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Связанные темы</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {relatedPages.map((rp) => rp && (
                    <Link
                      key={rp.slug}
                      to={`/${rp.slug}`}
                      className="rounded-xl border border-border bg-card p-4 hover:border-primary/30 transition-colors group"
                    >
                      <span className="text-sm font-medium group-hover:text-primary transition-colors">{rp.h1}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {relatedArticles.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Статьи по теме</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {relatedArticles.map((ra) => ra && (
                    <Link
                      key={ra.slug}
                      to={`/blog/${ra.slug}`}
                      className="rounded-xl border border-border bg-card overflow-hidden hover:border-primary/30 transition-all hover:shadow-lg group"
                    >
                      <div className="aspect-[16/9] overflow-hidden">
                        <img
                          src={ra.image}
                          alt={ra.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-4">
                        <h4 className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                          {ra.title}
                        </h4>
                        <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">
                          {ra.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </motion.section>
        )}

        {/* Back */}
        <motion.div {...fade(0.1)}>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/" className="gap-2">
              <ArrowLeft className="w-4 h-4" /> На главную
            </Link>
          </Button>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default ProblemPage;
