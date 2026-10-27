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
import Expectations from "@/components/Expectations";
import Approach from "@/components/Approach";
import About from "@/components/About";
import AboutDetailed from "@/components/AboutDetailed";
import AboutEvidence from "@/components/AboutEvidence";
import Blog from "@/components/Blog";
import heroPhoto from "@/assets/hero-photo.webp";
import {
  ArrowRight,
  Sparkles,
  Users,
  Flame,
  Zap,
  Globe,
  Brain,
  GraduationCap,
  Award,
  Target,
  ShieldCheck,
  Send,
  CheckCircle2,
  Star,
  MessageCircle,
  Layers,
  BookOpen,
  Clock,
} from "lucide-react";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, delay },
});

/* ─── IT-specific data ─── */

const painPoints = [
  { icon: Flame, title: "Выгорание в IT", text: "Закрываешь спринты, растёшь в карьере, делаешь всё правильно. Но внутри — как будто батарейка на 3%. И не заряжается." },
  { icon: ShieldCheck, title: "Синдром самозванца", text: "«Скоро поймут, что я не такой крутой». Даже когда объективно всё хорошо — не покидает ощущение, что ты недостаточно." },
  { icon: Globe, title: "Двойная изоляция", text: "Переехал. Нашёл работу. Обустроился. По чеклисту — всё сделано правильно. Почему тогда так тяжело? Удалёнка плюс новая страна — это двойная изоляция." },
  { icon: Zap, title: "Тревога за карьеру", text: "Перформанс-ревью, волны сокращений, страх не вырасти достаточно быстро. Тревога стала фоновым режимом." },
  { icon: Target, title: "Перфекционизм и прокрастинация", text: "Задача кажется недостаточно проработанной. Не начинаешь, пока не будет идеально. Или не начинаешь вообще." },
  { icon: Clock, title: "Стресс адаптации", text: "Новая страна, другой язык, чужие правила. Постоянное напряжение от необходимости «соответствовать» — на работе и за её пределами." },
];

const specializations = [
  { title: "Выгорание", text: "Эмоциональное и профессиональное истощение. Особенно в IT — где высокий темп, удалёнка и переезд бьют одновременно.", featured: true, link: "/burnout" },
  { title: "Тревога и панические атаки", text: "Постоянное беспокойство, навязчивые мысли, ощущение что вот-вот что-то случится.", featured: true, link: "/anxiety" },
  { title: "Самооценка и синдром самозванца", text: "Постоянная самокритика, ощущение что вы хуже других — особенно в окружении сильных коллег.", featured: true, link: "/self-esteem" },
  { title: "Депрессия", text: "Нет сил, ничего не радует, утром не хочется вставать — и это длится неделями.", link: "/depression" },
  { title: "Прокрастинация и перфекционизм", text: "Откладываешь важное, потому что «не готово» или «я недостаточно хорош». Работаем с корневыми убеждениями, не с симптомами.", link: "/stress" },
  { title: "Стресс адаптации", text: "Переезд, новая работа, новая страна — когда всё навалилось и непонятно, как справляться.", link: "/stress" },
];


const itFaq = [
  { question: "Вы работаете с выгоранием в IT конкретно, или с выгоранием вообще?", answer: "Работаю с профессиональным и эмоциональным выгоранием вне зависимости от профессии. При этом хорошо понимаю специфику IT: высокий темп, удалёнка, постоянное давление перформанса, культура «всегда онлайн». Этот контекст учитывается в работе." },
  { question: "Я не верю в «просто поговорить». КПТ — это действительно что-то конкретное?", answer: "Да. КПТ — это структурированная работа с конкретными когнитивными и поведенческими паттернами. Есть повестка каждой сессии, домашние задания, измеримые цели. Больше похоже на отладку системы, чем на разговор по душам." },
  { question: "Онлайн-терапия — это так же эффективно, как очная?", answer: "По данным исследований — да, для большинства запросов эффективность сопоставима. Для людей, привыкших к удалённой работе, онлайн-формат часто даже комфортнее." },
  { question: "Сколько сессий обычно нужно?", answer: "Длительность зависит от вашей ситуации. Обсудим ориентировочный план на первой встрече и будем пересматривать его по ходу работы." },
  { question: "Вы работаете с парами, где один или оба — из IT?", answer: "Пары — отдельный запрос, который я сейчас не веду. Работаю индивидуально." },
  { question: "Как оплатить из Европы?", answer: "Принимаю оплату через Stripe (карта), PayPal и банковский перевод. Детали обсудим на знакомстве." },
];

