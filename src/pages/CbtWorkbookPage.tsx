import ToolConsultCta from "@/components/ToolConsultCta";
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Sparkles, Brain, BookOpen, Target, Leaf, Zap,
  Shield, AlertTriangle, Lightbulb, Compass, Heart, Check, X, ChevronDown,
  TrendingUp, Activity,
} from "lucide-react";
import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogSubscribeForm from "@/components/BlogSubscribeForm";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, delay },
});

const problems = [
  { icon: Leaf, title: "Депрессия и апатия", symptoms: "Нет сил, ничего не радует, трудно встать с кровати, мысли «я неудачник».", help: "Поведенческая активация: маленькими шагами возвращаете дела, которые дают энергию." },
  { icon: AlertTriangle, title: "Тревога и стресс", symptoms: "Мысли по кругу, «а вдруг случится худшее», напряжение в теле, плохой сон.", help: "Проверка мыслей и решение проблем: отделяете реальные риски от катастрофических сценариев." },
  { icon: Zap, title: "Панические атаки", symptoms: "Сердце колотится, не хватает воздуха, страх потерять контроль, избегание мест.", help: "Работа со страхами: шаг за шагом перестаёте избегать — и паника теряет силу." },
];

const modules = [
  { icon: Brain, title: "Как устроен ваш замкнутый круг", desc: "Разбираете, как мысли, эмоции, тело и поведение подпитывают друг друга." },
  { icon: Target, title: "Цели", desc: "Формулируете, что конкретно хотите изменить — и как поймёте, что получилось." },
  { icon: Zap, title: "Возвращение активности", desc: "План небольших дел, которые поднимают настроение при депрессии." },
  { icon: Shield, title: "Встреча со страхами", desc: "Лестница страхов: от лёгкого к сложному — при тревоге и панике." },
  { icon: Compass, title: "Проверка мыслей", desc: "Ловите автоматические мысли и находите более реалистичный взгляд." },
  { icon: Lightbulb, title: "Решение проблем", desc: "Пошаговый способ разобраться с реальной трудностью вместо бесконечного беспокойства." },
  { icon: BookOpen, title: "Здоровый сон", desc: "Простые правила, которые помогают засыпать и высыпаться." },
  { icon: Heart, title: "Личный план устойчивости", desc: "Что помогает именно вам и что делать, если станет хуже." },
];

const faqs = [
  {
    q: "Поможет ли тетрадь при депрессии, тревоге и панических атаках?",
    a: "Да, упражнения подобраны именно для этих состояний. КПТ — метод первой линии при депрессии, тревожных расстройствах и панике по рекомендациям NICE и ВОЗ. При тяжёлом состоянии тетрадь лучше использовать вместе с терапией.",
  },
  {
    q: "На чём основана тетрадь?",
    a: "На рабочей тетради навыков КПТ британской государственной службы здравоохранения NHS (программа IAPT), адаптированной на русский язык и в интерактивный формат.",
  },
  {
    q: "Это бесплатно?",
    a: "Да, тетрадь бесплатная и без рекламы.",
  },
  {
    q: "Можно заниматься без психолога?",
    a: "Да, тетрадь создана для самостоятельной работы. Но если есть мысли о смерти или самоповреждении, или за 2–3 недели стало хуже — обратитесь к специалисту.",
  },
  {
    q: "Это заменяет врача или психолога?",
    a: "Нет. Тетрадь не ставит диагнозы и не заменяет лечение — это инструмент для отработки навыков.",
  },
  {
    q: "Когда будет доступ?",
    a: "Сейчас идёт закрытая бета. Оставьте email — пришлю приглашение, когда откроем регистрацию. Без спама.",
  },
];

const stats = [
  { value: "8", label: "практических модулей" },
  { value: "NHS", label: "британский протокол КПТ" },
  { value: "0 €", label: "бесплатно, без рекламы" },
  { value: "24/7", label: "в любом браузере" },
];

