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
  ShieldCheck,
  Clock,
  Target,
  BookOpen,
  Award,
  AlertCircle,
  CloudRain,
  Flame,
  Heart,
  Shield,
  Wine,
  Zap,
  Wind,
  AlertTriangle,
  Phone,
  Quote,
  GraduationCap,
  Lightbulb,
  ListChecks,
  Wrench,
  Wallet,
  FileCheck2,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getPageBySlug, problemPages } from "@/data/problemPages";
import { blogPosts } from "@/data/blogPosts";
import { getProblemExtras, PRICING, COMMON_FAQ_ADDONS } from "@/data/problemExtras";
import { useActiveSection, useScrollProgress } from "@/hooks/usePageScroll";
import NotFound from "@/pages/NotFound";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.5, delay },
});

interface ProblemMeta {
  Icon: typeof Brain;
  badge: string;
  tagline: string;
  accent: string;
  stats: { label: string; value: string; Icon: typeof Brain }[];
  trustChips: { Icon: typeof Brain; text: string }[];
  evidence: { source: string; finding: string }[];
  // Optional safety warning shown on serious-condition pages
  urgent?: { title: string; text: string };
}

const COMMON_TRUST = [
  { Icon: GraduationCap, text: "Доказательный подход" },
  { Icon: ShieldCheck, text: "Конфиденциально" },
  { Icon: Clock, text: "Сессия 50 минут" },
];

