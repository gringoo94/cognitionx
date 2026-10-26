import { motion } from "framer-motion";
import { ArrowRight, AlertCircle, CloudRain, Flame, Heart, Shield, Sparkles, Wine, Brain, Layers, Globe, MapPin, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, delay },
});

const problems = [
  { title: "Тревожные расстройства", desc: "Постоянное беспокойство, панические атаки, ощущение, что вот-вот случится что-то плохое", icon: AlertCircle, slug: "anxiety" },
  { title: "Депрессия", desc: "Нет сил, ничего не радует, утром не хочется вставать — и это длится неделями", icon: CloudRain, slug: "depression" },
  { title: "Зависимости", desc: "Алкоголь, вещества, поведенческие зависимости — когда хочется остановиться, но не получается", icon: Wine, slug: "addiction" },
  { title: "ОКР", desc: "Навязчивые мысли и ритуалы, которые отнимают время и не дают покоя", icon: Brain, slug: "ocd" },
];

const otherTopics = [
  { title: "Панические атаки", slug: "panic-attacks", icon: Sparkles },
  { title: "Выгорание", slug: "burnout", icon: Flame },
  { title: "Отношения и созависимость", slug: "co-dependency", icon: Heart },
  { title: "Самооценка", slug: "self-esteem", icon: Shield },
  { title: "Стресс и адаптация", slug: "stress", icon: Sparkles },
];

const methods = [
  { title: "КПТ", desc: "Когнитивно-поведенческая терапия — золотой стандарт с доказательной базой для тревоги, депрессии и других расстройств", icon: Brain, slug: "cbt-therapy" },
  { title: "Схема-терапия", desc: "Глубинная работа с ранними дезадаптивными схемами — когда проблемы повторяются и КПТ недостаточно", icon: Layers, slug: "schema-therapy" },
  { title: "Онлайн-терапия", desc: "Полноценные сессии из любой точки мира — такая же эффективность, как и очный формат", icon: Globe, slug: "online-therapy" },
  { title: "Очная терапия", desc: "Индивидуальные консультации в кабинете в центре Кишинёва — живой контакт и безопасное пространство", icon: MapPin, slug: "in-person-therapy" },
];

const Card = ({ item }: { item: typeof problems[0] }) => (
  <motion.div {...fade(0)} className="h-full">
    <Link
      to={`/${item.slug}`}
      className="group h-full rounded-2xl border border-border bg-card p-5 flex flex-col gap-3 hover:border-primary/40 hover:shadow-md transition-all"
    >
      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
        <item.icon className="w-4 h-4 text-primary" />
      </div>
      <h3 className="text-base font-bold">{item.title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed flex-1">{item.desc}</p>
      <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
        Подробнее <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  </motion.div>
);

const Specializations = () => (
  <section id="specs" className="max-w-6xl mx-auto px-6 py-14 md:py-20">
    <motion.div {...fade()} className="text-center mb-8">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">С чем я работаю</h2>
      <p className="text-muted-foreground mt-3 text-sm md:text-base max-w-xl mx-auto">
        Выберите свою тему — я расскажу, как мы будем работать
      </p>
    </motion.div>

    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {problems.map((s) => (
        <Card key={s.slug} item={s} />
      ))}
    </div>

    <motion.div {...fade()} className="mt-5 flex flex-wrap items-center justify-center gap-2">
      <span className="text-sm text-muted-foreground mr-1">Также работаю с:</span>
      {otherTopics.map((t) => (
        <Link
          key={t.slug}
          to={`/${t.slug}`}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium hover:border-primary/40 hover:text-primary transition-colors"
        >
          <t.icon className="w-3.5 h-3.5 text-primary" />
          {t.title}
        </Link>
      ))}
    </motion.div>

    <motion.div {...fade(0)} className="mt-6 rounded-2xl bg-primary/5 border border-primary/30 p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
      <div className="flex-1">
        <h3 className="text-base md:text-lg font-bold">Не нашли свою тему?</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mt-1">
          На консультации разберём ваш запрос и решим, чем я могу помочь.
        </p>
      </div>
      <Button size="sm" className="gap-1.5 self-start sm:self-center" asChild>
        <Link to="/booking">
          Записаться <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </Button>
    </motion.div>

    <motion.div {...fade()} className="mt-10 flex flex-wrap items-center justify-center gap-2">
      <span className="text-sm text-muted-foreground mr-1">Методы:</span>
      {methods.map((m) => (
        <Link
          key={m.slug}
          to={`/${m.slug}`}
          title={m.desc}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium hover:border-primary/40 hover:text-primary transition-colors"
        >
          <m.icon className="w-3.5 h-3.5 text-primary" />
          {m.title}
        </Link>
      ))}
    </motion.div>
  </section>
);

export default Specializations;
