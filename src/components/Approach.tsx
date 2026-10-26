import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Brain, Target, TrendingUp, CheckCircle2 } from "lucide-react";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, delay },
});

/* ─── Animated demo: Diagnostic checklist appearing ─── */
function DiagnosticDemo() {
  const items = ["Запрос", "История", "Цели терапии", "Ожидания"];
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3 w-full">
      <div className="flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-primary" />
        <span className="text-xs font-semibold text-foreground">Первая встреча</span>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <motion.div
            key={item}
            className="flex items-center gap-2.5 p-2 rounded-lg bg-muted/50"
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.4 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 + 0.3, duration: 0.3, type: "spring" }}
            >
              <CheckCircle2 className="w-4 h-4 text-primary" />
            </motion.div>
            <span className="text-xs text-foreground">{item}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── Animated demo: Case formulation connections ─── */
function FormulationDemo() {
  const nodes = [
    { label: "Мысли", color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Эмоции", color: "text-rose-500", bg: "bg-rose-500/10" },
    { label: "Поведение", color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Тело", color: "text-amber-500", bg: "bg-amber-500/10" },
  ];
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3 w-full">
      <div className="flex items-center gap-2">
        <Brain className="w-4 h-4 text-primary" />
        <span className="text-xs font-semibold text-foreground">Модель случая</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {nodes.map((n, i) => (
          <motion.div
            key={n.label}
            className={`${n.bg} rounded-lg p-3 text-center`}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.4, type: "spring" }}
          >
            <span className={`text-xs font-semibold ${n.color}`}>{n.label}</span>
          </motion.div>
        ))}
      </div>
      {/* Connecting lines animation */}
      <motion.div
        className="h-0.5 rounded-full bg-primary/20 mx-4"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.6 }}
      />
      <motion.p
        className="text-[10px] text-muted-foreground text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.7 }}
      >
        Все элементы связаны между собой
      </motion.p>
    </div>
  );
}

/* ─── Animated demo: Technique progress bars ─── */
function TechniqueDemo() {
  const techniques = [
    { name: "Реструктуризация", emoji: "🧠", progress: 85 },
    { name: "Экспозиция", emoji: "🎯", progress: 60 },
    { name: "Эксперименты", emoji: "⚡", progress: 45 },
  ];
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3 w-full">
      <div className="flex items-center gap-2">
        <Target className="w-4 h-4 text-primary" />
        <span className="text-xs font-semibold text-foreground">Прогресс техник</span>
      </div>
      {techniques.map((t, i) => (
        <motion.div
          key={t.name}
          className="space-y-1"
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.12, duration: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-foreground flex items-center gap-1.5">
              <span>{t.emoji}</span> {t.name}
            </span>
            <span className="text-[10px] font-mono text-primary">{t.progress}%</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              whileInView={{ width: `${t.progress}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Animated demo: Self-help skills mood trend ─── */
function SelfHelpDemo() {
  const weeks = [
    { label: "Нед 1", score: 3, emoji: "😔" },
    { label: "Нед 4", score: 5, emoji: "😐" },
    { label: "Нед 8", score: 7, emoji: "🙂" },
    { label: "Нед 12", score: 8, emoji: "😊" },
    { label: "После", score: 9, emoji: "😄" },
  ];
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3 w-full">
      <div className="flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-primary" />
        <span className="text-xs font-semibold text-foreground">Динамика состояния</span>
      </div>
      <div className="flex items-end gap-2 h-20">
        {weeks.map((w, i) => (
          <motion.div
            key={i}
            className="flex-1 flex flex-col items-center gap-1"
            initial={{ height: 0, opacity: 0 }}
            whileInView={{ height: "auto", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
          >
            <span className="text-sm">{w.emoji}</span>
            <motion.div
              className="w-full rounded-t-md overflow-hidden"
              initial={{ height: 0 }}
              whileInView={{ height: `${w.score * 7}px` }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 + 0.2, duration: 0.6, ease: "easeOut" }}
            >
              <div
                className="w-full h-full rounded-t-md bg-primary"
                style={{ opacity: 0.3 + (w.score / 10) * 0.7 }}
              />
            </motion.div>
            <span className="text-[9px] text-muted-foreground">{w.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const STEPS = [
  {
    step: "01",
    title: "Знакомство и диагностика",
    description:
      "На первой встрече мы определяем запрос, разбираемся в истории и ставим цели терапии. Вы рассказываете — я слушаю и задаю вопросы.",
    Demo: DiagnosticDemo,
  },
  {
    step: "02",
    title: "Формулировка случая",
    description:
      "Вместе мы выстраиваем модель: какие мысли, эмоции и поведение поддерживают проблему. Это карта, по которой мы будем двигаться.",
    Demo: FormulationDemo,
  },
  {
    step: "03",
    title: "Работа с мыслями и поведением",
    description:
      "Используем техники КПТ: когнитивная реструктуризация, поведенческие эксперименты, экспозиция. Шаг за шагом меняем паттерны.",
    Demo: TechniqueDemo,
  },
  {
    step: "04",
    title: "Закрепление и профилактика",
    description:
      "Формируем навыки самопомощи, составляем план профилактики рецидивов. Цель — чтобы вы могли справляться самостоятельно.",
    Demo: SelfHelpDemo,
  },
];

const SHORT = ["Запрос и цели", "Карта проблемы", "Техники КПТ", "Самостоятельность"];

const Approach = () => {
  const [active, setActive] = useState(0);
  const s = STEPS[active];
  return (
    <section id="approach" className="max-w-5xl mx-auto px-6 py-14 md:py-20">
      <motion.div {...fade()} className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Как устроена терапия</h2>
        <p className="text-muted-foreground mt-3 text-sm md:text-base max-w-xl mx-auto">
          Структурированный процесс с понятными этапами и измеримыми результатами
        </p>
      </motion.div>

      <div role="tablist" aria-label="Этапы терапии" className="flex gap-3 overflow-x-auto snap-x pb-2 [scrollbar-width:none]">
        {STEPS.map((st, i) => {
          const on = i === active;
          return (
            <button
              key={st.step}
              type="button"
              role="tab"
              aria-selected={on}
              aria-controls="approach-panel"
              onClick={() => setActive(i)}
              className={`snap-start shrink-0 w-[70%] sm:w-auto sm:flex-1 text-left rounded-xl border p-4 transition-colors ${
                on ? "border-primary bg-primary/5" : "border-border bg-muted/30 hover:bg-muted/60"
              }`}
            >
              <span className={`text-2xl font-bold ${on ? "text-primary" : "text-primary/30"}`}>{st.step}</span>
              <span className="block text-sm font-semibold mt-1">{st.title}</span>
              <span className="block text-xs text-muted-foreground mt-0.5">{SHORT[i]}</span>
            </button>
          );
        })}
      </div>

      <div
        id="approach-panel"
        role="tabpanel"
        className="mt-5 rounded-2xl border border-border bg-card shadow-sm p-6 md:p-8 grid md:grid-cols-2 gap-6 md:gap-10 items-center"
      >
        <motion.div key={`t${active}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <h3 className="text-xl md:text-2xl font-bold">{s.title}</h3>
          <p className="text-sm md:text-base text-muted-foreground mt-3 leading-relaxed">{s.description}</p>
        </motion.div>
        <div key={`d${active}`} className="w-full">
          <s.Demo />
        </div>
      </div>
    </section>
  );
};

export default Approach;
