import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Sparkles, Brain, BookOpen, Target, Leaf, Zap,
  Shield, AlertTriangle, Lightbulb, Compass, Heart, Check, X, ChevronDown,
  TrendingUp, Activity,
} from "lucide-react";
import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogSubscribeForm from "@/components/BlogSubscribeForm";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, delay },
});

const modules = [
  { icon: Brain, title: "Диагностика депрессии и тревоги", desc: "Оценка симптомов в четырёх плоскостях: мысли, эмоции, тело, поведение. Помогает увидеть, как они подпитывают друг друга." },
  { icon: BookOpen, title: "ABC-модель Эллиса", desc: "Раскладываете ситуацию: активирующее событие → убеждение → последствия → диспут → новый взгляд. База когнитивной терапии." },
  { icon: Target, title: "SMART-цели", desc: "Конкретные, измеримые, достижимые, релевантные и ограниченные по времени цели — для терапии и для жизни." },
  { icon: Leaf, title: "Изменение образа жизни", desc: "Работа с базой: сон, питание, движение, социальные связи. То, что в КПТ называют biological CBT." },
  { icon: Zap, title: "Поведенческая активация", desc: "Метод первой линии при депрессии: возвращаете в жизнь активности, дающие удовольствие и чувство мастерства." },
  { icon: Shield, title: "Работа со страхами", desc: "Иерархия страхов и постепенная экспозиция — золотой стандарт работы с фобиями и тревожными расстройствами." },
  { icon: AlertTriangle, title: "Контейнирование тревоги", desc: "«Время для тревоги», дерево решений, разделение продуктивного и непродуктивного беспокойства." },
  { icon: Lightbulb, title: "Решение проблем", desc: "Структурированный problem solving: определение, варианты, оценка, план действий — техника с 50-летней доказательной базой." },
  { icon: Compass, title: "Оспаривание мыслей", desc: "Поиск автоматических мыслей, распознавание когнитивных искажений и формулирование сбалансированных альтернатив." },
  { icon: Heart, title: "План благополучия", desc: "Личный wellbeing blueprint: ресурсы, ранние сигналы ухудшения, стратегии поддержания, кризисный план." },
];

const faqs = [
  {
    q: "Это правда бесплатно?",
    a: "Да, доступ к воркбуку бесплатный. Это часть моей публичной практики: чем больше людей получают доказательные техники в открытом доступе, тем меньше страданий вокруг — и тем понятнее им потом, чего ждать от очной терапии.",
  },
  {
    q: "Чем это отличается от обычного дневника или mood-трекера в App Store?",
    a: "Большинство популярных приложений собирают эмодзи настроения и ничего с ними не делают. CBT Workbook структурирован вокруг конкретных протоколов КПТ (Beck, Ellis, Lewinsohn, Padesky) — то есть каждое упражнение имеет цель, форму и опору на исследования.",
  },
  {
    q: "Нужна ли регистрация?",
    a: "Регистрация нужна, чтобы сохранять прогресс между сессиями и видеть динамику настроения за недели. Без неё инструменты тоже работают, но как одноразовые рабочие листы.",
  },
  {
    q: "Можно ли использовать без терапевта?",
    a: "Да, многие техники КПТ изначально создавались как self-help. Но если у вас выраженная депрессия, суицидальные мысли, тревога, мешающая жить, или ПТСР — самостоятельная работа не заменит терапию. Воркбук в этом случае — дополнение, а не альтернатива.",
  },
  {
    q: "Это медицинский продукт?",
    a: "Нет. CBT Workbook — образовательный инструмент. Он не ставит диагнозы и не заменяет консультацию врача или психолога. Если состояние ухудшается — обратитесь к специалисту.",
  },
  {
    q: "Что с приватностью данных?",
    a: "Данные хранятся в зашифрованной базе, доступ — только у вас. Ни email, ни записи не передаются третьим сторонам. Удалить аккаунт и все записи можно в один клик из настроек.",
  },
  {
    q: "На каких устройствах работает?",
    a: "Это веб-приложение — открывается в любом браузере на телефоне, планшете и компьютере. Отдельного нативного приложения пока нет, но интерфейс адаптирован под мобильные.",
  },
  {
    q: "Когда будет доступ?",
    a: "Сейчас идёт закрытая бета. Оставьте email — пришлю инвайт, как только откроем регистрацию. Спама не будет: одно письмо при запуске и потом раз в пару месяцев — об апдейтах.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left"
      >
        <span className="text-sm md:text-base font-medium text-foreground pr-4">{q}</span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        className="overflow-hidden"
      >
        <p className="text-sm text-muted-foreground pb-5 leading-relaxed">{a}</p>
      </motion.div>
    </div>
  );
}

