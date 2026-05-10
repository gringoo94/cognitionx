import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import {
  Brain,
  BookOpen,
  Target,
  Leaf,
  Zap,
  Shield,
  AlertTriangle,
  Lightbulb,
  Compass,
  Heart,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  ClipboardList,
  Activity,
  Sparkles,
  Lock,
  Clock,
  BookMarked,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE_URL } from "@/lib/globalSchema";
import { tests } from "@/data/tests";

type ToolCard = {
  to: string;
  title: string;
  description: string;
  icon: LucideIcon;
  meta?: string;
  badge?: string;
};

// Block 2 — interactive on-site tools (without tests / without cbtworkbook)
const interactiveTools: ToolCard[] = [
  {
    to: "/tools/schema-quiz",
    title: "Тест: ваши ранние схемы",
    description:
      "Экспресс-версия YSQ — 36 вопросов за 5–7 минут. Покажет, какие из 18 ранних дезадаптивных схем могут быть активны.",
    icon: Compass,
    meta: "36 вопросов · 5–7 мин",
  },
  {
    to: "/tools/abc-analysis",
    title: "ABC-анализ",
    description:
      "Пошаговый разбор ситуации по модели Эллиса: событие → мысль → эмоция → диспут → новый взгляд.",
    icon: BookOpen,
    meta: "5 шагов",
  },
  {
    to: "/tools/emotion-wheel",
    title: "Колесо эмоций",
    description:
      "Интерактивное колесо: 13 категорий переживаний и 87 эмоций. Нажмите на сектор, чтобы исследовать.",
    icon: Heart,
    meta: "87 эмоций",
  },
  {
    to: "/tools/behavioral-activation",
    title: "Дневник поведенческой активации",
    description:
      "Фиксируйте активности и их влияние на настроение, мастерство и удовольствие. Метод первой линии при депрессии.",
    icon: Activity,
    meta: "Ежедневный трекер",
  },
];

// Block 3 — extended workbook (Knowledge Forge external app, the same one CBT Workbook routes to)
const externalTools = [
  { id: 1, title: "Диагностика депрессии и тревоги", description: "Оцените выраженность симптомов в четырёх плоскостях: мысли, эмоции, тело и поведение.", icon: Brain, tags: ["Депрессия", "Тревога"] },
  { id: 2, title: "ABC-модель (ABCDE)", description: "Разберите ситуацию по модели Эллиса: событие → убеждение → последствия → диспут → новое убеждение.", icon: BookOpen, tags: ["Когнитивная терапия"] },
  { id: 3, title: "SMART-цели", description: "Поставьте конкретные, измеримые, достижимые, релевантные и ограниченные по времени цели.", icon: Target, tags: ["Цели", "Планирование"] },
  { id: 4, title: "Изменение образа жизни", description: "Спланируйте изменения в ключевых сферах: сон, питание, активность, социальные связи.", icon: Leaf, tags: ["Привычки"] },
  { id: 5, title: "Поведенческая активация", description: "Отслеживайте настроение и планируйте активности, чтобы выйти из спирали избегания при депрессии.", icon: Zap, tags: ["Активация", "Настроение"] },
  { id: 6, title: "Работа со страхами", description: "Постепенная экспозиция: составьте иерархию страхов и систематически работайте с каждым уровнем.", icon: Shield, tags: ["Фобии", "Экспозиция"] },
  { id: 7, title: "Контейнирование тревоги", description: "Техники для управления беспокойством: «время для тревоги», дерево решений, разделение видов беспокойства.", icon: AlertTriangle, tags: ["Тревога"] },
  { id: 8, title: "Решение проблем", description: "Структурированный подход: определение, генерация решений, оценка вариантов и план действий.", icon: Lightbulb, tags: ["Проблемы"] },
  { id: 9, title: "Оспаривание мыслей", description: "Выявление и оспаривание негативных автоматических мыслей. Когнитивные искажения и альтернативы.", icon: Compass, tags: ["Мысли", "Искажения"] },
  { id: 10, title: "План благополучия", description: "Персональный план: ресурсы, сигналы ухудшения, стратегии поддержания и кризисный план.", icon: Heart, tags: ["Благополучие"] },
];

const KNOWLEDGE_FORGE_URL = "https://knowledge-forge.lovable.app";

