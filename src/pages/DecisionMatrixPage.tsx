import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Lock,
  Sparkles,
  Compass,
} from "lucide-react";
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
      "Нет. Инструмент не выбирает за вас. Он помогает увидеть структуру выбора: ценности, страхи, цену бездействия и первый безопасный шаг.",
  },
  {
    question: "Чем это отличается от списка плюсов и минусов?",
    answer:
      "Матрица добавляет психологические факторы: страхи, чужие ожидания, телесную реакцию, обратимость и цену бездействия.",
  },
  {
    question: "Подходит ли для решения об эмиграции или отношениях?",
    answer:
      "Да — для развилок с высокой неопределённостью. Если в отношениях есть угроза безопасности, обратитесь за срочной помощью.",
  },
  {
    question: "Что делать, если после прохождения стало тревожнее?",
    answer:
      "Сделайте паузу, не принимайте решение в пике тревоги. Можно принести результат на диагностическую консультацию.",
  },
  {
    question: "Заменяет ли это консультацию?",
    answer:
      "Нет. Инструмент структурирует мысли, но не заменяет работу с психологом — особенно при кризисе, травме или насилии.",
  },
];

const steps = [
  { n: "01", title: "Назовите выбор", text: "Сформулируйте развилку одной фразой." },
  { n: "02", title: "7 коротких шагов", text: "Варианты, ценности, страхи, тело, цена бездействия." },
  { n: "03", title: "Карта выбора", text: "Структурированный разбор того, что стоит за решением." },
  { n: "04", title: "GPT или психолог", text: "Скопируйте промпт для GPT или принесите на консультацию." },
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
        title="Матрица выбора — инструмент для принятия решений"
        description="Разложите сложный выбор по вариантам, страхам, ценностям и первым шагам. После заполнения можно продолжить разбор в GPT-помощнике."
        path="/tools/decision-matrix"
        schema={schemas}
        breadcrumbs={[
          { name: "Главная", url: `${SITE_URL}/` },
          { name: "Инструменты", url: `${SITE_URL}/tools` },
          { name: "Матрица выбора", url: `${SITE_URL}/tools/decision-matrix` },
        ]}
      />
      <Navbar />

      <main className="print:py-6">
        {/* Hero */}
        <section className="border-b border-border print:hidden">
          <div className="max-w-4xl mx-auto px-6 pt-10 pb-14 md:pt-14 md:pb-20">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="gap-2 mb-8 text-muted-foreground -ml-2"
            >
              <Link to="/tools">
                <ArrowLeft className="w-4 h-4" /> Все инструменты
              </Link>
            </Button>

            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-5">
              <Compass className="w-3.5 h-3.5" />
              <span>Инструмент · бесплатно</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight mb-5">
              Матрица выбора
            </h1>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-7 max-w-2xl">
              Разложите сложное решение на части: ценности, страхи, чужие ожидания и цена бездействия. Без советов и «правильных» ответов.
            </p>

            <div className="flex flex-wrap gap-3 mb-6">
              <Button size="lg" asChild className="gap-2">
                <a href="#tool">
                  Начать разбор <ArrowRight className="w-4 h-4" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#how">Как это работает</a>
              </Button>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> 5–7 минут
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Lock className="w-4 h-4" /> Данные не уходят на сервер
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Промпт для GPT
              </span>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="border-b border-border print:hidden">
          <div className="max-w-4xl mx-auto px-6 py-14 md:py-20">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-10">
              Как это работает
            </h2>
            <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {steps.map(({ n, title, text }) => (
                <li key={n} className="rounded-xl border border-border bg-card p-5">
                  <div className="text-sm font-mono text-primary mb-3">{n}</div>
                  <div className="font-semibold mb-1.5">{title}</div>
                  <div className="text-sm text-muted-foreground leading-relaxed">{text}</div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Tool */}
        <section id="tool" className="scroll-mt-24">
          <div className="max-w-3xl mx-auto px-6 py-14 md:py-20 print:py-6">
            <DecisionMatrix />
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-border bg-muted/30 print:hidden">
          <div className="max-w-3xl mx-auto px-6 py-14 md:py-20">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8">
              Частые вопросы
            </h2>
            <Accordion type="single" collapsible className="space-y-2">
              {faq.map((f, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="border border-border rounded-xl px-4 bg-card"
                >
                  <AccordionTrigger className="text-left text-base font-semibold">
                    {f.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                    {f.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Related */}
        <section className="print:hidden">
          <div className="max-w-4xl mx-auto px-6 py-14 md:py-20">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8">
              Другие инструменты
            </h2>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { to: "/tools/emotion-wheel", title: "Колесо эмоций", text: "Если трудно назвать чувства." },
                { to: "/tools/abc-analysis", title: "ABC-анализ", text: "Если много тревожных мыслей." },
                { to: "/tools/schema-quiz", title: "Тест на схемы", text: "Если решение повторяет старый сценарий." },
                { to: "/start", title: "С чего начать", text: "Короткий опросник для запроса." },
              ].map(({ to, title, text }) => (
                <Link
                  key={to}
                  to={to}
                  className="group rounded-xl border border-border p-5 hover:border-primary/40 hover:bg-muted/40 transition-colors"
                >
                  <div className="font-semibold mb-1 flex items-center justify-between">
                    {title}
                    <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </div>
                  <div className="text-sm text-muted-foreground">{text}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default DecisionMatrixPage;
