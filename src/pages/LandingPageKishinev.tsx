import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { buildLandingFaq } from "@/lib/geoFaq";
import SEOHead from "@/components/SEOHead";
import { buildFaqSchema, buildGeoBusinessSchema, buildGeoServiceSchema } from "@/lib/geoSchema";
import TelegramCTA from "@/components/TelegramCTA";
import Pricing from "@/components/Pricing";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomeBookingOffer from "@/components/HomeBookingOffer";
import Testimonials, { testimonialsSchema } from "@/components/Testimonials";
import { Badge } from "@/components/ui/badge";
import Blog from "@/components/Blog";
import Approach from "@/components/Approach";
import AboutEvidence from "@/components/AboutEvidence";
import About from "@/components/About";
import AboutDetailed from "@/components/AboutDetailed";
import Specializations from "@/components/Specializations";
import Expectations from "@/components/Expectations";
import heroPhoto from "@/assets/hero-photo.webp";
import {
  ArrowRight,
  Sparkles,
  Users,
  Briefcase,
  HeartCrack,
  Clock,
  ShieldCheck,
  Brain,
  GraduationCap,
  Award,
  MapPin,
  Send,
  CheckCircle2,
  Star,
  MessageCircle,
  Globe,
} from "lucide-react";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, delay },
});

/* ─── Kishinev-specific data ─── */

const painPoints = [
  { icon: Brain, title: "Тревога о будущем", text: "Геополитика, экономика, мысли «а вдруг придётся уезжать» — фоновый стресс, который сложно отключить" },
  { icon: Briefcase, title: "Выгорание на удалёнке", text: "IT, фриланс, работа на зарубежных клиентов — высокая нагрузка, размытые границы, хроническая усталость" },
  { icon: HeartCrack, title: "Отношения и семья", text: "Конфликты в паре, родительские сценарии, развод, сложные отношения с близкими" },
  { icon: Users, title: "Самооценка и перфекционизм", text: "Внутренний критик, страх ошибки, синдром самозванца — глубинные схемы, проработка через схема-терапию" },
  { icon: Clock, title: "Депрессия и апатия", text: "«Всё вроде нормально, но ничего не радует» — типичный запрос, с которым работает КПТ" },
  { icon: ShieldCheck, title: "Решение об эмиграции", text: "Уезжать или оставаться, куда, когда, с кем — помогаю прояснить ценности и снизить тревогу выбора" },
];

