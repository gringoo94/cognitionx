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
        <Link to="/tools/tests/atq-thoughts" className="text-primary hover:underline">ATQ</Link>).
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
        <Link to="/contact" className="text-primary hover:underline">запишитесь на консультацию</Link>.
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
    a: "Если балл низкий — поддерживайте текущие привычки. Если средний — попробуйте 2–3 недели сосредоточенной самопомощи (КПТ-инструменты на сайте). Если высокий — запишитесь на консультацию.",
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

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: hubFaq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="Психологические тесты онлайн бесплатно — валидированные шкалы"
        description="Бесплатные психологические тесты онлайн: PHQ-9, BDI-II, BAI, BHS (шкалы Бека), GAD-7, PCL-5, ISI, ECR-R, Большая пятёрка (BFI-10), WHO-5 и другие валидированные опросники."
        path="/tools/tests"
        schema={[itemListSchema, faqSchema]}
        breadcrumbs={[
          { name: "Главная", url: `${SITE_URL}/` },
          { name: "Инструменты", url: `${SITE_URL}/tools` },
          { name: "Тесты", url: `${SITE_URL}/tools/tests` },
        ]}
      />
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 pt-28 pb-20">
        <Link
          to="/tools"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Все инструменты
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10 max-w-2xl"
        >
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            Психологические тесты онлайн — 17 валидированных шкал
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed mb-4">
            Скрининги, которыми пользуются психологи и врачи во всём мире: депрессия, тревога,
            ПТСР, выгорание, стресс, бессонница, алкоголь, самооценка, перфекционизм, привязанность,
            личность по Большой пятёрке и КПТ-инструменты. Бесплатно, анонимно, без регистрации.
            Каждый тест занимает от 2 до 7 минут и завершается понятной интерпретацией с PDF-отчётом
            для психолога.
          </p>
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Бесплатно
            </span>
            <span className="text-border">•</span>
            <span className="inline-flex items-center gap-1">
              <Lock className="h-3 w-3" /> Ответы не сохраняются
            </span>
            <span className="text-border">•</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" /> 2–7 минут
            </span>
          </div>
        </motion.div>

        <div className="flex flex-wrap gap-2 mb-8">
          {clusters.map((c) => (
            <button
              key={c.key}
              onClick={() => setFilter(c.key)}
              className={cn(
                "text-xs px-3 py-1.5 rounded-full border transition-colors",
                filter === c.key
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((t, i) => (
            <motion.div
              key={t.slug}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
            >
              <Link
                to={`/tools/tests/${t.slug}`}
                className="group block h-full rounded-2xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase tracking-wide font-semibold text-primary">
                    {t.code}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                    {t.clusterLabel}
                  </span>
                </div>
                <h2 className="text-base font-semibold text-foreground mb-2 group-hover:text-primary transition-colors leading-snug">
                  {t.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                  {t.tagline}
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {t.durationMin} мин · {t.questions.length} вопр.
                  </span>
                  <span className="inline-flex items-center gap-1 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Пройти <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* SEO content sections */}
        <section className="mt-16 space-y-8">
          {seoSections.map((s) => (
            <article key={s.h2}>
              <h2 className="text-xl font-semibold text-foreground mb-3">{s.h2}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
            </article>
          ))}
        </section>

        {/* FAQ */}
        <section className="mt-16">
          <h2 className="text-xl font-semibold text-foreground mb-4">Частые вопросы</h2>
          <Accordion type="single" collapsible className="space-y-3">
            {hubFaq.map((f, i) => (
              <AccordionItem
                key={i}
                value={`hub-faq-${i}`}
                className="border border-border rounded-xl px-5 data-[state=open]:border-primary/20 transition-colors"
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

        <div className="mt-12 rounded-2xl border border-border bg-muted/30 p-6 text-sm text-muted-foreground leading-relaxed">
          <p>
            <strong className="text-foreground">Важно.</strong> Все представленные шкалы — это{" "}
            <em>скрининговые инструменты</em>, а не диагностика. Они помогают понять, насколько выражены
            те или иные симптомы, но не ставят диагноз. Диагноз психического расстройства может поставить
            только врач — психотерапевт или психиатр — после клинического интервью.
          </p>
          <p className="mt-3">
            Если результат вас встревожил — это веский повод обратиться за консультацией. Я работаю с
            этими темами в формате КПТ и схема-терапии.{" "}
            <Link to="/contact" className="text-primary hover:underline">
              Записаться
            </Link>
            .
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TestsHub;
