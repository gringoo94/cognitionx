import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TelegramCTA from "@/components/TelegramCTA";
import {
  Users,
  Globe,
  HeartCrack,
  Clock,
  ShieldCheck,
  Brain,
  MessageCircle,
  CalendarCheck,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Star,
} from "lucide-react";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, delay },
});

const painPoints = [
  { icon: Users, title: "Одиночество", text: "Нет близких друзей, не с кем поговорить по-настоящему" },
  { icon: Globe, title: "Языковой барьер", text: "Не можете выразить тонкие чувства на чужом языке" },
  { icon: HeartCrack, title: "Кризис идентичности", text: "«Ни свой, ни чужой» — потеря себя между культурами" },
  { icon: Clock, title: "Тревога за близких", text: "Чувство вины, что уехали от семьи на родине" },
  { icon: ShieldCheck, title: "Давление адаптации", text: "Постоянный стресс от необходимости «соответствовать»" },
  { icon: Brain, title: "Выгорание", text: "Эмоциональное истощение от жизни на двух языках" },
];

const steps = [
  { num: "01", title: "Знакомство", text: "Бесплатная 15-минутная встреча — обсуждаем ваш запрос" },
  { num: "02", title: "Первая сессия", text: "Глубокая диагностика: что происходит и почему" },
  { num: "03", title: "План работы", text: "Индивидуальный план с конкретными целями и сроками" },
  { num: "04", title: "Терапия", text: "Еженедельные сессии с домашними заданиями и отслеживанием прогресса" },
];

const testimonials = [
  {
    text: "После нескольких месяцев работы с Дмитрием я научилась распознавать тревожные мысли и не поддаваться им. Качество жизни изменилось кардинально.",
    initials: "А. К.",
    topic: "Тревога",
  },
  {
    text: "Я пришёл с выгоранием — не мог заставить себя работать. КПТ-подход помог разобраться в причинах и выстроить здоровый ритм.",
    initials: "М. С.",
    topic: "Выгорание",
  },
  {
    text: "Дмитрий помог мне выйти из созависимых отношений и научиться ставить границы. Очень благодарна за структурный подход.",
    initials: "О. В.",
    topic: "Созависимость",
  },
];

const faq = [
  {
    q: "В какой стране вы находитесь?",
    a: "Я нахожусь в Кишинёве, Молдова (часовой пояс EET, UTC+2/+3). Работаю онлайн с клиентами из Германии, Франции, Нидерландов, Великобритании, Испании, Италии и других стран.",
  },
  {
    q: "Почему важно работать на родном языке?",
    a: "Эмоции, детские воспоминания и глубинные убеждения «живут» на том языке, на котором вы выросли. Терапия на неродном языке часто остаётся поверхностной.",
  },
  {
    q: "Я давно живу в Европе, но до сих пор не адаптировался — это нормально?",
    a: "Да. Адаптация — не линейный процесс. Многие проходят через циклы: энтузиазм → разочарование → кризис → принятие. Застревание на одном этапе — повод обратиться за помощью.",
  },
  {
    q: "Вы работаете с парами экспатов?",
    a: "Сейчас я работаю индивидуально. Но если проблемы в отношениях связаны с адаптацией — мы можем работать с вашей частью.",
  },
  {
    q: "Как оплатить из Европы?",
    a: "Оплата в EUR банковским переводом или через удобный для вас способ. Детали обсуждаем на первой сессии.",
  },
];

const schema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Психолог Дмитрий Яцко — Европа",
  description: "Русскоязычный психолог онлайн для экспатов в Европе. КПТ и схема-терапия.",
  url: "https://cognitionx.cloud/psiholog-europa",
  provider: {
    "@type": "Person",
    name: "Дмитрий Яцко",
    jobTitle: "Психолог, КПТ-терапевт",
  },
  areaServed: { "@type": "Place", name: "Европа" },
  serviceType: "Психотерапия онлайн",
  availableLanguage: "Russian",
};

