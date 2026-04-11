import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, delay },
});

const items = [
  "Подготовьте тихое место, где вас не побеспокоят",
  "Запишите, что вас волнует — хотя бы в нескольких словах",
  "Будьте готовы к открытому и честному диалогу",
  "Первая сессия — это знакомство, не нужно готовить «правильные» ответы",
];

const FAQ = [
  {
    q: "Сколько длится терапия?",
    a: "Обычно от 8 до 20 сессий. Зависит от запроса и темпа работы.",
  },
  {
    q: "Можно ли работать онлайн?",
    a: "Да, я работаю через Zoom или Google Meet. Онлайн-формат так же эффективен.",
  },
  {
    q: "Как часто нужно встречаться?",
    a: "Оптимально — раз в неделю. По мере прогресса можно реже.",
  },
  {
    q: "Что если я не знаю свой запрос?",
    a: "Это нормально. На первой встрече мы вместе разберёмся, с чем работать.",
  },
];

const Checklist = () => (
  <>
    {/* FAQ */}
    <section className="max-w-3xl mx-auto px-6 py-24 md:py-32">
      <motion.div {...fade()} className="text-center mb-14">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
          Частые вопросы
        </h2>
      </motion.div>

      <div className="space-y-4">
        {FAQ.map((item, i) => (
          <motion.div
            key={i}
            {...fade(0.06 * i)}
            className="rounded-xl border border-border bg-card p-6"
          >
            <h3 className="font-semibold text-sm">{item.q}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.a}</p>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Checklist / CTA */}
    <section className="bg-primary text-primary-foreground">
      <div className="max-w-3xl mx-auto px-6 py-20 md:py-28 text-center">
        <motion.h2
          {...fade()}
          className="text-2xl sm:text-3xl md:text-4xl font-bold"
        >
          Готовы к первому шагу?
        </motion.h2>
        <motion.div {...fade(0.05)} className="mt-8 space-y-3 text-left max-w-md mx-auto">
          {items.map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
              <p className="text-sm opacity-90 leading-relaxed">{item}</p>
            </div>
          ))}
        </motion.div>
        <motion.div {...fade(0.1)} className="mt-10">
          <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 gap-2 text-base px-8" asChild>
            <a href="#booking">
              Записаться на консультацию <ArrowRight className="w-4 h-4" />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  </>
);

export default Checklist;