const localFaq = [
  {
    question: "Вы принимаете очно в Кишинёве?",
    answer:
      "Основной формат — онлайн в Zoom. Это удобнее по времени, не нужно тратить часы на дорогу через пробки, и качество терапии не уступает очному формату (есть исследования). При необходимости очной встречи — обсудим индивидуально.",
  },
  {
    question: "Сколько стоит сессия и можно ли платить в леях?",
    answer:
      "Разовая консультация (50 мин) — 45 €. Регулярная терапия — 40 € за сессию при оплате от 4 сессий. Оплата возможна в EUR (Wise, Revolut, банковский перевод) или в MDL по курсу на молдавскую карту.",
  },
  {
    question: "Чем КПТ отличается от «просто разговора с другом»?",
    answer:
      "КПТ — это структурированный, доказательный метод с конкретными протоколами под тревогу, депрессию, ОКР, ПТСР. Мы не просто обсуждаем проблему — мы работаем с мыслями, поведением и эмоциями по плану. Есть домашние задания, измеримые цели, понятный прогресс.",
  },
  {
    question: "Как понять, что мне нужна терапия, а не просто отдых?",
    answer:
      "Если состояние длится дольше 2–4 недель, мешает работе, отношениям или сну, и «отдых» не помогает — это сигнал. На первой консультации мы вместе оценим, нужна ли терапия, и если да — какой формат подойдёт.",
  },
  {
    question: "Вы работаете с клиентами из других городов Молдовы?",
    answer:
      "Да. Онлайн-формат означает, что я работаю с людьми из Бельц, Тирасполя, Кагула, Орхея и других городов. Главное — стабильный интернет и тихое место на час.",
  },
  {
    question: "Можно ли работать на румынском или английском?",
    answer:
      "Терапия идёт на русском языке — это мой основной рабочий язык. Если для вас комфортнее румынский или английский — я порекомендую коллег с соответствующей специализацией.",
  },
  {
    question: "Онлайн-терапия действительно работает?",
    answer:
      "Да. Десятки мета-анализов подтверждают: онлайн-КПТ по эффективности сопоставима с очной терапией при депрессии, тревоге и панических атаках.",
  },
  {
    question: "Сколько сессий нужно для результата?",
    answer:
      "Зависит от запроса. Обычно 8–20 сессий. Первые улучшения часто заметны через 4–6 сессий. Точнее скажу после первичной консультации.",
  },
  {
    question: "Как быстро можно записаться?",
    answer:
      "Запись на разовую консультацию — примерно за 2 недели. Оставьте заявку на странице записи или напишите в Telegram/WhatsApp, и я предложу ближайшее время.",
  },
  {
    question: "Берёте ли вы сейчас новых клиентов на регулярную терапию?",
    answer:
      "До ноября новые клиенты на регулярную терапию не принимаются. Разовая консультация доступна: на ней разберём запрос и план, а затем договоримся о продолжении.",
  },
  {
    question: "Что будет на первой консультации?",
    answer:
      "50 минут: обсудим, что беспокоит, как давно и в каких ситуациях, оценим состояние и наметим план — какие методы КПТ подойдут и сколько примерно сессий может понадобиться. Готовиться не нужно.",
  },
  {
    question: "Это конфиденциально?",
    answer:
      "Да. Всё, что обсуждается на сессии, остаётся между нами. Исключения — только ситуации прямой угрозы жизни, о них я рассказываю заранее в информированном согласии.",
  },
];

const visibleFaq = buildLandingFaq(localFaq);
const localFaqSchema = buildFaqSchema(visibleFaq);

const kishinevGeoInput = {
  url: "https://cognitionx.cloud/psiholog-kishinev",
  name: "Психолог в Кишинёве — Дмитрий Яцко",
  description:
    "Русскоязычный психолог в Кишинёве и по всей Молдове. КПТ и схема-терапия онлайн.",
  city: "Кишинёв",
  country: "Молдова",
  languages: ["Russian", "Romanian"],
};

const businessSchema = buildGeoBusinessSchema(kishinevGeoInput);
const serviceSchema = buildGeoServiceSchema(kishinevGeoInput);