const PROBLEM_META: Record<string, ProblemMeta> = {
  depression: {
    Icon: CloudRain,
    badge: "Помощь при депрессии",
    tagline:
      "Депрессия — это не лень и не слабость характера. Это лечится: КПТ показала эффективность, сопоставимую с медикаментами при умеренной депрессии.",
    accent: "from-primary/20 via-accent/10 to-transparent",
    stats: [
      { label: "Длительность курса", value: "12–20 сессий", Icon: Clock },
      { label: "Первые улучшения", value: "4–6 встреч", Icon: Sparkles },
      { label: "Метод", value: "КПТ + поведенческая активация", Icon: Brain },
      { label: "Эффективность", value: "70–80%", Icon: Award },
    ],
    trustChips: COMMON_TRUST,
    evidence: [
      {
        source: "NICE Guidelines (UK)",
        finding:
          "КПТ — метод первой линии при умеренной и тяжёлой депрессии, наряду с антидепрессантами.",
      },
      {
        source: "Cuijpers et al. (2020), meta-analysis",
        finding:
          "КПТ показывает большой размер эффекта при депрессии и значимо снижает риск рецидивов.",
      },
      {
        source: "WHO mhGAP",
        finding:
          "Поведенческая активация — рекомендованный метод первой линии при депрессии в условиях ограниченных ресурсов.",
      },
    ],
    urgent: {
      title: "Если есть мысли о самоповреждении или суициде",
      text: "Это сигнал к срочной помощи, а не к ожиданию. В Молдове: 112 (экстренная) или Кишинёвская служба психиатрии. Если вы за рубежом — местная служба экстренной помощи. После стабилизации мы можем продолжить плановую работу.",
    },
  },
  anxiety: {
    Icon: AlertCircle,
    badge: "Тревожные расстройства",
    tagline:
      "Постоянное беспокойство, навязчивые мысли, ощущение что вот-вот случится плохое — это поддаётся работе. КПТ — золотой стандарт при тревоге.",
    accent: "from-primary/25 via-primary/5 to-transparent",
    stats: [
      { label: "Длительность курса", value: "12–16 сессий", Icon: Clock },
      { label: "Первые улучшения", value: "4–6 встреч", Icon: Sparkles },
      { label: "Метод", value: "КПТ + экспозиция", Icon: Brain },
      { label: "Эффективность", value: "d = 0.79", Icon: Award },
    ],
    trustChips: COMMON_TRUST,
    evidence: [
      {
        source: "Hofmann et al. (2012)",
        finding:
          "Мета-анализ 269 исследований: КПТ показывает большие размеры эффекта при тревожных расстройствах (d = 0.79).",
      },
      {
        source: "NICE Guidelines",
        finding:
          "КПТ — метод первой линии при ГТР, социальной тревоге, специфических фобиях, ОКР.",
      },
      {
        source: "APA Clinical Practice Guideline",
        finding:
          "Когнитивно-поведенческая терапия — наиболее исследованный и рекомендованный подход при тревожных расстройствах у взрослых.",
      },
    ],
  },
  "panic-attacks": {
    Icon: Zap,
    badge: "Панические атаки",
    tagline:
      "Панические атаки страшные, но безопасные. Тело умеет переживать страх — этому можно научиться, и циклу страха перед страхом можно положить конец.",
    accent: "from-destructive/15 via-primary/10 to-transparent",
    stats: [
      { label: "Длительность курса", value: "8–12 сессий", Icon: Clock },
      { label: "Первые улучшения", value: "3–4 встречи", Icon: Sparkles },
      { label: "Метод", value: "КПТ + интероцептивная экспозиция", Icon: Brain },
      { label: "Эффективность", value: "70–90%", Icon: Award },
    ],
    trustChips: COMMON_TRUST,
    evidence: [
      {
        source: "Barlow et al., Panic Control Treatment",
        finding:
          "Протокол КПТ для панических атак показывает 70–90% избавления от панических приступов по результатам РКИ.",
      },
      {
        source: "NICE CG113",
        finding:
          "КПТ — рекомендованный метод первой линии при паническом расстройстве с агорафобией и без неё.",
      },
      {
        source: "Pompoli et al. (2018)",
        finding:
          "Сетевой мета-анализ: КПТ — наиболее эффективный психотерапевтический подход при паническом расстройстве.",
      },
    ],
  },
  burnout: {
    Icon: Flame,
    badge: "Выгорание",
    tagline:
      "Выгорание — не «слабость воли». Это закономерный результат хронического дисбаланса между нагрузкой и восстановлением. Нужны системные изменения, а не «отпуск на неделю».",
    accent: "from-destructive/15 via-accent/10 to-transparent",
    stats: [
      { label: "Длительность курса", value: "10–16 сессий", Icon: Clock },
      { label: "Первые улучшения", value: "3–5 встреч", Icon: Sparkles },
      { label: "Метод", value: "КПТ + работа со схемами", Icon: Brain },
      { label: "Подход", value: "Восстановление + границы", Icon: ShieldCheck },
    ],
    trustChips: COMMON_TRUST,
    evidence: [
      {
        source: "ВОЗ, МКБ-11",
        finding:
          "Выгорание официально признано синдромом, связанным с хроническим стрессом на рабочем месте.",
      },
      {
        source: "Maricuțoiu et al. (2016), meta-analysis",
        finding:
          "Психотерапевтические интервенции эффективно снижают эмоциональное истощение и деперсонализацию при выгорании.",
      },
      {
        source: "Cochrane Review (2015)",
        finding:
          "КПТ-вмешательства показывают значимое снижение симптомов выгорания у профессионалов помогающих профессий.",
      },
    ],
  },
  "co-dependency": {
    Icon: Heart,
    badge: "Отношения и созависимость",
    tagline:
      "Конфликты, обиды, ощущение что вас не слышат — или невозможность уйти. Часто корни — в ранних схемах, и это можно изменить.",
    accent: "from-accent/20 via-primary/10 to-transparent",
    stats: [
      { label: "Длительность курса", value: "16–24 сессии", Icon: Clock },
      { label: "Первые улучшения", value: "6–8 встреч", Icon: Sparkles },
      { label: "Метод", value: "КПТ + схема-терапия", Icon: Brain },
      { label: "Фокус", value: "Границы и потребности", Icon: ShieldCheck },
    ],
    trustChips: COMMON_TRUST,
    evidence: [
      {
        source: "Young et al., Schema Therapy",
        finding:
          "Схема-терапия эффективна при стойких межличностных паттернах: покинутости, подчинении, самопожертвовании.",
      },
      {
        source: "Renner et al. (2018), meta-analysis",
        finding:
          "Схема-терапия показывает высокую эффективность при сложных межличностных и эмоциональных проблемах.",
      },
      {
        source: "Linehan, DBT research",
        finding:
          "Навыки эмоциональной регуляции и межличностной эффективности значимо улучшают качество отношений.",
      },
    ],
  },
  "self-esteem": {
    Icon: Shield,
    badge: "Самооценка",
    tagline:
      "Низкая самооценка — это не объективная истина о вас, а набор глубинных убеждений, сформированных в детстве. Их можно осознать и изменить.",
    accent: "from-primary/20 via-accent/10 to-transparent",
    stats: [
      { label: "Длительность курса", value: "12–16 сессий", Icon: Clock },
      { label: "Первые улучшения", value: "4–6 встреч", Icon: Sparkles },
      { label: "Метод", value: "КПТ + схема-терапия", Icon: Brain },
      { label: "Фокус", value: "Глубинные убеждения", Icon: Brain },
    ],
    trustChips: COMMON_TRUST,
    evidence: [
      {
        source: "Fennell, Overcoming Low Self-Esteem",
        finding:
          "КПТ-протокол для работы с низкой самооценкой показал значимое улучшение в РКИ.",
      },
      {
        source: "Neff (2011), Self-Compassion research",
        finding:
          "Развитие самосострадания снижает самокритику и повышает устойчивость к неудачам.",
      },
      {
        source: "Schema Therapy outcome studies",
        finding:
          "Работа со схемой «дефективность/стыд» значимо улучшает образ себя и устойчивость самооценки.",
      },
    ],
  },
  stress: {
    Icon: Wind,
    badge: "Стресс и адаптация",
    tagline:
      "Переезд, увольнение, развод — когда всё навалилось. КПТ помогает быстро восстановить ресурс и выстроить опору в период перемен.",
    accent: "from-primary/20 via-accent/10 to-transparent",
    stats: [
      { label: "Длительность курса", value: "6–12 сессий", Icon: Clock },
      { label: "Первые улучшения", value: "2–4 встречи", Icon: Sparkles },
      { label: "Метод", value: "КПТ + копинг-стратегии", Icon: Brain },
      { label: "Фокус", value: "Адаптация и ресурс", Icon: ShieldCheck },
    ],
    trustChips: COMMON_TRUST,
    evidence: [
      {
        source: "Lazarus & Folkman, Stress and Coping",
        finding:
          "Когнитивная переоценка ситуации — ключевой фактор успешной адаптации к жизненным переменам.",
      },
      {
        source: "Meichenbaum, Stress Inoculation Training",
        finding:
          "КПТ-техники тренировки совладания со стрессом эффективны при остром и хроническом стрессе.",
      },
      {
        source: "WHO mhGAP",
        finding:
          "Краткосрочные психологические интервенции рекомендованы при расстройствах адаптации.",
      },
    ],
  },
  addiction: {
    Icon: Wine,
    badge: "Зависимости",
    tagline:
      "Алкоголь, вещества, поведенческие зависимости — когда хочется остановиться, но не получается. КПТ работает с триггерами и циклом срыва.",
    accent: "from-destructive/15 via-primary/10 to-transparent",
    stats: [
      { label: "Длительность курса", value: "16–24+ сессии", Icon: Clock },
      { label: "Первые улучшения", value: "4–8 встреч", Icon: Sparkles },
      { label: "Метод", value: "КПТ + профилактика рецидивов", Icon: Brain },
      { label: "Фокус", value: "Триггеры и навыки", Icon: ShieldCheck },
    ],
    trustChips: COMMON_TRUST,
    evidence: [
      {
        source: "Marlatt & Gordon, Relapse Prevention",
        finding:
          "Модель профилактики рецидивов — стандарт в работе с зависимостями, доказательная база свыше 30 лет.",
      },
      {
        source: "NICE CG115",
        finding:
          "КПТ рекомендована при алкогольной зависимости в комбинации с медикаментозной поддержкой.",
      },
      {
        source: "Magill & Ray (2009), meta-analysis",
        finding:
          "КПТ показывает значимый эффект при употреблении психоактивных веществ у взрослых.",
      },
    ],
    urgent: {
      title: "При тяжёлой физической зависимости",
      text: "Резкая отмена алкоголя или ряда веществ опасна для жизни. Сначала — медицинская детоксикация под наблюдением врача, затем психотерапия. Я работаю с поддерживающим этапом, не заменяю нарколога.",
    },
  },
  "psiholog-moskva": {
    Icon: Brain,
    badge: "Онлайн для Москвы и России",
    tagline:
      "Работаю с русскоязычными клиентами из Москвы и всей России. Онлайн-формат: без пробок, очередей и привязки к району.",
    accent: "from-primary/20 via-accent/10 to-transparent",
    stats: [
      { label: "Часовой пояс", value: "Удобно для МСК", Icon: Clock },
      { label: "Длительность сессии", value: "50 минут", Icon: Clock },
      { label: "Метод", value: "КПТ + схема-терапия", Icon: Brain },
      { label: "Эффективность", value: "= очной", Icon: Award },
    ],
    trustChips: COMMON_TRUST,
    evidence: [
      {
        source: "Luo et al. (2021)",
        finding:
          "Онлайн-КПТ сопоставима с очной по эффективности при депрессии и тревоге.",
      },
      {
        source: "NICE Guidelines",
        finding:
          "КПТ — метод первой линии при тревожных и депрессивных расстройствах.",
      },
      {
        source: "Norwood et al. (2018)",
        finding:
          "Терапевтический альянс в онлайн-формате формируется так же надёжно, как и очно.",
      },
    ],
  },
  "psiholog-usa": {
    Icon: Brain,
    badge: "Онлайн для США и Канады",
    tagline:
      "Русскоязычный психолог для эмигрантов в США и Канаде. КПТ и схема-терапия на родном языке — там, где найти своего сложно.",
    accent: "from-primary/20 via-accent/10 to-transparent",
    stats: [
      { label: "Язык", value: "Русский", Icon: BookOpen },
      { label: "Длительность сессии", value: "50 минут", Icon: Clock },
      { label: "Метод", value: "КПТ + схема-терапия", Icon: Brain },
      { label: "Часовые пояса", value: "EST / PST", Icon: Clock },
    ],
    trustChips: COMMON_TRUST,
    evidence: [
      {
        source: "Carlbring et al. (2018)",
        finding:
          "Онлайн-терапия не уступает очной по результатам и удержанию клиентов.",
      },
      {
        source: "APA Guidelines",
        finding:
          "Видеоформат рекомендован APA как полноценная альтернатива при отсутствии локального специалиста.",
      },
      {
        source: "Hofmann et al. (2012)",
        finding:
          "КПТ — наиболее исследованный психотерапевтический подход с большой доказательной базой.",
      },
    ],
  },
};

