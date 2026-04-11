import { motion } from "framer-motion";
import { MessageSquare, Brain, Target, TrendingUp } from "lucide-react";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, delay },
});

const STEPS = [
  {
    step: "01",
    title: "Знакомство и диагностика",
    description: "На первой встрече мы определяем запрос, разбираемся в истории и ставим цели терапии. Вы рассказываете — я слушаю и задаю вопросы.",
    icon: MessageSquare,
  },
  {
    step: "02",
    title: "Формулировка случая",
    description: "Вместе мы выстраиваем модель: какие мысли, эмоции и поведение поддерживают проблему. Это карта, по которой мы будем двигаться.",
    icon: Brain,
  },
  {
    step: "03",
    title: "Работа с мыслями и поведением",
    description: "Используем техники КПТ: когнитивная реструктуризация, поведенческие эксперименты, экспозиция. Шаг за шагом меняем паттерны.",
    icon: Target,
  },
  {
    step: "04",
    title: "Закрепление и профилактика",
    description: "Формируем навыки самопомощи, составляем план профилактики рецидивов. Цель — чтобы вы могли справляться самостоятельно.",
    icon: TrendingUp,
  },
];

const Approach = () => (
  <section id="approach" className="max-w-5xl mx-auto px-6 py-24 md:py-32">
    <motion.div {...fade()} className="text-center mb-6">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
        Как устроена терапия
      </h2>
      <p className="text-muted-foreground mt-3 text-sm md:text-base max-w-xl mx-auto">
        Структурированный процесс с понятными этапами и измеримыми результатами
      </p>
    </motion.div>

    <div className="mt-16 space-y-20">
      {STEPS.map((s, i) => (
        <motion.div
          key={s.step}
          {...fade(0.05 * i)}
          className={`flex flex-col ${
            i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
          } items-center gap-10 md:gap-16`}
        >
          <div className="flex-1 text-center md:text-left">
            <span className="text-4xl md:text-5xl font-bold text-primary/20">
              {s.step}
            </span>
            <h3 className="text-xl md:text-2xl font-bold mt-2">{s.title}</h3>
            <p className="text-sm md:text-base text-muted-foreground mt-3 leading-relaxed max-w-md">
              {s.description}
            </p>
          </div>
          <div className="flex-1 w-full">
            <div className="rounded-2xl border border-border bg-card shadow-sm aspect-[4/3] flex items-center justify-center p-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                  <s.icon className="w-8 h-8 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground max-w-[200px] mx-auto">{s.title}</p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);

export default Approach;
