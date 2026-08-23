import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import { buildToolSchema } from "@/lib/toolSchema";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BehavioralActivationDiary from "@/components/BehavioralActivationDiary";

const toolSchema = buildToolSchema({
  name: "Дневник поведенческой активации",
  description: "Отслеживайте активности, настроение, мастерство и удовольствие. Поведенческая активация — один из самых изученных методов работы с депрессией и апатией.",
  path: "/tools/behavioral-activation",
});

const BehavioralActivationPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="Дневник поведенческой активации — бесплатный инструмент при депрессии"
        description="Отслеживайте активности, настроение, мастерство и удовольствие. Поведенческая активация — один из самых изученных методов работы с депрессией и апатией."
        path="/tools/behavioral-activation"
        schema={[toolSchema]}
        breadcrumbs={[
          { name: "Главная", url: "https://cognitionx.cloud/" },
          { name: "Инструменты", url: "https://cognitionx.cloud/tools" },
          { name: "Поведенческая активация", url: "https://cognitionx.cloud/tools/behavioral-activation" },
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
            Дневник <span className="text-primary">поведенческой активации</span>
          </h1>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            При депрессии и апатии мозг хуже вырабатывает дофамин — двигатель «не заводится» сам.
            Запускает его действие, а не ожидание настроения. Этот дневник помогает фиксировать активности
            и видеть, какие из них реально поднимают настроение, дают чувство мастерства и удовольствия.
          </p>
        </header>

        <BehavioralActivationDiary />

        <section className="mt-12 prose prose-invert prose-sm max-w-none">
          <h2 className="text-xl font-semibold text-foreground">Как пользоваться</h2>
          <ol className="text-muted-foreground space-y-2 leading-relaxed">
            <li><strong className="text-foreground">Записывайте активности</strong> — даже самые мелкие: умылся, позвонил маме, прогулялся 10 минут.</li>
            <li><strong className="text-foreground">Оценивайте по трём шкалам:</strong> настроение после, мастерство (насколько было сложно/хорошо получилось), удовольствие.</li>
            <li><strong className="text-foreground">Смотрите аналитику</strong> — какие категории дают больше энергии. Планируйте больше таких на неделе.</li>
          </ol>

          <h2 className="text-xl font-semibold text-foreground mt-8">Связанные материалы</h2>
          <ul className="text-muted-foreground space-y-1.5">
            <li>→ <Link to="/blog/kogda-nichego-ne-hochetsya" className="text-primary hover:underline">Когда ничего не хочется — это не про силу воли</Link></li>
            <li>→ <Link to="/depression" className="text-primary hover:underline">Терапия при депрессии</Link></li>
            <li>→ <Link to="/tools/abc-analysis" className="text-primary hover:underline">ABC-анализ мыслей</Link></li>
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BehavioralActivationPage;
