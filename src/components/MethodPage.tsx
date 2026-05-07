import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  MessageCircle,
  Sparkles,
  Brain,
  Layers,
  Globe,
  MapPin,
  ShieldCheck,
  Clock,
  Target,
  BookOpen,
  Award,
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
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getPageBySlug, problemPages } from "@/data/problemPages";
import { blogPosts } from "@/data/blogPosts";
import NotFound from "@/pages/NotFound";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.5, delay },
});

/* ─── Per-method visual + textual config ─── */
const METHOD_META: Record<
  string,
  {
    Icon: typeof Brain;
    badge: string;
    accent: string; // tailwind classes for gradient
    stats: { label: string; value: string }[];
    serviceType: string;
  }
> = {
  "cbt-therapy": {
    Icon: Brain,
    badge: "Доказательный метод",
    accent: "from-primary/20 via-primary/5 to-transparent",
    stats: [
      { label: "Длительность курса", value: "12–20 сессий" },
      { label: "Первые улучшения", value: "4–6 встреч" },
      { label: "Доказательная база", value: "1000+ RCT" },
      { label: "Формат", value: "Онлайн / очно" },
    ],
    serviceType: "Когнитивно-поведенческая терапия (КПТ)",
  },
  "schema-therapy": {
    Icon: Layers,
    badge: "Глубинная работа",
    accent: "from-accent/20 via-accent/5 to-transparent",
    stats: [
      { label: "Длительность курса", value: "20–40+ сессий" },
      { label: "Первые улучшения", value: "8–12 встреч" },
      { label: "Подход", value: "Интегративный" },
      { label: "Формат", value: "Онлайн / очно" },
    ],
    serviceType: "Схема-терапия",
  },
  "online-therapy": {
    Icon: Globe,
    badge: "Из любой точки мира",
    accent: "from-primary/20 via-accent/10 to-transparent",
    stats: [
      { label: "Эффективность", value: "= очной" },
      { label: "Длительность сессии", value: "50 мин" },
      { label: "География", value: "10+ стран" },
      { label: "Платформы", value: "Zoom / Meet" },
    ],
    serviceType: "Онлайн-психотерапия",
  },
  "in-person-therapy": {
    Icon: MapPin,
    badge: "Кишинёв, центр",
    accent: "from-accent/20 via-primary/10 to-transparent",
    stats: [
      { label: "Локация", value: "Центр Кишинёва" },
      { label: "Длительность сессии", value: "50 мин" },
      { label: "Расписание", value: "Пн–Пт, 9–19" },
      { label: "Гибкость", value: "Можно онлайн" },
    ],
    serviceType: "Очная психотерапия",
  },
};

