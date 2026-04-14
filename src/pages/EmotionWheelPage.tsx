import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EmotionWheel from "@/components/EmotionWheel";

const EmotionWheelPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="Колесо эмоций — интерактивный инструмент | Психолог Дмитрий Яцко"
        description="Интерактивное колесо эмоций: исследуйте 13 категорий и 87 эмоций. Нажмите на сектор, чтобы узнать больше о каждой группе переживаний."
        path="/tools/emotion-wheel"
        breadcrumbs={[
          { name: "Главная", url: "https://cognitionx.cloud/" },
          { name: "Инструменты", url: "https://cognitionx.cloud/tools" },
          { name: "Колесо эмоций", url: "https://cognitionx.cloud/tools/emotion-wheel" },
        ]}
      />
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <Button variant="ghost" size="sm" asChild className="gap-2 mb-8 text-muted-foreground">
          <Link to="/tools">
            <ArrowLeft className="w-4 h-4" /> Инструменты
          </Link>
        </Button>

        <EmotionWheel />
      </main>

      <Footer />
    </div>
  );
};

export default EmotionWheelPage;
