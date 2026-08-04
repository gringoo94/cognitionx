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
  Heart,
  Compass,
  BookOpen,
  AlertTriangle,
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
import AboutDetailed from "@/components/AboutDetailed";
import AboutEvidence from "@/components/AboutEvidence";
import Specializations from "@/components/Specializations";
import Expectations from "@/components/Expectations";
import Testimonials, { testimonialsSchema } from "@/components/Testimonials";
import Ethics from "@/components/Ethics";
import SessionPrep from "@/components/SessionPrep";
import Projects from "@/components/Projects";
import Blog from "@/components/Blog";
import heroPhoto from "@/assets/hero-photo.webp";
import { getCityBySlug, cityPages } from "@/data/cityPages";
import { blogPosts } from "@/data/blogPosts";
import NotFound from "@/pages/NotFound";


// Hour offset for "min" side of utcOffset string (e.g. "UTC+1/+2" -> 1).
// Used for the "session times in your timezone" mini-table.
function minOffsetHours(utcOffset: string): number {
  const m = utcOffset.match(/UTC([+-]\d+)/);
  return m ? parseInt(m[1], 10) : 0;
}
// Kishinev (host) min offset is +2 (winter). We compute diff = clientMin - hostMin.
function shiftToKishinev(clientHour: number, clientUtcOffset: string): number {
  const diff = minOffsetHours(clientUtcOffset) - 2;
  let h = clientHour - diff;
  if (h < 0) h += 24;
  if (h >= 24) h -= 24;
  return h;
}
const fmtH = (h: number) => `${String(h).padStart(2, "0")}:00`;


const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.45, delay },
});

