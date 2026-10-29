import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { tests } from "@/data/tests";
import { ArrowLeft, ArrowRight, Clock, Lock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { SITE_URL } from "@/lib/globalSchema";
import TestHistoryWidget from "@/components/tests/TestHistoryWidget";

const clusters = [
  { key: "all", label: "Все" },
  { key: "depression", label: "Депрессия" },
  { key: "anxiety", label: "Тревога" },
  { key: "trauma", label: "Травма / ПТСР" },
  { key: "burnout", label: "Выгорание" },
  { key: "stress", label: "Стресс" },
  { key: "sleep", label: "Сон" },
  { key: "addiction", label: "Зависимости" },
  { key: "eating", label: "Пищевое поведение" },
  { key: "self-esteem", label: "Самооценка" },
  { key: "relationships", label: "Отношения" },
  { key: "personality", label: "Личность" },
  { key: "it", label: "Для IT" },
  { key: "cbt-tools", label: "КПТ-инструменты" },
] as const;

const seoSections = [
  {
    h2: "Тесты на депрессию",
    body: (
      <>
        Самый известный скрининг депрессии — <Link to="/tools/tests/phq-9" className="text-primary hover:underline">PHQ-9</Link>,
        построенный прямо по критериям DSM-5. Он занимает 3 минуты и используется врачами по всему
        миру. Если вы подозреваете депрессию, стоит проверить и сопутствующие состояния — тревогу
        (<Link to="/tools/tests/gad-7" className="text-primary hover:underline">GAD-7</Link>) и стресс
        (<Link to="/tools/tests/pss-10" className="text-primary hover:underline">PSS-10</Link>): они
        часто идут вместе. Подробнее в статье{" "}
        <Link to="/blog/kak-ponyat-chto-u-menya-depressiya" className="text-primary hover:underline">
          «Как понять, что у меня депрессия»
        </Link>
        .
      </>
    ),
  },
  {
    h2: "Тесты на тревогу и панику",
    body: (
      <>
        <Link to="/tools/tests/gad-7" className="text-primary hover:underline">GAD-7</Link> — золотой
        стандарт скрининга генерализованной тревоги, 7 вопросов. Если ваша тревога сосредоточена в
        теле, попробуйте оценить уровень стресса (<Link to="/tools/tests/pss-10" className="text-primary hover:underline">PSS-10</Link>) и
        проверьте автоматические мысли (
        <Link to="/tools/tests/atq-automatic-thoughts" className="text-primary hover:underline">ATQ</Link>).
        Если тревога после травматического события — пройдите{" "}
        <Link to="/tools/tests/pcl-5" className="text-primary hover:underline">PCL-5</Link>.
      </>
    ),
  },
  {
    h2: "Тесты на ПТСР и последствия травмы",
    body: (
      <>
        <Link to="/tools/tests/pcl-5" className="text-primary hover:underline">PCL-5</Link> —
        официальный скрининговый тест на посттравматическое стрессовое расстройство по критериям
        DSM-5. 20 пунктов охватывают все 4 кластера симптомов: вторжение, избегание, негативные
        изменения и гиперактивацию. Травма-сфокусированная КПТ и EMDR — методы первой линии для
        работы с ПТСР.
      </>
    ),
  },
  {
    h2: "Тесты на бессонницу и проблемы со сном",
    body: (
      <>
        <Link to="/tools/tests/isi" className="text-primary hover:underline">ISI</Link> (Insomnia
        Severity Index) — короткий валидированный тест на бессонницу. КПТ-И (CBT-I) — научно
        обоснованный метод первой линии при хронической инсомнии, эффективнее снотворных в
        долгосрочной перспективе.
      </>
    ),
  },
  {
    h2: "Тесты для отношений и привязанности",
    body: (
      <>
        Стили привязанности можно оценить с помощью{" "}
        <Link to="/tools/tests/ecr-r-12" className="text-primary hover:underline">ECR-R</Link>:
        тревожный, избегающий, надёжный или дезорганизованный. Эти паттерны формируются в раннем
        детстве, но не зафиксированы навсегда — концепция «заработанной безопасности» показывает,
        что значимые отношения и психотерапия меняют стиль во взрослом возрасте.
      </>
    ),
  },
  {
    h2: "Личностные тесты и Большая пятёрка",
    body: (
      <>
        Если вы ищете научный профиль личности — пройдите{" "}
        <Link to="/tools/tests/bfi-10" className="text-primary hover:underline">BFI-10</Link>{" "}
        (Большая пятёрка). В отличие от MBTI, Big Five — академический стандарт с высокой
        ретест-надёжностью и доказанной предсказательной валидностью. Подробнее:{" "}
        <Link to="/blog/big-five-vs-mbti" className="text-primary hover:underline">
          Большая пятёрка vs MBTI
        </Link>
        .
      </>
    ),
  },
  {
    h2: "Самооценка, перфекционизм и КПТ-инструменты",
    body: (
      <>
        Шкала Розенберга (<Link to="/tools/tests/rosenberg-self-esteem" className="text-primary hover:underline">RSE</Link>)
        для самооценки, FMPS (<Link to="/tools/tests/fmps-perfectionism" className="text-primary hover:underline">шкала Фроста</Link>)
        для перфекционизма, ATQ для негативных мыслей, RRS для руминаций и DERS-16 для оценки
        эмоциональной регуляции — всё, что нужно для самостоятельной диагностики мишеней КПТ.
      </>
    ),
  },
  {
    h2: "Благополучие, устойчивость и осознанность",
    body: (
      <>
        <Link to="/tools/tests/who-5" className="text-primary hover:underline">WHO-5</Link> от ВОЗ —
        короткий индекс эмоционального благополучия за минуту.{" "}
        <Link to="/tools/tests/cd-risc-10" className="text-primary hover:underline">CD-RISC-10</Link>{" "}
        оценивает психологическую устойчивость к стрессу, а{" "}
        <Link to="/tools/tests/maas" className="text-primary hover:underline">MAAS</Link> — уровень
        осознанности в повседневной жизни. Три коротких теста, которые удобно использовать как точку
        отсчёта перед терапией или практикой mindfulness.
      </>
    ),
  },
  {
    h2: "Скрининг ОКР, социофобии и биполярного спектра",
    body: (
      <>
        <Link to="/tools/tests/ybocs-sr" className="text-primary hover:underline">Y-BOCS-SR</Link> —
        золотой стандарт оценки обсессивно-компульсивных симптомов.{" "}
        <Link to="/tools/tests/spin" className="text-primary hover:underline">SPIN</Link> —
        скрининг социального тревожного расстройства.{" "}
        <Link to="/tools/tests/mdq" className="text-primary hover:underline">MDQ</Link> —
        скрининг биполярного расстройства (важно проверять при «странной» депрессии с эпизодами
        подъёма энергии).
      </>
    ),
  },
  {
    h2: "Шкалы Бека: классика когнитивной терапии",
    body: (
      <>
        Аарон Бек, основатель КПТ, разработал семейство шкал, которые до сих пор используются во
        всём мире.{" "}
        <Link to="/tools/tests/bdi-2" className="text-primary hover:underline">BDI-II</Link> —
        подробная шкала депрессии из 21 пункта, дополняющая короткий{" "}
        <Link to="/tools/tests/phq-9" className="text-primary hover:underline">PHQ-9</Link>.{" "}
        <Link to="/tools/tests/bai" className="text-primary hover:underline">BAI</Link> — шкала
        тревоги с фокусом на соматических симптомах: помогает отличить тревогу от депрессии.{" "}
        <Link to="/tools/tests/bhs" className="text-primary hover:underline">BHS</Link> — шкала
        безнадёжности, важный индикатор риска при депрессии и одна из основных мишеней КПТ.
      </>
    ),
  },
  {
    h2: "Пищевое поведение и одиночество",
    body: (
      <>
        <Link to="/tools/tests/eat-26" className="text-primary hover:underline">EAT-26</Link> —
        самый используемый скрининг расстройств пищевого поведения.{" "}
        <Link to="/tools/tests/ucla-3" className="text-primary hover:underline">UCLA Loneliness</Link>{" "}
        — классическая шкала чувства одиночества. Оба теста закрывают темы, о которых редко
        говорят, но которые сильно влияют на психическое и физическое здоровье.
      </>
    ),
  },
  {
    h2: "Когда тест — это не диагноз",
    body: (
      <>
        Все шкалы на этой странице — скрининговые. Они помогают понять, насколько выражены симптомы,
        и принять решение, стоит ли обратиться. Диагноз ставится врачом-психиатром или
        психотерапевтом после клинического интервью. Если результат вас встревожил —{" "}
        <Link to="/booking" className="text-primary hover:underline">запишитесь на консультацию</Link>.
      </>
    ),
  },
];

const hubFaq = [
  {
    q: "Все ли тесты бесплатные и анонимные?",
    a: "Да. Ни один тест не требует регистрации, не сохраняет ответы на сервере и не передаёт данные третьим лицам. Результат виден только вам.",
  },
  {
    q: "Какой тест пройти, если я не понимаю, что со мной?",
    a: "Начните с PHQ-9 (депрессия) и GAD-7 (тревога) — это «базовая пара», которая покрывает самые частые жалобы. Дальше можно перейти к более специфическим: PCL-5 (травма), ISI (сон), DERS-16 (регуляция эмоций).",
  },
  {
    q: "Тесты заменяют визит к психологу?",
    a: "Нет. Это скрининг — он показывает выраженность симптомов, но не ставит диагноз. Диагноз и план лечения возможны только после клинического интервью со специалистом.",
  },
  {
    q: "Можно ли проходить тесты регулярно?",
    a: "Да. PHQ-9, GAD-7, PSS-10, ISI и DERS-16 разработаны в том числе для мониторинга динамики. Психотерапевты часто просят пациентов проходить их каждые 2 недели.",
  },
  {
    q: "Откуда взяты тесты и насколько они надёжны?",
    a: "Все шкалы — валидированные опросники из научной литературы: PHQ-9 (Kroenke et al.), GAD-7 (Spitzer et al.), PCL-5 (National Center for PTSD), AUDIT (ВОЗ), Rosenberg, FMPS, ECR-R, BFI-10, DERS-16. Источники указаны на каждой странице.",
  },
  {
    q: "Что делать с результатом?",
    a: "Если балл низкий — поддерживайте текущие привычки. Если средний — можно попробовать упражнения КПТ на сайте и понаблюдать за динамикой. Если высокий — стоит обсудить результат со специалистом.",
  },
  {
    q: "Можно ли скачать результат?",
    a: "Да. На странице каждого теста после результата есть кнопка «Скачать PDF-отчёт» — с ответами, баллами по подшкалам и интерпретацией. Подходит, чтобы поделиться с психологом или врачом.",
  },
  {
    q: "Есть ли тест на MBTI?",
    a: "Нет — MBTI не признан современной академической психологией: низкая ретест-надёжность, отсутствие доказанной предсказательной валидности. Вместо этого используйте BFI-10 (Большая пятёрка) — научный стандарт.",
  },
];

const TestsHub = () => {
  const [filter, setFilter] = useState<(typeof clusters)[number]["key"]>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return tests;
    return tests.filter((t) => t.cluster === filter);
  }, [filter]);

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Психологические тесты онлайн",
    itemListElement: [
      ...tests.map((t, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE_URL}/tools/tests/${t.slug}`,
        name: t.title,
      })),
      {
        "@type": "ListItem",
        position: tests.length + 1,
        url: `${SITE_URL}/tools/schema-quiz`,
        name: "Опросник ранних дезадаптивных схем (YSQ)",
      },
    ],
  };

  // FAQPage schema removed: Google deprecated FAQ rich results (May 2026).
  // The visible FAQ section stays for users; no need to emit structured data.

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="Психологические тесты онлайн бесплатно — около 30 шкал с расшифровкой"
        description="Бесплатные психологические тесты онлайн: PHQ-9, BDI-II, BAI, BHS (шкалы Бека), GAD-7, PCL-5, ISI, ECR-R, Большая пятёрка (BFI-10), WHO-5 и другие валидированные опросники."
        path="/tools/tests"
        schema={[itemListSchema]}
        breadcrumbs={[
          { name: "Главная", url: `${SITE_URL}/` },
          { name: "Инструменты", url: `${SITE_URL}/tools` },
          { name: "Тесты", url: `${SITE_URL}/tools/tests` },
        ]}
      />
      <Navbar />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent" />
          <div className="relative max-w-6xl mx-auto px-6 pt-28 pb-12 md:pt-32 md:pb-16 grid lg:grid-cols-[1.4fr_1fr] gap-10 items-center">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <Link
                to="/tools"
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary mb-6 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Все инструменты
              </Link>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-5 leading-[1.1]">
                Психологические тесты <span className="text-primary">онлайн</span> бесплатно
              </h1>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6 max-w-2xl">
                Скрининги, которыми пользуются психологи и врачи во всём мире: депрессия, тревога,
                ПТСР, выгорание, стресс, бессонница, алкоголь, самооценка, перфекционизм, привязанность,
                личность по Большой пятёрке и КПТ-инструменты. Бесплатно, анонимно, без регистрации.
                Каждый тест занимает от 2 до 7 минут и завершается понятной интерпретацией с PDF-отчётом
                для психолога.
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                {[
                  { icon: Sparkles, label: "Бесплатно" },
                  { icon: Lock, label: "Ответы не сохраняются" },
                  { icon: Clock, label: "2–7 минут" },
                ].map(({ icon: Icon, label }) => (
                  <span key={label} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5">
                    <Icon className="h-3.5 w-3.5 text-primary" /> {label}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="rounded-3xl border border-primary/20 bg-card p-6 shadow-xl shadow-primary/5"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary mb-2">
                Не знаете, с чего начать?
              </p>
              <p className="text-sm text-muted-foreground mb-5">
                Базовая пара покрывает самые частые жалобы — займёт около 5 минут.
              </p>
              <div className="space-y-3">
                {["phq-9", "gad-7"].map((slug) => {
                  const t = tests.find((x) => x.slug === slug);
                  if (!t) return null;
                  return (
                    <Link
                      key={slug}
                      to={`/tools/tests/${slug}`}
                      className="group flex items-center gap-4 rounded-2xl border border-border bg-background p-4 hover:border-primary/40 transition-colors"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xs font-bold text-primary">
                        {t.code}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                          {t.clusterLabel}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          {t.durationMin} мин · {t.questions.length} вопросов
                        </span>
                      </span>
                      <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  );
                })}
              </div>
              <p className="mt-5 text-xs text-muted-foreground">
                Всего {tests.length} валидированных шкал
              </p>
            </motion.div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-6 pt-10 pb-20">
        <TestHistoryWidget />

        {/* Filters */}
        <div className="sticky top-16 z-20 -mx-6 px-6 py-3 mb-6 bg-background/90 backdrop-blur border-b border-border/60">
          <div className="flex gap-2 overflow-x-auto md:flex-wrap pb-1 md:pb-0">
            {clusters.map((c) => {
              const count = c.key === "all" ? tests.length : tests.filter((t) => t.cluster === c.key).length;
              if (count === 0) return null;
              const active = filter === c.key;
              return (
                <button
                  key={c.key}
                  onClick={() => setFilter(c.key)}
                  className={cn(
                    "shrink-0 inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-colors",
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
                  )}
                >
                  {c.label}
                  <span className={cn("text-[10px] tabular-nums", active ? "opacity-80" : "text-muted-foreground/70")}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((t, i) => (
            <motion.div
              key={t.slug}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(i, 12) * 0.03 }}
            >
              <Link
                to={`/tools/tests/${t.slug}`}
                className="group flex flex-col h-full rounded-2xl border border-border bg-card p-5 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-bold tracking-wide text-primary bg-primary/10 rounded-md px-2 py-1">
                    {t.code}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                    {t.clusterLabel}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2 group-hover:text-primary transition-colors leading-snug">
                  {t.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                  {t.tagline}
                </p>
                <div className="mt-auto flex items-center justify-between text-xs pt-3 border-t border-border/60">
                  <span className="text-muted-foreground inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {t.durationMin} мин · {t.questions.length} вопр.
                  </span>
                  <span className="inline-flex items-center gap-1 font-medium text-primary">
                    Пройти <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Practice bridge */}
        <div className="mt-12 rounded-3xl border border-border bg-card p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-foreground mb-2">После теста — к практике</h2>
            <p className="text-sm text-muted-foreground">
              Результат показывает, с чем работать. Упражнения КПТ помогают начать уже сегодня.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { to: "/tools/abc-analysis", label: "ABC-анализ" },
              { to: "/tools/thought-diary", label: "Дневник мыслей" },
              { to: "/tools/behavioral-activation", label: "Поведенческая активация" },
              { to: "/tools/breathing", label: "Дыхание" },
              { to: "/tools", label: "Все упражнения КПТ онлайн" },
            ].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-sm rounded-full border border-border bg-background px-4 py-2 text-foreground hover:border-primary/40 hover:text-primary transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* SEO content sections */}
        <section className="mt-16">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-8">
            Какой тест выбрать
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            {seoSections.map((s) => (
              <article key={s.h2} className="rounded-2xl border border-border bg-card p-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">{s.h2}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-16 grid lg:grid-cols-[1fr_2fr] gap-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-3">Частые вопросы</h2>
            <p className="text-sm text-muted-foreground">О приватности, точности и том, что делать с результатом.</p>
          </div>
          <Accordion type="single" collapsible className="space-y-3">
            {hubFaq.map((f, i) => (
              <AccordionItem
                key={i}
                value={`hub-faq-${i}`}
                className="border border-border bg-card rounded-xl px-5 data-[state=open]:border-primary/30 transition-colors"
              >
                <AccordionTrigger className="text-sm font-medium text-left py-4 hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <div className="mt-12 rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 to-transparent p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1 text-sm text-muted-foreground leading-relaxed">
            <p>
              <strong className="text-foreground">Важно.</strong> Все представленные шкалы — это{" "}
              <em>скрининговые инструменты</em>, а не диагностика. Диагноз психического расстройства может
              поставить только врач — психотерапевт или психиатр — после клинического интервью.
            </p>
            <p className="mt-3">
              Если результат вас встревожил, его можно обсудить на консультации. Я работаю с этими темами
              в формате КПТ и схема-терапии.
            </p>
          </div>
          <Link
            to="/booking"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Записаться на консультацию <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TestsHub;
