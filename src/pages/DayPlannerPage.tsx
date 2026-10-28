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
import DayPlanner from "@/components/DayPlanner";

const toolSchema = buildToolSchema({
  name: "Планировщик дня",
  description: "Бесплатный инструмент планирования дня по методу поведенческой активации: оценка энергии, три опоры (необходимое, удовольствие, смысл), минимальные версии и история за 14 дней.",
  path: "/tools/day-planner",
});

const faq = [
  { question: "Чем этот планировщик отличается от обычного списка дел?", answer: "Он строится вокруг вашей энергии, а не продуктивности. Вы оцениваете силы на завтра и выбираете всего три опоры: одно необходимое дело, одно приятное и одно ради результата или смысла." },
  { question: "Что такое минимальная версия действия?", answer: "Это самый маленький вариант дела, который реально сделать в плохой день: не «убрать квартиру», а «помыть одну чашку». Он помогает начать и не бросать план целиком." },
  { question: "Где хранятся мои планы?", answer: "Только в вашем браузере на этом устройстве. На сервер они не отправляются, поэтому с другого устройства их не будет видно." },
  { question: "Подходит ли планировщик при тяжёлой депрессии?", answer: "Он может быть поддержкой, но не заменяет лечение. Если сил нет почти ни на что несколько недель или появляются мысли о смерти, важно обратиться к специалисту." },
];

const faqSchema = buildFaqSchema(faq);

const DayPlannerPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="Планировщик дня при депрессии онлайн — поведенческая активация | Яцко"
        description="Бесплатный инструмент планирования дня по методу поведенческой активации: оценка энергии, три опоры (необходимое, удовольствие, смысл), минимальные версии и история за 14 дней."
        path="/tools/day-planner"
        schema={faqSchema ? [toolSchema, faqSchema] : [toolSchema]}
        breadcrumbs={[
          { name: "Главная", url: "https://cognitionx.cloud/" },
          { name: "Инструменты", url: "https://cognitionx.cloud/tools" },
          { name: "Планировщик дня", url: "https://cognitionx.cloud/tools/day-planner" },
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
            Планировщик <span className="text-primary">дня</span>
          </h1>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Реалистичный план дня по методу поведенческой активации. Не для максимальной
            продуктивности — а чтобы постепенно восстановить контакт с действиями, которые дают
            структуру, удовольствие и чувство влияния. Данные хранятся только в вашем браузере.
          </p>
        </header>

        <DayPlanner />

        <section className="mt-12 prose prose-invert prose-sm max-w-none">
          <h2 className="text-xl font-semibold text-foreground">Как пользоваться</h2>
          <ol className="text-muted-foreground space-y-2 leading-relaxed">
            <li><strong className="text-foreground">Наблюдайте 1–2 дня.</strong> Отметьте несколько действий и как они повлияли на энергию, удовольствие, чувство результата.</li>
            <li><strong className="text-foreground">Оцените завтрашнюю энергию.</strong> Планируйте под этот уровень, а не под желаемую восьмёрку.</li>
            <li><strong className="text-foreground">Три опоры, не больше.</strong> Одно необходимое, одно ради удовольствия, одно ради результата или смысла.</li>
            <li><strong className="text-foreground">Минимальная версия — не обман.</strong> Она снижает порог начала и сохраняет связь с направлением.</li>
            <li><strong className="text-foreground">Отметьте после действия.</strong> Полезное действие не обязано сразу улучшать настроение.</li>
          </ol>

          <h2 className="text-xl font-semibold text-foreground mt-8">Пример плана на день с низкой энергией</h2>
          <ul className="text-muted-foreground space-y-1.5 leading-relaxed">
            <li><strong className="text-foreground">Энергия:</strong> 3 из 10.</li>
            <li><strong className="text-foreground">Необходимое:</strong> оплатить счёт. Минимальная версия — открыть приложение банка.</li>
            <li><strong className="text-foreground">Удовольствие:</strong> послушать любимый альбом. Минимальная версия — одну песню.</li>
            <li><strong className="text-foreground">Смысл:</strong> написать другу. Минимальная версия — одно короткое сообщение.</li>
          </ul>

          <ToolFaq items={faq} />

          <h2 className="text-xl font-semibold text-foreground mt-8">Связанные материалы</h2>
          <ul className="text-muted-foreground space-y-1.5">
            <li>→ <Link to="/blog/planirovanie-dnya-pri-depressii" className="text-primary hover:underline">Статья: как планировать день при депрессии</Link></li>
            <li>→ <Link to="/tools/behavioral-activation" className="text-primary hover:underline">Дневник поведенческой активации</Link></li>
            <li>→ <Link to="/tools/thought-diary" className="text-primary hover:underline">Дневник мыслей (RFCBT)</Link></li>
            <li>→ <Link to="/tools/tests/phq-9" className="text-primary hover:underline">PHQ-9 — шкала депрессии</Link></li>
            <li>→ <Link to="/depression" className="text-primary hover:underline">Терапия при депрессии</Link></li>
          </ul>
        </section>
      </main>

      <ToolConsultCta tool="day_planner" />
      <Footer />
    </div>
  );
};

export default DayPlannerPage;
