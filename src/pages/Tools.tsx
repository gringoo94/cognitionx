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
  ArrowRight,
  ExternalLink,
  ClipboardList,
  Activity,
  Sparkles,
  Lock,
  Clock,
  BookMarked,
  CheckCircle2,
  ShieldCheck,
  GraduationCap,
  MousePointerClick,
  ListChecks,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { SITE_URL } from "@/lib/globalSchema";
import { tests } from "@/data/tests";

type ToolCard = {
  to: string;
  title: string;
  description: string;
  icon: LucideIcon;
  meta?: string;
};

const interactiveTools: ToolCard[] = [
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
// Top-3 most-searched tests (SEO): депрессия, тревога, выгорание
const featuredTestSlugs = ["phq-9", "gad-7", "bat-burnout"];

const benefits = [
  {
    icon: ShieldCheck,
    title: "Доказательная база",
    text: "Только валидированные шкалы и протоколы из современных клинических руководств.",
  },
  {
    icon: Lock,
    title: "Полностью анонимно",
    text: "Без регистрации и cookies. Ответы остаются в вашем браузере и нигде не сохраняются.",
  },
  {
    icon: GraduationCap,
    title: "С пояснениями психолога",
    text: "Каждый тест и техника сопровождаются интерпретацией и рекомендациями, что делать дальше.",
  },
  {
    icon: Sparkles,
    title: "Бесплатно и навсегда",
    text: "Все инструменты на сайте — бесплатные. Без скрытых платежей и подписок.",
  },
];

const steps = [
  {
    icon: MousePointerClick,
    title: "Выберите инструмент",
    text: "Тест по вашему запросу, технику КПТ или модуль рабочей тетради.",
  },
  {
    icon: ListChecks,
    title: "Пройдите 2–10 минут",
    text: "Отвечайте честно. Никаких «правильных» ответов — важна точность, а не желательность.",
  },
  {
    icon: MessageCircle,
    title: "Получите интерпретацию",
    text: "Прочитайте результат, рекомендации и решите — работать самостоятельно или со специалистом.",
  },
];

const faq = [
  {
    q: "Это заменяет консультацию психолога?",
    a: "Нет. Тесты — это скрининг, а не диагноз. Они помогают сформулировать запрос и понять, в каком направлении двигаться. Диагноз ставит врач или клинический психолог в очной беседе.",
  },
  {
    q: "Сохраняются ли мои ответы?",
    a: "Нет. Все вычисления происходят в браузере. Мы не храним ответы, не передаём их на сервер и не привязываем к личности. Можно проходить тесты без регистрации.",
  },
  {
    q: "Можно ли использовать результаты на сессии?",
    a: "Да, и это очень полезно. Покажите скриншот или назовите баллы — это сэкономит время на старте терапии и поможет точнее наметить план работы.",
  },
  {
    q: "Чем тесты на сайте отличаются от расширенной рабочей тетради?",
    a: "Тесты дают быстрый срез по конкретной шкале. Рабочая тетрадь — это структурированный курс из 10 модулей с трекингом прогресса и возможностью делиться им с терапевтом.",
  },
  {
    q: "Что делать, если результат меня встревожил?",
    a: "Это нормальная реакция. Не делайте поспешных выводов и не ставьте себе диагноз. Лучшее, что можно сделать — обсудить результат со специалистом. Запись на консультацию: /contact.",
  },
];

const SectionHeader = ({
  eyebrow,
  title,
  description,
  meta,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  meta?: React.ReactNode;
  align?: "left" | "center";
}) => (
  <div className={`mb-10 ${align === "center" ? "text-center mx-auto max-w-2xl" : ""}`}>
    <div className={`flex flex-wrap items-end gap-2 ${align === "center" ? "justify-center" : "justify-between"}`}>
      <div className={align === "center" ? "" : ""}>
        <span className="inline-block text-[11px] uppercase tracking-[0.18em] font-semibold text-primary mb-2">
          {eyebrow}
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight leading-[1.15]">
          {title}
        </h2>
      </div>
      {meta && <div className="text-sm text-muted-foreground">{meta}</div>}
    </div>
    {description && (
      <p className={`mt-3 text-base text-muted-foreground leading-relaxed ${align === "center" ? "max-w-2xl mx-auto" : "max-w-2xl"}`}>
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

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="КПТ-инструменты и психологические тесты | Дмитрий Яцко"
        description="Бесплатные интерактивные инструменты КПТ и схема-терапии: 11 валидированных тестов (PHQ-9, GAD-7, BAT, YSQ), ABC-анализ, колесо эмоций, дневник активации, рабочая тетрадь."
        path="/tools"
        ogImage={`${SITE_URL}/og-tools.webp`}
        schema={[itemListSchema, faqSchema]}
        breadcrumbs={[
          { name: "Главная", url: `${SITE_URL}/` },
          { name: "Инструменты", url: `${SITE_URL}/tools` },
        ]}
      />
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div
          aria-hidden
          className="absolute inset-0 -z-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,hsl(var(--primary)/0.18),transparent_70%)]"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 -z-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
        />
        <div className="relative max-w-6xl mx-auto px-6 pt-32 pb-20 md:pt-40 md:pb-28 text-center">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 border border-primary/20 px-3.5 py-1.5 rounded-full mb-6"
          >
            <Sparkles className="h-3.5 w-3.5" /> 11 тестов · 4 техники КПТ · доказательная психология
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.05] max-w-4xl mx-auto"
          >
            Психологические тесты и&nbsp;<span className="text-primary">инструменты&nbsp;КПТ</span>
            <br className="hidden md:block" /> которые работают
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto"
          >
            Валидированные шкалы, интерактивные техники и рабочие тетради — для самостоятельной
            практики или работы с терапевтом. Без регистрации, анонимно, на основе доказательной психологии.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Button asChild size="lg" className="gap-2 px-7">
              <a href="#tests">
                Пройти тест <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="px-7">
              <a href="#interactive">Открыть техники</a>
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground"
          >
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Бесплатно</span>
            <span className="inline-flex items-center gap-1.5"><Lock className="h-3.5 w-3.5 text-primary" /> Анонимно</span>
            <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-primary" /> 2–10 минут</span>
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-primary" /> Валидированные методики</span>
          </motion.div>
        </div>

        {/* Stats strip */}
        <div className="relative border-t border-border/60 bg-card/40 backdrop-blur">
          <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { v: "11", l: "психологических тестов" },
              { v: "4", l: "интерактивные техники" },
              { v: "10", l: "модулей рабочей тетради" },
              { v: "0 €", l: "стоимость использования" },
            ].map((s) => (
              <div key={s.l}>
                <div className="text-2xl md:text-3xl font-bold text-foreground">{s.v}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="relative">
        {/* BLOCK 1 — Tests */}
        <section id="tests" className="max-w-6xl mx-auto px-6 py-20 md:py-24 scroll-mt-20">
          <SectionHeader
            eyebrow="Блок 1 · Диагностика"
            title="Психологические тесты"
            description="10 валидированных шкал: депрессия (PHQ-9), тревога (GAD-7), выгорание (BAT-12), синдром самозванца, стресс, самооценка, перфекционизм, прокрастинация и дисфункциональные установки."
            meta={
              <Link to="/tools/tests" className="inline-flex items-center gap-1 text-primary hover:underline font-medium">
                Все 10 тестов <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            }
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredTests.map((t, i) => (
              <motion.div
                key={t.slug}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
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
                    {t.tagline || t.seoDescription}
                  </p>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/60">
                    <span className="text-[11px] text-muted-foreground">{t.durationMin} мин</span>
                    <span className="inline-flex items-center gap-1 text-xs text-primary opacity-70 group-hover:opacity-100 transition-opacity">
                      Пройти <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Schema-quiz: extended diagnostic test (YSQ) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4 }}
            className="mt-4"
          >
            <Link
              to="/tools/schema-quiz"
              className="group relative flex flex-col md:flex-row items-start md:items-center gap-5 rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="inline-flex p-3 rounded-xl bg-primary/10 shrink-0">
                <Compass className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold uppercase tracking-wider">
                    YSQ · 18 схем
                  </span>
                  <span className="text-[11px] text-muted-foreground">36 вопросов · 5–7 мин</span>
                </div>
                <h3 className="font-semibold text-foreground mb-1 leading-snug group-hover:text-primary transition-colors">
                  Опросник ранних дезадаптивных схем
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Расширенный тест по схема-терапии Янга. Покажет, какие из 18 ранних схем (брошенность,
                  дефективность, недоверие, эмоц. депривация и др.) могут быть активны.
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-sm text-primary font-medium opacity-80 group-hover:opacity-100 transition-opacity shrink-0">
                Пройти <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </motion.div>

          <div className="mt-8 text-center">
            <Button asChild variant="outline" size="lg">
              <Link to="/tools/tests">
                Смотреть все 10 тестов <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        </section>

        {/* HOW IT WORKS — alternate background */}
        <section className="bg-muted/30 border-y border-border/60">
          <div className="max-w-6xl mx-auto px-6 py-20 md:py-24">
            <SectionHeader
              eyebrow="Как это работает"
              title="Три простых шага"
              description="Не нужно регистрироваться, скачивать приложение или платить. Всё работает прямо в браузере."
              align="center"
            />
            <div className="grid md:grid-cols-3 gap-5 relative">
              {steps.map((s, i) => (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.35, delay: i * 0.07 }}
                  className="relative rounded-2xl border border-border bg-card p-6 text-center"
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                    {i + 1}
                  </div>
                  <div className="inline-flex p-3 rounded-2xl bg-primary/10 mb-4 mt-2">
                    <s.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* BLOCK 2 — Interactive */}
        <section id="interactive" className="max-w-6xl mx-auto px-6 py-20 md:py-24 scroll-mt-20">
          <SectionHeader
            eyebrow="Блок 2 · Практика"
            title="Интерактивные инструменты"
            description="Готовые техники прямо на сайте: разбор ранних схем, ABC-анализ, колесо эмоций и дневник поведенческой активации."
          />
          <div className="grid sm:grid-cols-2 gap-4">
            {interactiveTools.map((t, i) => (
              <motion.div
                key={t.to}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
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
                      <p className="text-sm text-muted-foreground leading-relaxed">{t.description}</p>
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

        {/* WHY / Benefits */}
        <section className="bg-muted/30 border-y border-border/60">
          <div className="max-w-6xl mx-auto px-6 py-20 md:py-24">
            <SectionHeader
              eyebrow="Почему этим инструментам можно доверять"
              title="Доказательная база и приватность"
              align="center"
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {benefits.map((b, i) => (
                <motion.div
                  key={b.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  className="rounded-2xl border border-border bg-card p-5"
                >
                  <div className="inline-flex p-2.5 rounded-xl bg-primary/10 mb-4">
                    <b.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1.5 text-sm">{b.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{b.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* BLOCK 3 — Workbook */}
        <section id="workbook" className="max-w-6xl mx-auto px-6 py-20 md:py-24 scroll-mt-20">
          <SectionHeader
            eyebrow="Блок 3 · Углублённая работа"
            title="Расширенная рабочая тетрадь"
            description="Полноценный курс КПТ из 10 модулей с возможностью сохранять прогресс и работать вместе с терапевтом. Открывается во внешнем приложении — нужна регистрация."
            meta={
              <Link to="/cbtworkbook" className="inline-flex items-center gap-1 text-primary hover:underline font-medium">
                Подробнее о тетради <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            }
          />

          <div className="mb-8 rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-card p-6 md:p-10 overflow-hidden relative">
            <div
              aria-hidden
              className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-primary/10 blur-3xl"
            />
            <div className="relative grid md:grid-cols-[1fr_auto] gap-6 items-center">
              <div className="flex items-start gap-4">
                <div className="inline-flex p-3.5 rounded-2xl bg-primary/15 shrink-0">
                  <BookMarked className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-2">
                    CBT Workbook — полный курс КПТ
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-xl">
                    10 модулей по протоколам Beck, Ellis и Lewinsohn, трекер настроения, упражнения и
                    возможность делиться прогрессом с терапевтом.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button asChild size="lg">
                  <Link to="/cbtworkbook">О курсе</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
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
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
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

        {/* FAQ */}
        <section className="bg-muted/30 border-y border-border/60">
          <div className="max-w-3xl mx-auto px-6 py-20 md:py-24">
            <SectionHeader
              eyebrow="FAQ"
              title="Частые вопросы"
              align="center"
            />
            <Accordion type="single" collapsible className="space-y-3">
              {faq.map((f, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="border border-border rounded-xl bg-card px-5 data-[state=open]:border-primary/30 transition-colors"
                >
                  <AccordionTrigger className="text-sm md:text-base font-medium text-left py-4 hover:no-underline">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="max-w-6xl mx-auto px-6 py-20 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4 }}
            className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-card to-card p-8 md:p-14 text-center"
          >
            <div
              aria-hidden
              className="absolute inset-0 -z-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_0%,hsl(var(--primary)/0.15),transparent_70%)]"
            />
            <div className="relative">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 tracking-tight">
                Инструменты — это начало, не замена терапии
              </h2>
              <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed mb-7">
                Если результат теста встревожил, или вы чувствуете, что в одиночку не справляетесь —
                поговорим. Первая встреча — знакомство и оценка запроса, без обязательств.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild size="lg" className="px-8">
                  <Link to="/contact">Записаться на консультацию</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="px-8">
                  <Link to="/about">Подробнее обо мне</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Tools;
