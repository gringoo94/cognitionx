import { motion } from "framer-motion";
import { ShieldCheck, BarChart3, BookOpen } from "lucide-react";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, delay },
});

const items = [
  {
    icon: ShieldCheck,
    title: "В клинических рекомендациях",
    text: "КПТ входит в клинические рекомендации ВОЗ и NICE при депрессии, тревожных и панических расстройствах.",
  },
  {
    icon: BarChart3,
    title: "План работы вместе с вами",
    text: "На первой встрече обсуждаем цели и ориентировочную длительность терапии. По ходу работы сверяем, что меняется и что ещё требует внимания.",
  },
  {
    icon: BookOpen,
    title: "Опирается на исследования",
    text: "В КПТ и схема-терапии используем методы, которые изучают в исследованиях. Подбираем их под ваш запрос и обсуждаем, насколько они вам подходят.",
  },
];

const sources = [
  { label: "APA", href: "https://www.apa.org/ptsd-guideline/patients-and-families/cognitive-behavioral" },
  { label: "WHO Guidelines", href: "https://www.who.int/publications/i/item/9789240084278" },
  { label: "Cochrane Library", href: "https://www.cochranelibrary.com/" },
];

const AboutEvidence = () => (
  <section className="bg-background">
    <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
      <div className="rounded-3xl bg-primary text-primary-foreground p-8 md:p-16">
        <div className="max-w-3xl">
          <motion.h2
            {...fade()}
            className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight"
          >
            Подход, который опирается на исследования
          </motion.h2>
          <motion.p
            {...fade(0.05)}
            className="mt-5 text-base md:text-lg leading-relaxed opacity-85"
          >
            Я работаю в КПТ и схема-терапии. Вместе разбираемся, что поддерживает
            трудности, и пробуем способы справляться с ними. Темп и длительность работы зависят от вашей ситуации.
          </motion.p>
        </div>

        <div className="mt-10 md:mt-14 grid gap-8 md:grid-cols-3 md:gap-12">
          {items.map(({ icon: Icon, title, text }, i) => (
            <motion.div key={title} {...fade(0.1 + i * 0.05)} className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-primary-foreground/10 flex items-center justify-center">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold">{title}</h3>
              <p className="text-sm leading-relaxed opacity-80">{text}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          {...fade(0.25)}
          className="mt-12 pt-7 border-t border-primary-foreground/20 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs"
        >
          <span className="uppercase tracking-wider font-semibold opacity-60">Источники:</span>
          {sources.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="underline underline-offset-4 decoration-primary-foreground/30 opacity-80 hover:opacity-100 transition-opacity"
            >
              {s.label}
            </a>
          ))}
        </motion.div>

        <motion.p {...fade(0.3)} className="mt-8 text-xs md:text-sm opacity-60">
          Вот как устроена работа ↓
        </motion.p>
      </div>
    </div>
  </section>
);

export default AboutEvidence;
