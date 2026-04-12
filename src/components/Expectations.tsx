import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, delay },
});

const expect = [
  "Конкретные инструменты, которые работают уже между сессиями",
  "Понятную структуру каждой встречи",
  "Безоценочное, безопасное пространство для разговора",
  "Домашние задания для закрепления навыков",
  "Измеримый прогресс — вы будете видеть динамику",
];

const dontExpect = [
  "Мгновенное исцеление после одной сессии",
  "Советов «просто не думай об этом»",
  "Давления или осуждения",
  "Работы за вас — терапия требует участия",
];

const Expectations = () => (
  <section className="max-w-4xl mx-auto px-6 py-20 md:py-28">
    <motion.div {...fade()} className="text-center mb-14">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Что ожидать от терапии</h2>
      <p className="text-muted-foreground mt-3 text-sm md:text-base max-w-xl mx-auto">
        Прозрачность помогает снизить тревогу перед первой встречей
      </p>
    </motion.div>

    <div className="grid md:grid-cols-2 gap-8">
      <motion.div {...fade(0.05)} className="rounded-2xl border border-border bg-card p-6 md:p-8">
        <h3 className="text-base font-bold mb-5 flex items-center gap-2">
          <Check className="w-5 h-5 text-primary" /> Что вы получите
        </h3>
        <ul className="space-y-3">
          {expect.map((e) => (
            <li key={e} className="flex items-start gap-3 text-sm text-muted-foreground">
              <Check className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
              {e}
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.div {...fade(0.1)} className="rounded-2xl border border-border bg-card p-6 md:p-8">
        <h3 className="text-base font-bold mb-5 flex items-center gap-2">
          <X className="w-5 h-5 text-destructive" /> Чего не стоит ожидать
        </h3>
        <ul className="space-y-3">
          {dontExpect.map((e) => (
            <li key={e} className="flex items-start gap-3 text-sm text-muted-foreground">
              <X className="w-4 h-4 mt-0.5 text-destructive/60 flex-shrink-0" />
              {e}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  </section>
);

export default Expectations;
