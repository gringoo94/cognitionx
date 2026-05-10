import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { tests } from "@/data/tests";
import { ArrowLeft, ArrowRight, Clock, Lock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { SITE_URL } from "@/lib/globalSchema";

const clusters = [
  { key: "all", label: "Все" },
  { key: "depression", label: "Депрессия" },
  { key: "anxiety", label: "Тревога" },
  { key: "burnout", label: "Выгорание" },
  { key: "stress", label: "Стресс" },
  { key: "self-esteem", label: "Самооценка" },
  { key: "it", label: "Для IT" },
  { key: "cbt-tools", label: "КПТ-инструменты" },
] as const;

const TestsHub = () => {
  const [filter, setFilter] = useState<(typeof clusters)[number]["key"]>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return tests;
    return tests.filter((t) => t.cluster === filter);
  }, [filter]);

  // ItemList schema (10 valid scales + YSQ schema-quiz)
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Психологические тесты онлайн",
    itemListElement: [
      ...tests.map((t, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE_URL}/tools/tests/${t.slug}`,
        name: t.title,
      })),
      {
        "@type": "ListItem",
        position: tests.length + 1,
        url: `${SITE_URL}/tools/schema-quiz`,
        name: "Опросник ранних дезадаптивных схем (YSQ)",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="Психологические тесты онлайн — бесплатно и анонимно | Дмитрий Яцко"
        description="Бесплатные психологические тесты онлайн: депрессия (PHQ-9), тревога (GAD-7), выгорание (BAT), синдром самозванца, стресс, самооценка, перфекционизм. Валидированные шкалы."
        path="/tools/tests"
        schema={itemListSchema}
        breadcrumbs={[
          { name: "Главная", url: `${SITE_URL}/` },
          { name: "Инструменты", url: `${SITE_URL}/tools` },
          { name: "Тесты", url: `${SITE_URL}/tools/tests` },
        ]}
      />
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 pt-28 pb-20">
        <Link
          to="/tools"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Все инструменты
        </Link>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10 max-w-2xl"
        >
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            Психологические тесты онлайн
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed mb-4">
            Десять валидированных шкал, которыми пользуются психологи и врачи во всём мире.
            Бесплатно, анонимно, без регистрации. Каждый тест занимает от 2 до 7 минут и завершается
            понятной интерпретацией результата.
          </p>
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Бесплатно
            </span>
            <span className="text-border">•</span>
            <span className="inline-flex items-center gap-1">
              <Lock className="h-3 w-3" /> Ответы не сохраняются
            </span>
            <span className="text-border">•</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" /> 2–7 минут
            </span>
          </div>
        </motion.div>

        {/* Cluster filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {clusters.map((c) => (
            <button
              key={c.key}
              onClick={() => setFilter(c.key)}
              className={cn(
                "text-xs px-3 py-1.5 rounded-full border transition-colors",
                filter === c.key
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Test grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((t, i) => (
            <motion.div
              key={t.slug}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
            >
              <Link
                to={`/tools/tests/${t.slug}`}
                className="group block h-full rounded-2xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase tracking-wide font-semibold text-primary">
                    {t.code}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                    {t.clusterLabel}
                  </span>
                </div>
                <h2 className="text-base font-semibold text-foreground mb-2 group-hover:text-primary transition-colors leading-snug">
                  {t.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                  {t.tagline}
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {t.durationMin} мин · {t.questions.length} вопр.
                  </span>
                  <span className="inline-flex items-center gap-1 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Пройти <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-12 rounded-2xl border border-border bg-muted/30 p-6 text-sm text-muted-foreground leading-relaxed">
          <p>
            <strong className="text-foreground">Важно.</strong> Все представленные шкалы — это{" "}
            <em>скрининговые инструменты</em>, а не диагностика. Они помогают понять, насколько выражены
            те или иные симптомы, но не ставят диагноз. Диагноз психического расстройства может поставить
            только врач — психотерапевт или психиатр — после клинического интервью.
          </p>
          <p className="mt-3">
            Если результат вас встревожил — это веский повод обратиться за консультацией. Я работаю с
            этими темами в формате КПТ и схема-терапии.{" "}
            <Link to="/contact" className="text-primary hover:underline">
              Записаться
            </Link>
            .
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TestsHub;
