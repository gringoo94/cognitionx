import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SEOHead from "@/components/SEOHead";
import { buildGeoAlternates } from "@/lib/geoAlternates";
import { buildFaqSchema, buildGeoBusinessSchema, buildGeoServiceSchema } from "@/lib/geoSchema";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingForm from "@/components/BookingForm";
import Testimonials, { testimonialsSchema } from "@/components/Testimonials";
import Ethics from "@/components/Ethics";
import Projects from "@/components/Projects";
import SessionPrep from "@/components/SessionPrep";
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
    question: "Какая разница во времени? Когда проходят сессии?",
    answer: "Я в Кишинёве (UTC+2/+3). Для EST это +7–8 часов, для PST +10–11. Ваше раннее утро (7:00–10:00 EST) — мой день, это самые удобные слоты. Сессии по выходным тоже возможны. Расписание фиксируем заранее и не сдвигаем.",
  },
  {
    question: "Почему не пойти к русскоязычному терапевту в США или Канаде?",
    answer: "Можно, но их мало, запись на недели вперёд, а цена — $150–250 за сессию. Онлайн-формат со мной доступнее (35 €), не привязан к городу и строится на доказательных методах — КПТ и схема-терапии.",
  },
  {
    question: "Почему важно работать на родном языке?",
    answer: "Эмоциональная память билингвов хранится на языке детства. На английском проще сказать «I felt sad» и не заплакать, чем «мне было больно» — и встретиться с этой болью. Поэтому терапия на английском у многих русскоязычных клиентов годами остаётся «на поверхности».",
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
    answer: "Первый шаг — бесплатная 20-минутная встреча-знакомство. Это не терапия: обсудим запрос, ответите на вопросы, решите, подходим ли мы друг другу. Дальше — диагностическая сессия 50 минут (35 €).",
  },
  {
    question: "Сколько сессий нужно для результата?",
    answer: "Обычно 8–20 встреч, первые улучшения чаще заметны через 4–6. Точнее скажу после первичной консультации, когда увидим картину целиком.",
  },
  {
    question: "Как оплатить из США или Канады?",
    answer: "Удобнее всего Wise или Revolut в USD/EUR — комиссия минимальная. Подойдёт и обычный банковский перевод; детали обсудим на первой сессии.",
  },
];

const usaFaqSchema = buildFaqSchema(usaFaq);

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Дмитрий Яцко",
  jobTitle: "Клинический психолог, КПТ и схема-терапевт",
  url: "https://cognitionx.cloud/psiholog-usa",
};

const usaGeoInput = {
  url: "https://cognitionx.cloud/psiholog-usa",
  name: "Русскоязычный психолог онлайн для США и Канады — Дмитрий Яцко",
  description:
    "Русскоязычный психолог онлайн для клиентов из США и Канады. КПТ и схема-терапия на родном языке, удобные слоты по EST/CST/PST.",
  places: ["США", "Канада", "Нью-Йорк", "Торонто", "Сан-Франциско"],
  timezone: "EST / CST / PST",
};

const businessSchema = buildGeoBusinessSchema(usaGeoInput);
const serviceSchema = buildGeoServiceSchema(usaGeoInput);

const pricing = [
  {
    title: "Разовая консультация",
    price: "35",
    duration: "50 мин",
    featured: true,
    features: ["Работа в формате КПТ", "Домашние задания", "Поддержка между сессиями"],
  },
  {
    title: "Регулярная сессия",
    price: "30",
    priceNote: "за сессию",
    totalPrice: "При продолжении работы",
    duration: "50 мин",
    features: ["Дешевле разовой консультации", "Регулярная работа над запросом", "Приоритетная запись"],
  },
];

