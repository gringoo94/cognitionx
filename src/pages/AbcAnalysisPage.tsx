import ToolConsultCta from "@/components/ToolConsultCta";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import { buildToolSchema } from "@/lib/toolSchema";
import { buildFaqSchema } from "@/lib/geoSchema";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AbcAnalysis from "@/components/AbcAnalysis";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const description =
  "Бесплатный ABC-анализ мыслей онлайн по модели Альберта Эллиса: событие, мысль, эмоция, диспут и новый взгляд. Пошаговый бланк КПТ с разобранным примером.";

const toolSchema = buildToolSchema({
  name: "ABC-анализ мыслей",
  description,
  path: "/tools/abc-analysis",
});

const faq = [
  {
    question: "Сохраняются ли мои записи?",
    answer:
      "Нет. Текст, который вы вводите, никуда не отправляется и не сохраняется на сервере. Если хотите вернуться к разбору позже, скопируйте его себе.",
  },
  {
    question: "Как часто делать ABC-анализ?",
    answer:
      "Для начала достаточно одной-двух ситуаций в день, когда тревога, злость или вина заметно усилились. Удобнее заполнять бланк через 15–30 минут после события, когда первая волна эмоции немного спала.",
  },
  {
    question: "Что делать, если новая мысль кажется неубедительной?",
    answer:
      "Не нужно заставлять себя думать позитивно. Новая мысль должна быть точной, а не радостной: «Ситуация неприятная, но у меня пока нет фактов для худших выводов». Иногда она становится убедительнее после нескольких повторений.",
  },
  {
    question: "Заменяет ли бланк работу с психологом?",
    answer:
      "Бланк помогает тренировать самонаблюдение между встречами или при умеренном стрессе. Если мысли связаны с устойчивыми убеждениями о себе («я никчёмный», «мир опасен») или состояние долго не меняется, их удобнее разобрать на консультации.",
  },
];

const faqSchema = buildFaqSchema(faq);

const AbcAnalysisPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="ABC-анализ мыслей онлайн — бланк КПТ с примером | Дмитрий Яцко"
        description={description}
        path="/tools/abc-analysis"
        schema={faqSchema ? [toolSchema, faqSchema] : [toolSchema]}
        breadcrumbs={[
          { name: "Главная", url: "https://cognitionx.cloud/" },
          { name: "Инструменты", url: "https://cognitionx.cloud/tools" },
          { name: "ABC-анализ", url: "https://cognitionx.cloud/tools/abc-analysis" },
        ]}
      />
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <Button variant="ghost" size="sm" asChild className="gap-2 mb-8 text-muted-foreground">
          <Link to="/tools">
            <ArrowLeft className="w-4 h-4" /> Инструменты
          </Link>
        </Button>

        <AbcAnalysis />

        <section className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight mb-4">Частые вопросы</h2>
          <Accordion type="single" collapsible className="w-full">
            {faq.map((f, i) => (
              <AccordionItem key={f.question} value={`faq-${i}`}>
                <AccordionTrigger className="text-left">{f.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {f.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <h2 className="text-xl font-semibold mt-10 mb-3">Связанные материалы</h2>
          <ul className="text-muted-foreground space-y-1.5">
            <li>→ <Link to="/cbtworkbook" className="text-primary hover:underline">Онлайн-тетрадь КПТ</Link></li>
            <li>→ <Link to="/tools/thought-diary" className="text-primary hover:underline">Дневник мыслей (RFCBT)</Link></li>
            <li>→ <Link to="/tools/emotion-wheel" className="text-primary hover:underline">Колесо эмоций</Link></li>
          </ul>
        </section>
      </main>

      <ToolConsultCta tool="abc" />
      <Footer />
    </div>
  );
};

export default AbcAnalysisPage;
