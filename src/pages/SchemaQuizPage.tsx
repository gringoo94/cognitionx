import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SchemaQuiz from "@/components/SchemaQuiz";

const SchemaQuizPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="Тест на схемы — экспресс-версия YSQ | Психолог Дмитрий Яцко"
        description="Бесплатный экспресс-тест на 18 ранних дезадаптивных схем по модели Джеффри Янга. 36 вопросов, 5-7 минут. Узнайте свои глубинные паттерны."
        path="/tools/schema-quiz"
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

        <SchemaQuiz />
      </main>

      <Footer />
    </div>
  );
};

export default SchemaQuizPage;
