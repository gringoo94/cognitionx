import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SchemaQuiz from "@/components/SchemaQuiz";
import { SITE_URL } from "@/lib/globalSchema";
import { questions, scaleLabels } from "@/data/schemaQuizData";

const faq = [
  {
    q: "Что такое опросник Янга (YSQ) и чем он измеряет?",
    a: "Young Schema Questionnaire (YSQ) — стандартизированный опросник, разработанный Джеффри Янгом для диагностики 18 ранних дезадаптивных схем (early maladaptive schemas). Полная версия (YSQ-L3) содержит 232 вопроса, короткая (YSQ-S3) — 90. Этот тест — экспресс-версия на 36 утверждений: по 2 на каждую схему. Он не заменяет клиническую диагностику, но даёт хороший срез доминирующих паттернов за 5–7 минут.",
  },
  {
    q: "Что такое ранние дезадаптивные схемы?",
    a: "Это глубинные эмоциональные паттерны, которые формируются в детстве, когда базовые потребности ребёнка (безопасность, принятие, автономия, границы) не удовлетворяются. Схема включает воспоминания, эмоции, телесные ощущения и убеждения о себе и мире. Во взрослом возрасте схема активируется в ситуациях, напоминающих детский опыт — и человек реагирует так же, как реагировал в 5 лет, хотя ему 35.",
  },
  {
    q: "Сколько схем может быть у одного человека?",
    a: "У большинства людей выражены 3–6 схем. Полное отсутствие схем — редкость, как и активация всех 18. Чаще схемы группируются в кластеры: например, Покинутость + Эмоциональная депривация + Дефективность часто идут вместе. Тест покажет ваш профиль с уровнем выраженности каждой схемы.",
  },
  {
    q: "Можно ли «вылечить» схему?",
    a: "Полностью убрать схему — нельзя, она остаётся в долгосрочной памяти. Но можно значительно ослабить её активацию: научиться замечать триггеры, не действовать на автомате, развить «здорового взрослого», который заботится о «уязвимом ребёнке» внутри. Схема-терапия даёт устойчивые изменения за 20–40 сессий.",
  },
  {
    q: "Чем схема-терапия отличается от классической КПТ?",
    a: "КПТ работает с поверхностными мыслями и поведением «здесь и сейчас». Схема-терапия идёт глубже — к корням в детстве, использует работу с эмоциями (imagery rescripting), диалоги с режимами, элементы гештальт-подхода. КПТ — для конкретных симптомов (тревога, паника, депрессия). Схема-терапия — для хронических паттернов в отношениях и самооценке.",
  },
  {
    q: "Что делать после прохождения теста?",
    a: "Запишите 2–3 схемы с наибольшим баллом — это ваши «главные действующие лица». Понаблюдайте за неделю: в каких ситуациях они активируются, какие чувства поднимаются, как вы обычно реагируете. Если паттерн мешает жить — это сигнал к работе со специалистом. Прочитайте подробнее: «Прочь из замкнутого круга» Янга и Клоско.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const quizSchema = {
  "@context": "https://schema.org",
  "@type": "Quiz",
  name: "Тест на ранние дезадаптивные схемы — опросник Янга (YSQ)",
  description: "Экспресс-версия Young Schema Questionnaire: 36 вопросов, 18 ранних дезадаптивных схем.",
  educationalLevel: "professional",
  inLanguage: "ru",
  about: { "@type": "Thing", name: "Схема-терапия" },
  isAccessibleForFree: true,
  url: `${SITE_URL}/tools/schema-quiz`,
  numberOfQuestions: questions.length,
  timeRequired: "PT7M",
  hasPart: questions.map((q, i) => ({
    "@type": "Question",
    position: i + 1,
    name: q.text,
    eduQuestionType: "Multiple choice",
    suggestedAnswer: scaleLabels.map((label: string) => ({
      "@type": "Answer",
      text: label,
    })),
  })),
};

const SchemaQuizPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="Тест на схемы — экспресс-версия YSQ Янга | Психолог Дмитрий Яцко"
        description="Бесплатный экспресс-тест на 18 ранних дезадаптивных схем по модели Джеффри Янга. 36 вопросов, 5-7 минут. Узнайте свои глубинные паттерны."
        path="/tools/schema-quiz"
        schema={faqSchema}
        breadcrumbs={[
          { name: "Главная", url: "https://cognitionx.cloud/" },
          { name: "Инструменты", url: "https://cognitionx.cloud/tools" },
          { name: "Тест на схемы", url: "https://cognitionx.cloud/tools/schema-quiz" },
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
            Тест на ранние дезадаптивные схемы — опросник Янга онлайн
          </h1>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Экспресс-версия опросника YSQ Джеффри Янга: 36 утверждений, 5–7 минут. Узнайте, какие глубинные паттерны
            (схемы) включаются в трудных ситуациях и определяют вашу реакцию.
          </p>
        </header>

        <SchemaQuiz />

        {/* SEO long-form content */}
        <section className="mt-20 space-y-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Что показывает тест на схемы</h2>
            <p className="text-muted-foreground leading-relaxed">
              Этот опросник — короткая адаптация{" "}
              <strong className="text-foreground">Young Schema Questionnaire (YSQ-S3)</strong>, стандартизированного
              инструмента схема-терапии. Джеффри Янг выделил 18 ранних дезадаптивных схем — устойчивых эмоциональных
              паттернов, которые формируются в детстве, когда базовые потребности ребёнка (в безопасности, принятии,
              автономии, реалистичных границах) не были удовлетворены. Эти схемы продолжают работать во взрослой жизни
              как невидимые фильтры — искажая восприятие реальности и запуская повторяющиеся реакции.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              По результатам теста вы получите профиль с уровнем выраженности каждой схемы. Высокие баллы означают, что
              схема часто активируется и влияет на ваше поведение. Это не диагноз и не приговор — это карта, с которой
              можно работать.
            </p>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">5 доменов схем по Янгу</h2>
            <ul className="space-y-3 text-muted-foreground leading-relaxed">
              <li>
                <strong className="text-foreground">1. Отвержение и нестабильность.</strong> Покинутость, Недоверие,
                Эмоциональная депривация, Дефективность, Социальная изоляция. Корни — в небезопасной привязанности и
                эмоционально холодной семье.
              </li>
              <li>
                <strong className="text-foreground">2. Нарушение автономии.</strong> Зависимость, Уязвимость, Слияние,
                Неуспешность. Корни — в гиперопеке или, наоборот, в полной заброшенности.
              </li>
              <li>
                <strong className="text-foreground">3. Нарушение границ.</strong> Грандиозность, Недостаточный
                самоконтроль. Корни — в отсутствии разумных границ в детстве.
              </li>
              <li>
                <strong className="text-foreground">4. Направленность на других.</strong> Покорность, Самопожертвование,
                Поиск одобрения. Корни — в условной любви, где ребёнка принимали только за «хорошее поведение».
              </li>
              <li>
                <strong className="text-foreground">5. Сверхбдительность и подавление.</strong> Негативизм, Подавление
                эмоций, Жёсткие стандарты, Пунитивность. Корни — в требовательной, критикующей или угрюмой семье.
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              Подробнее о работе со схемами — на странице{" "}
              <Link to="/schema-therapy" className="text-primary underline">
                схема-терапии
              </Link>
              .
            </p>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Как использовать результаты</h2>
            <ol className="space-y-3 text-muted-foreground leading-relaxed list-decimal pl-5">
              <li>
                <strong className="text-foreground">Запишите топ-3 схемы.</strong> Это ваши «главные действующие лица» —
                паттерны, которые чаще всего активируются.
              </li>
              <li>
                <strong className="text-foreground">Понаблюдайте неделю.</strong> Отмечайте ситуации, в которых каждая
                схема включается. Полезно вести{" "}
                <Link to="/tools/abc-analysis" className="text-primary underline">
                  ABC-анализ
                </Link>{" "}
                таких эпизодов.
              </li>
              <li>
                <strong className="text-foreground">Распознайте копинг-стиль.</strong> На каждую схему мы реагируем
                одним из трёх способов: капитуляция (подчинение схеме), избегание (уход от триггеров), гиперкомпенсация
                (поведение наоборот).
              </li>
              <li>
                <strong className="text-foreground">Подумайте о работе со специалистом.</strong> Если 2+ схемы выражены
                сильно и мешают жить — самопомощи обычно недостаточно.{" "}
                <Link to="/schema-therapy" className="text-primary underline">
                  Схема-терапия
                </Link>{" "}
                даёт устойчивые изменения за 20–40 сессий.
              </li>
            </ol>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Частые вопросы</h2>
            <Accordion type="single" collapsible className="rounded-2xl border border-border bg-card overflow-hidden">
              {faq.map((f, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border-border px-5">
                  <AccordionTrigger className="text-sm md:text-base text-left font-medium">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-sm md:text-[15px] text-muted-foreground leading-relaxed">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Internal links */}
          <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-transparent p-6 md:p-8">
            <h3 className="text-lg font-semibold mb-3">Что почитать дальше</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                →{" "}
                <Link to="/blog/8-prepyatstvij-na-puti-k-peremenam" className="text-primary underline">
                  8 препятствий на пути к переменам в схема-терапии
                </Link>
              </li>
              <li>
                →{" "}
                <Link to="/blog/kognitivnyj-barjer-vera-v-istinnost" className="text-primary underline">
                  Когнитивный барьер: вера в истинность ловушки
                </Link>
              </li>
              <li>
                →{" "}
                <Link to="/blog/lovushka-yarlykov" className="text-primary underline">
                  Ловушка ярлыков в схема-терапии
                </Link>
              </li>
              <li>
                →{" "}
                <Link to="/schema-therapy" className="text-primary underline">
                  Подробнее о схема-терапии и моём подходе
                </Link>
              </li>
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SchemaQuizPage;