const LandingPageEuropa = () => {
  const scrollToBooking = () => {
    document.getElementById("booking-europa")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <SEOHead
        title="Русскоязычный психолог в Европе онлайн | КПТ — Дмитрий Яцко"
        description="Русскоязычный психолог онлайн для экспатов в Европе. КПТ и схема-терапия на русском языке. Адаптация, одиночество, тревога. Запишитесь."
        path="/psiholog-europa"
        schema={schema}
        breadcrumbs={[
          { name: "Главная", url: "https://cognitionx.cloud/" },
          { name: "Психолог для экспатов — Европа", url: "https://cognitionx.cloud/psiholog-europa" },
        ]}
      />
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-5xl mx-auto px-6 pt-28 pb-20 md:pt-36 md:pb-28 flex flex-col md:flex-row items-center gap-10">
          <motion.div {...fade()} className="flex-1 text-center md:text-left">
            <span className="inline-block text-xs font-semibold tracking-wide uppercase text-primary mb-4 bg-primary/10 px-3 py-1 rounded-full">
              Онлайн · Zoom · На русском
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Русскоязычный психолог
              <br />
              <span className="text-primary">для экспатов в Европе</span>
            </h1>
            <p className="mt-5 text-muted-foreground text-lg max-w-lg">
              Сложные вещи хочется обсуждать на родном языке. КПТ и схема-терапия онлайн — из любой точки Европы.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Button size="lg" onClick={scrollToBooking} className="gap-2 rounded-xl shadow-lg shadow-primary/20 text-base px-8">
                Записаться — первая сессия 25 € <ArrowRight className="w-4 h-4" />
              </Button>
              <TelegramCTA variant="outline" size="lg" className="rounded-xl text-base" />
            </div>
            <div className="mt-8 flex gap-8 justify-center md:justify-start text-sm text-muted-foreground">
              <div><span className="block text-2xl font-bold text-foreground">200+</span>клиентов</div>
              <div><span className="block text-2xl font-bold text-foreground">5 лет</span>опыта</div>
              <div><span className="block text-2xl font-bold text-foreground">КПТ</span>и схема-терапия</div>
            </div>
          </motion.div>

          <motion.div {...fade(0.15)} className="flex-shrink-0">
            <img
              src="/hero-photo.webp"
              alt="Психолог Дмитрий Яцко"
              width={340}
              height={420}
              className="rounded-2xl shadow-2xl shadow-primary/10 object-cover w-[260px] sm:w-[300px] md:w-[340px]"
              loading="eager"
            />
          </motion.div>
        </div>
      </section>

      {/* ── Pain Points ── */}
      <section className="bg-muted/40">
        <div className="max-w-5xl mx-auto px-6 py-20 md:py-28">
          <motion.div {...fade()} className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold">Знакомо?</h2>
            <p className="mt-2 text-muted-foreground">С чем сталкиваются экспаты каждый день</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {painPoints.map((p, i) => (
              <motion.div
                key={i}
                {...fade(i * 0.04)}
                className="rounded-xl border border-border bg-card p-6 flex gap-4 items-start hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <p.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{p.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{p.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Social Proof ── */}
      <section className="max-w-5xl mx-auto px-6 py-20 md:py-28">
        <motion.div {...fade()} className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold">Что говорят клиенты</h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              {...fade(i * 0.05)}
              className="rounded-xl border border-border bg-card p-6 flex flex-col gap-3"
            >
              <div className="flex gap-1">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground flex-1 leading-relaxed">{t.text}</p>
              <div className="flex items-center gap-3 pt-3 border-t border-border">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                  {t.initials}
                </div>
                <span className="text-xs text-muted-foreground">{t.topic}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── How I Work ── */}
      <section className="bg-muted/40">
        <div className="max-w-5xl mx-auto px-6 py-20 md:py-28">
          <motion.div {...fade()} className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold">Как проходит работа</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <motion.div key={i} {...fade(i * 0.06)} className="text-center">
                <div className="text-4xl font-bold text-primary/20 mb-2">{s.num}</div>
                <h3 className="font-semibold mb-1">{s.title}</h3>
                <p className="text-xs text-muted-foreground">{s.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="max-w-5xl mx-auto px-6 py-20 md:py-28">
        <motion.div {...fade()} className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold">Стоимость</h2>
          <p className="mt-2 text-muted-foreground">Прозрачные цены, без скрытых платежей</p>
        </motion.div>
        <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {[
            { label: "Первая встреча", price: "25 €", note: "50 мин · знакомство", highlight: true },
            { label: "Сессия", price: "30 €", note: "50 мин · КПТ / схема-терапия", highlight: false },
            { label: "Пакет 4 сессии", price: "100 €", note: "25 € за сессию · экономия 20 €", highlight: false },
          ].map((p, i) => (
            <motion.div
              key={i}
              {...fade(i * 0.06)}
              className={`rounded-xl border p-6 text-center flex flex-col gap-3 ${
                p.highlight ? "border-primary bg-primary/5 shadow-lg shadow-primary/10" : "border-border bg-card"
              }`}
            >
              <div className="text-sm font-medium text-muted-foreground">{p.label}</div>
              <div className="text-3xl font-bold">{p.price}</div>
              <div className="text-xs text-muted-foreground">{p.note}</div>
              <Button
                size="sm"
                variant={p.highlight ? "default" : "outline"}
                onClick={scrollToBooking}
                className="mt-2 rounded-lg"
              >
                Записаться
              </Button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-muted/40">
        <div className="max-w-3xl mx-auto px-6 py-20 md:py-28">
          <motion.div {...fade()} className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold">Частые вопросы</h2>
          </motion.div>
          <motion.div {...fade(0.05)}>
            <Accordion type="single" collapsible className="space-y-2">
              {faq.map((f, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border border-border rounded-xl px-5 bg-card">
                  <AccordionTrigger className="text-sm font-medium text-left">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section id="booking-europa" className="bg-foreground text-background">
        <div className="max-w-xl mx-auto px-6 py-20 md:py-28 text-center">
          <motion.div {...fade()}>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Готовы начать?</h2>
            <p className="text-sm opacity-60 mb-8 max-w-md mx-auto">
              Напишите мне в Telegram или оставьте заявку — я отвечу в течение дня. Первая сессия — 25 €.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                asChild
                className="rounded-xl gap-2 text-base px-8 shadow-lg shadow-primary/25"
              >
                <a href="https://t.me/cognitionx" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5" /> Написать в Telegram
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="rounded-xl text-base px-8 border-background/20 text-background hover:bg-background/10"
              >
                <a href="/contact">Оставить заявку</a>
              </Button>
            </div>
            <div className="mt-8 flex gap-6 justify-center text-xs opacity-50">
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Конфиденциально</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Без обязательств</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Ответ за 24ч</span>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default LandingPageEuropa;
