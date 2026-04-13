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
  { title: "Тревога и панические атаки", desc: "Постоянное беспокойство, навязчивые мысли, ощущение что вот-вот случится что-то плохое", icon: AlertCircle, slug: "anxiety" },
  { title: "Депрессия", desc: "Нет сил, ничего не радует, утром не хочется вставать — и это длится неделями", icon: CloudRain, slug: "depression" },
  { title: "Выгорание", desc: "Работа высасывает все силы, а на жизнь их уже не остаётся", icon: Flame, slug: "burnout" },
  { title: "Отношения", desc: "Конфликты, обиды, ощущение что вас не слышат — или невозможность уйти", icon: Heart, slug: "co-dependency" },
  { title: "Самооценка", desc: "Постоянная самокритика, ощущение что вы хуже других, синдром самозванца", icon: Shield, slug: "self-esteem" },
  { title: "Стресс и адаптация", desc: "Переезд, увольнение, развод — когда всё навалилось и непонятно как справляться", icon: Sparkles, slug: "stress" },
  { title: "Зависимости", desc: "Алкоголь, вещества, поведенческие зависимости — когда хочется остановиться, но не получается", icon: Wine, slug: "addiction" },
];

const methods = [
  { title: "КПТ-терапия", desc: "Когнитивно-поведенческая терапия — золотой стандарт с доказательной базой для тревоги, депрессии и других расстройств", icon: Brain, slug: "cbt-therapy" },
  { title: "Схема-терапия", desc: "Глубинная работа с ранними дезадаптивными схемами — когда проблемы повторяются и КПТ недостаточно", icon: Layers, slug: "schema-therapy" },
  { title: "Онлайн-терапия", desc: "Полноценные сессии из любой точки мира — такая же эффективность, как и очный формат", icon: Globe, slug: "online-therapy" },
  { title: "Очная терапия", desc: "Индивидуальные консультации в кабинете в центре Кишинёва — живой контакт и безопасное пространство", icon: MapPin, slug: "in-person-therapy" },
];

const Card = ({ item, accentLeft }: { item: typeof problems[0]; accentLeft?: boolean }) => (
  <motion.div
    {...fade(0)}
    whileHover={{ scale: 1.02, y: -4 }}
    transition={{ duration: 0.25 }}
    className={`rounded-2xl border border-border bg-card p-6 flex flex-col gap-4 hover:border-primary/40 hover:shadow-lg transition-all cursor-pointer ${accentLeft ? "border-l-2 border-l-primary" : ""}`}
  >
    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
      <item.icon className="w-5 h-5 text-primary" />
    </div>
    <h3 className="text-base font-bold">{item.title}</h3>
    <p className="text-sm text-muted-foreground leading-relaxed flex-1">{item.desc}</p>
    <div className="flex gap-2 flex-wrap">
      <Button variant="outline" size="sm" className="gap-1.5" asChild>
        <Link to={`/${item.slug}`}>
          <BookOpen className="w-3.5 h-3.5" /> Подробнее
        </Link>
      </Button>
      <Button variant="outline" size="sm" className="gap-1.5" asChild>
        <a href="#booking">
          Записаться <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </Button>
    </div>
  </motion.div>
);

const Specializations = () => (
  <section id="specs" className="max-w-5xl mx-auto px-6 py-24 md:py-32">
    {/* Problems */}
    <motion.div {...fade()} className="text-center mb-14">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">На чём специализируюсь</h2>
      <p className="text-muted-foreground mt-3 text-sm md:text-base max-w-xl mx-auto">
        Выберите свою тему — я расскажу, как мы будем работать
      </p>
    </motion.div>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {problems.map((s) => (
        <Card key={s.slug} item={s} />
      ))}
    </div>

    {/* Methods */}
    <motion.div {...fade()} className="text-center mt-20 mb-14">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Методы терапии</h2>
      <p className="text-muted-foreground mt-3 text-sm md:text-base max-w-xl mx-auto">
        Как мы будем работать — подходы с доказанной эффективностью
      </p>
    </motion.div>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {methods.map((m) => (
        <Card key={m.slug} item={m} accentLeft />
      ))}
    </div>
  </section>
);

export default Specializations;
