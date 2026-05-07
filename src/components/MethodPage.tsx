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
  XCircle,
  GraduationCap,
  Quote,
  Languages,
  Wifi,
  Calendar,
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

interface MethodMeta {
  Icon: typeof Brain;
  badge: string;
  tagline: string;
  accent: string;
  stats: { label: string; value: string; Icon: typeof Brain }[];
  serviceType: string;
  notFor: string[];
  evidence: { source: string; finding: string }[];
  comparePeer?: { slug: string; label: string; note: string };
  trustChips: { Icon: typeof Brain; text: string }[];
}

const METHOD_META: Record<string, MethodMeta> = {
  "cbt-therapy": {
    Icon: Brain,
    badge: "Доказательный метод",
    tagline:
      "Структурированный, краткосрочный, измеримый — рекомендован NICE и APA как метод первой линии.",
    accent: "from-primary/25 via-primary/5 to-transparent",
    stats: [
      { label: "Длительность курса", value: "12–20 сессий", Icon: Calendar },
      { label: "Первые улучшения", value: "4–6 встреч", Icon: Clock },
      { label: "Доказательная база", value: "1000+ RCT", Icon: GraduationCap },
      { label: "Формат", value: "Онлайн / очно", Icon: Globe },
    ],
    serviceType: "Когнитивно-поведенческая терапия (КПТ)",
    notFor: [
      "Острый психотический эпизод — нужна психиатрическая помощь в первую очередь",
      "Активная зависимость без сопутствующего лечения — сначала детоксикация",
      "Если вы не готовы выполнять домашние задания между сессиями",
      "Когда нужна длительная поддержка без структуры и целей",
    ],
    evidence: [
      {
        source: "NICE Guidelines (UK)",
        finding:
          "КПТ — метод первой линии при тревожных расстройствах, депрессии, ОКР, ПТСР, бессоннице.",
      },
      {
        source: "Hofmann et al. (2012), meta-analysis",
        finding:
          "269 мета-анализов: КПТ показывает большие размеры эффекта для тревоги (d = 0.95), депрессии (d = 0.71).",
      },
      {
        source: "American Psychological Association",
        finding:
          "КПТ — наиболее исследованный психотерапевтический метод. Эффективность сопоставима с медикаментозным лечением при умеренной депрессии.",
      },
    ],
    comparePeer: {
      slug: "schema-therapy",
      label: "Сравнить со схема-терапией",
      note: "Если проблема хроническая, повторяется в отношениях или связана с детским опытом — стоит посмотреть на схема-терапию.",
    },
    trustChips: [
      { Icon: GraduationCap, text: "Доказательный метод" },
      { Icon: Clock, text: "Краткосрочный курс" },
      { Icon: Target, text: "Измеримый результат" },
    ],
  },
  "schema-therapy": {
    Icon: Layers,
    badge: "Глубинная работа",
    tagline:
      "Когда классическая КПТ помогла со симптомами, но повторяющиеся паттерны остались — пора идти глубже.",
    accent: "from-accent/25 via-accent/5 to-transparent",
    stats: [
      { label: "Длительность курса", value: "20–40+ сессий", Icon: Calendar },
      { label: "Первые улучшения", value: "8–12 встреч", Icon: Clock },
      { label: "Подход", value: "Интегративный", Icon: Layers },
      { label: "Формат", value: "Онлайн / очно", Icon: Globe },
    ],
    serviceType: "Схема-терапия",
    notFor: [
      "Острый кризис — сначала стабилизация классическими методами КПТ",
      "Если нужна быстрая работа с симптомом за 6–10 сессий",
      "Если вы не готовы прикасаться к детским переживаниям",
      "Активные психотические или маниакальные состояния",
    ],
    evidence: [
      {
        source: "Bamelis et al. (2014), Am J Psychiatry",
        finding:
          "Схема-терапия превосходит обычное лечение при расстройствах личности: 81% полного восстановления против 51%.",
      },
      {
        source: "Giesen-Bloo et al. (2006)",
        finding:
          "При пограничном расстройстве личности: схема-терапия эффективнее психодинамической, ниже dropout-rate.",
      },
      {
        source: "Renner et al. (2018), meta-analysis",
        finding:
          "Высокая эффективность при хронической депрессии, тревожных расстройствах и сложных межличностных проблемах.",
      },
    ],
    comparePeer: {
      slug: "cbt-therapy",
      label: "Сравнить с КПТ",
      note: "Если у вас конкретная проблема (паника, фобия, бессонница) — начните с классической КПТ, она быстрее и дешевле.",
    },
    trustChips: [
      { Icon: Layers, text: "18 схем, 4 режима" },
      { Icon: Brain, text: "Работа с эмоциями" },
      { Icon: Award, text: "Устойчивые изменения" },
    ],
  },
  "online-therapy": {
    Icon: Globe,
    badge: "Из любой точки мира",
    tagline:
      "Десятки мета-анализов: онлайн-КПТ сопоставима с очной по эффективности. Нужны только интернет и 50 минут.",
    accent: "from-primary/20 via-accent/15 to-transparent",
    stats: [
      { label: "Эффективность", value: "= очной", Icon: Award },
      { label: "Длительность сессии", value: "50 минут", Icon: Clock },
      { label: "География", value: "10+ стран", Icon: Globe },
      { label: "Платформы", value: "Zoom / Meet", Icon: Wifi },
    ],
    serviceType: "Онлайн-психотерапия",
    notFor: [
      "Острый суицидальный риск — нужен очный контакт и связка с психиатром",
      "Если дома нет приватного пространства для откровенного разговора",
      "Острые психотические эпизоды",
      "Если интернет нестабильный — постоянные обрывы мешают терапевтическому контакту",
    ],
    evidence: [
      {
        source: "Luo et al. (2021), J Affect Disord",
        finding:
          "Мета-анализ онлайн-КПТ: d = 0.67 для депрессии, d = 0.79 для тревоги — сопоставимо с очной терапией.",
      },
      {
        source: "Carlbring et al. (2018)",
        finding:
          "Онлайн-терапия не уступает очной по результатам и удержанию клиентов в большинстве расстройств.",
      },
      {
        source: "NICE Digital Health Guidelines",
        finding:
          "Рекомендуют онлайн-КПТ как один из вариантов первой линии при лёгкой и умеренной депрессии и тревоге.",
      },
    ],
    comparePeer: {
      slug: "in-person-therapy",
      label: "Сравнить с очной терапией",
      note: "Если вы в Кишинёве и предпочитаете живой контакт — посмотрите формат очных сессий.",
    },
    trustChips: [
      { Icon: Globe, text: "Любая точка мира" },
      { Icon: Languages, text: "Русский / румынский" },
      { Icon: ShieldCheck, text: "Зашифрованная связь" },
    ],
  },
  "in-person-therapy": {
    Icon: MapPin,
    badge: "Кишинёв, центр",
    tagline:
      "Уютный кабинет в центре Кишинёва. Полный спектр техник КПТ и схема-терапии — включая chair work и imagery.",
    accent: "from-accent/20 via-primary/10 to-transparent",
    stats: [
      { label: "Локация", value: "Центр Кишинёва", Icon: MapPin },
      { label: "Длительность сессии", value: "50 минут", Icon: Clock },
      { label: "Расписание", value: "Пн–Пт, 9–19", Icon: Calendar },
      { label: "Гибкость", value: "Можно онлайн", Icon: Globe },
    ],
    serviceType: "Очная психотерапия",
    notFor: [
      "Если вы живёте не в Кишинёве — выбирайте онлайн-формат",
      "При сильной социальной тревоге первые сессии часто легче онлайн",
      "Если расписание не позволяет регулярно приезжать — онлайн надёжнее",
    ],
    evidence: [
      {
        source: "Norcross & Lambert (2018)",
        finding:
          "Терапевтический альянс — главный предиктор результата терапии. В очном формате формируется глубже у части клиентов.",
      },
      {
        source: "Arntz et al. (2017), Schema Therapy",
        finding:
          "Техники chair work и imagery rescripting показывают усиленный эффект при очном проведении.",
      },
      {
        source: "APA Guidelines",
        finding:
          "При работе с травмой и расстройствами привязанности физическое присутствие может усиливать ощущение безопасности.",
      },
    ],
    comparePeer: {
      slug: "online-therapy",
      label: "Сравнить с онлайн-форматом",
      note: "Если вы не в Кишинёве или цените гибкость расписания — онлайн даст ту же эффективность.",
    },
    trustChips: [
      { Icon: MapPin, text: "Центр Кишинёва" },
      { Icon: ShieldCheck, text: "Конфиденциальность" },
      { Icon: Calendar, text: "Удобное расписание" },
    ],
  },
};

