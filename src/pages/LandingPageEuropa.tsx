import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SEOHead from "@/components/SEOHead";
import { buildFaqSchema } from "@/lib/geoSchema";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingForm from "@/components/BookingForm";
import Testimonials, { testimonialsSchema } from "@/components/Testimonials";
import { Badge } from "@/components/ui/badge";
import Ethics from "@/components/Ethics";
import Projects from "@/components/Projects";
import SessionPrep from "@/components/SessionPrep";
import Blog from "@/components/Blog";
import Approach from "@/components/Approach";
import Specializations from "@/components/Specializations";
import Expectations from "@/components/Expectations";
import heroPhoto from "@/assets/hero-photo.webp";
import { trackContact } from "@/lib/metaPixel";
import {
  ArrowRight,
  Sparkles,
  Users,
  Globe,
  HeartCrack,
  Clock,
  ShieldCheck,
  Brain,
  GraduationCap,
  Award,
  BookOpen,
  Layers,
  Send,
  CheckCircle2,
  Star,
  MessageCircle,
} from "lucide-react";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, delay },
});

/* ─── Expat-specific data ─── */

const painPoints = [
  { icon: Users, title: "Одиночество в эмиграции", text: "Нет близких друзей, не с кем поговорить по-настоящему" },
  { icon: Globe, title: "Языковой барьер", text: "Не можете выразить тонкие чувства на чужом языке — терапия на неродном языке остаётся поверхностной" },
  { icon: HeartCrack, title: "Кризис идентичности", text: "«Ни свой, ни чужой» — потеря себя между культурами" },
  { icon: Clock, title: "Тревога за семью", text: "Чувство вины, что уехали от близких на родине" },
  { icon: ShieldCheck, title: "Давление адаптации", text: "Постоянный стресс от необходимости «соответствовать» и быть благодарным" },
  { icon: Brain, title: "Выгорание", text: "Эмоциональное истощение от жизни на двух языках и в двух культурах" },
];

const expatFaq = [
  {
    question: "В какой стране вы находитесь?",
    answer: "Я нахожусь в Кишинёве, Молдова (часовой пояс EET, UTC+2/+3). Работаю онлайн с клиентами из Германии, Франции, Нидерландов, Великобритании, Испании, Италии и других стран.",
  },
  {
    question: "Почему важно работать на родном языке?",
    answer: "Эмоции, детские воспоминания и глубинные убеждения «живут» на том языке, на котором вы выросли. Терапия на неродном языке часто остаётся поверхностной — как чинить часы в перчатках.",
  },
  {
    question: "Я давно живу в Европе, но до сих пор не адаптировался — это нормально?",
    answer: "Да. Адаптация — не линейный процесс. Многие проходят через циклы: энтузиазм → разочарование → кризис → принятие. Застревание на одном этапе — повод обратиться за помощью.",
  },
  {
    question: "Как проходит первая консультация?",
    answer: "Первый шаг — бесплатная 20-минутная встреча-знакомство. Это не терапия, а возможность обсудить ваш запрос, задать вопросы и понять, подходим ли мы друг другу. После этого, если решите продолжить, начнём полноценную диагностическую сессию (50 мин, 25 €).",
  },
  {
    question: "Онлайн-терапия действительно работает?",
    answer: "Да. Десятки мета-анализов подтверждают: онлайн-КПТ по эффективности сопоставима с очной терапией при депрессии, тревоге и панических атаках.",
  },
  {
    question: "Сколько сессий нужно для результата?",
    answer: "Зависит от проблемы. Обычно 8–20 сессий. Первые улучшения часто заметны через 4–6 сессий. Точнее скажу после первичной консультации.",
  },
  {
    question: "Вы работаете с парами экспатов?",
    answer: "Сейчас я работаю индивидуально. Но если проблемы в отношениях связаны с адаптацией — мы можем работать с вашей частью.",
  },
  {
    question: "Как оплатить из Европы?",
    answer: "Оплата в EUR банковским переводом или через удобный для вас способ. Детали обсуждаем на первой сессии.",
  },
];