const CbtWorkbookPage = () => {
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "CBT Workbook",
    description:
      "Бесплатная цифровая рабочая тетрадь по когнитивно-поведенческой терапии: 10 модулей, трекер настроения, упражнения по протоколам Beck, Ellis, Lewinsohn.",
    applicationCategory: "HealthApplication",
    operatingSystem: "Web",
    inLanguage: "ru",
    url: "https://cognitionx.cloud/cbtworkbook",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
    author: {
      "@type": "Person",
      name: "Дмитрий Яцко",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="CBT Workbook — бесплатная цифровая тетрадь по КПТ онлайн"
        description="Бесплатный CBT воркбук: 10 модулей когнитивно-поведенческой терапии, трекер настроения, упражнения при депрессии и тревоге. Доказательные техники онлайн."
        path="/cbtworkbook"
        schema={[softwareSchema, faqSchema]}
        breadcrumbs={[
          { name: "Главная", url: "https://cognitionx.cloud/" },
          { name: "Инструменты", url: "https://cognitionx.cloud/tools" },
          { name: "CBT Workbook", url: "https://cognitionx.cloud/cbtworkbook" },
        ]}
      />
      <Navbar />

      <main>
        {/* HERO */}
        <section className="max-w-4xl mx-auto px-6 pt-12 md:pt-20 pb-16 md:pb-24 text-center">
          <Link to="/tools" className="inline-block mb-6">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> Все инструменты
            </Button>
          </Link>

          <motion.div
            {...fade(0)}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-xs font-medium text-primary mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Beta · Бесплатно · Без рекламы
          </motion.div>

          <motion.h1
            {...fade(0.05)}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.08]"
          >
            CBT Workbook —<br />
            <span className="text-primary">тетрадь по КПТ</span> онлайн
          </motion.h1>

          <motion.p
            {...fade(0.1)}
            className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            10 структурированных модулей когнитивно-поведенческой терапии,
            трекер настроения и упражнения, основанные на протоколах Beck, Ellis и Lewinsohn.
            Бесплатно, на русском, в браузере.
          </motion.p>

          <motion.div
            {...fade(0.15)}
            className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Button size="lg" className="gap-2 text-base px-8 hover:scale-[1.02] transition-all" asChild>
              <a href="#waitlist">
                Получить ранний доступ <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
            <Button variant="outline" size="lg" className="text-base px-8" asChild>
              <Link to="/contact">Записаться на консультацию</Link>
            </Button>
          </motion.div>

          <motion.p {...fade(0.2)} className="mt-4 text-xs text-muted-foreground">
            Закрытая бета · Инвайт придёт на email · Можно отписаться в любой момент
          </motion.p>
        </section>

        {/* WHAT IS IT */}
        <section className="border-y border-border bg-card/40">
          <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
            <motion.div {...fade()}>
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Что такое CBT Workbook</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Когнитивно-поведенческая терапия (КПТ) — это самый изученный психотерапевтический подход
                  в мире. За 60+ лет накопились сотни клинических исследований и стандартизированные
                  протоколы для депрессии, тревоги, панических атак, ОКР, ПТСР, бессонницы, зависимостей.
                  Эти протоколы давно перестали быть «секретом терапевтов» — большая их часть открыта,
                  описана в книгах и активно используется как self-help.
                </p>
                <p>
                  CBT Workbook собирает эти техники в одном месте и превращает их из бумажных рабочих
                  листов в интерактивные упражнения с сохранением прогресса. Это не «приложение для
                  настроения» с эмодзи — это рабочая тетрадь, которую вы заполняете последовательно,
                  глава за главой, как при работе с терапевтом по протоколу.
                </p>
                <p>
                  Воркбук подходит, если вы хотите разобраться в собственных мыслях и поведении,
                  готовитесь к терапии, идёте параллельно с терапевтом или уже завершили курс и хотите
                  поддерживать навыки. Он не заменяет лечение при тяжёлых состояниях, но даёт структуру
                  и язык, на котором с собой можно разговаривать.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 3 STEPS */}
        <section className="max-w-5xl mx-auto px-6 py-16 md:py-24">
          <motion.div {...fade()} className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold">Как это устроено</h2>
            <p className="text-muted-foreground mt-3 text-sm md:text-base max-w-xl mx-auto">
              Три цикла, которые повторяются каждую неделю.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: TrendingUp, n: "01", title: "Отслеживайте настроение", desc: "Короткий ежедневный чек-ин: настроение, энергия, тревога. Через две недели появляется график, на котором видно паттерны: что подкручивает вниз, что вытягивает." },
              { icon: Activity, n: "02", title: "Делайте упражнения", desc: "Каждый модуль — это последовательность шагов. Не «прочитайте теорию», а «заполните, подумайте, попробуйте». Прогресс сохраняется, к упражнениям можно возвращаться." },
              { icon: Heart, n: "03", title: "Видите динамику", desc: "Через месяц на дашборде накапливается ваша история: какие техники сработали, какие убеждения поменялись, какие активности дают энергию. Это и есть терапевтическая работа." },
            ].map((s, i) => (
              <motion.div
                key={s.n}
                {...fade(0.05 * i)}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <s.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-3xl font-bold text-primary/15 font-mono">{s.n}</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 10 MODULES */}
        <section className="bg-card/40 border-y border-border">
          <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
            <motion.div {...fade()} className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold">10 модулей</h2>
              <p className="text-muted-foreground mt-3 text-sm md:text-base max-w-2xl mx-auto">
                Полный курс рассчитан на 8–12 недель работы по 1–2 модулю в неделю.
                Можно проходить последовательно или брать только то, что актуально.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {modules.map((m, i) => (
                <motion.div
                  key={m.title}
                  {...fade(0.04 * i)}
                  className="rounded-xl border border-border bg-background p-5 hover:border-primary/30 transition-colors"
                >
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <m.icon className="h-4.5 w-4.5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1.5">{m.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{m.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* EVIDENCE */}
        <section className="max-w-3xl mx-auto px-6 py-16 md:py-24">
          <motion.div {...fade()}>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">На чём это основано</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Когнитивно-поведенческая терапия — терапия первой линии для большинства распространённых
                расстройств по рекомендациям{" "}
                <a href="https://www.nice.org.uk/guidance" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  NICE (Великобритания)
                </a>
                ,{" "}
                <a href="https://www.apa.org/depression-guideline" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  APA (США)
                </a>
                {" "}и ВОЗ. Это значит, что прежде чем назначать антидепрессанты при лёгкой и умеренной
                депрессии, врачу рекомендовано предложить именно КПТ.
              </p>
              <p>
                Каждый модуль воркбука основан на конкретных протоколах:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong className="text-foreground">Когнитивная терапия Аарона Бека</strong> — оспаривание автоматических мыслей, выявление искажений.</li>
                <li><strong className="text-foreground">REBT Альберта Эллиса</strong> — модель ABC, работа с иррациональными убеждениями.</li>
                <li><strong className="text-foreground">Поведенческая активация Левинсона/Якобсона</strong> — выход из спирали избегания при депрессии.</li>
                <li><strong className="text-foreground">Экспозиционная терапия</strong> — работа со страхами через постепенное приближение.</li>
                <li><strong className="text-foreground">Problem Solving Therapy Незу</strong> — структурированный подход к жизненным проблемам.</li>
                <li><strong className="text-foreground">Когнитивная модель Падески</strong> — пятифакторная модель «мысль–эмоция–тело–поведение–среда».</li>
              </ul>
              <p>
                Метаанализы показывают, что для депрессии и тревоги эффективность структурированных
                self-help программ КПТ — особенно с поддержкой даже минимального контакта — сравнима с
                полноценной терапией при лёгких и умеренных формах. То есть это не «слабая замена», а
                рабочий инструмент.
              </p>
            </div>
          </motion.div>
        </section>

        {/* COMPARISON */}
        <section className="bg-card/40 border-y border-border">
          <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
            <motion.div {...fade()} className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold">Чем отличается от других решений</h2>
            </motion.div>

            <motion.div {...fade(0.05)} className="overflow-x-auto rounded-xl border border-border bg-background">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="px-4 sm:px-6 py-4 text-left w-[28%] font-medium text-muted-foreground"></th>
                    <th className="px-3 sm:px-6 py-4 text-center font-bold text-primary">CBT Workbook</th>
                    <th className="px-3 sm:px-6 py-4 text-center font-medium text-muted-foreground">Бумажный дневник</th>
                    <th className="px-3 sm:px-6 py-4 text-center font-medium text-muted-foreground">Mood-приложения</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Структурированные протоколы КПТ", true, false, false],
                    ["Сохранение прогресса", true, false, true],
                    ["Аналитика настроения", true, false, true],
                    ["Доступно в любой момент", true, false, true],
                    ["Бесплатно без подписки", true, true, false],
                    ["На русском языке", true, true, "Часто нет"],
                  ].map(([dim, ours, paper, app], i) => (
                    <tr key={i} className="border-b border-border last:border-0">
                      <td className="px-4 sm:px-6 py-3.5 font-medium text-foreground">{dim as string}</td>
                      <td className="px-3 sm:px-6 py-3.5 text-center">
                        {ours === true ? <Check className="h-4 w-4 text-primary inline" /> : <X className="h-4 w-4 text-muted-foreground inline" />}
                      </td>
                      <td className="px-3 sm:px-6 py-3.5 text-center text-muted-foreground">
                        {paper === true ? <Check className="h-4 w-4 inline" /> : paper === false ? <X className="h-4 w-4 inline" /> : (paper as string)}
                      </td>
                      <td className="px-3 sm:px-6 py-3.5 text-center text-muted-foreground">
                        {app === true ? <Check className="h-4 w-4 inline" /> : app === false ? <X className="h-4 w-4 inline" /> : (app as string)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </div>
        </section>

        {/* FOR WHOM */}
        <section className="max-w-4xl mx-auto px-6 py-16 md:py-24">
          <motion.div {...fade()} className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold">Кому подходит и кому — нет</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-5">
            <motion.div {...fade(0.05)} className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Check className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Подойдёт</h3>
              </div>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li>— У вас лёгкая или умеренная тревога, апатия, прокрастинация — и хочется системно с этим работать</li>
                <li>— Вы готовитесь к терапии и хотите прийти со словарём и базой</li>
                <li>— Идёте параллельно с терапевтом и хотите делать домашние задания удобнее</li>
                <li>— Закончили курс терапии и поддерживаете навыки</li>
                <li>— Любите структуру, чек-листы и письменные практики</li>
                <li>— Живёте в стране, где русскоязычная терапия дорогая или недоступная</li>
              </ul>
            </motion.div>

            <motion.div {...fade(0.1)} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <X className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-semibold">Лучше к специалисту</h3>
              </div>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li>— Тяжёлая депрессия с мыслями о смерти или самоповреждении</li>
                <li>— Активная зависимость, расстройства пищевого поведения</li>
                <li>— ПТСР, тяжёлая травматизация</li>
                <li>— Психотические симптомы</li>
                <li>— Состояния, при которых сложно концентрироваться даже на короткой задаче</li>
                <li>— Если за 2–3 недели self-help стало хуже — это не неудача, это сигнал, что нужен живой человек</li>
              </ul>
            </motion.div>
          </div>
        </section>

        {/* RELATION TO THERAPY */}
        <section className="bg-foreground text-background">
          <div className="max-w-3xl mx-auto px-6 py-16 md:py-24 text-center">
            <motion.h2 {...fade()} className="text-2xl md:text-3xl font-bold leading-tight">
              Воркбук — не замена терапии
            </motion.h2>
            <motion.p {...fade(0.05)} className="mt-6 text-base md:text-lg leading-relaxed opacity-80 max-w-2xl mx-auto">
              Никакая рабочая тетрадь не вмещает живой контакт, ту самую «третью точку зрения»,
              которая есть только у внешнего человека. Воркбук помогает структурировать собственное
              мышление и натренировать конкретные навыки. Терапия — помогает увидеть то, что вы сами
              на себе не замечаете, и проработать то, что больно держать в одиночестве.
            </motion.p>
            <motion.div {...fade(0.1)} className="mt-8">
              <Button size="lg" variant="outline" asChild className="bg-transparent border-background/30 text-background hover:bg-background hover:text-foreground">
                <Link to="/contact" className="gap-2">
                  Записаться на консультацию <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* WAITLIST */}
        <section id="waitlist" className="max-w-2xl mx-auto px-6 py-16 md:py-24 scroll-mt-20">
          <motion.div {...fade()} className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Получить доступ к бета-версии</h2>
            <p className="text-muted-foreground mt-3 text-sm md:text-base">
              Оставьте email — пришлю инвайт, как только откроем регистрацию. Одно письмо при запуске,
              потом раз в пару месяцев — об апдейтах. Без спама.
            </p>
          </motion.div>
          <motion.div {...fade(0.05)}>
            <BlogSubscribeForm
              source="cbtworkbook"
              title="Ранний доступ к CBT Workbook"
              description="Получите инвайт первым, когда откроем регистрацию в бету."
            />
          </motion.div>
        </section>

        {/* FAQ */}
        <section className="bg-card/40 border-y border-border">
          <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
            <motion.div {...fade()} className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold">Частые вопросы</h2>
            </motion.div>
            <motion.div {...fade(0.05)} className="rounded-2xl border border-border bg-background px-6">
              {faqs.map((f) => (
                <FAQItem key={f.q} q={f.q} a={f.a} />
              ))}
            </motion.div>
          </div>
        </section>

        {/* RELATED */}
        <section className="max-w-3xl mx-auto px-6 py-16 md:py-20">
          <motion.div {...fade()}>
            <h2 className="text-xl md:text-2xl font-semibold mb-5">Связанные материалы</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>→ <Link to="/tools/abc-analysis" className="text-primary hover:underline">ABC-анализ — интерактивный инструмент</Link></li>
              <li>→ <Link to="/tools/behavioral-activation" className="text-primary hover:underline">Дневник поведенческой активации</Link></li>
              <li>→ <Link to="/tools/emotion-wheel" className="text-primary hover:underline">Колесо эмоций</Link></li>
              <li>→ <Link to="/cbt-therapy" className="text-primary hover:underline">Что такое КПТ — подробная статья</Link></li>
              <li>→ <Link to="/depression" className="text-primary hover:underline">Терапия при депрессии</Link></li>
              <li>→ <Link to="/anxiety" className="text-primary hover:underline">Терапия при тревоге</Link></li>
              <li>→ <Link to="/blog" className="text-primary hover:underline">Блог о КПТ и схема-терапии</Link></li>
            </ul>
          </motion.div>
        </section>

        {/* FINAL CTA */}
        <section className="border-t border-border bg-primary/5">
          <div className="max-w-3xl mx-auto px-6 py-16 md:py-20 text-center">
            <motion.h2 {...fade()} className="text-2xl md:text-3xl font-bold">
              Готовы начать?
            </motion.h2>
            <motion.p {...fade(0.05)} className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Получите инвайт в бету или запишитесь на первую сессию — обсудим, что подойдёт именно вам.
            </motion.p>
            <motion.div {...fade(0.1)} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button size="lg" className="gap-2 px-8" asChild>
                <a href="#waitlist">Получить ранний доступ <ArrowRight className="w-4 h-4" /></a>
              </Button>
              <Button size="lg" variant="outline" className="px-8" asChild>
                <Link to="/contact">Записаться на консультацию</Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CbtWorkbookPage;
