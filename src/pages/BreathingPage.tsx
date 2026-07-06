import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BreathingExercise from "@/components/BreathingExercise";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Почему длинный выдох успокаивает?",
    answer:
      "Длинный выдох активирует блуждающий нерв и парасимпатическую нервную систему — ту часть автономной регуляции, которая отвечает за «отдых и восстановление». Пульс замедляется, давление снижается, тело получает сигнал: «острой опасности нет». Это не эзотерика, а базовая физиология.",
  },
  {
    question: "Какой ритм выбрать: 4-6 или 4-7-8?",
    answer:
      "Начинайте с 4-6: вдох 4 счёта, выдох 6, без задержек. Это самый универсальный ритм, он редко вызывает дискомфорт. К 4-7-8 переходите, только если задержка дыхания вам приятна. Если появляется головокружение или ещё больше тревоги — вернитесь к 4-6.",
  },
  {
    question: "Сколько нужно делать, чтобы почувствовать эффект?",
    answer:
      "Обычно 6–8 циклов — это 1–2 минуты. У большинства людей уже к концу первой минуты пульс замедляется, а телесное напряжение снижается на 10–20%. Задача не «полностью успокоиться», а немного снизить обороты, чтобы вернуть себе выбор.",
  },
  {
    question: "Что делать, если дыхание усиливает тревогу?",
    answer:
      "Так бывает, особенно если есть страх нехватки воздуха или паника. Не заставляйте себя. Замените дыхание на заземление (назвать 5 предметов вокруг), холодную воду на лицо или мягкую мышечную релаксацию. Дыхание — лишь один из инструментов, а не единственный правильный.",
  },
  {
    question: "Можно ли использовать это при панической атаке?",
    answer:
      "Да, но осторожно. При панике дыхательные техники помогают, если они уже отработаны в спокойном состоянии. Если вы никогда так не дышали — на пике паники не время учиться. Лучше сначала практиковать 1–2 минуты в день в фоновом режиме, а потом использовать во время приступа.",
  },
];

const BreathingPage = () => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Как дышать, чтобы успокоиться",
    description:
      "Пошаговая инструкция: дыхание с длинным выдохом для быстрого снижения тревоги.",
    step: [
      { "@type": "HowToStep", name: "Сядьте удобно", text: "Расслабьте плечи, поставьте стопы на пол. Одну ладонь можно положить на живот." },
      { "@type": "HowToStep", name: "Вдохните на 4", text: "Медленный вдох через нос на 4 счёта. Живот немного расширяется." },
      { "@type": "HowToStep", name: "Выдохните на 6", text: "Плавный выдох через рот или нос на 6 счётов. Выдох заметно длиннее вдоха." },
      { "@type": "HowToStep", name: "Повторите 6–8 раз", text: "Достаточно 1–2 минут. Заметьте разницу в теле после последнего цикла." },
    ],
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="Дыхание для успокоения онлайн — таймер 4-6 и 4-7-8 | Дмитрий Яцко"
        description="Интерактивный таймер дыхания: 4-6, 4-7-8, квадратное дыхание. Длинный выдох снижает тревогу за 1–2 минуты. Бесплатно, без регистрации."
        path="/tools/breathing"
        schema={[faqSchema, howToSchema]}
        breadcrumbs={[
          { name: "Главная", url: "https://cognitionx.cloud/" },
          { name: "Инструменты", url: "https://cognitionx.cloud/tools" },
          { name: "Дыхание для успокоения", url: "https://cognitionx.cloud/tools/breathing" },
        ]}
      />
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <Button variant="ghost" size="sm" asChild className="gap-2 mb-8 text-muted-foreground">
          <Link to="/tools">
            <ArrowLeft className="w-4 h-4" /> Инструменты
          </Link>
        </Button>

        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Дыхание с длинным выдохом
          </h1>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Интерактивный таймер, который ведёт вас через цикл вдоха, задержки и
            выдоха. Помогает быстро снизить тревогу за 1–2 минуты. Выберите ритм,
            нажмите «Начать» и следуйте кругу.
          </p>
        </header>

        <BreathingExercise />

        <section className="mt-16 prose prose-invert max-w-none">
          <h2 className="text-2xl font-bold tracking-tight">Как это работает</h2>
          <p className="text-foreground/85 leading-relaxed">
            Когда тревожно, дыхание становится быстрым и поверхностным — тело
            получает сигнал «опасность продолжается». Длинный выдох делает
            обратное: активирует блуждающий нерв и парасимпатическую систему.
            Пульс замедляется, мышцы отпускаются, ум перестаёт цепляться за
            каждую тревожную мысль. Это не «расслабление ради расслабления», а
            прямая физиологическая обратная связь.
          </p>

          <h2 className="text-2xl font-bold tracking-tight mt-10">
            Как пользоваться таймером
          </h2>
          <ol className="space-y-3 list-decimal pl-5 text-foreground/85">
            <li>
              <strong>Выберите ритм.</strong> Начните с <em>4-6</em>. К <em>4-7-8</em>
              переходите, только если задержка вам приятна.
            </li>
            <li>
              <strong>Сядьте удобно.</strong> Стопы на полу, плечи мягкие. Можно
              положить ладонь на живот.
            </li>
            <li>
              <strong>Нажмите «Начать».</strong> Следуйте кругу: он расширяется на
              вдохе и сжимается на выдохе.
            </li>
            <li>
              <strong>6–8 циклов.</strong> Обычно этого достаточно, чтобы почувствовать
              разницу. Не гонитесь за «полным успокоением».
            </li>
            <li>
              <strong>Заметьте разницу.</strong> После — сравните: как было и как
              стало. Даже 10–20% снижения — это уже результат.
            </li>
          </ol>

          <h2 className="text-2xl font-bold tracking-tight mt-10">
            Когда не подходит
          </h2>
          <ul className="space-y-2 list-disc pl-5 text-foreground/85">
            <li>
              <strong>Задержки усиливают тревогу.</strong> Выберите 4-6 без пауз или
              замените технику на заземление.
            </li>
            <li>
              <strong>Головокружение.</strong> Не дышите глубже обычного — важна
              длина выдоха, а не объём.
            </li>
            <li>
              <strong>Паническая атака в первый раз.</strong> Дыхание работает
              лучше, если техника уже освоена в спокойном состоянии.
            </li>
          </ul>

          <h2 className="text-2xl font-bold tracking-tight mt-10">Часто задаваемые вопросы</h2>
        </section>

        <Accordion type="single" collapsible className="mt-6">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`f-${i}`}>
              <AccordionTrigger className="text-left">{f.question}</AccordionTrigger>
              <AccordionContent className="text-foreground/85 leading-relaxed">
                {f.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 rounded-2xl border border-primary/20 bg-primary/5 p-6">
          <h2 className="text-xl font-bold mb-2">Связанные материалы</h2>
          <ul className="space-y-1.5 text-sm">
            <li>
              <Link to="/blog/kak-uspokoitsya" className="text-primary underline">
                Статья: как быстро успокоиться — 5 техник за 2 минуты
              </Link>
            </li>
            <li>
              <Link to="/blog/panicheskaya-ataka-chto-delat" className="text-primary underline">
                Паническая атака: что делать прямо сейчас
              </Link>
            </li>
            <li>
              <Link to="/tools/tests/gad-7" className="text-primary underline">
                Тест GAD-7 — оценить уровень тревоги
              </Link>
            </li>
            <li>
              <Link to="/tools/emotion-wheel" className="text-primary underline">
                Колесо эмоций — назвать чувство точнее
              </Link>
            </li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BreathingPage;
