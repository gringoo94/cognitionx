import ToolConsultCta from "@/components/ToolConsultCta";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import { buildToolSchema } from "@/lib/toolSchema";
import { buildFaqSchema } from "@/lib/geoSchema";
import ToolFaq from "@/components/ToolFaq";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AbstractToConcreteTool from "@/components/AbstractToConcreteTool";
import { SITE_URL } from "@/lib/globalSchema";

const toolSchema = buildToolSchema({
  name: "Как думать иначе (RFCBT)",
  description: "Интерактивный инструмент по методу RFCBT Эдварда Уоткинса: учитесь заменять руминативные «почему» на конкретные вопросы, которые открывают выход из петли.",
  path: "/tools/abstract-to-concrete",
});

const faq = [
  { question: "Почему вопросы «почему» усиливают руминацию?", answer: "Вопросы вроде «почему это случилось со мной?» обычно не имеют точного ответа, поэтому мысли ходят по кругу. Вопросы «что именно произошло?» и «какой следующий шаг?» конкретны и помогают перейти к действию." },
  { question: "Что такое RFCBT?", answer: "Это когнитивно-поведенческая терапия, направленная на руминацию. Её разработал британский психолог Эдвард Уоткинс. Один из ключевых навыков метода — переключение с абстрактного стиля мышления на конкретный." },
  { question: "Сколько нужно тренироваться?", answer: "Достаточно пройти 5 примеров здесь, а затем замечать «почему»-вопросы в жизни и переформулировать их. Навык укрепляется от повторения в реальных ситуациях." },
];

const faqSchema = buildFaqSchema(faq);

const AbstractToConcretePage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="Как остановить руминацию: тренажёр «почему → как» онлайн (RFCBT) | Яцко"
        description="Интерактивный инструмент по методу RFCBT Эдварда Уоткинса: учитесь заменять руминативные «почему» на конкретные вопросы, которые открывают выход из петли."
        path="/tools/abstract-to-concrete"
        schema={faqSchema ? [toolSchema, faqSchema] : [toolSchema]}
        breadcrumbs={[
          { name: "Главная", url: `${SITE_URL}/` },
          { name: "Инструменты", url: `${SITE_URL}/tools` },
          { name: "Как думать иначе", url: `${SITE_URL}/tools/abstract-to-concrete` },
        ]}
      />
      <Navbar />

      <main className="max-w-2xl mx-auto px-6 py-16 md:py-24">
        <Button variant="ghost" size="sm" asChild className="gap-2 mb-8 text-muted-foreground">
          <Link to="/tools">
            <ArrowLeft className="w-4 h-4" /> Инструменты
          </Link>
        </Button>

        <header className="mb-10">
          <div className="text-[11px] uppercase tracking-[0.18em] text-primary font-semibold mb-3">
            RFCBT · Психообразование
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-4">
            Как думать иначе: тренажёр против руминации
          </h1>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Руминация усиливается, когда мы спрашиваем «почему». Конкретные вопросы
            открывают выход. Пройдите 5 примеров и потренируйте переключение.
          </p>
        </header>

        <AbstractToConcreteTool />

        <section className="mt-12">
          <h2 className="text-xl font-semibold text-foreground">Пример переключения</h2>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Абстрактно:</strong> «Почему я всегда всё порчу в отношениях?»
          </p>
          <p className="mt-1 text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Конкретно:</strong> «Что именно произошло во вчерашнем разговоре? В какой момент он пошёл не так? Что я могу сказать иначе в следующий раз?»
          </p>
        </section>

        <ToolFaq items={faq} />

        <div className="mt-12 rounded-xl border border-border bg-muted/40 p-5 text-sm text-muted-foreground leading-relaxed">
          Подробнее о методе — в статье{" "}
          <Link
            to="/blog/rfcbt-dva-stilya-myshleniya"
            className="text-primary hover:underline font-medium"
          >
            RFCBT: два стиля мышления и три техники переключения
          </Link>
          .
        </div>
      </main>

      <ToolConsultCta tool="abstract_to_concrete" />
      <Footer />
    </div>
  );
};

export default AbstractToConcretePage;
