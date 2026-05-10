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
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE_URL } from "@/lib/globalSchema";

type FeaturedTool = {
  to: string;
  title: string;
  description: string;
  icon: LucideIcon;
  meta?: string;
  badge?: string;
  featured?: boolean;
};

const featuredTools: FeaturedTool[] = [
  {
    to: "/tools/tests",
    title: "Психологические тесты",
    description:
      "10 валидированных шкал: депрессия (PHQ-9), тревога (GAD-7), выгорание (BAT), синдром самозванца, стресс, самооценка, перфекционизм. Бесплатно и анонимно.",
    icon: ClipboardList,
    meta: "10 шкал · 2–7 мин",
    badge: "Новое",
    featured: true,
  },
  {
    to: "/cbtworkbook",
    title: "CBT Workbook — полный курс КПТ",
    description:
      "Бесплатная цифровая тетрадь: 10 модулей КПТ, трекер настроения, упражнения по протоколам Beck, Ellis, Lewinsohn.",
    icon: Brain,
    meta: "10 модулей",
    badge: "Beta",
    featured: true,
  },
  {
    to: "/tools/schema-quiz",
    title: "Тест: ваши ранние схемы",
    description:
      "Экспресс-версия YSQ — 36 вопросов за 5–7 минут. Покажет, какие из 18 ранних дезадаптивных схем могут быть активны.",
    icon: Compass,
    meta: "36 вопросов",
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

const externalTools = [
  {
    id: 1,
    title: "Диагностика депрессии и тревоги",
    description:
      "Оцените выраженность симптомов в четырёх плоскостях: мысли, эмоции, тело и поведение.",
    icon: Brain,
    tags: ["Депрессия", "Тревога"],
  },
  {
    id: 2,
    title: "ABC-модель (ABCDE)",
    description:
      "Разберите ситуацию по модели Эллиса: событие → убеждение → последствия → диспут → новое убеждение.",
    icon: BookOpen,
    tags: ["Когнитивная терапия"],
  },
  {
    id: 3,
    title: "SMART-цели",
    description:
      "Поставьте конкретные, измеримые, достижимые, релевантные и ограниченные по времени цели.",
    icon: Target,
    tags: ["Цели", "Планирование"],
  },
  {
    id: 4,
    title: "Изменение образа жизни",
    description:
      "Спланируйте изменения в ключевых сферах: сон, питание, активность, социальные связи.",
    icon: Leaf,
    tags: ["Привычки"],
  },
  {
    id: 5,
    title: "Поведенческая активация",
    description:
      "Отслеживайте настроение и планируйте активности, чтобы выйти из спирали избегания при депрессии.",
    icon: Zap,
    tags: ["Активация", "Настроение"],
  },
  {
    id: 6,
    title: "Работа со страхами",
    description:
      "Постепенная экспозиция: составьте иерархию страхов и систематически работайте с каждым уровнем.",
    icon: Shield,
    tags: ["Фобии", "Экспозиция"],
  },
  {
    id: 7,
    title: "Контейнирование тревоги",
    description:
      "Техники для управления беспокойством: «время для тревоги», дерево решений, разделение видов беспокойства.",
    icon: AlertTriangle,
    tags: ["Тревога"],
  },
  {
    id: 8,
    title: "Решение проблем",
    description:
      "Структурированный подход: определение, генерация решений, оценка вариантов и план действий.",
    icon: Lightbulb,
    tags: ["Проблемы"],
  },
  {
    id: 9,
    title: "Оспаривание мыслей",
    description:
      "Выявление и оспаривание негативных автоматических мыслей. Когнитивные искажения и альтернативы.",
    icon: Compass,
    tags: ["Мысли", "Искажения"],
  },
  {
    id: 10,
    title: "План благополучия",
    description:
      "Персональный план: ресурсы, сигналы ухудшения, стратегии поддержания и кризисный план.",
    icon: Heart,
    tags: ["Благополучие"],
  },
];

const KNOWLEDGE_FORGE_URL = "https://knowledge-forge.lovable.app";

const Tools = () => {
  // ItemList schema for SEO
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Инструменты КПТ и психологические тесты",
    itemListElement: featuredTools.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}${t.to}`,
      name: t.title,
    })),
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

      <main className="max-w-6xl mx-auto px-6 pt-24 pb-20">
        <Link to="/">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 mb-6 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> На главную
          </Button>
        </Link>

        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10 max-w-2xl"
        >
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Инструменты <span className="text-primary">КПТ</span> и психологические тесты
          </h1>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            Интерактивные инструменты когнитивно-поведенческой и схема-терапии: тесты,
            рабочие тетради, дневники. С теорией, примерами и шагами для самостоятельной работы —
            или вместе с терапевтом.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> Бесплатно
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5" /> Без регистрации
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> 2–10 минут
            </span>
          </div>
        </motion.section>

        {/* Featured: on-site interactive tools */}
        <section className="mb-16">
          <div className="flex items-end justify-between mb-5">
            <h2 className="text-xl md:text-2xl font-semibold text-foreground">
              Интерактивные инструменты
            </h2>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Прямо на сайте
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredTools.map((t, i) => (
              <motion.div
                key={t.to}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
                className={t.featured ? "sm:col-span-2 lg:col-span-1" : ""}
              >
                <Link
                  to={t.to}
                  className={`group relative flex h-full flex-col rounded-2xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5 ${
                    t.featured
                      ? "border-primary/30 bg-gradient-to-br from-primary/5 to-card"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`inline-flex p-2.5 rounded-xl ${
                        t.featured ? "bg-primary/15" : "bg-muted"
                      }`}
                    >
                      <t.icon
                        className={`h-5 w-5 ${t.featured ? "text-primary" : "text-foreground/80"}`}
                      />
                    </div>
                    {t.badge && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/15 text-primary font-medium">
                        {t.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="font-semibold text-foreground mb-2 leading-snug group-hover:text-primary transition-colors">
                    {t.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                    {t.description}
                  </p>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/60">
                    {t.meta ? (
                      <span className="text-[11px] text-muted-foreground">{t.meta}</span>
                    ) : (
                      <span />
                    )}
                    <span className="inline-flex items-center gap-1 text-xs text-primary opacity-70 group-hover:opacity-100 transition-opacity">
                      Открыть <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* External: Knowledge Forge workbook */}
        <section className="mb-16">
          <div className="flex flex-wrap items-end justify-between gap-2 mb-2">
            <h2 className="text-xl md:text-2xl font-semibold text-foreground">
              Расширенная рабочая тетрадь
            </h2>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <ExternalLink className="h-3 w-3" /> Открывается во внешнем приложении
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-6 max-w-2xl">
            10 структурированных техник с возможностью сохранять прогресс и работать вместе с
            терапевтом. Требуется регистрация в Knowledge Forge.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {externalTools.map((tool, i) => (
              <motion.a
                key={tool.id}
                href={`${KNOWLEDGE_FORGE_URL}/dashboard/tool/${tool.id}`}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                className="group relative flex h-full flex-col rounded-2xl border border-border bg-card p-5 hover:border-primary/30 hover:shadow-md transition-all"
              >
                <div className="inline-flex p-2 rounded-lg bg-muted w-fit mb-3">
                  <tool.icon className="h-4 w-4 text-foreground/70" />
                </div>
                <h3 className="font-semibold text-foreground text-sm mb-1.5 group-hover:text-primary transition-colors leading-snug">
                  {tool.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3 flex-1">
                  {tool.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {tool.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <ExternalLink className="h-3 w-3 text-muted-foreground/60 group-hover:text-primary transition-colors" />
                </div>
              </motion.a>
            ))}
          </div>
        </section>

        {/* Bottom CTA — consultation, not external app */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl border border-border bg-card p-8 md:p-10"
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
            <div className="flex flex-col sm:flex-row md:flex-col gap-2">
              <Button asChild size="lg">
                <Link to="/contact">Записаться на консультацию</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href={KNOWLEDGE_FORGE_URL} target="_blank" rel="noopener noreferrer">
                  Открыть приложение <ExternalLink className="h-4 w-4 ml-1.5" />
                </a>
              </Button>
            </div>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
};

export default Tools;
