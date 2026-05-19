import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThoughtDiary from "@/components/ThoughtDiary";

const ThoughtDiaryPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="Дневник мыслей — рабочий лист РКПТ онлайн | Дмитрий Яцко"
        description="Бесплатный рабочий лист для работы с руминацией: что было до, какие мысли, «почему» или «что именно», что было после. Между сессиями. По методу RFCBT."
        path="/tools/thought-diary"
        breadcrumbs={[
          { name: "Главная", url: "https://cognitionx.cloud/" },
          { name: "Инструменты", url: "https://cognitionx.cloud/tools" },
          { name: "Дневник мыслей", url: "https://cognitionx.cloud/tools/thought-diary" },
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
            Дневник <span className="text-primary">мыслей</span>
          </h1>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Рабочий лист для между сессиями. Помогает заметить, что запускает руминацию и чем отличаются
            эпизоды, когда мысли застревают, от тех, когда — нет. По методу RFCBT (Эдвард Уоткинс).
          </p>
        </header>

        <ThoughtDiary />

        <section className="mt-12 prose prose-invert prose-sm max-w-none">
          <h2 className="text-xl font-semibold text-foreground">Как пользоваться</h2>
          <ol className="text-muted-foreground space-y-2 leading-relaxed">
            <li><strong className="text-foreground">Не в момент руминации.</strong> Подойдите к листу позже, когда станет спокойнее — так наблюдение точнее.</li>
            <li><strong className="text-foreground">Опишите контекст.</strong> Что было за 5–10 минут до того, как мысли начали крутиться.</li>
            <li><strong className="text-foreground">Различайте стиль.</strong> «Почему»-мысли абстрактны и усугубляют состояние; «что именно»-мысли конкретны и ведут к решению.</li>
            <li><strong className="text-foreground">Сравните с эпизодами «когда не застревало».</strong> Там обычно прячется ответ — что помогает именно вам.</li>
          </ol>

          <h2 className="text-xl font-semibold text-foreground mt-8">Связанные материалы</h2>
          <ul className="text-muted-foreground space-y-1.5">
            <li>→ <Link to="/tools/abstract-to-concrete" className="text-primary hover:underline">Тренажёр «как думать иначе» (RFCBT)</Link></li>
            <li>→ <Link to="/tools/tests/rrs-rumination" className="text-primary hover:underline">RRS — шкала руминации</Link></li>
            <li>→ <Link to="/tools/abc-analysis" className="text-primary hover:underline">ABC-анализ мыслей</Link></li>
            <li>→ <Link to="/depression" className="text-primary hover:underline">Терапия при депрессии</Link></li>
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ThoughtDiaryPage;