// Block 1 — featured psychological tests (top 6 from data set)
const featuredTestSlugs = ["phq9", "gad7", "bat", "cips", "pss10", "rosenberg"];

const SectionHeader = ({
  eyebrow,
  title,
  description,
  meta,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  meta?: React.ReactNode;
}) => (
  <div className="mb-6">
    <div className="flex flex-wrap items-end justify-between gap-2">
      <div>
        <span className="inline-block text-[11px] uppercase tracking-wider font-medium text-primary/80 mb-1.5">
          {eyebrow}
        </span>
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
          {title}
        </h2>
      </div>
      {meta && <div className="text-xs text-muted-foreground">{meta}</div>}
    </div>
    {description && (
      <p className="mt-2 text-sm md:text-base text-muted-foreground max-w-2xl leading-relaxed">
        {description}
      </p>
    )}
  </div>
);

const Tools = () => {
  const featuredTests = featuredTestSlugs
    .map((s) => tests.find((t) => t.slug === s))
    .filter(Boolean) as typeof tests;

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Инструменты КПТ и психологические тесты",
    itemListElement: [
      ...featuredTests.map((t, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE_URL}/tools/tests/${t.slug}`,
        name: t.title,
      })),
      ...interactiveTools.map((t, i) => ({
        "@type": "ListItem",
        position: featuredTests.length + i + 1,
        url: `${SITE_URL}${t.to}`,
        name: t.title,
      })),
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="КПТ-инструменты и психологические тесты | Дмитрий Яцко"
        description="Бесплатные интерактивные инструменты КПТ и схема-терапии: 10 валидированных тестов (PHQ-9, GAD-7, BAT), ABC-анализ, колесо эмоций, дневник активации, рабочая тетрадь."
        path="/tools"
        schema={itemListSchema}
        breadcrumbs={[
          { name: "Главная", url: `${SITE_URL}/` },
          { name: "Инструменты", url: `${SITE_URL}/tools` },
        ]}
      />
      <Navbar />

      {/* Decorative gradient background for the whole page */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[520px] -z-0 bg-gradient-to-b from-primary/5 via-primary/[0.02] to-transparent pointer-events-none"
      />

      <main className="relative max-w-6xl mx-auto px-6 pt-24 pb-20">
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-2 mb-6 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> На главную
          </Button>
        </Link>

        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-16 max-w-3xl"
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full mb-4">
            <Sparkles className="h-3.5 w-3.5" /> Бесплатные психологические инструменты
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
            Инструменты <span className="text-primary">КПТ</span> и психологические тесты
          </h1>
          <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed">
            Валидированные тесты, интерактивные техники и рабочие тетради — для самостоятельной
            работы или вместе с терапевтом. Без регистрации, анонимно, на основе доказательной психологии.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5" /> Бесплатно</span>
            <span className="inline-flex items-center gap-1.5"><Lock className="h-3.5 w-3.5" /> Анонимно</span>
            <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> 2–10 минут</span>
          </div>
        </motion.section>

        {/* BLOCK 1 — Psychological tests */}
        <section className="mb-20">
          <SectionHeader
            eyebrow="Блок 1 · Диагностика"
            title="Психологические тесты"
            description="10 валидированных шкал: депрессия (PHQ-9), тревога (GAD-7), выгорание (BAT-12), синдром самозванца, стресс, самооценка, перфекционизм, прокрастинация, дисфункциональные установки."
            meta={
              <Link to="/tools/tests" className="inline-flex items-center gap-1 text-primary hover:underline">
                Все 10 тестов <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            }
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredTests.map((t, i) => (
              <motion.div
                key={t.slug}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
              >
                <Link
                  to={`/tools/tests/${t.slug}`}
                  className="group relative flex h-full flex-col rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="inline-flex p-2.5 rounded-xl bg-primary/10">
                      <ClipboardList className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium uppercase tracking-wider">
                      {t.questions.length} вопр.
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 leading-snug group-hover:text-primary transition-colors">
                    {t.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-3">
                    {t.shortDescription || t.seo?.description}
                  </p>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/60">
                    <span className="text-[11px] text-muted-foreground">{t.estimatedMinutes} мин</span>
                    <span className="inline-flex items-center gap-1 text-xs text-primary opacity-70 group-hover:opacity-100 transition-opacity">
                      Пройти <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Button asChild variant="outline">
              <Link to="/tools/tests">Смотреть все 10 тестов</Link>
            </Button>
          </div>
        </section>

        {/* BLOCK 2 — Interactive tools */}
        <section className="mb-20">
          <SectionHeader
            eyebrow="Блок 2 · Практика"
            title="Интерактивные инструменты"
            description="Готовые техники прямо на сайте: разбор схем, ABC-анализ, колесо эмоций и дневник поведенческой активации."
            meta={<span className="hidden sm:inline">Прямо на сайте</span>}
          />

          <div className="grid sm:grid-cols-2 gap-4">
            {interactiveTools.map((t, i) => (
              <motion.div
                key={t.to}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
              >
                <Link
                  to={t.to}
                  className="group relative flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
                >
                  <div className="flex items-start gap-4">
                    <div className="inline-flex p-3 rounded-xl bg-primary/10 shrink-0">
                      <t.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1.5 leading-snug group-hover:text-primary transition-colors">
                        {t.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {t.description}
                      </p>
                      {t.meta && (
                        <div className="mt-3 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                          {t.meta}
                          <ArrowRight className="h-3 w-3 ml-1 opacity-60 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* BLOCK 3 — Extended workbook (CBT Workbook / Knowledge Forge) */}
        <section className="mb-20">
          <SectionHeader
            eyebrow="Блок 3 · Углублённая работа"
            title="Расширенная рабочая тетрадь"
            description="Полноценный курс КПТ из 10 модулей с возможностью сохранять прогресс и работать вместе с терапевтом. Открывается во внешнем приложении — нужна регистрация."
            meta={
              <Link to="/cbtworkbook" className="inline-flex items-center gap-1 text-primary hover:underline">
                Подробнее о тетради <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            }
          />

          {/* Hero card for the workbook */}
          <div className="mb-6 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-card p-6 md:p-8">
            <div className="grid md:grid-cols-[1fr_auto] gap-6 items-center">
              <div className="flex items-start gap-4">
                <div className="inline-flex p-3 rounded-xl bg-primary/15 shrink-0">
                  <BookMarked className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-foreground mb-1.5">
                    CBT Workbook — полный курс КПТ
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                    10 модулей по протоколам Beck, Ellis и Lewinsohn, трекер настроения, упражнения и
                    возможность делиться прогрессом с терапевтом.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button asChild>
                  <Link to="/cbtworkbook">О курсе</Link>
                </Button>
                <Button asChild variant="outline">
                  <a href={KNOWLEDGE_FORGE_URL} target="_blank" rel="noopener noreferrer">
                    Открыть <ExternalLink className="h-4 w-4 ml-1.5" />
                  </a>
                </Button>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {externalTools.map((tool, i) => (
              <motion.a
                key={tool.id}
                href={`${KNOWLEDGE_FORGE_URL}/dashboard/tool/${tool.id}`}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.02 }}
                className="group relative flex h-full flex-col rounded-xl border border-border bg-card p-4 hover:border-primary/40 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-3 mb-2">
                  <div className="inline-flex p-1.5 rounded-lg bg-muted shrink-0">
                    <tool.icon className="h-4 w-4 text-foreground/70" />
                  </div>
                  <h4 className="font-medium text-foreground text-sm leading-snug group-hover:text-primary transition-colors flex-1">
                    {tool.title}
                  </h4>
                  <ExternalLink className="h-3 w-3 text-muted-foreground/60 group-hover:text-primary transition-colors shrink-0" />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3 flex-1">
                  {tool.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {tool.tags.map((tag) => (
                    <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.a>
            ))}
          </div>
        </section>

        {/* Bottom CTA — consultation */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl border border-border bg-gradient-to-br from-card to-muted/30 p-8 md:p-10"
        >
          <div className="grid md:grid-cols-[1fr_auto] items-center gap-6">
            <div>
              <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-2">
                Инструменты — это начало, не замена терапии
              </h2>
              <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
                Если результат теста встревожил, или вы чувствуете, что в одиночку не справляетесь —
                поговорим. Первая встреча — знакомство и оценка запроса, без обязательств.
              </p>
            </div>
            <Button asChild size="lg">
              <Link to="/contact">Записаться на консультацию</Link>
            </Button>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
};

export default Tools;
