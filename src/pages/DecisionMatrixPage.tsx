import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DecisionMatrix from "@/components/DecisionMatrix";
import { buildFaqSchema } from "@/lib/geoSchema";
import { SITE_URL } from "@/lib/globalSchema";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faq = [
  {
    question: "Матрица выбора принимает решение за меня?",
    answer:
      "Нет. Инструмент не выбирает за вас и не говорит, какой вариант правильный. Он помогает увидеть структуру выбора: ценности, страхи, цену бездействия и первый безопасный шаг.",
  },
  {
    question: "Чем это отличается от списка плюсов и минусов?",
    answer:
      "Обычный список плюсов и минусов часто остаётся на рациональном уровне. Матрица выбора добавляет психологические факторы: страхи, чужие ожидания, телесную реакцию, обратимость решения и цену бездействия.",
  },
  {
    question: "Подходит ли инструмент для решения об эмиграции?",
    answer:
      "Да. Инструмент особенно полезен для решений с высокой неопределённостью: уехать или остаться, менять страну, возвращаться или строить жизнь дальше.",
  },
  {
    question: "Можно ли использовать для отношений?",
    answer:
      "Да, если решение не связано с угрозой безопасности. Если есть насилие или риск вреда, лучше обратиться за срочной помощью и поддержкой.",
  },
  {
    question: "Что делать, если после прохождения стало тревожнее?",
    answer:
      "Это может означать, что решение сильно заряжено и связано с важными страхами или ценностями. Сделайте паузу, вернитесь к телу, не принимайте решение в пике тревоги. Можно принести результат на диагностическую консультацию.",
  },
  {
    question: "Можно ли отправить результат психологу?",
    answer:
      "Да. Вы можете скопировать результат и отправить его через короткий опросник /start или принести на первую диагностическую консультацию.",
  },
  {
    question: "Заменяет ли это консультацию?",
    answer:
      "Нет. Инструмент помогает структурировать мысли, но не заменяет консультацию психолога, особенно если выбор связан с кризисом, травмой, насилием, зависимостью или сильным ухудшением состояния.",
  },
];

const DecisionMatrixPage = () => {
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Матрица выбора",
    applicationCategory: "HealthApplication",
    operatingSystem: "Web",
    url: `${SITE_URL}/tools/decision-matrix`,
    description:
      "Интерактивный инструмент для разбора сложного решения: варианты, ценности, страхи, цена бездействия и первый безопасный шаг.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  };

  const faqSchema = buildFaqSchema(faq);
  const schemas = [webAppSchema, ...(faqSchema ? [faqSchema] : [])];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="Матрица выбора — как принять сложное решение | CognitionX"
        description="Интерактивная матрица выбора: разберите варианты, плюсы и минусы, ценности, страхи, цену бездействия, обратимость решения и первый безопасный шаг."
        path="/tools/decision-matrix"
        schema={schemas}
        breadcrumbs={[
          { name: "Главная", url: `${SITE_URL}/` },
          { name: "Инструменты", url: `${SITE_URL}/tools` },
          { name: "Матрица выбора", url: `${SITE_URL}/tools/decision-matrix` },
        ]}
      />
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-16 md:py-24 print:py-6">
        <Button variant="ghost" size="sm" asChild className="gap-2 mb-8 text-muted-foreground print:hidden">
          <Link to="/tools">
            <ArrowLeft className="w-4 h-4" /> Инструменты
          </Link>
        </Button>

        <DecisionMatrix />

        <section className="mt-20 print:hidden">
          <h2 className="text-2xl font-bold mb-6">Частые вопросы</h2>
          <Accordion type="single" collapsible className="space-y-2">
            {faq.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border border-border rounded-xl px-4 bg-card">
                <AccordionTrigger className="text-left text-base font-semibold">
                  {f.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  {f.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <section className="mt-16 print:hidden">
          <h2 className="text-xl font-bold mb-4">Другие инструменты, которые могут помочь</h2>
          <div className="grid md:grid-cols-2 gap-3">
            <Link to="/tools/emotion-wheel" className="rounded-xl border border-border p-4 hover:border-primary/40 transition-colors">
              <div className="font-semibold mb-1">Колесо эмоций</div>
              <div className="text-sm text-muted-foreground">Если трудно назвать чувства, которые мешают выбрать.</div>
            </Link>
            <Link to="/tools/abc-analysis" className="rounded-xl border border-border p-4 hover:border-primary/40 transition-colors">
              <div className="font-semibold mb-1">ABC-анализ</div>
              <div className="text-sm text-muted-foreground">Если много тревожных мыслей вокруг решения.</div>
            </Link>
            <Link to="/tools/schema-quiz" className="rounded-xl border border-border p-4 hover:border-primary/40 transition-colors">
              <div className="font-semibold mb-1">Тест на схемы</div>
              <div className="text-sm text-muted-foreground">Если решение повторяет старый сценарий из жизни.</div>
            </Link>
            <Link to="/start" className="rounded-xl border border-border p-4 hover:border-primary/40 transition-colors">
              <div className="font-semibold mb-1">Понять, с чего начать</div>
              <div className="text-sm text-muted-foreground">Короткий опросник для запроса в Telegram.</div>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default DecisionMatrixPage;