function MoodDemo() {
  const days = [3, 5, 4, 6, 7, 6, 8];
  const labels = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <div className="flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-primary" />
        <span className="text-xs font-semibold text-foreground">Настроение за неделю</span>
      </div>
      <div className="flex items-end gap-1.5 h-20">
        {days.map((v, i) => (
          <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1 h-full">
            <motion.div
              className="w-full rounded-t-md bg-primary"
              style={{ opacity: 0.3 + (v / 10) * 0.7 }}
              initial={{ height: 0 }}
              whileInView={{ height: `${v * 8}px` }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: "easeOut" }}
            />
            <span className="text-[10px] text-muted-foreground">{labels[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProgressDemo() {
  const items = [
    { icon: Compass, name: "Проверка мыслей", progress: 85 },
    { icon: Zap, name: "Возвращение активности", progress: 60 },
    { icon: Shield, name: "Встреча со страхами", progress: 45 },
  ];
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Activity className="w-4 h-4 text-primary" />
        <span className="text-xs font-semibold text-foreground">Прогресс упражнений</span>
      </div>
      {items.map((t, i) => (
        <div key={t.name} className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-foreground flex items-center gap-1.5">
              <t.icon className="w-3 h-3 text-primary" /> {t.name}
            </span>
            <span className="text-[10px] font-mono text-primary">{t.progress}%</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              whileInView={{ width: `${t.progress}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: "easeOut" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left"
      >
        <span className="text-sm md:text-base font-medium text-foreground pr-4">{q}</span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        className="overflow-hidden"
      >
        <p className="text-sm text-muted-foreground pb-5 leading-relaxed">{a}</p>
      </motion.div>
    </div>
  );
}

const CbtWorkbookPage = () => {
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "CBT Workbook",
    description:
      "Бесплатная рабочая тетрадь КПТ онлайн при депрессии, тревоге и панических атаках. Основана на рабочей тетради навыков КПТ NHS (IAPT).",
    applicationCategory: "HealthApplication",
    operatingSystem: "Web",
    inLanguage: "ru",
    url: "https://cognitionx.cloud/cbtworkbook",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
    author: {
      "@type": "Person",
      name: "Дмитрий Яцко",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="Тетрадь КПТ онлайн при депрессии, тревоге и панических атаках"
        description="Бесплатная рабочая тетрадь КПТ на русском по протоколу NHS: упражнения при депрессии, тревоге и панических атаках. Пошагово, в браузере, без рекламы."
        path="/cbtworkbook"
        schema={[softwareSchema, faqSchema]}
        breadcrumbs={[
          { name: "Главная", url: "https://cognitionx.cloud/" },
          { name: "Инструменты", url: "https://cognitionx.cloud/tools" },
          { name: "CBT Workbook", url: "https://cognitionx.cloud/cbtworkbook" },
        ]}
      />
      <Navbar />

      <main>
        {/* HERO */}
        <section className="max-w-4xl mx-auto px-6 pt-12 md:pt-20 pb-16 md:pb-24 text-center">
          <Link to="/tools" className="inline-block mb-6">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> Все инструменты
            </Button>
          </Link>

          <motion.div
            {...fade(0)}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-xs font-medium text-primary mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Рабочая тетрадь КПТ — бета
          </motion.div>

          <motion.h1
            {...fade(0.05)}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.08]"
          >
            CBT Workbook —<br />
            <span className="text-primary">тетрадь по КПТ онлайн</span>
          </motion.h1>

          <motion.p
            {...fade(0.1)}
            className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Простые упражнения, которые помогают справиться с депрессией, тревогой и
            паническими атаками. Основано на рабочей тетради КПТ британской службы здравоохранения NHS.
          </motion.p>

          <motion.div
            {...fade(0.15)}
            className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Button size="lg" className="gap-2 text-base px-8 hover:scale-[1.02] transition-all" asChild>
              <a href="#waitlist">
                Получить ранний доступ <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
            <Button variant="outline" size="lg" className="text-base px-8" asChild>
              <Link to="/booking">Записаться на консультацию</Link>
            </Button>
          </motion.div>

          <motion.p {...fade(0.2)} className="mt-4 text-xs text-muted-foreground">
            Закрытая бета · Бесплатно · Без рекламы
          </motion.p>

          <motion.div
            {...fade(0.25)}
            className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto text-left"
          >
            <MoodDemo />
            <ProgressDemo />
          </motion.div>
        </section>

        {/* STATS */}
        <section className="border-y border-border bg-card/50">
          <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <motion.div key={s.label} {...fade(i * 0.05)} className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-primary font-mono">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* PROBLEMS */}
        <section className="max-w-5xl mx-auto px-6 py-16 md:py-24">
          <motion.div {...fade()} className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold">С чем помогает</h2>
            <p className="text-muted-foreground mt-3 text-sm md:text-base">Узнаёте себя? Для каждого состояния — свои упражнения.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {problems.map((p, i) => (
              <motion.div key={p.title} {...fade(0.05 * i)} className="rounded-2xl border border-border bg-card p-6">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <p.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">{p.symptoms}</p>
                <p className="text-sm text-foreground leading-relaxed"><span className="text-primary font-medium">Что поможет: </span>{p.help}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 3 STEPS */}
        <section className="bg-card/40 border-y border-border">
          <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
            <motion.div {...fade()} className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold">Как это работает</h2>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: TrendingUp, n: "01", title: "Отмечайте настроение", desc: "Минута в день. Через пару недель видно, что тянет вниз, а что помогает." },
                { icon: Activity, n: "02", title: "Делайте упражнения", desc: "Короткие практики: заполнили, подумали, попробовали. Прогресс сохраняется." },
                { icon: Heart, n: "03", title: "Замечайте изменения", desc: "Навыки закрепляются, и с трудными состояниями становится легче справляться." },
              ].map((s, i) => (
                <motion.div key={s.n} {...fade(0.05 * i)} className="rounded-2xl border border-border bg-background p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <s.icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-3xl font-bold text-primary/15 font-mono">{s.n}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* MODULES */}
        <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
          <motion.div {...fade()} className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold">Что внутри</h2>
            <p className="text-muted-foreground mt-3 text-sm md:text-base">Проходите по порядку или берите то, что нужно сейчас.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {modules.map((m, i) => (
              <motion.div key={m.title} {...fade(0.04 * i)} className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <m.icon className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1.5">{m.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{m.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* EVIDENCE */}
        <section className="bg-card/40 border-y border-border">
          <div className="max-w-3xl mx-auto px-6 py-16 md:py-20 text-center">
            <motion.h2 {...fade()} className="text-2xl md:text-3xl font-bold mb-5">Почему этому можно доверять</motion.h2>
            <motion.p {...fade(0.05)} className="text-muted-foreground leading-relaxed">
              Тетрадь основана на рабочей тетради навыков КПТ британской государственной службы
              здравоохранения NHS (программа IAPT). КПТ — метод первой линии при депрессии и тревожных
              расстройствах по рекомендациям{" "}
              <a href="https://www.nice.org.uk/guidance" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">NICE</a>
              {" "}и ВОЗ. Адаптация на русский — психолог Дмитрий Яцко.
            </motion.p>
          </div>
        </section>

        {/* FOR WHOM */}
        <section className="max-w-4xl mx-auto px-6 py-16 md:py-24">
          <motion.div {...fade()} className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold">Кому подходит</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-5">
            <motion.div {...fade(0.05)} className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Check className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Подойдёт</h3>
              </div>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li>— Лёгкая или умеренная депрессия, тревога, панические атаки</li>
                <li>— Хотите понять, что с вами происходит, и действовать</li>
                <li>— Вы в терапии и хотите заниматься между сессиями</li>
                <li>— Закончили терапию и хотите сохранить результат</li>
              </ul>
            </motion.div>

            <motion.div {...fade(0.1)} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <X className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-semibold">Лучше к специалисту</h3>
              </div>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li>— Мысли о смерти или самоповреждении</li>
                <li>— Зависимость, расстройство пищевого поведения</li>
                <li>— ПТСР, психотические симптомы</li>
                <li>— За 2–3 недели стало хуже — это сигнал, что нужна поддержка специалиста</li>
              </ul>
            </motion.div>
          </div>
        </section>

        {/* RELATION TO THERAPY */}
        <section className="bg-foreground text-background">
          <div className="max-w-3xl mx-auto px-6 py-16 md:py-24 text-center">
            <motion.h2 {...fade()} className="text-2xl md:text-3xl font-bold leading-tight">
              Тетрадь — не замена терапии
            </motion.h2>
            <motion.p {...fade(0.05)} className="mt-6 text-base md:text-lg leading-relaxed opacity-80 max-w-2xl mx-auto">
              Тетрадь помогает отработать навыки. Терапия помогает увидеть то, что сложно заметить самому.
              Если хотите разобраться вместе — первая консультация 50 минут, 45 €.
            </motion.p>
            <motion.div {...fade(0.1)} className="mt-8">
              <Button size="lg" variant="outline" asChild className="bg-transparent border-background/30 text-background hover:bg-background hover:text-foreground">
                <Link to="/booking" className="gap-2">
                  Записаться на консультацию <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* WAITLIST */}
        <section id="waitlist" className="max-w-2xl mx-auto px-6 py-16 md:py-24 scroll-mt-20">
          <motion.div {...fade()} className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Получить доступ к бета-версии</h2>
            <p className="text-muted-foreground mt-3 text-sm md:text-base">
              Оставьте email — пришлю приглашение, когда откроем регистрацию. Без спама.
            </p>
          </motion.div>
          <motion.div {...fade(0.05)}>
            <BlogSubscribeForm
              source="cbtworkbook"
              title="Ранний доступ к CBT Workbook"
              description="Получите приглашение первым."
            />
          </motion.div>
        </section>

        {/* FAQ */}
        <section className="bg-card/40 border-y border-border">
          <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
            <motion.div {...fade()} className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold">Частые вопросы</h2>
            </motion.div>
            <motion.div {...fade(0.05)} className="rounded-2xl border border-border bg-background px-6">
              {faqs.map((f) => (
                <FAQItem key={f.q} q={f.q} a={f.a} />
              ))}
            </motion.div>
          </div>
        </section>

        {/* RELATED */}
        <section className="max-w-3xl mx-auto px-6 py-16 md:py-20">
          <motion.div {...fade()}>
            <h2 className="text-xl md:text-2xl font-semibold mb-5">Связанные материалы</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>→ <Link to="/tools/abc-analysis" className="text-primary hover:underline">ABC-анализ — интерактивный инструмент</Link></li>
              <li>→ <Link to="/tools/behavioral-activation" className="text-primary hover:underline">Дневник поведенческой активации</Link></li>
              <li>→ <Link to="/tools/emotion-wheel" className="text-primary hover:underline">Колесо эмоций</Link></li>
              <li>→ <Link to="/cbt-therapy" className="text-primary hover:underline">Что такое КПТ — подробная статья</Link></li>
              <li>→ <Link to="/depression" className="text-primary hover:underline">Терапия при депрессии</Link></li>
              <li>→ <Link to="/anxiety" className="text-primary hover:underline">Терапия при тревоге</Link></li>
              <li>→ <Link to="/blog" className="text-primary hover:underline">Блог о КПТ и схема-терапии</Link></li>
            </ul>
          </motion.div>
        </section>

        {/* FINAL CTA */}
        <section className="border-t border-border bg-primary/5">
          <div className="max-w-3xl mx-auto px-6 py-16 md:py-20 text-center">
            <motion.h2 {...fade()} className="text-2xl md:text-3xl font-bold">
              Начните с первого шага
            </motion.h2>
            <motion.p {...fade(0.05)} className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Получите бесплатный доступ к тетради или запишитесь на консультацию (45 €, 50 минут).
            </motion.p>
            <motion.div {...fade(0.1)} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button size="lg" className="gap-2 px-8" asChild>
                <a href="#waitlist">Получить ранний доступ <ArrowRight className="w-4 h-4" /></a>
              </Button>
              <Button size="lg" variant="outline" className="px-8" asChild>
                <Link to="/booking">Записаться на консультацию</Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      <ToolConsultCta tool="cbt_workbook" />
      <Footer />
    </div>
  );
};

export default CbtWorkbookPage;
