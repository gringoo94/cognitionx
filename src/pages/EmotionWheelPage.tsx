import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EmotionWheel from "@/components/EmotionWheel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Что такое колесо эмоций и зачем оно нужно?",
    answer:
      "Колесо эмоций — это визуальная карта чувств, в которой переживания сгруппированы по смысловым категориям. Она помогает точнее назвать то, что вы испытываете: вместо обобщённого «мне плохо» вы находите конкретное «разочарование», «обида» или «стыд». Чем точнее называние, тем меньше интенсивность эмоции и тем понятнее, что с ней делать дальше.",
  },
  {
    question: "Чем колесо Брене Браун отличается от колеса Плутчика?",
    answer:
      "Колесо Плутчика (1980) — академическая модель из 8 базовых эмоций и их комбинаций. Колесо Брене Браун из книги «Атлас сердца» (2021) практичнее для самопомощи: 87 переживаний в 13 жизненных категориях («нас обидели», «всё идёт не по плану», «сердце открыто»), сформированных по результатам 20-летнего исследования.",
  },
  {
    question: "Как пользоваться колесом эмоций каждый день?",
    answer:
      "Минимальная практика: 1–2 раза в день останавливайтесь и спрашивайте себя «что я сейчас чувствую?». Найдите подходящую категорию на колесе, кликните по ней и выберите наиболее точное слово. Запишите его в дневник одной строкой вместе с триггером. Через 2–3 недели вы заметите паттерны: какие ситуации какие эмоции вызывают чаще всего.",
  },
  {
    question: "Помогает ли называние эмоций при тревоге и депрессии?",
    answer:
      "Да. Исследования affect labeling (Lieberman et al., 2007, UCLA) показывают: называние эмоции снижает активность миндалевидного тела и активирует префронтальную кору. На практике это означает: эмоция становится менее интенсивной и более управляемой. Это базовая техника в КПТ и DBT для работы с тревогой, депрессией и эмоциональной дисрегуляцией.",
  },
  {
    question: "Что делать, если я не нахожу подходящего слова?",
    answer:
      "Это нормально, особенно в начале. Начните с уровня категории («мне сейчас в зоне „всё идёт не по плану“»). Этого уже достаточно, чтобы запустить осознанность. Со временем словарный запас расширится. Если эмоции остаются «слипшимися» и непонятными неделями — это повод поработать с психологом: алекситимия хорошо корректируется в терапии.",
  },
];