const MethodPage = () => {
  const location = useLocation();
  const slug = location.pathname.replace("/", "");
  const page = getPageBySlug(slug);
  const meta = METHOD_META[slug];

  if (!page || !meta) return <NotFound />;

  const { Icon } = meta;

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

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: "https://cognitionx.cloud/" },
      { "@type": "ListItem", position: 2, name: "Методы терапии", item: "https://cognitionx.cloud/#specs" },
      { "@type": "ListItem", position: 3, name: page.title, item: `https://cognitionx.cloud/${page.slug}` },
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalTherapy",
    name: meta.serviceType,
    alternateName: page.title,
    description: page.metaDescription,
    url: `https://cognitionx.cloud/${page.slug}`,
    medicineSystem: "https://schema.org/Psychiatric",
    relevantSpecialty: "Psychotherapy",
    provider: { "@id": "https://cognitionx.cloud/#person" },
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `Как проходит ${page.title.toLowerCase()}`,
    step: page.howIWork.map((text, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: `Шаг ${i + 1}`,
      text,
    })),
  };

  const schemas = [faqSchema, breadcrumbSchema, serviceSchema, howToSchema];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title={page.metaTitle}
        description={page.metaDescription}
        path={`/${page.slug}`}
        schema={schemas}
      />
      <Navbar />

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${meta.accent} pointer-events-none`}
          aria-hidden="true"
        />
        <div className="relative max-w-5xl mx-auto px-6 pt-16 md:pt-24 pb-16 md:pb-20">
          {/* Breadcrumb */}
          <motion.nav
            {...fade()}
            aria-label="Хлебные крошки"
            className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8"
          >
            <Link to="/" className="hover:text-foreground transition-colors">
              Главная
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/#specs" className="hover:text-foreground transition-colors">
              Методы
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground">{page.title}</span>
          </motion.nav>

          <div className="grid md:grid-cols-[1fr_auto] gap-8 items-start">
            <motion.div {...fade(0.05)}>
              <Badge variant="secondary" className="mb-4 gap-1.5">
                <Sparkles className="w-3 h-3" />
                {meta.badge}
              </Badge>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight">
                {page.h1}
              </h1>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed mt-5 max-w-2xl">
                {page.subtitle}
              </p>

              <div className="flex flex-wrap gap-3 mt-8">
                <Button size="lg" asChild>
                  <a href="https://t.me/gringoo94" className="gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Записаться на консультацию
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/#booking" className="gap-2">
                    Заполнить форму
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              {...fade(0.15)}
              className="hidden md:flex w-24 h-24 rounded-2xl bg-primary/10 border border-primary/20 items-center justify-center shrink-0"
            >
              <Icon className="w-12 h-12 text-primary" strokeWidth={1.5} />
            </motion.div>
          </div>

          {/* Stats grid */}
          <motion.div
            {...fade(0.2)}
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3"
          >
            {meta.stats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-border bg-card/80 backdrop-blur p-4"
              >
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </div>
                <div className="text-base md:text-lg font-bold mt-1.5 leading-tight">
                  {s.value}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-6 py-16 md:py-20">
        {/* ─── 1. Когда подходит ─── */}
        <motion.section {...fade()} className="mb-20" aria-labelledby="for-whom">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-5 h-5 text-primary" />
            <h2 id="for-whom" className="text-2xl md:text-3xl font-bold">
              {page.symptomsTitle || "Когда подходит"}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {page.symptoms.map((s, i) => (
              <motion.div
                key={i}
                {...fade(0.03 * i)}
                className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 hover:border-primary/30 transition-colors"
              >
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span className="text-sm md:text-[15px] leading-relaxed">
                  {s.text}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ─── 2. Концепция / пример ─── */}
        <motion.section {...fade()} className="mb-20" aria-labelledby="concept">
          <div className="flex items-center gap-3 mb-6">
            <Brain className="w-5 h-5 text-primary" />
            <h2 id="concept" className="text-2xl md:text-3xl font-bold">
              {page.conceptTitle || "Как это работает"}
            </h2>
          </div>
          <div className="rounded-2xl border border-border bg-gradient-to-br from-card to-muted/30 p-6 md:p-8 space-y-5">
            {[
              { label: page.conceptLabels?.situation || "Ситуация", value: page.cbtExample.situation },
              { label: page.conceptLabels?.thoughts || "Мысли", value: page.cbtExample.thoughts },
              { label: page.conceptLabels?.emotions || "Эмоции", value: page.cbtExample.emotions },
              { label: page.conceptLabels?.behavior || "Поведение", value: page.cbtExample.behavior },
            ].map((item, i) => (
              <motion.div
                key={i}
                {...fade(0.05 * i)}
                className="flex flex-col sm:flex-row sm:items-baseline gap-1.5 sm:gap-4"
              >
                <span className="text-xs font-semibold uppercase tracking-wider text-primary shrink-0 w-28">
                  {item.label}
                </span>
                <span className="text-sm md:text-[15px] leading-relaxed">
                  {item.value}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ─── 2b. Schema domains (only schema-therapy) ─── */}
        {page.schemaDomains && (
          <motion.section
            {...fade()}
            className="mb-20"
            aria-labelledby="schema-domains"
          >
            <div className="flex items-center gap-3 mb-6">
              <Layers className="w-5 h-5 text-primary" />
              <h2 id="schema-domains" className="text-2xl md:text-3xl font-bold">
                18 ранних дезадаптивных схем
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {page.schemaDomains.map((d, i) => (
                <motion.div
                  key={i}
                  {...fade(0.05 * i)}
                  className="rounded-xl border border-border bg-card p-5"
                >
                  <h3 className="text-sm font-semibold text-primary mb-3">
                    {d.domain}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {d.schemas.map((s, j) => (
                      <span
                        key={j}
                        className="text-xs bg-muted px-3 py-1.5 rounded-full text-foreground"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* ─── 3. Психообразование ─── */}
        <motion.section {...fade()} className="mb-20" aria-labelledby="evidence">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-5 h-5 text-primary" />
            <h2 id="evidence" className="text-2xl md:text-3xl font-bold">
              Что важно знать
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {page.psychoeducation.map((p, i) => (
              <motion.article
                key={i}
                {...fade(0.04 * i)}
                className="rounded-xl border border-border bg-card p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-mono font-bold text-primary bg-primary/10 rounded-md px-2 py-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="text-sm md:text-[15px] text-muted-foreground leading-relaxed">
                  {p}
                </p>
              </motion.article>
            ))}
          </div>
        </motion.section>

        {/* ─── 4. Как я работаю ─── */}
        <motion.section {...fade()} className="mb-20" aria-labelledby="process">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-5 h-5 text-primary" />
            <h2 id="process" className="text-2xl md:text-3xl font-bold">
              Как проходит работа
            </h2>
          </div>
          <ol className="relative border-l-2 border-primary/20 pl-6 md:pl-8 space-y-6">
            {page.howIWork.map((item, i) => (
              <motion.li key={i} {...fade(0.04 * i)} className="relative">
                <span className="absolute -left-[34px] md:-left-[42px] top-0 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <p className="text-sm md:text-[15px] leading-relaxed">{item}</p>
              </motion.li>
            ))}
          </ol>
        </motion.section>

        {/* ─── 5. Outcomes ─── */}
        <motion.section {...fade()} className="mb-20" aria-labelledby="outcomes">
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-5 h-5 text-primary" />
            <h2 id="outcomes" className="text-2xl md:text-3xl font-bold">
              Что вы получите
            </h2>
          </div>
          <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 p-6 md:p-8">
            <ul className="grid sm:grid-cols-2 gap-4">
              {page.outcomes.map((o, i) => (
                <motion.li
                  key={i}
                  {...fade(0.04 * i)}
                  className="flex items-start gap-3 text-sm md:text-[15px] leading-relaxed"
                >
                  <ShieldCheck className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <span>{o}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.section>

        {/* ─── 6. FAQ ─── */}
        <motion.section {...fade()} className="mb-20" aria-labelledby="faq">
          <h2 id="faq" className="text-2xl md:text-3xl font-bold mb-6">
            Частые вопросы
          </h2>
          <Accordion
            type="single"
            collapsible
            className="rounded-2xl border border-border bg-card overflow-hidden"
          >
            {page.faq.map((f, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border-border px-5"
              >
                <AccordionTrigger className="text-sm md:text-base text-left font-medium">
                  {f.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm md:text-[15px] text-muted-foreground leading-relaxed">
                  {f.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.section>

        {/* ─── 7. CTA ─── */}
        <motion.section {...fade()} className="mb-20">
          <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent p-8 md:p-12 text-center">
            <MessageCircle className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Готовы начать?
            </h2>
            <p className="text-sm md:text-base text-muted-foreground mb-7 max-w-md mx-auto leading-relaxed">
              Первая сессия — знакомство и диагностика. Вы получите понимание
              проблемы и план работы.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" asChild>
                <a href="https://t.me/gringoo94">Написать в Telegram</a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/#booking">Заполнить форму</Link>
              </Button>
            </div>
          </div>
        </motion.section>

        {/* ─── Internal links ─── */}
        {(relatedPages.length > 0 || relatedArticles.length > 0) && (
          <motion.section {...fade()} className="mb-12">
            {relatedPages.length > 0 && (
              <div className="mb-10">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                  Связанные темы
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {relatedPages.map(
                    (rp) =>
                      rp && (
                        <Link
                          key={rp.slug}
                          to={`/${rp.slug}`}
                          className="rounded-xl border border-border bg-card p-4 hover:border-primary/30 hover:shadow-sm transition-all group"
                        >
                          <span className="text-sm font-medium group-hover:text-primary transition-colors">
                            {rp.title}
                          </span>
                          <ArrowRight className="w-4 h-4 inline-block ml-1.5 -mt-0.5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </Link>
                      ),
                  )}
                </div>
              </div>
            )}
            {relatedArticles.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                  Статьи по теме
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {relatedArticles.map(
                    (ra) =>
                      ra && (
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
                      ),
                  )}
                </div>
              </div>
            )}
          </motion.section>
        )}

        {/* Back */}
        <motion.div {...fade()}>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              На главную
            </Link>
          </Button>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default MethodPage;
