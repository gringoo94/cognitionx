import ToolConsultCta from "@/components/ToolConsultCta";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import { buildToolSchema } from "@/lib/toolSchema";
import { buildFaqSchema } from "@/lib/geoSchema";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThoughtDiary from "@/components/ThoughtDiary";

const description =
  "Дневник мыслей онлайн для работы с руминацией по методу RFCBT Эдварда Уоткинса: как переключиться с вопросов «почему» на конкретные шаги. Бесплатно, с примером.";

const toolSchema = buildToolSchema({
  name: "Дневник мыслей",
  description,
  path: "/tools/thought-diary",
});

const faq = [
  {
    question: "Что такое руминация?",
    answer:
      "Руминация — повторяющееся прокручивание одних и тех же мыслей о проблеме, её причинах и последствиях без движения к решению. Она часто сопровождает депрессию и тревогу.",
  },
  {
    question: "Когда лучше заполнять дневник?",
    answer:
      "Не в самый момент, когда мысли крутятся, а позже, когда станет спокойнее. Так легче заметить, что запустило эпизод и что помогло из него выйти.",
  },
  {
    question: "Заменяет ли дневник терапию?",
    answer:
      "Нет. Это упражнение для самонаблюдения между встречами. Если руминация мешает спать, работать или держится неделями, стоит обсудить её с психологом.",
  },
];

const faqSchema = buildFaqSchema(faq);

const ThoughtDiaryPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="Дневник мыслей онлайн — работа с руминацией (RFCBT) | Дмитрий Яцко"
        description={description}
        path="/tools/thought-diary"
        schema={faqSchema ? [toolSchema, faqSchema] : [toolSchema]}
        breadcrumbs={[
          { name: "Главная", url: "https://cognitionx.cloud/" },
          { name: "Инструменты", url: "https://cognitionx.cloud/tools" },
          { name: "Дневник мыслей", url: "https://cognitionx.cloud/tools/thought-diary" },
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
            Дневник <span className="text-primary">мыслей</span>
          </h1>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Рабочий лист для между сессиями. Помогает заметить, что запускает руминацию и чем отличаются
            эпизоды, когда мысли застревают, от тех, когда — нет. По методу RFCBT (Эдвард Уоткинс).
          </p>
        </header>

        <ThoughtDiary />

        <section className="mt-12 prose prose-invert prose-sm max-w-none">
          <h2 className="text-xl font-semibold text-foreground">Как пользоваться</h2>
          <ol className="text-muted-foreground space-y-2 leading-relaxed">
            <li><strong className="text-foreground">Не в момент руминации.</strong> Подойдите к листу позже, когда станет спокойнее — так наблюдение точнее.</li>
            <li><strong className="text-foreground">Опишите контекст.</strong> Что было за 5–10 минут до того, как мысли начали крутиться.</li>
            <li><strong className="text-foreground">Различайте стиль.</strong> «Почему»-мысли абстрактны и усугубляют состояние; «что именно»-мысли конкретны и ведут к решению.</li>
            <li><strong className="text-foreground">Сравните с эпизодами «когда не застревало».</strong> Там обычно прячется ответ — что помогает именно вам.</li>
          </ol>

          <h2 className="text-xl font-semibold text-foreground mt-8">Пример: «почему» и «что именно»</h2>
          <p className="text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Мысль «почему»:</strong> «Почему мне так тяжело начать простое дело? Почему я не могу собраться, как другие?» Такие вопросы обычно не дают ответа и усиливают вину.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Мысль «что именно»:</strong> «Что именно сейчас мешает? Какое одно действие на 3 минуты я могу сделать — открыть файл, написать первую строку?» Внимание переходит от оценки себя к следующему шагу.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">Частые вопросы</h2>
          {faq.map((f) => (
            <div key={f.question} className="mt-4">
              <h3 className="text-base font-semibold text-foreground">{f.question}</h3>
              <p className="text-muted-foreground leading-relaxed">{f.answer}</p>
            </div>
          ))}

          <h2 className="text-xl font-semibold text-foreground mt-8">Связанные материалы</h2>
          <ul className="text-muted-foreground space-y-1.5">
            <li>→ <Link to="/tools/abstract-to-concrete" className="text-primary hover:underline">Тренажёр «как думать иначе» (RFCBT)</Link></li>
            <li>→ <Link to="/tools/tests/rrs-rumination" className="text-primary hover:underline">RRS — шкала руминации</Link></li>
            <li>→ <Link to="/tools/abc-analysis" className="text-primary hover:underline">ABC-анализ мыслей</Link></li>
            <li>→ <Link to="/depression" className="text-primary hover:underline">Терапия при депрессии</Link></li>
          </ul>
        </section>
      </main>

      <ToolConsultCta tool="thought_diary" />
      <Footer />
    </div>
  );
};

export default ThoughtDiaryPage;