const EmotionWheelPage = () => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Как пользоваться колесом эмоций",
    description:
      "Пошаговая инструкция: как использовать интерактивное колесо эмоций для развития эмоциональной грамотности.",
    step: [
      { "@type": "HowToStep", name: "Остановитесь и заметьте", text: "Сделайте паузу и обратите внимание на то, что происходит в теле и в мыслях прямо сейчас." },
      { "@type": "HowToStep", name: "Выберите категорию", text: "Найдите на колесе ту жизненную категорию, которая ближе всего описывает текущее переживание." },
      { "@type": "HowToStep", name: "Уточните оттенок", text: "Внутри категории выберите самое точное слово — оно может отличаться от первого пришедшего на ум." },
      { "@type": "HowToStep", name: "Запишите в дневник", text: "Зафиксируйте эмоцию, триггер и контекст одной строкой. Через 2–3 недели вы увидите паттерны." },
    ],
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="Колесо эмоций онлайн — 87 чувств Брене Браун | Психолог Дмитрий Яцко"
        description="Интерактивное колесо эмоций по «Атласу сердца» Брене Браун: 13 категорий и 87 переживаний. Точное называние снижает интенсивность эмоции и помогает понять себя."
        path="/tools/emotion-wheel"
        schema={[faqSchema, howToSchema]}
        breadcrumbs={[
          { name: "Главная", url: "https://cognitionx.cloud/" },
          { name: "Инструменты", url: "https://cognitionx.cloud/tools" },
          { name: "Колесо эмоций", url: "https://cognitionx.cloud/tools/emotion-wheel" },
        ]}
      />
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <Button variant="ghost" size="sm" asChild className="gap-2 mb-8 text-muted-foreground">
          <Link to="/tools">
            <ArrowLeft className="w-4 h-4" /> Инструменты
          </Link>
        </Button>

        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Колесо эмоций
          </h1>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Интерактивная карта чувств: 13 категорий и 87 эмоций по «Атласу сердца»
            Брене Браун. Помогает точно назвать переживание и отличить базовые
            эмоции от их оттенков.
          </p>
        </header>

        <EmotionWheel />

        <section className="mt-16 prose prose-invert max-w-none">
          <h2 className="text-2xl font-bold tracking-tight">Зачем называть эмоцию точнее</h2>
          <p className="text-foreground/85 leading-relaxed">
            Когда мы говорим «мне плохо» или «всё бесит», мозг получает слишком
            размытый сигнал. Эмоция остаётся в теле как фон: напряжение в плечах,
            ком в горле, поверхностное дыхание. Как только мы находим точное
            слово — «я разочарован», «я обижен», «мне одиноко», — включается
            префронтальная кора, миндалевидное тело снижает активность, и
            переживание становится управляемым. Этот эффект называется{" "}
            <em>affect labeling</em>: его описали в исследованиях UCLA
            (Lieberman et al., 2007) и подтвердили десятки последующих работ по
            нейровизуализации.
          </p>

          <h2 className="text-2xl font-bold tracking-tight mt-10">
            Как устроено колесо Брене Браун
          </h2>
          <p className="text-foreground/85 leading-relaxed">
            87 переживаний сгруппированы в 13 жизненных категорий. Не «радость и
            грусть», а ситуации: «всё идёт не по плану», «нас обидели», «сердце
            открыто», «мы сравниваем». Такая разбивка ближе к тому, как мы
            реально думаем о своём состоянии — не от эмоции к ситуации, а от
            ситуации к эмоции. Внутри каждой категории — оттенки: «разочарование»
            и «фрустрация» рядом, но это разные переживания с разными
            подходящими реакциями.
          </p>

          <h2 className="text-2xl font-bold tracking-tight mt-10">
            5 шагов для практики
          </h2>
          <ol className="space-y-3 list-decimal pl-5 text-foreground/85">
            <li>
              <strong>Поставьте 2 напоминания в день.</strong> Утро и вечер — самое
              удобное время. Достаточно 30 секунд.
            </li>
            <li>
              <strong>Сначала тело.</strong> Где напряжение? Где тепло? Где
              сжато? Тело часто называет эмоцию раньше головы.
            </li>
            <li>
              <strong>Найдите категорию.</strong> Какая из 13 ближе всего? Не
              обязательно одна — может быть две.
            </li>
            <li>
              <strong>Уточните слово.</strong> Откройте категорию и выберите
              самый точный оттенок. Иногда самое подходящее — то, которое сначала
              «не хотелось».
            </li>
            <li>
              <strong>Запишите.</strong> «Сегодня в 17:40 после звонка — обида,
              не злость». Этой строки достаточно.
            </li>
          </ol>

          <h2 className="text-2xl font-bold tracking-tight mt-10">
            Когда колесо помогает особенно
          </h2>
          <ul className="space-y-2 list-disc pl-5 text-foreground/85">
            <li>
              <strong>Хроническая тревога.</strong> Часто за «тревогой» стоит
              стыд, обида или гнев, который не разрешён.{" "}
              <Link to="/blog/povyshennaya-trevozhnost" className="text-primary underline">
                Подробнее
              </Link>.
            </li>
            <li>
              <strong>Депрессия и апатия.</strong> Помогает разделить «грусть» и
              «отчаяние», «усталость» и «безнадёжность» — это разные сигналы.
            </li>
            <li>
              <strong>Конфликты в отношениях.</strong> Точное называние своей
              эмоции — половина продуктивного разговора. Партнёр реагирует на
              «мне обидно», а не на «ты опять всё испортил».
            </li>
            <li>
              <strong>Алекситимия.</strong> Если эмоции «слипаются» и непонятны —
              колесо это базовый инструмент развития эмоциональной грамотности.
            </li>
          </ul>

          <h2 className="text-2xl font-bold tracking-tight mt-10">Часто задаваемые вопросы</h2>
        </section>

        <Accordion type="single" collapsible className="mt-6">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`f-${i}`}>
              <AccordionTrigger className="text-left">{f.question}</AccordionTrigger>
              <AccordionContent className="text-foreground/85 leading-relaxed">
                {f.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 rounded-2xl border border-primary/20 bg-primary/5 p-6">
          <h2 className="text-xl font-bold mb-2">Связанные материалы</h2>
          <ul className="space-y-1.5 text-sm">
            <li>
              <Link to="/blog/koleso-emocij" className="text-primary underline">
                Статья: колесо эмоций — 87 переживаний по Брене Браун
              </Link>
            </li>
            <li>
              <Link to="/tools/abc-analysis" className="text-primary underline">
                ABC-анализ: связать эмоцию с мыслью и ситуацией
              </Link>
            </li>
            <li>
              <Link to="/tools/thought-diary" className="text-primary underline">
                Дневник мыслей онлайн
              </Link>
            </li>
            <li>
              <Link to="/tools/tests" className="text-primary underline">
                Психологические тесты и шкалы
              </Link>
            </li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EmotionWheelPage;
