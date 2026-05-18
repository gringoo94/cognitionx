import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AbstractToConcreteTool from "@/components/AbstractToConcreteTool";
import { SITE_URL } from "@/lib/globalSchema";

const AbstractToConcretePage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="Как думать иначе — переключение с «почему» на «как» | RFCBT"
        description="Интерактивный инструмент по методу RFCBT Эдварда Уоткинса: учитесь заменять руминативные «почему» на конкретные вопросы, которые открывают выход из петли."
        path="/tools/abstract-to-concrete"
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
            Как думать иначе
          </h1>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Руминация усиливается, когда мы спрашиваем «почему». Конкретные вопросы
            открывают выход. Пройдите 5 примеров и потренируйте переключение.
          </p>
        </header>

        <AbstractToConcreteTool />

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

      <Footer />
    </div>
  );
};

export default AbstractToConcretePage;
