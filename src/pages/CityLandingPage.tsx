import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronRight,
  MessageCircle,
  Clock,
  MapPin,
  Globe,
  Send,
  Sparkles,
  Star,
  CheckCircle2,
  Users,
  GraduationCap,
  Award,
  Brain,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingForm from "@/components/BookingForm";
import Approach from "@/components/Approach";
import Specializations from "@/components/Specializations";
import Expectations from "@/components/Expectations";
import Testimonials, { testimonialsSchema } from "@/components/Testimonials";
import Ethics from "@/components/Ethics";
import SessionPrep from "@/components/SessionPrep";
import Projects from "@/components/Projects";
import Blog from "@/components/Blog";
import heroPhoto from "@/assets/hero-photo.webp";
import { getCityBySlug, cityPages } from "@/data/cityPages";
import NotFound from "@/pages/NotFound";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.45, delay },
});

const CityLandingPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const page = getCityBySlug(slug || "");

  if (!page) return <NotFound />;

  const url = `https://cognitionx.cloud/${page.slug}`;
  const isEurope = ["DE", "NL", "PT"].includes(page.countryCode);

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Дмитрий Яцко",
    jobTitle: "Психолог, КПТ и схема-терапевт",
    url,
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${url}#service`,
    name: `Русскоязычный психолог онлайн ${page.cityFor} — Дмитрий Яцко`,
    description: page.metaDescription,
    url,
    provider: { "@type": "Person", name: "Дмитрий Яцко" },
    areaServed: [
      { "@type": "City", name: page.city },
      { "@type": "Country", name: page.country },
    ],
    serviceType: ["Онлайн-психотерапия", "КПТ-терапия", "Схема-терапия"],
    availableLanguage: "Russian",
    availableChannel: { "@type": "ServiceChannel", serviceType: "Online", serviceUrl: url },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  const otherCities = cityPages.filter((c) => c.slug !== page.slug);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SEOHead
        title={page.metaTitle}
        description={page.metaDescription}
        path={`/${page.slug}`}
        schema={[personSchema, serviceSchema, faqSchema, testimonialsSchema]}
        breadcrumbs={[
          { name: "Главная", url: "https://cognitionx.cloud/" },
          { name: `Психолог ${page.cityIn}`, url },
        ]}
      />
      <Navbar />

      <main>
        {/* ── Hero ── */}
        <section className="max-w-7xl mx-auto px-6 pt-20 md:pt-32 pb-24">
          <motion.nav
            {...fade()}
            className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8"
          >
            <Link to="/" className="hover:text-foreground transition-colors">Главная</Link>
            <ChevronRight className="w-3 h-3" />
            {isEurope && (
              <>
                <Link to="/psiholog-europa" className="hover:text-foreground transition-colors">
                  Европа
                </Link>
                <ChevronRight className="w-3 h-3" />
              </>
            )}
            <span className="text-foreground">Психолог {page.cityIn}</span>
          </motion.nav>

          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="text-center md:text-left order-2 md:order-1">
              <motion.div
                {...fade(0)}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-xs font-medium text-primary mb-7"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Онлайн · {page.country} · {page.utcOffset}
              </motion.div>

              <motion.h1
                {...fade(0.05)}
                className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08]"
              >
                Русскоязычный психолог
                <br />
                <span className="text-primary">{page.cityIn}</span>
              </motion.h1>

              <motion.p
                {...fade(0.1)}
                className="mt-6 text-base md:text-lg text-muted-foreground max-w-lg leading-relaxed"
              >
                {page.subtitle}
              </motion.p>

              <motion.div
                {...fade(0.15)}
                className="mt-9 flex flex-col sm:flex-row items-center md:items-start gap-3"
              >
                <Button size="lg" className="gap-2 text-base px-8 hover:scale-[1.02] hover:shadow-lg transition-all" asChild>
                  <a href="#booking">
                    Бесплатная встреча — 20 мин <ArrowRight className="w-4 h-4" />
                  </a>
                </Button>
                <Button variant="outline" size="lg" className="text-base px-8 hover:scale-[1.02] hover:shadow-md transition-all" asChild>
                  <a href="#approach">Как я работаю</a>
                </Button>
              </motion.div>

              <motion.p {...fade(0.2)} className="mt-4 text-xs text-muted-foreground">
                Бесплатная 20-минутная встреча — познакомимся и я отвечу на ваши вопросы
              </motion.p>

              <motion.div
                {...fade(0.25)}
                className="mt-8 flex items-center justify-center md:justify-start gap-6 text-sm text-muted-foreground"
              >
                {[
                  { value: "200+", label: "клиентов" },
                  { value: "5 лет", label: "опыта" },
                  { value: page.timezone.split(" ")[0], label: "часовой пояс" },
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
                    alt={`Психолог Дмитрий Яцко — русскоязычный КПТ-терапевт ${page.cityFor}, ${page.country}`}
                    className="w-full h-full object-cover object-top"
                    loading="eager"
                    fetchPriority="high"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Telegram CTA bar ── */}
        <section className="bg-primary text-primary-foreground">
          <div className="max-w-3xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
            <p className="text-sm font-medium">
              Запишитесь на бесплатную 20-минутную встречу — напишите в Telegram
            </p>
            <Button size="sm" variant="secondary" className="gap-2 rounded-full" asChild>
              <a href="https://t.me/gringoo94" target="_blank" rel="noopener noreferrer">
                <Send className="w-4 h-4" /> Написать в Telegram
              </a>
            </Button>
          </div>
        </section>

        {/* ── Intro ── */}
        <section className="bg-card border-y border-border">
          <div className="max-w-3xl mx-auto px-6 py-16 md:py-20">
            <motion.p {...fade()} className="text-base md:text-lg leading-relaxed text-muted-foreground">
              {page.intro}
            </motion.p>
          </div>
        </section>

        {/* ── Pain points ── */}
        <section className="max-w-5xl mx-auto px-6 py-24 md:py-32">
          <motion.div {...fade()} className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              С чем приходят клиенты {page.cityIn}
            </h2>
            <p className="text-muted-foreground mt-3 text-sm md:text-base max-w-xl mx-auto">
              Узнаёте себя? Это не «слабость» и не «лень» — это типичные запросы экспата.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {page.painPoints.map((p, i) => (
              <motion.div
                key={i}
                {...fade(i * 0.04)}
                whileHover={{ scale: 1.02, y: -4 }}
                transition={{ duration: 0.25 }}
                className="rounded-2xl border border-border bg-background p-6 hover:border-primary/40 hover:shadow-lg transition-all"
              >
                <h3 className="text-base font-bold mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Practical info bar ── */}
        <section className="bg-foreground text-background">
          <div className="max-w-3xl mx-auto px-6 py-16 md:py-20">
            <motion.div {...fade()} className="grid sm:grid-cols-3 gap-6 text-center sm:text-left">
              <div className="flex flex-col items-center sm:items-start gap-2">
                <Clock className="w-6 h-6 opacity-70" />
                <p className="text-xs uppercase tracking-wider opacity-60">Часовой пояс</p>
                <p className="text-sm font-semibold">{page.timezone}</p>
                <p className="text-xs opacity-70">{page.utcOffset}</p>
              </div>
              <div className="flex flex-col items-center sm:items-start gap-2">
                <Globe className="w-6 h-6 opacity-70" />
                <p className="text-xs uppercase tracking-wider opacity-60">Формат</p>
                <p className="text-sm font-semibold">Онлайн · Zoom</p>
                <p className="text-xs opacity-70">На русском языке</p>
              </div>
              <div className="flex flex-col items-center sm:items-start gap-2">
                <MessageCircle className="w-6 h-6 opacity-70" />
                <p className="text-xs uppercase tracking-wider opacity-60">Оплата</p>
                <p className="text-sm font-semibold">{page.currency}</p>
                <p className="text-xs opacity-70">Wise, Revolut, перевод</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Free meeting block ── */}
        <section className="bg-primary text-primary-foreground">
          <div className="max-w-3xl mx-auto px-6 py-20 md:py-28 text-center">
            <motion.div {...fade()} className="inline-flex items-center gap-2 mb-6">
              <Star className="w-5 h-5" />
              <span className="text-sm font-semibold uppercase tracking-widest opacity-80">
                Рекомендую начать с этого
              </span>
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
                { icon: Users, text: "Решите, подходим ли мы" },
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

        <Specializations />
        <Approach />

        {/* ── Evidence-based ── */}
        <section className="bg-primary text-primary-foreground">
          <div className="max-w-3xl mx-auto px-6 py-20 md:py-28 text-center">
            <motion.h2 {...fade()} className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
              Доказательный подход
              <br className="hidden sm:block" /> к вашему благополучию
            </motion.h2>
            <motion.p {...fade(0.05)} className="mt-6 text-sm md:text-base leading-relaxed opacity-85 max-w-2xl mx-auto">
              КПТ — один из самых исследованных методов психотерапии. Терапия на родном языке значительно эффективнее: эмоции, детские воспоминания и внутренний голос «говорят» по-русски — и работать с ними нужно на русском.
            </motion.p>
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
                Прозрачные цены без скрытых платежей · оплата в {page.currency}
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
                    (p as any).featured
                      ? "border-primary bg-primary text-primary-foreground shadow-lg"
                      : (p as any).accent
                      ? "border-accent bg-accent/5 hover:border-accent/60 shadow-md"
                      : "border-border bg-background hover:border-primary/30"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className={`text-xs uppercase tracking-widest font-medium ${(p as any).featured ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                        {p.title}
                      </p>
                      {(p as any).badge && (
                        <Badge variant="secondary" className="text-[10px] px-2 py-0">
                          {(p as any).badge}
                        </Badge>
                      )}
                    </div>
                    <p className={`text-sm ${(p as any).featured ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                      {p.duration}
                    </p>
                  </div>
                  <div className="mt-6">
                    <span className="text-4xl font-bold tracking-tight">{p.price}</span>
                    <span className={`text-sm ml-1 ${(p as any).featured ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                      €{(p as any).priceNote ? ` ${(p as any).priceNote}` : ""}
                    </span>
                    {(p as any).totalPrice && (
                      <p className={`text-xs mt-1 ${(p as any).featured ? "text-primary-foreground/60" : "text-muted-foreground/70"}`}>
                        {(p as any).totalPrice}
                      </p>
                    )}
                  </div>
                  <ul className="mt-6 space-y-3 flex-1">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-accent" />
                        <span className={(p as any).featured ? "text-primary-foreground/90" : "text-muted-foreground"}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`mt-8 w-full ${
                      (p as any).featured ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90" : ""
                    }`}
                    variant={(p as any).featured ? "default" : "outline"}
                    asChild
                  >
                    <a href="#booking">{(p as any).accent ? "Записаться бесплатно" : "Записаться"}</a>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── About Detailed ── */}
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
                  <p>• Все дипломы верифицированы платформой <a href="https://www.b17.ru/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">B17.ru</a></p>
                  <p>• Практика по международным стандартам <span className="font-medium">EABCT</span>, регулярные супервизии</p>
                  <p>• Основатель <span className="font-medium">Rolelit</span> — тренажёр для психологов</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="city-context" className="border rounded-xl px-5">
                <AccordionTrigger className="hover:no-underline">
                  <span className="flex items-center gap-3 text-sm font-semibold">
                    <Globe className="w-5 h-5 text-primary" /> Опыт работы с экспатами {page.cityFor}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed space-y-2">
                  <p>• Работаю с клиентами {page.cityIn} и других городов {page.country}</p>
                  <p>• Понимаю специфику локального стресса: бюрократия, адаптация, климат, идентичность</p>
                  <p>• Гибкие часы под {page.timezone}</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>
        </section>

        <Ethics />
        <SessionPrep />

        {/* ── FAQ ── */}
        <section id="faq" className="max-w-3xl mx-auto px-6 py-20 md:py-28">
          <motion.h2 {...fade()} className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-center">
            Частые <span className="text-primary">вопросы</span> {page.cityFor}
          </motion.h2>
          <motion.div {...fade(0.1)} className="mt-10">
            <Accordion type="single" collapsible className="space-y-3">
              {page.faq.map((faq, i) => (
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

        <Projects />
        <Blog />
        <BookingForm />

        {/* ── Other cities (internal linking) ── */}
        <section className="max-w-5xl mx-auto px-6 py-16 border-t border-border">
          <motion.h2 {...fade()} className="text-lg font-semibold text-center mb-6">
            Психолог в других городах
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-3xl mx-auto">
            {otherCities.map((c) => (
              <Link
                key={c.slug}
                to={`/${c.slug}`}
                className="rounded-xl border border-border bg-card px-4 py-3 text-center hover:border-primary/40 transition-colors group"
              >
                <span className="text-sm font-medium group-hover:text-primary transition-colors">
                  {c.city}
                </span>
                <span className="block text-xs text-muted-foreground mt-0.5">{c.country}</span>
              </Link>
            ))}
          </div>
          {isEurope && (
            <div className="mt-6 text-center">
              <Link to="/psiholog-europa" className="text-sm text-primary hover:underline">
                Все направления — Европа →
              </Link>
            </div>
          )}
        </section>

        {/* ── SEO footer ── */}
        <section className="max-w-3xl mx-auto px-6 py-12 text-center border-t border-border">
          <h2 className="text-base font-semibold text-muted-foreground mb-3">
            Русскоязычный психолог {page.cityIn} онлайн
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{page.seoFooter}</p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CityLandingPage;