const buildToc = (
  page: ReturnType<typeof getPageBySlug>,
  hasMyths: boolean,
  hasSelfCheck: boolean,
  hasCasebook: boolean,
) =>
  [
    { id: "symptoms", label: page?.symptomsTitle || "Знакомо?" },
    hasSelfCheck ? { id: "self-check", label: "Самопроверка" } : null,
    { id: "concept", label: "Как это работает" },
    hasMyths ? { id: "myths", label: "Мифы и факты" } : null,
    { id: "evidence", label: "Доказательная база" },
    { id: "process", label: "Как я работаю" },
    hasCasebook ? { id: "casebook", label: "Пример работы" } : null,
    { id: "outcomes", label: "Результаты" },
    { id: "pricing", label: "Стоимость" },
    { id: "faq", label: "FAQ" },
  ].filter(Boolean) as { id: string; label: string }[];

const ProblemPage = () => {
  const location = useLocation();
  const slug = location.pathname.replace("/", "");
  const page = getPageBySlug(slug);
  const meta = PROBLEM_META[slug];

  if (!page) return <NotFound />;
  // If this slug isn't in PROBLEM_META (e.g. method/city pages), fall back gracefully
  if (!meta) return <NotFound />;

  const { Icon } = meta;
  const extras = getProblemExtras(slug);
  const toc = buildToc(
    page,
    !!extras.myths?.length,
    !!extras.selfCheck?.length,
    !!extras.casebook,
  );
  const tocIds = toc.map((t) => t.id);
  const activeId = useActiveSection(tocIds);
  const scrollProgress = useScrollProgress();

  // Augment FAQ schema with common addons (price, online format)
  const fullFaq = [...page.faq, ...COMMON_FAQ_ADDONS];

  const relatedPages = page.relatedPages
    .map((s) => problemPages.find((p) => p.slug === s))
    .filter(Boolean);

  const relatedArticles = page.relatedArticles
    .map((s) => blogPosts.find((p) => p.slug === s))
    .filter(Boolean);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: fullFaq.map((f) => ({
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
      { "@type": "ListItem", position: 2, name: "С чем работаю", item: "https://cognitionx.cloud/#specs" },
      { "@type": "ListItem", position: 3, name: page.title, item: `https://cognitionx.cloud/${page.slug}` },
    ],
  };

  const medicalConditionSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalCondition",
    name: page.title,
    description: page.metaDescription,
    url: `https://cognitionx.cloud/${page.slug}`,
    possibleTreatment: {
      "@type": "MedicalTherapy",
      name: "Когнитивно-поведенческая терапия",
      url: "https://cognitionx.cloud/cbt-therapy",
    },
    signOrSymptom: page.symptoms.map((s) => ({
      "@type": "MedicalSymptom",
      name: s.text,
    })),
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `Как я работаю с темой «${page.title.toLowerCase()}»`,
    step: page.howIWork.map((text, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: `Шаг ${i + 1}`,
      text,
    })),
  };

  const medicalWebPageSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: page.metaTitle,
    description: page.metaDescription,
    url: `https://cognitionx.cloud/${page.slug}`,
    inLanguage: "ru-RU",
    lastReviewed: "2026-05-01",
    reviewedBy: { "@id": "https://cognitionx.cloud/#person" },
    about: { "@id": `https://cognitionx.cloud/${page.slug}#condition` },
    mainContentOfPage: {
      "@type": "WebPageElement",
      cssSelector: "main",
    },
  };

  const schemas = [
    faqSchema,
    breadcrumbSchema,
    medicalConditionSchema,
    medicalWebPageSchema,
    howToSchema,
  ];

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
        <div
          className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-32 -left-24 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative max-w-5xl mx-auto px-6 pt-14 md:pt-20 pb-16 md:pb-20">
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
              С чем работаю
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

      {/* ─── BODY ─── */}
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-20 grid lg:grid-cols-[1fr_220px] gap-12">
        <main className="min-w-0">
          {/* Urgent safety notice */}
          {meta.urgent && (
            <motion.aside
              {...fade()}
              role="note"
              className="mb-12 rounded-2xl border border-destructive/30 bg-destructive/5 p-5 md:p-6 flex gap-4"
            >
              <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <h2 className="text-sm md:text-base font-semibold text-foreground mb-1.5 flex items-center gap-2">
                  {meta.urgent.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {meta.urgent.text}
                </p>
                <a
                  href="tel:112"
                  className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-destructive hover:underline"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Экстренная помощь — 112
                </a>
              </div>
            </motion.aside>
          )}

          {/* 1. Symptoms */}
          <motion.section
            {...fade()}
            className="mb-20 scroll-mt-24"
            id="symptoms"
            aria-labelledby="symptoms-h"
          >
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <h2 id="symptoms-h" className="text-2xl md:text-3xl font-bold">
                {page.symptomsTitle || "Знакомо?"}
              </h2>
            </div>
            <p className="text-sm md:text-base text-muted-foreground mb-6 max-w-2xl">
              Если вы узнаёте себя в нескольких пунктах — это повод поговорить с
              психологом.
            </p>
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

          {/* 2. CBT model */}
          <motion.section
            {...fade()}
            className="mb-20 scroll-mt-24"
            id="concept"
            aria-labelledby="concept-h"
          >
            <div className="flex items-center gap-3 mb-6">
              <Brain className="w-5 h-5 text-primary" />
              <h2 id="concept-h" className="text-2xl md:text-3xl font-bold">
                {page.conceptTitle || "Как это работает: модель КПТ"}
              </h2>
            </div>
            <p className="text-sm md:text-base text-muted-foreground mb-6 max-w-2xl">
              Один и тот же повод вызывает разные реакции — потому что мы
              по-разному его интерпретируем. Вот как это выглядит на конкретном
              примере:
            </p>
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

          {/* Schema Domains (optional) */}
          {page.schemaDomains && (
            <motion.section
              {...fade()}
              className="mb-20 scroll-mt-24"
              aria-labelledby="domains-h"
            >
              <h2 id="domains-h" className="text-2xl md:text-3xl font-bold mb-6">
                Глубинные схемы
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {page.schemaDomains.map((d, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-border bg-card p-5"
                  >
                    <h3 className="text-sm font-semibold text-primary mb-3">
                      {d.domain}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {d.schemas.map((s, j) => (
                        <span
                          key={j}
                          className="text-xs bg-muted px-3 py-1.5 rounded-full"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* 3. Evidence + psychoeducation */}
          <motion.section
            {...fade()}
            className="mb-20 scroll-mt-24"
            id="evidence"
            aria-labelledby="evidence-h"
          >
            <div className="flex items-center gap-3 mb-6">
              <GraduationCap className="w-5 h-5 text-primary" />
              <h2 id="evidence-h" className="text-2xl md:text-3xl font-bold">
                Что говорят исследования
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4 mb-8">
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

            <h3 className="text-base md:text-lg font-bold mb-4 mt-8">
              Что важно знать
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
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

          {/* 4. Process */}
          <motion.section
            {...fade()}
            className="mb-20 scroll-mt-24"
            id="process"
            aria-labelledby="process-h"
          >
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-5 h-5 text-primary" />
              <h2 id="process-h" className="text-2xl md:text-3xl font-bold">
                Как я работаю с этой темой
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

          {/* 5. Outcomes */}
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

          {/* 6. FAQ */}
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

          {/* CTA */}
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

          {/* Internal links */}
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

          <motion.div {...fade()}>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                На главную
              </Link>
            </Button>
          </motion.div>
        </main>

        {/* Sticky TOC */}
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

export default ProblemPage;