const CityLandingPage = () => {
  const { pathname } = useLocation();
  const slug = pathname.replace(/^\/+/, "").split("/")[0];
  const page = getCityBySlug(slug);

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

  // FAQPage schema removed (Google deprecated FAQ rich results, May 2026).
  // Visible FAQ section stays for users; buildFaqSchema import kept elsewhere.

  const otherCities = cityPages.filter((c) => c.slug !== page.slug);

  // Related articles by slug from blogPosts
  const relatedArticles = (page.relatedArticleSlugs ?? [])
    .map((s) => blogPosts.find((p) => p.slug === s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .slice(0, 5);




  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SEOHead
        title={page.metaTitle}
        description={page.metaDescription}
        path={`/${page.slug}`}
        schema={[personSchema, serviceSchema, testimonialsSchema]}
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
            {page.countryPageSlug ? (
              <>
                <Link
                  to={`/${page.countryPageSlug}`}
                  className="hover:text-foreground transition-colors"
                >
                  {page.country}
                </Link>
                <ChevronRight className="w-3 h-3" />
              </>
            ) : isEurope && (
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
                  <Link to="/start">
                    Понять, с чего начать <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="text-base px-8 hover:scale-[1.02] hover:shadow-md transition-all" asChild>
                  <a href="#booking">Записаться на диагностику</a>
                </Button>
              </motion.div>

              <motion.p {...fade(0.2)} className="mt-4 text-xs text-muted-foreground max-w-md">
                Короткий опросник на 3–5 минут. Вы опишете ситуацию, а я отправлю первичный разбор в Telegram. Без оплаты и обязательств.
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
                    {...({ fetchpriority: "high" } as any)}
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

        <div id="about-detailed" className="scroll-mt-20">
          <AboutDetailed />
        </div>

        {/* ── Why Russian online ── */}
        {page.whyRussianOnline && page.whyRussianOnline.length > 0 && (
          <section className="bg-background">
            <div className="max-w-4xl mx-auto px-6 py-20 md:py-24">
              <motion.div {...fade()} className="text-center mb-12">
                <Heart className="w-8 h-8 text-primary mx-auto mb-4 opacity-80" />
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                  Почему русскоязычная терапия онлайн<br className="hidden sm:block" /> может быть удобнее {page.cityFor}
                </h2>
                <p className="text-muted-foreground mt-3 text-sm md:text-base max-w-xl mx-auto">
                  Не «лучше местной системы» — а другой формат, который подходит части людей.
                </p>
              </motion.div>
              <div className="grid sm:grid-cols-2 gap-4">
                {page.whyRussianOnline.map((point, i) => (
                  <motion.div
                    key={i}
                    {...fade(0.05 * i)}
                    className="flex items-start gap-3 rounded-xl border border-border bg-card p-5"
                  >
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <p className="text-sm leading-relaxed text-muted-foreground">{point}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Help routes (local system + steps) ── */}
        {page.helpRoutes && page.helpRoutes.length > 0 && (
          <section className="bg-card border-y border-border">
            <div className="max-w-4xl mx-auto px-6 py-20 md:py-24">
              <motion.div {...fade()} className="text-center mb-12">
                <Compass className="w-8 h-8 text-primary mx-auto mb-4 opacity-80" />
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                  Маршрут помощи в {page.country === "Германия" ? "Германии" : page.country === "Грузия" ? "Грузии" : page.country === "Молдова" ? "Молдове" : page.country === "Нидерланды" ? "Нидерландах" : page.country === "Португалия" ? "Португалии" : page.country}
                </h2>
                <p className="text-muted-foreground mt-3 text-sm md:text-base max-w-xl mx-auto">
                  Не каждому нужен именно я. Вот как выбрать формат под вашу ситуацию.
                </p>
              </motion.div>
              <div className="space-y-3">
                {page.helpRoutes.map((r, i) => (
                  <motion.div
                    key={i}
                    {...fade(0.05 * i)}
                    className={`rounded-xl border p-5 ${
                      i === 0 ? "border-destructive/30 bg-destructive/5" : "border-border bg-background"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {i === 0 ? (
                        <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
                      ) : (
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0 mt-0.5">
                          {i}
                        </span>
                      )}
                      <div className="space-y-1.5">
                        <h3 className="text-sm font-semibold">{r.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{r.text}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              {page.localSystem && (
                <motion.div {...fade(0.3)} className="mt-8 rounded-xl border border-border bg-background p-5 text-xs text-muted-foreground leading-relaxed">
                  <p className="font-semibold text-foreground mb-2">Контекст по страховке и системе</p>
                  <p className="mb-1"><span className="font-medium text-foreground">Страховка:</span> {page.localSystem.insurance}</p>
                  <p className="mb-1"><span className="font-medium text-foreground">Публичный путь:</span> {page.localSystem.publicRoute}</p>
                  <p className="mb-1"><span className="font-medium text-foreground">Частный путь:</span> {page.localSystem.privateRoute}</p>
                  <p className="mt-2 italic opacity-80">{page.localSystem.disclaimer}</p>
                </motion.div>
              )}
            </div>
          </section>
        )}









        <AboutEvidence />
        <Approach />
        <Specializations />

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
            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {[
                {
                  title: "Разовая консультация",
                  price: "40",
                  duration: "50 мин",
                  featured: true,
                  features: ["Разбор запроса", "План работы", "Домашние задания"],
                },
                {
                  title: "Стартовый курс — 4 сессии",
                  price: "35",
                  priceNote: "за сессию",
                  totalPrice: "140 € за 4 сессии",
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




        <Ethics />
        <Projects />
        <SessionPrep />

        {/* ── Related articles (city-specific) ── */}
        {relatedArticles.length > 0 ? (
          <section className="max-w-5xl mx-auto px-6 py-20 md:py-24">
            <motion.div {...fade()} className="text-center mb-10">
              <BookOpen className="w-7 h-7 text-primary mx-auto mb-3 opacity-80" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                Что почитать, если вы живёте {page.cityIn}
              </h2>
              <p className="text-muted-foreground mt-3 text-sm md:text-base max-w-xl mx-auto">
                Статьи под темы, с которыми чаще всего обращаются из {page.city === "Кишинёв" ? "Молдовы" : page.country}.
              </p>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {relatedArticles.map((post, i) => (
                <motion.div key={post.slug} {...fade(0.05 * i)}>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="block rounded-xl border border-border bg-card p-5 h-full hover:border-primary/40 transition-colors group"
                  >
                    <h3 className="text-sm font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{post.description}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to="/blog" className="text-sm text-primary hover:underline">
                Все статьи блога →
              </Link>
            </div>
          </section>
        ) : (
          <Blog />
        )}

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

        <BookingForm />





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
