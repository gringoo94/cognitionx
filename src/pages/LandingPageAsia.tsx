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
  Sun,
  HeartCrack,
  Plane,
  Wifi,
  Brain,
  GraduationCap,
  Award,
  Globe,
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

/* ─── Asia-specific data ─── */

const painPoints = [
  { icon: Users, title: "Одиночество среди «своих»", text: "Тусовка digital-nomad большая, но настоящих близких нет — все «временные»" },
  { icon: Sun, title: "Вечное лето без структуры", text: "Дни сливаются в один, нет смены сезонов — теряется ощущение времени и движения" },
  { icon: Plane, title: "Тревога за визы и переезды", text: "Постоянная неопределённость: visa run, релокация, аренда на месяц вперёд" },
  { icon: Wifi, title: "Выгорание на удалёнке", text: "Работа на разнице 5–8 часов с командой, вечные созвоны ночью, нет отдыха" },
  { icon: HeartCrack, title: "«Я тут навсегда или нет»", text: "Кризис идентичности: дом — там, жизнь — здесь, корни нигде" },
  { icon: Brain, title: "«Рай-ловушка»", text: "Переехали в красивое место, но проблемы остались — и это бьёт сильнее, чем дома" },
];

const asiaFaq = [
  {
    question: "Может ли в тропиках быть сезонная депрессия?",
    answer: "Да, и это частая жалоба у экспатов в Азии. Парадоксально — но «вечное лето» само по себе становится фактором риска: пропадает естественная смена ритма, телу не на что опираться. Плюс сезон дождей, влажность, изоляция — всё это даёт устойчивое снижение настроения. С этим хорошо работает поведенческая активация и структурирование дня.",
  },
  {
    question: "Я переехал на Бали, чтобы стало легче — а стало хуже. Это нормально?",
    answer: "Очень частая история. Эффект «рай-ловушки»: красивое место создаёт ожидание, что внутри тоже всё наладится. Когда этого не происходит, появляется вина («я в раю — а мне плохо, что со мной не так?»). Проблемы не остаются на родине — они едут с вами. Но и работать с ними стало проще: теперь они выпуклее видны.",
  },
  {
    question: "Как проходит первая консультация?",
    answer: "Первый шаг — консультация (50 минут, 45 €): обсудим запрос, ответите на вопросы и решите, подходим ли мы друг другу.",
  },
  {
    question: "Что с интернетом? У меня в Убуде/на Самуи бывают перебои.",
    answer: "Работаем в Zoom, который отлично держит даже слабый канал. Если вдруг связь подвиснет — переключимся на голос или перенесём сессию без оплаты. У большинства клиентов на Бали и в Таиланде стабильный интернет в коворкингах и виллах — проблем почти не бывает.",
  },
  {
    question: "Сколько сессий нужно для результата?",
    answer: "Длительность зависит от вашей ситуации. Обсудим ориентировочный план на первой встрече и будем пересматривать его по ходу работы.",
  },
  {
    question: "Как оплатить из Азии?",
    answer: "Удобнее всего — Wise или Revolut в EUR (комиссия минимальная). Также подойдёт обычный банковский перевод или другие способы — обсудим индивидуально на первой сессии.",
  },
];

const visibleFaq = buildLandingFaq(asiaFaq);
const asiaFaqSchema = buildFaqSchema(visibleFaq);

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Дмитрий Яцко",
  jobTitle: "Психолог, КПТ и схема-терапевт",
  url: "https://cognitionx.cloud/psiholog-aziya",
};

const asiaGeoInput = {
  url: "https://cognitionx.cloud/psiholog-aziya",
  name: "Психолог онлайн в Азии — Дмитрий Яцко",
  description:
    "Психолог онлайн в Азии: Бали, Таиланд, Вьетнам. КПТ и схема-терапия на русском при тревоге, депрессии и ОКР. Консультация — 45 €, 50 минут.",
  places: ["Индонезия", "Таиланд", "Вьетнам", "Малайзия", "Юго-Восточная Азия"],
};

const businessSchema = buildGeoBusinessSchema(asiaGeoInput);
const serviceSchema = buildGeoServiceSchema(asiaGeoInput);

const LandingPageAsia = () => (
  <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
    <SEOHead
      title="Психолог онлайн в Азии — Бали, Таиланд, Вьетнам | Яцко"
      description={asiaGeoInput.description}
      path="/psiholog-aziya"
      alternates={buildGeoAlternates("/psiholog-aziya", ["ID", "TH", "VN"])}
      schema={[personSchema, businessSchema, serviceSchema, ...(asiaFaqSchema ? [asiaFaqSchema] : []), testimonialsSchema]}
      breadcrumbs={[
        { name: "Главная", url: "https://cognitionx.cloud/" },
        { name: "Психолог онлайн в Азии", url: "https://cognitionx.cloud/psiholog-aziya" },
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
              <span className="text-primary">в Азии</span>
            </motion.h1>

            <motion.p
              {...fade(0.1)}
              className="mt-6 text-base md:text-lg text-muted-foreground max-w-lg leading-relaxed"
            >
              КПТ и схема-терапия онлайн для тех, кто живёт на Бали, в Таиланде, Вьетнаме и других странах Азии. 
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
                  alt="Психолог Дмитрий Яцко — русскоязычный КПТ-терапевт для экспатов в Азии (Бали, Таиланд)"
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
          Ответы на вопросы, которые чаще всего задают экспаты в Азии перед первой консультацией
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

export default LandingPageAsia;