const visibleFaq = buildLandingFaq(itFaq);
const itFaqSchema = buildFaqSchema(visibleFaq);

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Дмитрий Яцко",
  jobTitle: "Психолог, КПТ и схема-терапевт",
  url: "https://cognitionx.cloud/psiholog-dlya-it",
};

const itGeoInput = {
  url: "https://cognitionx.cloud/psiholog-dlya-it",
  name: "Психолог для IT-специалистов онлайн — Дмитрий Яцко",
  description:
    "Психолог онлайн для IT-специалистов в Европе. КПТ и схема-терапия. Выгорание, синдром самозванца, тревога.",
  places: ["Европа"],
  languages: ["Russian", "English"],
};

const businessSchema = buildGeoBusinessSchema(itGeoInput);
const serviceSchema = buildGeoServiceSchema(itGeoInput);

const LandingPageIT = () => (
  <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
    <SEOHead
      title="Психолог для IT-специалистов онлайн — КПТ | Яцко"
      description="Психолог для разработчиков, PM и аналитиков в Европе: КПТ онлайн. Выгорание, синдром самозванца, тревога. Консультация 45 €, 50 минут."
      path="/psiholog-dlya-it"
      alternates={buildGeoAlternates("/psiholog-dlya-it", ["DE", "NL", "PT", "GE"])}
      schema={[personSchema, businessSchema, serviceSchema, ...(itFaqSchema ? [itFaqSchema] : []), testimonialsSchema]}
      breadcrumbs={[
        { name: "Главная", url: "https://cognitionx.cloud/" },
        { name: "Психолог для IT-специалистов", url: "https://cognitionx.cloud/psiholog-dlya-it" },
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
              Психолог для
              <br />
              <span className="text-primary">IT-специалистов</span>
              <br />
              <span className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl text-muted-foreground font-medium">в Европе</span>
            </motion.h1>

            <motion.p
              {...fade(0.1)}
              className="mt-6 text-base md:text-lg text-muted-foreground max-w-lg leading-relaxed"
            >
              Работаю с разработчиками, PM, аналитиками и дата-специалистами. Использую КПТ и схема-терапию; цели и план работы обсуждаем вместе.
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
                <a href="#why-cbt">Как я работаю</a>
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
                  alt="Психолог Дмитрий Яцко — КПТ-терапевт для IT-специалистов онлайн"
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

      {/* ── Evidence-based ── */}
      <AboutEvidence />


      <Approach />

      {/* ── Specializations ── */}
      <section className="bg-card border-y border-border">
        <div className="max-w-5xl mx-auto px-6 py-24 md:py-32">
          <motion.div {...fade()} className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">На чём специализируюсь</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {specializations.map((s, i) => (
              <motion.div
                key={i}
                {...fade(i * 0.04)}
                className={`rounded-2xl border p-6 transition-all ${
                  s.featured ? "border-primary/40 bg-primary/5 shadow-md" : "border-border bg-background hover:border-primary/30"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-base font-bold">{s.title}</h3>
                  {s.featured && <Star className="w-4 h-4 text-primary" />}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.text}</p>
                <div className="mt-4 flex gap-2">
                  <Button variant="ghost" size="sm" className="text-xs" asChild>
                    <a href={s.link}>Подробнее</a>
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs" asChild>
                    <a href="/booking">Записаться</a>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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



      {/* ── FAQ (IT-specific) ── */}
      <section id="faq" className="bg-card border-y border-border">
        <div className="max-w-3xl mx-auto px-6 py-20 md:py-28">
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
            Ответы на вопросы, которые чаще всего задают IT-специалисты
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
        </div>
      </section>

      <HomeBookingOffer />

    </main>
    <Footer />
  </div>
);

export default LandingPageIT;