const LandingPageUSA = () => (
  <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
    <SEOHead
      title="Русскоязычный психолог онлайн США и Канада | КПТ"
      description="Русскоязычный психолог онлайн для США и Канады: КПТ и схема-терапия на родном языке. Удобные слоты по EST/CST/PST. Первая встреча — бесплатно."
      path="/psiholog-usa"
      alternates={buildGeoAlternates("/psiholog-usa", ["US", "CA"])}
      schema={[personSchema, businessSchema, serviceSchema, ...(usaFaqSchema ? [usaFaqSchema] : []), testimonialsSchema]}
      breadcrumbs={[
        { name: "Главная", url: "https://cognitionx.cloud/" },
        { name: "Психолог онлайн — США и Канада", url: "https://cognitionx.cloud/psiholog-usa" },
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
              Онлайн · Zoom · На русском · Слоты по EST / CST / PST
            </motion.div>

            <motion.h1
              {...fade(0.05)}
              className="text-4xl sm:text-5xl md:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.08]"
            >
              Русскоязычный психолог
              <br />
              <span className="text-primary">для США и Канады</span>
            </motion.h1>

            <motion.p
              {...fade(0.1)}
              className="mt-6 text-base md:text-lg text-muted-foreground max-w-lg leading-relaxed"
            >
              КПТ и схема-терапия онлайн для тех, кто живёт в Америке и Канаде. Сессии — в удобное для вас время по местному часовому поясу.
            </motion.p>

            <motion.div
              {...fade(0.15)}
              className="mt-9 flex flex-col sm:flex-row items-center md:items-start gap-3"
            >
              <Button size="lg" className="gap-2 text-base px-8 hover:scale-[1.02] hover:shadow-lg transition-all" asChild>
                <a href="/start">
                  Понять, с чего начать <ArrowRight className="w-4 h-4" />
                </a>
              </Button>
              <Button variant="outline" size="lg" className="text-base px-8 hover:scale-[1.02] hover:shadow-md transition-all" asChild>
                <a href="#approach">Как я работаю</a>
              </Button>
            </motion.div>

            <motion.p {...fade(0.2)} className="mt-4 text-xs text-muted-foreground">
              Короткий опросник на 3–5 минут. Я отправлю первичный разбор в Telegram. Без оплаты и обязательств.
            </motion.p>

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

      {/* ── Pain Points ── */}
      <section className="bg-card border-y border-border">
        <div className="max-w-5xl mx-auto px-6 py-24 md:py-32">
          <motion.div {...fade()} className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Узнаёте себя?</h2>
            <p className="text-muted-foreground mt-3 text-sm md:text-base max-w-xl mx-auto">
              С чем чаще всего сталкиваются русскоязычные в США и Канаде
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

      {/* ── About ── */}
      <About
        text="Меня зовут Дмитрий. Я клинический психолог, работаю в КПТ и схема-терапии. Провожу онлайн-сессии с русскоязычными клиентами в США и Канаде из Кишинёва (UTC+2/+3) — с учётом вашей разницы во времени по EST, CST и PST."
        quote="«Переезд решает вопрос географии. Всё остальное едет с нами — и с этим можно работать.»"
        chips={["КПТ", "Схема-терапия", "На русском языке", "Слоты для EST / PST"]}
      />

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
              <Link to="/free-consultation">Записаться на встречу <ArrowRight className="w-4 h-4" /></Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <Expectations />

      <Testimonials />

      {/* ── Pricing ── */}
      <section id="pricing" className="bg-card border-y border-border">
        <div className="max-w-5xl mx-auto px-6 py-24 md:py-32">
          <motion.div {...fade()} className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Стоимость</h2>
            <p className="text-muted-foreground mt-3 text-sm md:text-base max-w-xl mx-auto">
              Прозрачные цены без скрытых платежей — заметно ниже локальных ставок в США и Канаде
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {pricing.map((p, i) => (
              <motion.div
                key={p.title}
                {...fade(0.06 * i)}
                className={`rounded-2xl p-6 md:p-8 flex flex-col border transition-colors ${
                  p.featured
                    ? "border-primary bg-primary text-primary-foreground shadow-lg"
                    : "border-border bg-background hover:border-primary/30"
                }`}
              >
                <div className="space-y-1">
                  <p className={`text-xs uppercase tracking-widest font-medium ${p.featured ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {p.title}
                  </p>
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
                      <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-accent" />
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
                  <a href="#booking">Записаться</a>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Ethics />

      <Projects />

      <SessionPrep />

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
            {usaFaq.map((faq, i) => (
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

      <BookingForm />

      {/* ── SEO footer block ── */}
      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h2 className="text-lg font-semibold text-muted-foreground mb-4">
          Русскоязычный психолог онлайн для США и Канады
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Если вы живёте в Нью-Йорке, Чикаго, Майами, Сиэтле, Сан-Франциско, Торонто, Ванкувере или
          Монреале и хотите работать с психологом на родном языке — эта страница для вас. Я работаю
          онлайн с русскоязычными клиентами в США и Канаде в подходах когнитивно-поведенческой и
          схема-терапии: тревога, панические атаки, выгорание, синдром самозванца, эмиграционный
          стресс и отношения с семьёй на расстоянии. Удобные слоты по EST, CST и PST, бесплатная
          первая встреча, оплата через Wise или Revolut.
        </p>
      </section>
    </main>
    <Footer />
  </div>
);

export default LandingPageUSA;
