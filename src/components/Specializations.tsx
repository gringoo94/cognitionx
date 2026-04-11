import { motion } from "framer-motion";
import { ArrowRight, AlertCircle, CloudRain, Flame, Heart, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, delay },
});

const specs = [
  {
    title: "Тревога и панические атаки",
    desc: "Навязчивые мысли, постоянное беспокойство, приступы паники. Работаем с когнитивными искажениями и учимся управлять тревогой.",
    icon: AlertCircle,
  },
  {
    title: "Депрессия",
    desc: "Потеря интереса, апатия, чувство безнадёжности. Помогаю восстановить активность и изменить негативные паттерны мышления.",
    icon: CloudRain,
  },
  {
    title: "Выгорание",
    desc: "Эмоциональное истощение, потеря мотивации. Находим баланс между работой и отдыхом, выстраиваем границы.",
    icon: Flame,
  },
  {
    title: "Отношения",
    desc: "Сложности в общении, конфликты, созависимость. Учимся выстраивать здоровые и поддерживающие связи.",
    icon: Heart,
  },
  {
    title: "Самооценка",
    desc: "Неуверенность, самокритика, синдром самозванца. Работаем с глубинными убеждениями и формируем устойчивый образ себя.",
    icon: Shield,
  },
  {
    title: "Стресс и адаптация",
    desc: "Сложные жизненные ситуации, переезд, смена работы. Помогаю адаптироваться и находить ресурсы для изменений.",
    icon: Sparkles,
  },
];

const Specializations = () => (
  <section id="specs" className="max-w-5xl mx-auto px-6 py-24 md:py-32">
    <motion.div {...fade()} className="text-center mb-14">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
        С чем я работаю
      </h2>
      <p className="text-muted-foreground mt-3 text-sm md:text-base max-w-xl mx-auto">
        Основные направления, в которых я специализируюсь
      </p>
    </motion.div>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {specs.map((s, i) => (
        <motion.div
          key={s.title}
          {...fade(0.06 * i)}
          className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-4 hover:border-primary/30 transition-colors"
        >
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <s.icon className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-base font-bold">{s.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed flex-1">{s.desc}</p>
          <Button variant="outline" size="sm" className="w-fit gap-1.5" asChild>
            <a href="#booking">Записаться <ArrowRight className="w-3.5 h-3.5" /></a>
          </Button>
        </motion.div>
      ))}
    </div>
  </section>
);

export default Specializations;
