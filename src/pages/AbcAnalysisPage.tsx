import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import { buildToolSchema } from "@/lib/toolSchema";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AbcAnalysis from "@/components/AbcAnalysis";

const toolSchema = buildToolSchema({
  name: "ABC-анализ",
  description: "Разберите свою ситуацию по модели Эллиса: событие → мысль → эмоция → диспут → новый взгляд. Бесплатный пошаговый инструмент когнитивно-поведенческой терапии.",
  path: "/tools/abc-analysis",
});

const AbcAnalysisPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="ABC-анализ — интерактивный инструмент КПТ | Психолог Дмитрий Яцко"
        description="Разберите свою ситуацию по модели Эллиса: событие → мысль → эмоция → диспут → новый взгляд. Бесплатный пошаговый инструмент когнитивно-поведенческой терапии."
        path="/tools/abc-analysis"
        schema={[toolSchema]}
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
      </main>

      <Footer />
    </div>
  );
};

export default AbcAnalysisPage;
