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
import BehavioralActivationDiary from "@/components/BehavioralActivationDiary";

const toolSchema = buildToolSchema({
  name: "Дневник поведенческой активации",
  description: "Отслеживайте активности, настроение, мастерство и удовольствие. Поведенческая активация — один из самых изученных методов работы с депрессией и апатией.",
  path: "/tools/behavioral-activation",
});

const faq = [
  { question: "Что такое поведенческая активация?", answer: "Это метод когнитивно-поведенческой терапии, который хорошо изучен при депрессии. Идея простая: не ждать, пока появится настроение, а постепенно возвращать в жизнь действия, которые дают удовольствие, чувство результата и смысл." },
  { question: "Как оценивать мастерство и удовольствие?", answer: "По шкале от 0 до 10 сразу после действия. Мастерство — насколько получилось справиться с учётом вашего состояния сегодня. Удовольствие — насколько было приятно. Низкие оценки тоже полезны: они показывают, что стоит заменить или упростить." },
  { question: "Где хранятся мои записи?", answer: "Только в вашем браузере на этом устройстве. На сервер они не отправляются. Если очистить данные браузера или открыть сайт с другого устройства, записей там не будет." },
  { question: "Что делать, если ничего не хочется делать?", answer: "Начните с очень маленького действия на 2–5 минуты: умыться, выйти на балкон, написать одно сообщение. Если апатия держится больше двух недель или появляются мысли о том, что жить не хочется, обратитесь к специалисту." },
];

const faqSchema = buildFaqSchema(faq);

const BehavioralActivationPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="Дневник поведенческой активации онлайн — при депрессии и апатии | Яцко"
        description="Отслеживайте активности, настроение, мастерство и удовольствие. Поведенческая активация — один из самых изученных методов работы с депрессией и апатией."
        path="/tools/behavioral-activation"
        schema={faqSchema ? [toolSchema, faqSchema] : [toolSchema]}
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
            При депрессии и апатии трудно начать что-то делать, пока не появится настроение. Поведенческая
            активация предлагает обратный порядок: сначала небольшое действие, потом — наблюдение за тем,
            как оно повлияло. Дневник помогает увидеть, какие занятия дают удовольствие и чувство результата.
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

          <h2 className="text-xl font-semibold text-foreground mt-8">Пример записи</h2>
          <p className="text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Вторник, 18:00.</strong> Прогулка 15 минут вокруг дома. Настроение до — 3, после — 5.
            Мастерство — 6 (было трудно выйти, но получилось). Удовольствие — 4.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Через неделю таких записей обычно видно, что именно чуть-чуть помогает: короткие прогулки,
            разговор с близким, простое домашнее дело. Их и стоит понемногу добавлять в план.
          </p>

          <ToolFaq items={faq} />

          <h2 className="text-xl font-semibold text-foreground mt-8">Связанные материалы</h2>
          <ul className="text-muted-foreground space-y-1.5">
            <li>→ <Link to="/blog/kogda-nichego-ne-hochetsya" className="text-primary hover:underline">Когда ничего не хочется — это не про силу воли</Link></li>
            <li>→ <Link to="/depression" className="text-primary hover:underline">Терапия при депрессии</Link></li>
            <li>→ <Link to="/tools/day-planner" className="text-primary hover:underline">Планировщик дня</Link></li>
            <li>→ <Link to="/cbtworkbook" className="text-primary hover:underline">Онлайн-тетрадь КПТ</Link></li>
            <li>→ <Link to="/tools/abc-analysis" className="text-primary hover:underline">ABC-анализ мыслей</Link></li>
          </ul>
        </section>
      </main>

      <ToolConsultCta tool="behavioral_activation" />
      <Footer />
    </div>
  );
};

export default BehavioralActivationPage;