const expatFaqSchema = buildFaqSchema(expatFaq);

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Дмитрий Яцко",
  jobTitle: "Психолог, КПТ и схема-терапевт",
  url: "https://cognitionx.cloud/psiholog-europa",
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Русскоязычный психолог для экспатов в Европе — Дмитрий Яцко",
  url: "https://cognitionx.cloud/psiholog-europa",
  description: "Русскоязычный психолог онлайн для экспатов в Европе. КПТ и схема-терапия на русском языке.",
  areaServed: { "@type": "Place", name: "Европа" },
  serviceType: "Психотерапия онлайн",
  availableLanguage: "Russian",
  provider: { "@type": "Person", name: "Дмитрий Яцко" },
};

const LandingPageEuropa = () => (
  <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
    <SEOHead
      title="Психолог на русском для Европы онлайн | КПТ — Дмитрий Яцко"
      description="Психолог онлайн на русском для экспатов в Европе. КПТ и схема-терапия. Адаптация, одиночество, тревога."
      path="/psiholog-europa"
      schema={[personSchema, serviceSchema, ...(expatFaqSchema ? [expatFaqSchema] : []), testimonialsSchema]}
      alternates={[
        { hreflang: "ru", href: "/psiholog-europa" },
        { hreflang: "ru-RU", href: "/psiholog-europa" },
        { hreflang: "ru-DE", href: "/psiholog-europa" },
        { hreflang: "ru-IT", href: "/psiholog-europa" },
        { hreflang: "x-default", href: "/psiholog-europa" },
      ]}
      breadcrumbs={[
        { name: "Главная", url: "https://cognitionx.cloud/" },
        { name: "Психолог для экспатов — Европа", url: "https://cognitionx.cloud/psiholog-europa" },
      ]}
    />
    <Navbar />
    {/* ── Sticky Telegram FAB ── */}
    <a
      href="https://t.me/gringoo94"
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        trackContact("telegram_fab_europa");
      }}
      aria-label="Написать в Telegram"
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-4 py-3 shadow-2xl shadow-primary/30 hover:scale-105 transition-transform"
    >
      <Send className="w-5 h-5" />
      <span className="hidden sm:inline text-sm font-semibold">Написать в Telegram</span>
    </a>

    <main>
      {/* ── Hero (adapted for expats) ── */}
      <section className="max-w-7xl mx-auto px-6 pt-10 md:pt-16 pb-16">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="text-center md:text-left order-2 md:order-1">
            <motion.div
              {...fade(0)}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-xs font-medium text-primary mb-5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Онлайн · Zoom · На русском языке
            </motion.div>

            <motion.h1
              {...fade(0.05)}
              className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08]"
            >
              Русскоязычный психолог
              <br />
              <span className="text-primary">в Европе</span>
            </motion.h1>

            <motion.p
              {...fade(0.1)}
              className="mt-5 text-base md:text-lg text-muted-foreground max-w-lg leading-relaxed"
            >
              КПТ и схема-терапия онлайн — из любой точки Европы. Первая встреча <strong className="text-foreground">бесплатно, 20 минут</strong> — знакомство без обязательств.
            </motion.p>

            {/* Offer chips — сразу видно цену/формат */}
            <motion.div
              {...fade(0.12)}
              className="mt-5 flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs"
            >
              {["Бесплатное знакомство · 20 мин", "Сессия 50 мин · 25 €", "Zoom · из любой страны"].map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-foreground/80 border border-border">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  {t}
                </span>
              ))}
            </motion.div>

            <motion.div
              {...fade(0.15)}
              className="mt-6 flex flex-col sm:flex-row items-center md:items-start gap-3"
            >
              <Button size="lg" className="gap-2 text-base px-8 hover:scale-[1.02] hover:shadow-lg transition-all w-full sm:w-auto" asChild>
                <a href="/start">
                  Понять, с чего начать <ArrowRight className="w-4 h-4" />
                </a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="gap-2 text-base px-6 hover:scale-[1.02] hover:shadow-md transition-all w-full sm:w-auto"
                asChild
              >
                <a
                  href="https://t.me/gringoo94"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    trackContact("telegram_hero_europa");
                  }}
                >
                  <Send className="w-4 h-4" /> Написать в Telegram
                </a>
              </Button>
            </motion.div>

            <motion.div
              {...fade(0.25)}
              className="mt-6 flex items-center justify-center md:justify-start gap-6 text-sm text-muted-foreground"
            >
              {[
                { value: "200+", label: "клиентов" },
                { value: "5 лет", label: "опыта" },
                { value: "Онлайн", label: "из любой точки" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <span className="block text-lg font-bold text-foreground">{s.value}</span>
                  <span className="text-xs">{s.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div {...fade(0.2)} className="flex justify-center order-1 md:order-2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl scale-110" />
              <div className="relative w-64 h-72 sm:w-72 sm:h-80 md:w-[20rem] md:h-[24rem] lg:w-[24rem] lg:h-[28rem] rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={heroPhoto}
                  alt="Психолог Дмитрий Яцко — русскоязычный КПТ-терапевт для экспатов в Европе"
                  className="w-full h-full object-cover object-top"
                  loading="eager"
                  {...({ fetchpriority: "high" } as any)}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Telegram CTA ── */}
      <section className="bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm font-medium"
          >
            Запишитесь на бесплатную 20-минутную встречу — напишите в Telegram
          </motion.p>
          <Button size="sm" variant="secondary" className="gap-2 rounded-full" asChild>
            <a href="https://t.me/gringoo94" target="_blank" rel="noopener noreferrer">
              <Send className="w-4 h-4" /> Написать в Telegram
            </a>
          </Button>
        </div>
      </section>

      {/* ── 3. Pain Points (expat-specific) — боль сразу ── */}
      <section className="bg-card border-y border-border">
        <div className="max-w-5xl mx-auto px-6 py-24 md:py-32">
          <motion.div {...fade()} className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Узнаёте себя?</h2>
            <p className="text-muted-foreground mt-3 text-sm md:text-base max-w-xl mx-auto">
              С чем сталкиваются русскоязычные экспаты в Европе
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {painPoints.map((p, i) => (
              <motion.div
                key={i}
                {...fade(i * 0.04)}
                whileHover={{ scale: 1.02, y: -4 }}
                transition={{ duration: 0.25 }}
                className="rounded-2xl border border-border bg-background p-6 flex gap-4 items-start hover:border-primary/40 hover:shadow-lg transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <p.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-bold">{p.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{p.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. About (expat focus) — кто поможет ── */}
      <section className="bg-foreground text-background">
        <div className="max-w-3xl mx-auto px-6 py-20 md:py-28 text-center">
          <motion.h2
            {...fade()}
            className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight"
          >
            Обо мне
          </motion.h2>
          <motion.blockquote
            {...fade(0.05)}
            className="mt-8 text-base sm:text-lg md:text-xl leading-relaxed opacity-80 max-w-2xl mx-auto italic"
          >
            "Эмоции формируются на родном языке — и работать с ними на чужом всё равно что чинить часы в перчатках."
          </motion.blockquote>
          <motion.p
            {...fade(0.1)}
            className="mt-5 text-xs sm:text-sm opacity-50"
          >
            Меня зовут Дмитрий. Я — психолог, практикующий КПТ и схема-терапию. Работаю онлайн с русскоязычными экспатами по всей Европе из Кишинёва (EET, UTC+2/+3).
          </motion.p>
          <motion.div {...fade(0.15)} className="mt-6">
            <Button variant="outline" size="sm" className="border-background/60 text-background bg-background/10 hover:bg-background/20" asChild>
              <a href="#about-detailed">Подробнее об образовании →</a>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ── 5. Free Meeting — низкий барьер входа ── */}
      <section className="bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto px-6 py-20 md:py-28 text-center">
          <motion.div {...fade()} className="inline-flex items-center gap-2 mb-6">
            <Star className="w-5 h-5" />
            <span className="text-sm font-semibold uppercase tracking-widest opacity-80">Рекомендую начать с этого</span>
          </motion.div>
          <motion.h2 {...fade(0.05)} className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
            Бесплатная 20-минутная встреча
          </motion.h2>
          <motion.p {...fade(0.1)} className="mt-5 text-sm md:text-base leading-relaxed opacity-85 max-w-xl mx-auto">
            Это знакомство, не терапия. Без обязательств — просто поговорим и поймём, подходим ли мы друг другу.
          </motion.p>
          <motion.div {...fade(0.15)} className="mt-8 grid sm:grid-cols-3 gap-4 max-w-lg mx-auto text-left">
            {[
              { icon: MessageCircle, text: "Обсудим ваш запрос" },
              { icon: CheckCircle2, text: "Отвечу на вопросы" },
              { icon: Users, text: "Решите, подходим ли мы друг другу" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <item.icon className="w-4 h-4 shrink-0 opacity-80" />
                <span>{item.text}</span>
              </div>
            ))}
          </motion.div>
          <motion.div {...fade(0.2)} className="mt-8">
            <Button size="lg" variant="secondary" className="gap-2 text-base px-8" asChild>
              <a href="#booking">Записаться на встречу <ArrowRight className="w-4 h-4" /></a>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ── 6. Specializations ── */}
      <Specializations />

      {/* ── 7. Approach ── */}
      <Approach />

      {/* ── 8. Evidence-based approach ── */}
      <section className="bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto px-6 py-20 md:py-28 text-center">
          <motion.h2
            {...fade()}
            className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight"
          >
            Доказательный подход
            <br className="hidden sm:block" /> к вашему благополучию
          </motion.h2>
          <motion.p
            {...fade(0.05)}
            className="mt-6 text-sm md:text-base leading-relaxed opacity-85 max-w-2xl mx-auto"
          >
            КПТ — один из самых исследованных методов психотерапии. Исследования подтверждают: 
            терапия на родном языке значительно эффективнее. Эмоции, детские воспоминания и 
            внутренний голос «говорят» по-русски — и работать с ними нужно на русском.
          </motion.p>
        </div>
      </section>

      {/* ── 9. Expectations ── */}
      <Expectations />

      {/* ── 10. Testimonials ── */}
      <Testimonials />

      {/* ── 11. Pricing ── */}
      <section id="pricing" className="bg-card border-y border-border">
        <div className="max-w-5xl mx-auto px-6 py-24 md:py-32">
          <motion.div {...fade()} className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Стоимость</h2>
            <p className="text-muted-foreground mt-3 text-sm md:text-base max-w-xl mx-auto">
              Прозрачные цены без скрытых платежей
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Знакомство",
                price: "0",
                duration: "20 мин",
                badge: "⭐ Бесплатно",
                accent: true,
                features: ["Обсудим ваш запрос", "Отвечу на вопросы", "Без обязательств"],
              },
              {
                title: "Первая сессия",
                price: "25",
                duration: "50 мин",
                features: ["Диагностика проблемы", "План работы", "Домашние задания"],
              },
              {
                title: "Сессия",
                price: "30",
                duration: "50 мин",
                featured: true,
                features: ["Работа в формате КПТ", "Домашние задания", "Поддержка между сессиями"],
              },
              {
                title: "Пакет × 4",
                price: "25",
                priceNote: "за сессию",
                totalPrice: "100 € за 4 сессии",
                duration: "4 × 50 мин",
                features: ["Экономия 20 €", "Регулярная работа", "Приоритетная запись"],
              },
            ].map((p, i) => (
              <motion.div
                key={p.title}
                {...fade(0.06 * i)}
                className={`rounded-2xl p-6 md:p-8 flex flex-col border transition-colors ${
                  p.featured
                    ? "border-primary bg-primary text-primary-foreground shadow-lg"
                    : (p as any).accent
                    ? "border-accent bg-accent/5 hover:border-accent/60 shadow-md"
                    : "border-border bg-background hover:border-primary/30"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className={`text-xs uppercase tracking-widest font-medium ${p.featured ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                      {p.title}
                    </p>
                    {(p as any).badge && (
                      <Badge variant="secondary" className="text-[10px] px-2 py-0">
                        {(p as any).badge}
                      </Badge>
                    )}
                  </div>
                  <p className={`text-sm ${p.featured ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {p.duration}
                  </p>
                </div>
                <div className="mt-6">
                  <span className="text-4xl font-bold tracking-tight">{p.price}</span>
                  <span className={`text-sm ml-1 ${p.featured ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    €{(p as any).priceNote ? ` ${(p as any).priceNote}` : ""}
                  </span>
                  {(p as any).totalPrice && (
                    <p className={`text-xs mt-1 ${p.featured ? "text-primary-foreground/60" : "text-muted-foreground/70"}`}>{(p as any).totalPrice}</p>
                  )}
                </div>
                <ul className="mt-6 space-y-3 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 text-accent`} />
                      <span className={p.featured ? "text-primary-foreground/90" : "text-muted-foreground"}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`mt-8 w-full ${
                    p.featured ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90" : ""
                  }`}
                  variant={p.featured ? "default" : "outline"}
                  asChild
                >
                  <a href="#booking">{(p as any).accent ? "Записаться бесплатно" : "Записаться"}</a>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 12. About Detailed (образование — для тех кто копает глубже) ── */}
      <section id="about-detailed" className="max-w-3xl mx-auto px-6 py-20 md:py-28 scroll-mt-20">
        <motion.div {...fade()} className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Образование и профессиональное развитие</h2>
          <p className="text-muted-foreground mt-3 text-sm md:text-base max-w-xl mx-auto">
            Прозрачность — часть моей профессиональной этики
          </p>
        </motion.div>
        <motion.div {...fade(0.05)}>
          <Accordion type="multiple" className="space-y-3">
            <AccordionItem value="education" className="border rounded-xl px-5">
              <AccordionTrigger className="hover:no-underline">
                <span className="flex items-center gap-3 text-sm font-semibold">
                  <GraduationCap className="w-5 h-5 text-primary" /> Образование
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed space-y-2">
                <p>• МолдГУ, психология (2016); магистратура — клиническая психология</p>
                <p>• Базовый курс КПТ + две ступени специализации по депрессии (CBTLAB, с 2023)</p>
                <p>• Клинические аспекты тревожных, депрессивных и зависимых расстройств (стандарты APA)</p>
                <p>• Курсы и конференции Минского центра КПТ</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="certs" className="border rounded-xl px-5">
              <AccordionTrigger className="hover:no-underline">
                <span className="flex items-center gap-3 text-sm font-semibold">
                  <Award className="w-5 h-5 text-primary" /> Сертификаты и верификация
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed space-y-2">
                <p>• Все дипломы и сертификаты верифицированы платформой <a href="https://www.b17.ru/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">B17.ru</a></p>
                <p>• Практика по международным стандартам <span className="font-medium">EABCT</span>, регулярные супервизии</p>
                <p>• Основатель <span className="font-medium">Rolelit</span> — тренажёр для психологов</p>
                <p>• Работа в MedHub и Initiativa Pozitiva - психотерапия зависимости, созависимости</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="methods" className="border rounded-xl px-5">
              <AccordionTrigger className="hover:no-underline">
                <span className="flex items-center gap-3 text-sm font-semibold">
                  <Brain className="w-5 h-5 text-primary" /> Методы и подходы
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed space-y-2">
                <p>• <span className="font-medium">КПТ</span> (когнитивно-поведенческая терапия) — основное направление</p>
                <p>• <span className="font-medium">Схема-терапия</span> — работа с глубинными схемами и паттернами</p>
                <p>• ACT (терапия принятия и ответственности)</p>
                <p>• Мотивационное интервьюирование (MI)</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="expat-context" className="border rounded-xl px-5">
              <AccordionTrigger className="hover:no-underline">
                <span className="flex items-center gap-3 text-sm font-semibold">
                  <Globe className="w-5 h-5 text-primary" /> Опыт работы с экспатами
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed space-y-2">
                <p>• Работаю с клиентами из Германии, Франции, Нидерландов, Великобритании, Испании и других стран</p>
                <p>• Понимаю специфику экспатского стресса: адаптация, одиночество, двойная идентичность</p>
                <p>• Гибкие часы: подстраиваюсь под CET, EET и GMT</p>
                <p>• Часовой пояс EET (Молдова) удобен для большинства европейских стран</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>
      </section>

      {/* ── 13. Ethics ── */}
      <Ethics />

      {/* ── 14. Session Prep ── */}
      <SessionPrep />

      {/* ── 15. FAQ (expat-specific) ── */}
      <section id="faq" className="max-w-3xl mx-auto px-6 py-20 md:py-28">
        <motion.h2
          {...fade()}
          className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-center"
        >
          Частые <span className="text-primary">вопросы</span>
        </motion.h2>
        <motion.p
          {...fade(0.05)}
          className="mt-3 text-sm text-muted-foreground text-center max-w-lg mx-auto"
        >
          Ответы на вопросы, которые чаще всего задают экспаты перед первой консультацией
        </motion.p>
        <motion.div {...fade(0.1)} className="mt-10">
          <Accordion type="single" collapsible className="space-y-3">
            {expatFaq.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border border-border rounded-xl px-5 data-[state=open]:border-primary/20 transition-colors"
              >
                <AccordionTrigger className="text-sm font-medium text-left py-4 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </section>

      {/* ── 16. Projects ── */}
      <Projects />

      {/* ── 17. Blog ── */}
      <Blog />

      {/* ── 18. Booking Form ── */}
      <BookingForm />
    </main>
    <Footer />
  </div>
);

export default LandingPageEuropa;
