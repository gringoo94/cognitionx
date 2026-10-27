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
import { buildGeoAlternates } from "@/lib/geoAlternates";
import { buildFaqSchema, buildGeoBusinessSchema, buildGeoServiceSchema } from "@/lib/geoSchema";
import TelegramCTA from "@/components/TelegramCTA";
import Pricing from "@/components/Pricing";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomeBookingOffer from "@/components/HomeBookingOffer";
import Testimonials, { testimonialsSchema } from "@/components/Testimonials";
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
  FileText,
  Brain,
  Send,
  CheckCircle2,
  Star,
  MessageCircle,
  Clock,
} from "lucide-react";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, delay },
});

/* ─── USA/Canada-specific data ─── */

const painPoints = [
  { icon: Users, title: "Одиночество в suburbs", text: "Вокруг вежливые знакомые, но нет людей, с которыми можно говорить глубоко и на родном языке" },
  { icon: Brain, title: "Синдром самозванца", text: "«Меня терпят из вежливости, скоро поймут, что я не тяну» — частый запрос в IT и науке" },
  { icon: Briefcase, title: "Выгорание и hustle-культура", text: "Нужно быть продуктивным и позитивным 24/7, а виза часто привязана к работодателю" },
  { icon: FileText, title: "Тревога за статус и документы", text: "H-1B, грин-карта, PR в Канаде — постоянная неопределённость на годы вперёд" },
  { icon: HeartCrack, title: "Семья на расстоянии", text: "Чувство вины, звонки родителям, границы и «долг» — всё это через океан" },
  { icon: Clock, title: "Терапевт не понимает контекст", text: "Local therapist профессионален, но ему приходится объяснять то, что для своего — данность" },
];

const usaFaq = [
  {
    question: "Почему не пойти к русскоязычному терапевту в США или Канаде?",
    answer: "Можно, но их мало, запись на недели вперёд, а цена — $150–250 за сессию. Онлайн-формат со мной доступнее (45 €), не привязан к городу и строится на доказательных методах — КПТ и схема-терапии.",
  },
  {
    question: "Вы понимаете реалии жизни в Америке и Канаде?",
    answer: "Да. Работаю с клиентами из США и Канады: визовый стресс, workplace culture, performance review, давление успеха, изоляция в пригородах, отношения с родителями на расстоянии. Контекст объяснять не придётся.",
  },
  {
    question: "Принимаете ли вы американскую страховку?",
    answer: "Нет, я работаю вне системы страхования США и Канады. При этом стоимость сессии заметно ниже локальных ставок, а формат — тот же доказательный протокол.",
  },
  {
    question: "Как проходит первая консультация?",
    answer: "Первый шаг — консультация (50 минут, 45 €): обсудим запрос, ответите на вопросы и решите, подходим ли мы друг другу.",
  },
  {
    question: "Сколько сессий нужно для результата?",
    answer: "Длительность зависит от вашей ситуации. Обсудим ориентировочный план на первой встрече и будем пересматривать его по ходу работы.",
  },
  {
    question: "Как оплатить из США или Канады?",
    answer: "Удобнее всего Wise или Revolut в USD/EUR — комиссия минимальная. Подойдёт и обычный банковский перевод; детали обсудим на первой сессии.",
  },
];

const visibleFaq = buildLandingFaq(usaFaq);
const usaFaqSchema = buildFaqSchema(visibleFaq);

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Дмитрий Яцко",
  jobTitle: "Клинический психолог, КПТ и схема-терапевт",
  url: "https://cognitionx.cloud/psiholog-usa",
};

const usaGeoInput = {
  url: "https://cognitionx.cloud/psiholog-usa",
  name: "Психолог онлайн в США и Канаде — Дмитрий Яцко",
  description:
    "Психолог онлайн в США и Канаде: КПТ и схема-терапия на русском. Помощь при тревоге, депрессии и ОКР. Консультация — 45 €, 50 минут.",
  places: ["США", "Канада", "Нью-Йорк", "Торонто", "Сан-Франциско"],
};

const businessSchema = buildGeoBusinessSchema(usaGeoInput);
const serviceSchema = buildGeoServiceSchema(usaGeoInput);

const pricing = [
  {
    title: "Разовая консультация",
    price: "45",
    duration: "50 мин",
    featured: true,
    features: ["Работа в формате КПТ", "Домашние задания", "Поддержка между сессиями"],
  },
  {
    title: "Регулярная терапия",
    price: "40",
    priceNote: "за сессию",
    totalPrice: "При оплате от 4 сессий",
    duration: "50 мин",
    features: ["Дешевле разовой консультации", "Регулярная работа над запросом", "Приоритетная запись"],
  },
];

const LandingPageUSA = () => (
  <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
    <SEOHead
      title="Психолог онлайн в США и Канаде — на русском | Яцко"
      description={usaGeoInput.description}
      path="/psiholog-usa"
      alternates={buildGeoAlternates("/psiholog-usa", ["US", "CA"])}
      schema={[personSchema, businessSchema, serviceSchema, ...(usaFaqSchema ? [usaFaqSchema] : []), testimonialsSchema]}
      breadcrumbs={[
        { name: "Главная", url: "https://cognitionx.cloud/" },
        { name: "Психолог онлайн в США и Канаде", url: "https://cognitionx.cloud/psiholog-usa" },
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
              <Sparkles className="w-3.5 h-3.5" />
              Психотерапия онлайн
            </motion.div>

            <motion.h1
              {...fade(0.05)}
              className="text-4xl sm:text-5xl md:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.08]"
            >
              Психолог онлайн
              <br />
              <span className="text-primary">в США и Канаде</span>
            </motion.h1>

            <motion.p
              {...fade(0.1)}
              className="mt-6 text-base md:text-lg text-muted-foreground max-w-lg leading-relaxed"
            >
              КПТ и схема-терапия онлайн для тех, кто живёт в Америке и Канаде. 
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
              <div className="relative w-72 h-80 sm:w-80 sm:h-[22rem] md:w-[22rem] md:h-[28rem] lg:w-[26rem] lg:h-[32rem] rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={heroPhoto}
                  alt="Психолог Дмитрий Яцко — русскоязычный КПТ-терапевт онлайн для США и Канады"
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
          Ответы на вопросы, которые чаще всего задают клиенты из США и Канады перед первой консультацией
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

export default LandingPageUSA;
