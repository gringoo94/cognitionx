import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronRight,
  Send,
  Sparkles,
  MapPin,
  Globe,
  Building2,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCountryHubBySlug, getCitiesForCountry } from "@/data/countryHubs";
import { blogPosts } from "@/data/blogPosts";
import NotFound from "@/pages/NotFound";
import { buildFaqSchema } from "@/lib/geoSchema";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.45, delay },
});

const CountryHubPage = () => {
  const { pathname } = useLocation();
  const slug = pathname.replace(/^\/+/, "").split("/")[0];
  const page = getCountryHubBySlug(slug);

  if (!page) return <NotFound />;

  const url = `https://cognitionx.cloud/${page.slug}`;
  const cities = getCitiesForCountry(page);

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${url}#service`,
    name: `Русскоязычный психолог онлайн ${page.countryIn} — Дмитрий Яцко`,
    description: page.metaDescription,
    url,
    provider: { "@type": "Person", name: "Дмитрий Яцко" },
    areaServed: { "@type": "Country", name: page.country },
    serviceType: ["Онлайн-психотерапия", "КПТ-терапия", "Схема-терапия"],
    availableLanguage: "Russian",
    availableChannel: {
      "@type": "ServiceChannel",
      serviceType: "Online",
      serviceUrl: url,
    },
  };

  const faqSchema = buildFaqSchema(page.faq);

  const itemListSchema = cities.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: cities.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://cognitionx.cloud/${c.slug}`,
      name: `Психолог ${c.cityIn}`,
    })),
  } : null;

  const relatedArticles = (page.relatedArticleSlugs ?? [])
    .map((s) => blogPosts.find((p) => p.slug === s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SEOHead
        title={page.metaTitle}
        description={page.metaDescription}
        path={`/${page.slug}`}
        schema={[serviceSchema, faqSchema, ...(itemListSchema ? [itemListSchema] : [])]}
        breadcrumbs={[
          { name: "Главная", url: "https://cognitionx.cloud/" },
          { name: `Психолог ${page.countryIn}`, url },
        ]}
      />
      <Navbar />

      <main>
        {/* ── Hero ── */}
        <section className="max-w-7xl mx-auto px-6 pt-20 md:pt-32 pb-20">
          <motion.nav
            {...fade()}
            className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8"
          >
            <Link to="/" className="hover:text-foreground transition-colors">Главная</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground">Психолог {page.countryIn}</span>
          </motion.nav>

          <div className="max-w-3xl">
            <motion.div
              {...fade(0)}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-xs font-medium text-primary mb-7"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Онлайн · {page.country} · {page.utcOffset}
            </motion.div>

            <motion.h1
              {...fade(0.05)}
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.08]"
            >
              {page.h1}
            </motion.h1>

            <motion.p
              {...fade(0.1)}
              className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed"
            >
              {page.subtitle}
            </motion.p>

            <motion.div
              {...fade(0.15)}
              className="mt-9 flex flex-col sm:flex-row items-start gap-3"
            >
              <Button size="lg" className="gap-2 text-base px-8" asChild>
                <Link to="/start">
                  Понять, с чего начать <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-base px-8 gap-2" asChild>
                <a href="https://t.me/dmitry_iatsko" target="_blank" rel="noopener noreferrer">
                  <Send className="w-4 h-4" /> Написать в Telegram
                </a>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* ── Intro ── */}
        <section className="max-w-4xl mx-auto px-6 pb-20">
          <motion.p
            {...fade()}
            className="text-lg md:text-xl text-foreground/90 leading-relaxed"
          >
            {page.intro}
          </motion.p>
        </section>

        {/* ── Cities list ── */}
        {(cities.length > 0 || page.plannedCities?.length) && (
          <section className="max-w-6xl mx-auto px-6 pb-20">
            <motion.h2
              {...fade()}
              className="text-3xl md:text-4xl font-bold tracking-tight mb-3 flex items-center gap-3"
            >
              <MapPin className="w-7 h-7 text-primary" />
              Города {page.countryIn}
            </motion.h2>
            <motion.p {...fade(0.05)} className="text-muted-foreground mb-10 max-w-2xl">
              Я работаю онлайн с клиентами из любого города. Отдельные страницы — для городов с
              самой большой русскоязычной аудиторией.
            </motion.p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cities.map((c, i) => (
                <motion.div key={c.slug} {...fade(i * 0.05)}>
                  <Link
                    to={`/${c.slug}`}
                    className="group block rounded-2xl border border-border bg-card p-6 hover:border-primary/40 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-primary" />
                        <h3 className="text-lg font-semibold">{c.city}</h3>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{c.subtitle}</p>
                  </Link>
                </motion.div>
              ))}
              {page.plannedCities?.map((cityName, i) => (
                <motion.div
                  key={cityName}
                  {...fade((cities.length + i) * 0.05)}
                  className="rounded-2xl border border-dashed border-border bg-card/50 p-6"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="w-5 h-5 text-muted-foreground" />
                    <h3 className="text-lg font-semibold text-muted-foreground">{cityName}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Работаю онлайн. Отдельная страница скоро.
                  </p>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ── System overview ── */}
        <section className="bg-muted/30 py-20">
          <div className="max-w-5xl mx-auto px-6">
            <motion.h2
              {...fade()}
              className="text-3xl md:text-4xl font-bold tracking-tight mb-3"
            >
              Как устроена психологическая помощь {page.countryIn}
            </motion.h2>
            <motion.p {...fade(0.05)} className="text-muted-foreground mb-10 max-w-2xl">
              Коротко — три типичных пути. Я не лучше и не хуже государственной системы; я просто
              другой формат, который многим подходит.
            </motion.p>
            <div className="grid md:grid-cols-3 gap-5">
              {page.systemOverview.map((item, i) => (
                <motion.div
                  key={item.title}
                  {...fade(i * 0.05)}
                  className="rounded-2xl border border-border bg-background p-6"
                >
                  <h3 className="text-base font-semibold mb-3">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Expat context ── */}
        <section className="max-w-5xl mx-auto px-6 py-20">
          <motion.h2
            {...fade()}
            className="text-3xl md:text-4xl font-bold tracking-tight mb-3 flex items-center gap-3"
          >
            <Globe className="w-7 h-7 text-primary" />
            Контекст, который часто остаётся за кадром
          </motion.h2>
          <motion.p {...fade(0.05)} className="text-muted-foreground mb-10 max-w-2xl">
            То, что местный терапевт может не считать важным — а для русскоязычного клиента это и
            есть половина запроса.
          </motion.p>
          <div className="grid md:grid-cols-2 gap-4">
            {page.expatContext.map((text, i) => (
              <motion.div
                key={i}
                {...fade(i * 0.05)}
                className="flex gap-3 rounded-xl border border-border bg-card p-5"
              >
                <AlertTriangle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-foreground/90 leading-relaxed">{text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Why online RU ── */}
        <section className="bg-muted/30 py-20">
          <div className="max-w-4xl mx-auto px-6">
            <motion.h2
              {...fade()}
              className="text-3xl md:text-4xl font-bold tracking-tight mb-10"
            >
              Почему онлайн на русском {page.countryIn} — нормально
            </motion.h2>
            <ul className="space-y-4">
              {page.whyOnline.map((reason, i) => (
                <motion.li
                  key={i}
                  {...fade(i * 0.05)}
                  className="flex gap-3 items-start"
                >
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-base text-foreground/90 leading-relaxed">{reason}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="max-w-3xl mx-auto px-6 py-20">
          <motion.h2
            {...fade()}
            className="text-3xl md:text-4xl font-bold tracking-tight mb-10"
          >
            Частые вопросы — {page.country}
          </motion.h2>
          <Accordion type="single" collapsible className="w-full">
            {page.faq.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-base">{f.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {f.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* ── Related articles ── */}
        {relatedArticles.length > 0 && (
          <section className="bg-muted/30 py-20">
            <div className="max-w-5xl mx-auto px-6">
              <motion.h2
                {...fade()}
                className="text-2xl md:text-3xl font-bold tracking-tight mb-8 flex items-center gap-3"
              >
                <BookOpen className="w-6 h-6 text-primary" />
                Полезные материалы
              </motion.h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {relatedArticles.map((post, i) => (
                  <motion.div key={post.slug} {...fade(i * 0.05)}>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="group block rounded-xl border border-border bg-background p-5 hover:border-primary/40 transition-all"
                    >
                      <h3 className="text-base font-semibold mb-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{post.description}</p>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Final CTA ── */}
        <section className="max-w-3xl mx-auto px-6 py-20 text-center">
          <motion.h2
            {...fade()}
            className="text-3xl md:text-4xl font-bold tracking-tight mb-5"
          >
            Не уверены, с чего начать?
          </motion.h2>
          <motion.p
            {...fade(0.05)}
            className="text-muted-foreground mb-8 max-w-xl mx-auto"
          >
            Короткий опросник на 5 минут — я посмотрю ответы и пришлю первичный разбор в Telegram.
            Без оплаты и без обязательств.
          </motion.p>
          <motion.div {...fade(0.1)} className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" className="gap-2 px-8" asChild>
              <Link to="/start">
                Понять, с чего начать <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="gap-2 px-8" asChild>
              <a href="https://t.me/dmitry_iatsko" target="_blank" rel="noopener noreferrer">
                <Send className="w-4 h-4" /> Telegram
              </a>
            </Button>
          </motion.div>
        </section>

        {/* ── SEO footer ── */}
        <section className="max-w-4xl mx-auto px-6 pb-20">
          <p className="text-xs text-muted-foreground leading-relaxed text-center">
            {page.seoFooter}
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CountryHubPage;
