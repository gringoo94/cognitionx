import { motion } from "framer-motion";
import { MessageCircle, CalendarCheck, Route } from "lucide-react";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, delay },
});

const steps = [
  {
    icon: MessageCircle,
    step: "01",
    title: "Знакомство",
    desc: "Вы пишете мне — мы обсуждаем ваш запрос и формат работы. Без обязательств.",
  },
  {
    icon: CalendarCheck,
    step: "02",
    title: "Первая встреча",
    desc: "Диагностическая сессия: разбираемся в ситуации, определяем цели и подход.",
  },
  {
    icon: Route,
    step: "03",
    title: "План терапии",
    desc: "Составляем индивидуальный план работы — с конкретными шагами и понятными сроками.",
  },
];

const HowWeStart = () => (
  <section className="bg-card border-y border-border">
    <div className="max-w-4xl mx-auto px-6 py-20 md:py-28">
      <motion.div {...fade()} className="text-center mb-14">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Как мы начинаем работу</h2>
        <p className="text-muted-foreground mt-3 text-sm md:text-base max-w-xl mx-auto">
          Три простых шага — без давления и обязательств
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((s, i) => (
          <motion.div key={s.step} {...fade(0.08 * i)} className="text-center relative">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <s.icon className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xs font-bold text-primary/60 uppercase tracking-widest">{s.step}</span>
            <h3 className="text-base font-bold mt-1">{s.title}</h3>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{s.desc}</p>
            {i < steps.length - 1 && (
              <div className="hidden md:block absolute top-7 -right-4 w-8 border-t border-dashed border-border" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowWeStart;
