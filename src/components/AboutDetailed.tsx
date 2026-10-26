import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, delay },
});

type Stage = {
  period: string;
  title: string;
  text: string;
  details: string[];
};

const stages: Stage[] = [
  {
    period: "2013 — 2016",
    title: "МолдГУ, лиценциат по психологии",
    text: "Квалификация «психолог», академическая база.",
    details: ["Лиценциат по психологии — МолдГУ"],
  },
  {
    period: "2021 — 2024",
    title: "КПТ и КПТ депрессии",
    text: "Базовый курс и специалитет по депрессии.",
    details: [
      "Когнитивно-поведенческая терапия, базовый курс — CBTLAB, 36 ч",
      "КПТ депрессии: 1 ступень — CBTLAB, 12 ч",
      "КПТ депрессии: 2 ступень (специалитет) — CBTLAB, 16 ч",
    ],
  },
  {
    period: "2024",
    title: "Клинические протоколы APA",
    text: "Тревога, настроение, зависимости.",
    details: [
      "Anxiety and Related Disorders — APA PsycLearn, 20 ч",
      "Depressive and Bipolar Disorders — APA PsycLearn, 20 ч",
      "Psychology of Anxiety, Mood, Substance Use and Addictive Behaviors — APA, 50 ч",
      "Disorders Due to Substance Use and Addictive Behaviors — APA PsycLearn, 20 ч",
    ],
  },
  {
    period: "2025 — 2026",
    title: "Доказательная практика и безопасность",
    text: "Белорусское общество КПТ, UNICEF, конференции.",
    details: [
      "Научно обоснованная практика: КПТ и вызовы современности — Белорусское общество КПТ, 30 ч",
      "Предотвращение сексуальной эксплуатации и надругательств — UNICEF, 30 ч",
      "«В объятиях Тифона» — работа с опасным поведением — В 4 Стенах, 30 ч",
    ],
  },
  {
    period: "Практика",
    title: "MedHub, Without Prejudice и онлайн",
    text: "Зависимости, беженцы войны, люди с ВИЧ, группы.",
    details: [
      "Клиника MedHub (Кишинёв): зависимости и созависимость",
      "Initiativa Pozitiva: групповая терапия, люди с ВИЧ",
      "Without Prejudice: работа с беженцами войны, кризисная помощь",
    ],
  },
  {
    period: "Сейчас",
    title: "Магистратура по клинической психологии",
    text: "Углублённая клиническая подготовка и супервизии.",
    details: ["Магистратура по клинической психологии", "Регулярные супервизии"],
  },
];

const methods = ["КПТ", "Схема-терапия", "ACT", "MI", "Smart Recovery", "Травматерапия", "Сексология"];

const AboutDetailed = () => {
  const [open, setOpen] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <section className="max-w-5xl mx-auto px-6 py-12 md:py-16">
      <motion.div {...fade()} className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            Образование и профессиональное развитие
          </h2>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">
            Нажмите на этап, чтобы увидеть сертификаты
          </p>
        </div>
        <div className="hidden sm:flex gap-2 shrink-0">
          <button
            type="button"
            aria-label="Предыдущие этапы"
            onClick={() => scroll(-1)}
            className="rounded-full border border-border bg-background p-2 hover:bg-muted transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Следующие этапы"
            onClick={() => scroll(1)}
            className="rounded-full border border-border bg-background p-2 hover:bg-muted transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </motion.div>

      <div className="relative">
        <div className="absolute left-0 right-0 top-[11px] h-px bg-border" aria-hidden />
        <div
          ref={trackRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-none [scrollbar-width:none]"
        >
          {stages.map((s, i) => {
            const active = open === i;
            return (
              <div key={s.title} className="snap-start shrink-0 w-[82%] sm:w-[44%] lg:w-[40%]">
                <span
                  className={`relative block h-[23px] w-[23px] rounded-full border-4 border-background shadow-sm ${
                    active ? "bg-primary" : "bg-primary/50"
                  }`}
                />
                <button
                  type="button"
                  aria-expanded={active}
                  aria-controls="roadmap-details"
                  onClick={() => setOpen(active ? null : i)}
                  className={`mt-3 w-full text-left rounded-xl border p-4 transition-colors ${
                    active ? "border-primary bg-primary/5" : "border-border bg-muted/30 hover:bg-muted/60"
                  }`}
                >
                  <span className="text-xs font-medium text-muted-foreground">{s.period}</span>
                  <h3 className="text-base font-semibold mt-0.5">{s.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{s.text}</p>
                  <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary">
                    {active ? "Свернуть" : "Подробнее"}
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${active ? "rotate-180" : ""}`} />
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div id="roadmap-details" aria-live="polite">
        <AnimatePresence initial={false}>
          {open !== null && (
            <motion.div
              key={open}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <ul className="mt-4 rounded-xl border border-border bg-muted/30 p-5 space-y-2">
                {stages[open].details.map((d) => (
                  <li key={d} className="text-sm text-foreground/80">
                    {d}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div {...fade(0.1)} className="mt-6 flex flex-wrap items-center gap-2">
        {methods.map((m) => (
          <span key={m} className="rounded-lg border border-border bg-muted px-3 py-1.5 text-xs font-medium text-foreground/80">
            {m}
          </span>
        ))}
        <a
          href="https://www.b17.ru/dumitru_iatco/"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto inline-flex items-center gap-1.5 text-sm font-medium text-primary underline underline-offset-2 hover:no-underline"
        >
          <ShieldCheck className="h-4 w-4" />
          Дипломы проверены на B17.ru
        </a>
      </motion.div>
    </section>
  );
};

export default AboutDetailed;