const LandingPageKishinev = () => (
  <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
    <SEOHead
      title="Психолог в Кишинёве онлайн на русском — КПТ | Яцко"
      description="Психолог в Кишинёве и по всей Молдове: КПТ и схема-терапия онлайн на русском. Тревога, выгорание, отношения. Консультация 45 €, 50 минут."
      path="/psiholog-kishinev"
      schema={[businessSchema, serviceSchema, ...(localFaqSchema ? [localFaqSchema] : []), testimonialsSchema]}
      alternates={[
        { hreflang: "ru", href: "/psiholog-kishinev" },
        { hreflang: "ro-MD", href: "/psiholog-kishinev" },
        { hreflang: "ro", href: "/psiholog-kishinev" },
        { hreflang: "x-default", href: "/psiholog-kishinev" },
      ]}
      breadcrumbs={[
        { name: "Главная", url: "https://cognitionx.cloud/" },
        { name: "Психолог в Кишинёве", url: "https://cognitionx.cloud/psiholog-kishinev" },
      ]}
    />
    <Navbar />
    <main>
      {/* ── Hero ── */}
      <section className="max-w-7xl mx-auto px-6 pt-20 md:pt-32 pb-24">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="text-center md:text-left order-2 md:order-1">
            <motion.div
              {...fade(0)}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-xs font-medium text-primary mb-7"
            >
              <MapPin className="w-3.5 h-3.5" />
              Психотерапия онлайн
            </motion.div>

            <motion.h1
              {...fade(0.05)}
              className="text-4xl sm:text-5xl md:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.08]"
            >
              Психолог
              <br />
              <span className="text-primary">в Кишинёве</span>
            </motion.h1>

            <motion.p
              {...fade(0.08)}
              className="mt-2 text-sm text-muted-foreground/80 italic"
            >
              Psiholog Chișinău · online · în limba rusă
            </motion.p>

            <motion.p
              {...fade(0.1)}
              className="mt-6 text-base md:text-lg text-muted-foreground max-w-lg leading-relaxed"
            >
              КПТ и схема-терапия для жителей Кишинёва и Молдовы. Встречи проходят в Zoom. Pentru clienții din Chișinău, Bălți și toată Moldova.
            </motion.p>

            <motion.div
              {...fade(0.15)}
              className="mt-9 flex flex-col sm:flex-row items-center md:items-start gap-3"
            >
              <Button size="lg" className="gap-2 text-base px-8 hover:scale-[1.02] hover:shadow-lg transition-all" asChild>
                <a href="/booking">
                  Записаться на консультацию <ArrowRight className="w-4 h-4" />
                </a>
              </Button>
              <Button variant="outline" size="lg" className="text-base px-8 hover:scale-[1.02] hover:shadow-md transition-all" asChild>
                <a href="#approach">Как я работаю</a>
              </Button>
            </motion.div>

            <motion.div
              {...fade(0.25)}
              className="mt-8 flex items-center justify-center md:justify-start gap-6 text-sm text-muted-foreground"
            >
              {[
                { value: "200+", label: "клиентов" },
                { value: "5 лет", label: "опыта" },
                { value: "Кишинёв", label: "родной город" },
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
              <div className="relative w-72 h-80 sm:w-80 sm:h-[22rem] md:w-[22rem] md:h-[28rem] lg:w-[26rem] lg:h-[32rem] rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={heroPhoto}
                  alt="Психолог Дмитрий Яцко — КПТ-терапевт в Кишинёве, Молдова"
                  className="w-full h-full object-cover object-top"
                  loading="eager"
                  {...({ fetchpriority: "high" } as any)}
                  width={1080}
                  height={1350}
                  decoding="async"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <TelegramCTA />

      {/* ── About ── */}
      <About />

      <div id="about-detailed" className="scroll-mt-20">
        <AboutDetailed />
      </div>

      <AboutEvidence />

      <Approach />

      <Specializations />

      {/* ── Free Meeting ── */}
      <section className="bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto px-6 py-20 md:py-28 text-center">
          <motion.div {...fade()} className="inline-flex items-center gap-2 mb-6">
            <Star className="w-5 h-5" />
            <span className="text-sm font-semibold uppercase tracking-widest opacity-80">Рекомендую начать с этого</span>
          </motion.div>
          <motion.h2 {...fade(0.05)} className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
            Первая консультация — 45 €
          </motion.h2>
          <motion.p {...fade(0.1)} className="mt-5 text-sm md:text-base leading-relaxed opacity-85 max-w-xl mx-auto">
            50 минут: обсудим ваш запрос, разберём ситуацию и наметим план работы.
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
              <Link to="/booking">Записаться на встречу <ArrowRight className="w-4 h-4" /></Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <Expectations />

      <Testimonials />

      <Pricing />

      <Blog />

      {/* ── FAQ ── */}
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
          Ответы на вопросы, которые чаще всего задают перед первой консультацией
        </motion.p>
        <motion.div {...fade(0.1)} className="mt-10">
          <Accordion type="single" collapsible className="space-y-3">
            {visibleFaq.map((faq, i) => (
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

      <HomeBookingOffer />

    </main>
    <Footer />
  </div>
);

export default LandingPageKishinev;
