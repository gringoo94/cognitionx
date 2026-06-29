import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Lock,
  Sparkles,
  Heart,
  Compass,
  Plane,
  Briefcase,
  Users,
  Home,
  MessageCircleQuestion,
  Map,
  Footprints,
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

const useCases = [
  { icon: Plane, title: "Эмиграция", text: "Уезжать или остаться, возвращаться или нет." },
  { icon: Briefcase, title: "Работа", text: "Менять профессию, увольняться, принимать оффер." },
  { icon: Heart, title: "Отношения", text: "Расставаться или работать дальше, съезжаться, замужество." },
  { icon: Home, title: "Большие траты", text: "Ипотека, переезд, учёба, длительные обязательства." },
];

const steps = [
  {
    n: "01",
    title: "Назовите выбор",
    text: "Сформулируйте развилку в одной фразе — это уже половина ясности.",
  },
  {
    n: "02",
    title: "Пройдите 7 коротких шагов",
    text: "Варианты, ценности, страхи, чужие ожидания, тело, обратимость, цена бездействия.",
  },
  {
    n: "03",
    title: "Получите карту выбора",
    text: "Структурированный разбор того, что на самом деле стоит за вашим решением.",
  },
  {
    n: "04",
    title: "Углубите в GPT-помощнике",
    text: "Скопируйте готовый промпт и продолжите диалог — или принесите карту на консультацию.",
  },
];

const outcomes = [
  {
    icon: Map,
    title: "Карта выбора",
    text: "Все варианты, ценности и страхи на одном экране — без хаоса в голове.",
  },
  {
    icon: MessageCircleQuestion,
    title: "Готовый промпт для GPT",
    text: "Не нужно объяснять контекст заново — продолжите разбор там, где остановились.",
  },
  {
    icon: Footprints,
    title: "Первый безопасный шаг",
    text: "Маленькое действие, которое можно сделать в ближайшие 48 часов.",
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
        title="Матрица выбора — инструмент для принятия решений с GPT-разбором"
        description="Разложите сложный выбор по вариантам, страхам, ценностям и первым шагам. После заполнения можно скопировать результат и продолжить глубокий разбор в GPT-помощнике."
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
        <section className="border-b border-border/60 bg-muted/30 print:hidden">
          <div className="max-w-6xl mx-auto px-6 pt-10 pb-16 md:pt-14 md:pb-24">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="gap-2 mb-10 text-muted-foreground -ml-2"
            >
              <Link to="/tools">
                <ArrowLeft className="w-4 h-4" /> Все инструменты
              </Link>
            </Button>

            <div className="grid md:grid-cols-[1.2fr_1fr] gap-12 md:gap-16 items-start">
              <div>
                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground mb-6">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Инструмент · бесплатно</span>
                </div>
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mb-6">
                  Когда выбор кажется{" "}
                  <em className="italic text-primary">неподъёмным —</em>{" "}
                  разложите его на части
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 max-w-xl">
                  Матрица выбора помогает увидеть, что на самом деле стоит за вашим решением: ценности, страхи, чужие ожидания и цена бездействия. Без советов и «правильных» ответов.
                </p>

                <div className="flex flex-wrap gap-3 mb-8">
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
                    <Lock className="w-4 h-4" /> Ничего не отправляется на сервер
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> Готовый промпт для GPT
                  </span>
                </div>
              </div>

              {/* Use cases card */}
              <aside className="rounded-2xl border border-border bg-card p-6 md:p-7">
                <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-5">
                  Помогает с такими развилками
                </div>
                <ul className="space-y-4">
                  {useCases.map(({ icon: Icon, title, text }) => (
                    <li key={title} className="flex gap-4">
                      <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold mb-0.5">{title}</div>
                        <div className="text-sm text-muted-foreground leading-snug">
                          {text}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </aside>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="border-b border-border/60 print:hidden">
          <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
            <div className="max-w-2xl mb-12">
              <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-4">
                Как это работает
              </div>
              <h2 className="font-serif text-3xl md:text-4xl leading-tight tracking-tight">
                Четыре шага от тумана{" "}
                <em className="italic text-primary">до ясности</em>
              </h2>
            </div>

            <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden">
              {steps.map(({ n, title, text }) => (
                <li key={n} className="bg-background p-6 md:p-8">
                  <div className="font-serif text-3xl text-primary/70 mb-4">{n}</div>
                  <div className="font-semibold mb-2">{title}</div>
                  <div className="text-sm text-muted-foreground leading-relaxed">
                    {text}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Outcomes */}
        <section className="border-b border-border/60 bg-muted/30 print:hidden">
          <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
            <div className="max-w-2xl mb-12">
              <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-4">
                Что вы получите
              </div>
              <h2 className="font-serif text-3xl md:text-4xl leading-tight tracking-tight">
                Не «правильный ответ», а{" "}
                <em className="italic text-primary">опору для решения</em>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {outcomes.map(({ icon: Icon, title, text }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-border bg-card p-6 md:p-7"
                >
                  <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="font-semibold text-lg mb-2">{title}</div>
                  <div className="text-sm text-muted-foreground leading-relaxed">
                    {text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tool */}
        <section id="tool" className="scroll-mt-24">
          <div className="max-w-3xl mx-auto px-6 py-16 md:py-24 print:py-6">
            <DecisionMatrix />
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-border/60 bg-muted/30 print:hidden">
          <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
            <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-4">
              Вопросы и ответы
            </div>
            <h2 className="font-serif text-3xl md:text-4xl leading-tight tracking-tight mb-8">
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
          <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
            <div className="max-w-2xl mb-10">
              <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-4">
                Если матрица не подошла
              </div>
              <h2 className="font-serif text-3xl md:text-4xl leading-tight tracking-tight">
                Другие инструменты,{" "}
                <em className="italic text-primary">которые могут помочь</em>
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Link
                to="/tools/emotion-wheel"
                className="group rounded-2xl border border-border p-6 hover:border-primary/40 hover:bg-muted/40 transition-colors"
              >
                <div className="font-semibold mb-1 flex items-center justify-between">
                  Колесо эмоций
                  <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </div>
                <div className="text-sm text-muted-foreground">
                  Если трудно назвать чувства, которые мешают выбрать.
                </div>
              </Link>
              <Link
                to="/tools/abc-analysis"
                className="group rounded-2xl border border-border p-6 hover:border-primary/40 hover:bg-muted/40 transition-colors"
              >
                <div className="font-semibold mb-1 flex items-center justify-between">
                  ABC-анализ
                  <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </div>
                <div className="text-sm text-muted-foreground">
                  Если много тревожных мыслей вокруг решения.
                </div>
              </Link>
              <Link
                to="/tools/schema-quiz"
                className="group rounded-2xl border border-border p-6 hover:border-primary/40 hover:bg-muted/40 transition-colors"
              >
                <div className="font-semibold mb-1 flex items-center justify-between">
                  Тест на схемы
                  <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </div>
                <div className="text-sm text-muted-foreground">
                  Если решение повторяет старый сценарий из жизни.
                </div>
              </Link>
              <Link
                to="/start"
                className="group rounded-2xl border border-border p-6 hover:border-primary/40 hover:bg-muted/40 transition-colors"
              >
                <div className="font-semibold mb-1 flex items-center justify-between">
                  Понять, с чего начать
                  <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </div>
                <div className="text-sm text-muted-foreground">
                  Короткий опросник для запроса в Telegram.
                </div>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default DecisionMatrixPage;