/* TOC items computed per page */
const buildToc = (page: ReturnType<typeof getPageBySlug>) =>
  [
    { id: "for-whom", label: page?.symptomsTitle || "Когда подходит" },
    { id: "concept", label: "Как это работает" },
    page?.schemaDomains ? { id: "schema-domains", label: "Схемы и режимы" } : null,
    { id: "evidence", label: "Доказательная база" },
    { id: "process", label: "Как проходит работа" },
    { id: "outcomes", label: "Результаты" },
    { id: "not-for", label: "Кому не подходит" },
    { id: "faq", label: "FAQ" },
  ].filter(Boolean) as { id: string; label: string }[];

const MethodPage = () => {
  const location = useLocation();
  const slug = location.pathname.replace("/", "");
  const page = getPageBySlug(slug);
  const meta = METHOD_META[slug];

  if (!page || !meta) return <NotFound />;

  const { Icon } = meta;
  const toc = buildToc(page);

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
        {/* Decorative blur orbs */}
        <div
          className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-32 -left-24 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative max-w-5xl mx-auto px-6 pt-14 md:pt-20 pb-16 md:pb-20">
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
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight">
                {page.h1}
              </h1>
              <p className="text-base md:text-lg text-foreground/80 leading-relaxed mt-5 max-w-2xl">
                {meta.tagline}
              </p>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed mt-3 max-w-2xl">
                {page.subtitle}
              </p>

              {/* Trust chips */}
              <div className="flex flex-wrap gap-2 mt-6">
                {meta.trustChips.map((chip) => (
                  <span
                    key={chip.text}
                    className="inline-flex items-center gap-1.5 text-xs font-medium bg-card border border-border rounded-full px-3 py-1.5 text-foreground/80"
                  >
                    <chip.Icon className="w-3.5 h-3.5 text-primary" />
                    {chip.text}
                  </span>
                ))}
              </div>

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
              className="hidden md:flex w-28 h-28 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 items-center justify-center shrink-0 shadow-lg"
            >
              <Icon className="w-14 h-14 text-primary" strokeWidth={1.5} />
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
                className="rounded-xl border border-border bg-card/80 backdrop-blur p-4 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                  <s.Icon className="w-3.5 h-3.5" />
                  {s.label}
                </div>
                <div className="text-base md:text-lg font-bold mt-2 leading-tight">
                  {s.value}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── BODY with sticky TOC ─── */}
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-20 grid lg:grid-cols-[1fr_220px] gap-12">
        <main className="min-w-0">
          {/* ─── 1. Когда подходит ─── */}
          <motion.section
            {...fade()}
            className="mb-20 scroll-mt-24"
            id="for-whom"
            aria-labelledby="for-whom-h"
          >
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-5 h-5 text-primary" />
              <h2 id="for-whom-h" className="text-2xl md:text-3xl font-bold">
                {page.symptomsTitle || "Когда подходит"}
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {page.symptoms.map((s, i) => (
                <motion.div
                  key={i}
                  {...fade(0.03 * i)}
                  className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 hover:border-primary/30 hover:shadow-sm transition-all"
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
          <motion.section
            {...fade()}
            className="mb-20 scroll-mt-24"
            id="concept"
            aria-labelledby="concept-h"
          >
            <div className="flex items-center gap-3 mb-6">
              <Brain className="w-5 h-5 text-primary" />
              <h2 id="concept-h" className="text-2xl md:text-3xl font-bold">
                {page.conceptTitle || "Как это работает"}
              </h2>
            </div>
            <div className="rounded-2xl border border-border bg-gradient-to-br from-card to-muted/30 p-6 md:p-8 space-y-5 shadow-sm">
              {[
                { label: page.conceptLabels?.situation || "Ситуация", value: page.cbtExample.situation },
                { label: page.conceptLabels?.thoughts || "Мысли", value: page.cbtExample.thoughts },
                { label: page.conceptLabels?.emotions || "Эмоции", value: page.cbtExample.emotions },
                { label: page.conceptLabels?.behavior || "Поведение", value: page.cbtExample.behavior },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  {...fade(0.05 * i)}
                  className="flex flex-col sm:flex-row sm:items-baseline gap-1.5 sm:gap-4 pb-5 last:pb-0 border-b last:border-b-0 border-border/50"
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

          {/* ─── Schema domains ─── */}
          {page.schemaDomains && (
            <motion.section
              {...fade()}
              className="mb-20 scroll-mt-24"
              id="schema-domains"
              aria-labelledby="schema-domains-h"
            >
              <div className="flex items-center gap-3 mb-6">
                <Layers className="w-5 h-5 text-primary" />
                <h2
                  id="schema-domains-h"
                  className="text-2xl md:text-3xl font-bold"
                >
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

          {/* ─── Evidence ─── */}
          <motion.section
            {...fade()}
            className="mb-20 scroll-mt-24"
            id="evidence"
            aria-labelledby="evidence-h"
          >
            <div className="flex items-center gap-3 mb-6">
              <GraduationCap className="w-5 h-5 text-primary" />
              <h2 id="evidence-h" className="text-2xl md:text-3xl font-bold">
                Доказательная база
              </h2>
            </div>
            <p className="text-sm md:text-base text-muted-foreground mb-6 max-w-2xl">
              Что говорят независимые исследования и международные клинические
              рекомендации:
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              {meta.evidence.map((e, i) => (
                <motion.figure
                  key={i}
                  {...fade(0.05 * i)}
                  className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3 hover:border-primary/30 transition-colors"
                >
                  <Quote className="w-5 h-5 text-primary/40" />
                  <blockquote className="text-sm leading-relaxed text-foreground/90 flex-1">
                    {e.finding}
                  </blockquote>
                  <figcaption className="text-xs font-mono text-muted-foreground border-t border-border/50 pt-3">
                    {e.source}
                  </figcaption>
                </motion.figure>
              ))}
            </div>

            {/* Психообразование как доп. контекст */}
            <div className="mt-8 grid md:grid-cols-2 gap-4">
              {page.psychoeducation.map((p, i) => (
                <motion.article
                  key={i}
                  {...fade(0.04 * i)}
                  className="rounded-xl border border-border/60 bg-muted/30 p-5"
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

          {/* ─── Process ─── */}
          <motion.section
            {...fade()}
            className="mb-20 scroll-mt-24"
            id="process"
            aria-labelledby="process-h"
          >
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-5 h-5 text-primary" />
              <h2 id="process-h" className="text-2xl md:text-3xl font-bold">
                Как проходит работа
              </h2>
            </div>
            <ol className="relative border-l-2 border-primary/20 pl-6 md:pl-8 space-y-7">
              {page.howIWork.map((item, i) => (
                <motion.li key={i} {...fade(0.04 * i)} className="relative">
                  <span className="absolute -left-[34px] md:-left-[42px] top-0 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-sm">
                    {i + 1}
                  </span>
                  <p className="text-sm md:text-[15px] leading-relaxed">{item}</p>
                </motion.li>
              ))}
            </ol>
          </motion.section>

          {/* ─── Outcomes ─── */}
          <motion.section
            {...fade()}
            className="mb-20 scroll-mt-24"
            id="outcomes"
            aria-labelledby="outcomes-h"
          >
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-5 h-5 text-primary" />
              <h2 id="outcomes-h" className="text-2xl md:text-3xl font-bold">
                Что вы получите
              </h2>
            </div>
            <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-accent/5 p-6 md:p-8 shadow-sm">
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

          {/* ─── Not for whom ─── */}
          <motion.section
            {...fade()}
            className="mb-20 scroll-mt-24"
            id="not-for"
            aria-labelledby="not-for-h"
          >
            <div className="flex items-center gap-3 mb-6">
              <XCircle className="w-5 h-5 text-destructive/70" />
              <h2 id="not-for-h" className="text-2xl md:text-3xl font-bold">
                Когда метод не подходит
              </h2>
            </div>
            <p className="text-sm md:text-base text-muted-foreground mb-6 max-w-2xl">
              Честность в начале — экономия времени и денег. Если что-то из
              ниже описанного — про вас, обсудим альтернативу на первой встрече.
            </p>
            <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 md:p-7">
              <ul className="space-y-3">
                {meta.notFor.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm md:text-[15px] leading-relaxed"
                  >
                    <XCircle className="w-4.5 h-4.5 text-destructive/70 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Compare peer */}
            {meta.comparePeer && (
              <Link
                to={`/${meta.comparePeer.slug}`}
                className="mt-6 flex items-center gap-4 rounded-xl border border-border bg-card p-5 hover:border-primary/30 hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <ArrowRight className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold group-hover:text-primary transition-colors">
                    {meta.comparePeer.label}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {meta.comparePeer.note}
                  </p>
                </div>
              </Link>
            )}
          </motion.section>

          {/* ─── FAQ ─── */}
          <motion.section
            {...fade()}
            className="mb-20 scroll-mt-24"
            id="faq"
            aria-labelledby="faq-h"
          >
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-5 h-5 text-primary" />
              <h2 id="faq-h" className="text-2xl md:text-3xl font-bold">
                Частые вопросы
              </h2>
            </div>
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

          {/* ─── CTA ─── */}
          <motion.section {...fade()} className="mb-16">
            <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/15 via-accent/10 to-transparent p-8 md:p-12 text-center">
              <div
                className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
                aria-hidden="true"
              />
              <div className="relative">
                <MessageCircle className="w-10 h-10 text-primary mx-auto mb-4" />
                <h2 className="text-2xl md:text-3xl font-bold mb-3">
                  Готовы начать?
                </h2>
                <p className="text-sm md:text-base text-muted-foreground mb-7 max-w-md mx-auto leading-relaxed">
                  Первая сессия — знакомство и диагностика. Вы получите
                  понимание проблемы и план работы.
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

        {/* ─── Sticky TOC sidebar (desktop only) ─── */}
        <aside className="hidden lg:block">
          <nav
            aria-label="Содержание страницы"
            className="sticky top-24 rounded-xl border border-border bg-card p-5"
          >
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              На странице
            </div>
            <ul className="space-y-2">
              {toc.map((t) => (
                <li key={t.id}>
                  <a
                    href={`#${t.id}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors block leading-snug"
                  >
                    {t.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-5 pt-5 border-t border-border">
              <Button size="sm" className="w-full" asChild>
                <a href="https://t.me/gringoo94" className="gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5" />
                  Записаться
                </a>
              </Button>
            </div>
          </nav>
        </aside>
      </div>

      <Footer />
    </div>
  );
};

export default MethodPage;
