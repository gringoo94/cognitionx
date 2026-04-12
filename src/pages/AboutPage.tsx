import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.45, delay },
});

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Дмитрий Яцко",
  jobTitle: "Психолог, КПТ и схема-терапевт",
  url: "https://cognitionx.cloud",
  description: "Психолог, практикующий КПТ и схема-терапию. Работаю с депрессией, тревогой, паническими атаками, выгоранием.",
  knowsAbout: [
    "Когнитивно-поведенческая терапия",
    "Схема-терапия",
    "Депрессия",
    "Тревожные расстройства",
    "Панические атаки",
    "Выгорание",
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Главная", item: "https://cognitionx.cloud/" },
    { "@type": "ListItem", position: 2, name: "Обо мне", item: "https://cognitionx.cloud/about" },
  ],
};

const qualifications = [
  "Высшее психологическое образование",
  "Специализация в КПТ и схема-терапии",
  "Регулярная супервизия и повышение квалификации",
  "Опыт работы с депрессией, тревогой, паническими атаками, выгоранием",
  "Онлайн и очный формат консультаций",
];

const principles = [
  {
    title: "Доказательный подход",
    text: "КПТ — один из самых исследованных методов психотерапии. Я использую техники с подтверждённой эффективностью.",
  },
  {
    title: "Структура и прозрачность",
    text: "Каждая сессия имеет план. Вы понимаете, что происходит, зачем и к чему это ведёт.",
  },
  {
    title: "Практика между сессиями",
    text: "Большая часть изменений происходит между встречами. Домашние задания — ключевой элемент КПТ.",
  },
  {
    title: "Уважение к вашему темпу",
    text: "Нет давления. Работаем в комфортном ритме, но с чёткими целями.",
  },
];

const AboutPage = () => (
  <div className="min-h-screen bg-background text-foreground">
    <SEOHead
      title="Обо мне — Психолог Дмитрий Яцко | КПТ и схема-терапия"
      description="Психолог Дмитрий Яцко — КПТ и схема-терапия. Образование, подход, принципы работы. Помощь при депрессии, тревоге, панических атаках."
      path="/about"
      schema={[personSchema, breadcrumbSchema]}
    />
    <Navbar />

    <main className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <motion.nav {...fade()} className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8">
        <Link to="/" className="hover:text-primary transition-colors">Главная</Link>
        <span>/</span>
        <span className="text-foreground">Обо мне</span>
      </motion.nav>

      <motion.h1 {...fade(0.05)} className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
        Обо мне
      </motion.h1>

      <motion.p {...fade(0.1)} className="mt-6 text-lg text-muted-foreground leading-relaxed">
        Меня зовут Дмитрий. Я — психолог, практикующий КПТ и схема-терапию.
        Помогаю людям справиться с депрессией, тревогой, паническими атаками и выгоранием.
      </motion.p>

      <motion.blockquote {...fade(0.15)} className="mt-8 border-l-4 border-primary pl-5 py-2 text-muted-foreground italic text-lg">
        "Каждый человек способен измениться — ему нужно лишь безопасное пространство и правильные инструменты."
      </motion.blockquote>

      {/* Qualifications */}
      <motion.section {...fade(0.1)} className="mt-12">
        <h2 className="text-xl font-bold mb-4">Квалификация</h2>
        <ul className="space-y-3">
          {qualifications.map((q, i) => (
            <li key={i} className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <span className="text-sm text-foreground/90">{q}</span>
            </li>
          ))}
        </ul>
      </motion.section>

      {/* Principles */}
      <motion.section {...fade(0.1)} className="mt-12">
        <h2 className="text-xl font-bold mb-6">Принципы работы</h2>
        <div className="grid gap-4">
          {principles.map((p, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-semibold text-sm">{p.title}</h3>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{p.text}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Specializations */}
      <motion.section {...fade(0.1)} className="mt-12">
        <h2 className="text-xl font-bold mb-4">С чем я работаю</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { label: "Депрессия", to: "/depression" },
            { label: "Тревога", to: "/anxiety" },
            { label: "Панические атаки", to: "/panic-attacks" },
            { label: "Выгорание", to: "/burnout" },
            { label: "Созависимость", to: "/co-dependency" },
            { label: "КПТ-терапия", to: "/cbt-therapy" },
          ].map((s) => (
            <Link
              key={s.to}
              to={s.to}
              className="rounded-xl border border-border bg-card p-4 hover:border-primary/30 transition-colors group"
            >
              <span className="text-sm font-medium group-hover:text-primary transition-colors">{s.label}</span>
            </Link>
          ))}
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section {...fade(0.1)} className="mt-14 text-center">
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8">
          <h2 className="text-xl font-bold mb-2">Готовы начать?</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Первая сессия — знакомство и диагностика.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <Link to="/contact">Записаться</Link>
            </Button>
            <Button variant="outline" asChild>
              <a href="https://t.me/gringoo94">Telegram</a>
            </Button>
          </div>
        </div>
      </motion.section>

      <motion.div {...fade(0.1)} className="mt-8">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> На главную
          </Link>
        </Button>
      </motion.div>
    </main>

    <Footer />
  </div>
);

export default AboutPage;
