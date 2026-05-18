import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

type Example = {
  context: string;
  situation: string;
  abstract: {
    text: string;
    why: string;
  };
  concrete: {
    text: string;
    why: string;
  };
  diff: string;
};

const examples: Example[] = [
  {
    context: "После рабочей презентации",
    situation:
      "Презентация прошла напряжённо: руководитель задал три неудобных вопроса, на один я не ответил.",
    abstract: {
      text: "«Почему я опять не справляюсь? Что со мной не так?»",
      why: "Вопрос «почему» уводит в оценку себя и обобщения: «опять», «всегда», «со мной не так».",
    },
    concrete: {
      text: "«Что именно я не знал к этому вопросу — и где найти ответ к следующему разу?»",
      why: "Вопрос «что именно» сужает фокус до одного факта, который можно проверить и закрыть.",
    },
    diff: "Абстрактная мысль превращает один эпизод в приговор себе. Конкретная — превращает его в задачу.",
  },
  {
    context: "После ссоры с близким",
    situation:
      "Вечером был тяжёлый разговор. Он закончился молчанием, и теперь крутится в голове третий час.",
    abstract: {
      text: "«Почему у нас всё всегда вот так? Почему он меня не понимает?»",
      why: "«Всегда», «не понимает» — это уже выводы о человеке и отношениях, а не о разговоре.",
    },
    concrete: {
      text: "«Какие три фразы стали поворотными — и что именно я хотел донести в каждой?»",
      why: "Конкретные детали возвращают к разговору, который можно пересказать или продолжить.",
    },
    diff: "«Почему всегда» закрывает обсуждение. «Какие три фразы» — открывает.",
  },
  {
    context: "Утро после плохой ночи",
    situation:
      "Проснулся разбитый, без сил, с тяжестью в груди. Лежу и думаю, что снова всё плохо.",
    abstract: {
      text: "«Почему мне опять плохо? Когда это закончится?»",
      why: "Вопрос охватывает всё состояние сразу — и тело, и жизнь, и будущее. На него нельзя ответить.",
    },
    concrete: {
      text: "«Что было вчера вечером: во сколько лёг, что ел, сколько кофе, какой был последний разговор?»",
      why: "Это вопросы, на которые есть ответы. И часть из них — рычаги, которые можно подвинуть сегодня.",
    },
    diff: "Абстрактный вопрос ищет смысл состояния. Конкретный — его механику.",
  },
  {
    context: "После отказа",
    situation:
      "Написала человеку, ответ пришёл через сутки и довольно сухой. С тех пор не могу сосредоточиться.",
    abstract: {
      text: "«Почему со мной так нельзя по-человечески? Что со мной не так?»",
      why: "Один сухой ответ превращается в утверждение о себе и о том, как к тебе вообще относятся.",
    },
    concrete: {
      text: "«Что именно было в сообщении — и что я знаю про его день вчера?»",
      why: "Возвращает в реальность: текст сообщения и контекст другого человека — а не вывод о себе.",
    },
    diff: "«Почему со мной» сразу делает тебя причиной. «Что именно» оставляет место для других объяснений.",
  },
  {
    context: "Накатило в середине дня",
    situation:
      "Вроде всё нормально, но накатила тяжесть и мысль: «Зачем я вообще что-то делаю?»",
    abstract: {
      text: "«Зачем всё это? Какой во всём этом смысл?»",
      why: "Слишком крупный вопрос — он не помещается в один день и в одну голову.",
    },
    concrete: {
      text: "«Что я сделал за последние 3 дня — и что из этого было хоть немного важно или приятно?»",
      why: "Маленький, конкретный список почти всегда честнее, чем чувство «ничего не происходит».",
    },
    diff: "«Зачем всё» парализует. «Что за 3 дня» возвращает к материалу, с которым можно работать.",
  },
];

const keyReplacements = [
  ["«Почему я такой?»", "«Что именно произошло?»"],
  ["«Зачем я вообще?»", "«Что я сделал — и что мог бы?»"],
  ["«Почему со мной всегда так?»", "«Как это началось в тот раз?»"],
  ["«Почему мне не становится лучше?»", "«Что изменилось за последнюю неделю?»"],
];

const AbstractToConcreteTool = () => {
  const [step, setStep] = useState(0);
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [done, setDone] = useState(false);

  const total = examples.length;
  const current = examples[step];
  const isRevealed = !!revealed[step];

  const reveal = () => setRevealed((r) => ({ ...r, [step]: true }));

  const next = () => {
    if (step < total - 1) {
      setStep(step + 1);
    } else {
      setDone(true);
    }
  };

  const prev = () => {
    if (step > 0) setStep(step - 1);
  };

  const restart = () => {
    setStep(0);
    setRevealed({});
    setDone(false);
  };

  if (done) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 md:p-10 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
          <Sparkles className="h-5 w-5" />
        </div>
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-3">
          Разница — в одном слове
        </h2>
        <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto">
          «Почему» ищет смысл и оценку. «Как», «что», «когда» ищут факты и действие.
          Одно закрывает, другое открывает.
        </p>

        <div className="mt-8 text-left rounded-xl border border-border bg-muted/40 p-5 md:p-6 max-w-xl mx-auto">
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-medium mb-4">
            Ключевые замены
          </div>
          <ul className="space-y-3">
            {keyReplacements.map(([from, to]) => (
              <li key={from} className="flex items-start gap-3 text-sm leading-relaxed">
                <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                <span>
                  <span className="text-muted-foreground line-through decoration-muted-foreground/40">
                    {from}
                  </span>
                  <span className="mx-2 text-muted-foreground">→</span>
                  <span className="text-foreground font-medium">{to}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm text-muted-foreground mt-6 max-w-xl mx-auto leading-relaxed">
          Это навык, который тренируется. Поначалу конкретные вопросы кажутся странными —
          слишком маленькими. Но именно в деталях находится выход из петли.
        </p>

        <Button onClick={restart} variant="outline" size="lg" className="mt-8 gap-2">
          <RotateCcw className="h-4 w-4" /> Пройти ещё раз
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Intro */}
      <div className="rounded-xl border border-border bg-muted/40 p-5 mb-6 text-sm text-muted-foreground leading-relaxed">
        Ниже — реальные примеры мыслей, которые застревают. Для каждой есть{" "}
        <span className="text-foreground font-medium">абстрактная версия</span> (та, что
        крутится в голове) и{" "}
        <span className="text-foreground font-medium">конкретная альтернатива</span> (та,
        что помогает двигаться). Читай и замечай разницу.
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5">
          {examples.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === step
                  ? "w-6 bg-primary"
                  : i < step
                    ? "w-1.5 bg-primary/50"
                    : "w-1.5 bg-muted-foreground/20"
              }`}
            />
          ))}
        </div>
        <div className="text-xs font-mono text-muted-foreground">
          {String(step + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </div>
      </div>

      {/* Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="rounded-2xl border border-border bg-card overflow-hidden"
        >
          {/* Context */}
          <div className="px-5 md:px-7 pt-5 md:pt-6">
            <div className="text-[11px] uppercase tracking-[0.16em] font-mono text-muted-foreground mb-2">
              {current.context}
            </div>
            <p className="text-base md:text-lg italic text-muted-foreground leading-relaxed pb-5 border-b border-border">
              {current.situation}
            </p>
          </div>

          {/* Abstract */}
          <div className="p-5 md:p-7 pb-3 md:pb-4">
            <div
              className="rounded-xl p-4 md:p-5"
              style={{
                background: "hsl(12 70% 96%)",
                border: "1px solid hsl(12 65% 80%)",
              }}
            >
              <div
                className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.14em] font-semibold mb-2"
                style={{ color: "hsl(12 65% 38%)" }}
              >
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ background: "hsl(12 65% 45%)" }}
                />
                Абстрактная мысль
              </div>
              <p
                className="text-base md:text-lg italic leading-snug"
                style={{ color: "hsl(12 60% 25%)" }}
              >
                {current.abstract.text}
              </p>
              <p
                className="mt-3 pt-3 text-xs md:text-sm leading-relaxed border-t"
                style={{
                  color: "hsl(12 40% 35%)",
                  borderColor: "hsl(12 50% 80%)",
                }}
              >
                {current.abstract.why}
              </p>
            </div>
          </div>

          {/* Reveal / Concrete */}
          {!isRevealed ? (
            <div className="px-5 md:px-7 pb-5 md:pb-7">
              <button
                onClick={reveal}
                className="w-full font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground border border-dashed border-border rounded-xl py-3.5 hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors"
              >
                Показать конкретную альтернативу
              </button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-5 md:px-7 pb-4">
                <div
                  className="rounded-xl p-4 md:p-5"
                  style={{
                    background: "hsl(150 50% 95%)",
                    border: "1px solid hsl(150 45% 70%)",
                  }}
                >
                  <div
                    className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.14em] font-semibold mb-2"
                    style={{ color: "hsl(150 60% 28%)" }}
                  >
                    <span
                      className="inline-block h-1.5 w-1.5 rounded-full"
                      style={{ background: "hsl(150 55% 35%)" }}
                    />
                    Конкретная альтернатива
                  </div>
                  <p
                    className="text-base md:text-lg leading-snug font-medium"
                    style={{ color: "hsl(150 60% 18%)" }}
                  >
                    {current.concrete.text}
                  </p>
                  <p
                    className="mt-3 pt-3 text-xs md:text-sm leading-relaxed border-t"
                    style={{
                      color: "hsl(150 35% 30%)",
                      borderColor: "hsl(150 40% 75%)",
                    }}
                  >
                    {current.concrete.why}
                  </p>
                </div>
              </div>

              <div className="px-5 md:px-7 pb-6">
                <div className="rounded-lg bg-muted/50 p-4 text-sm leading-relaxed text-muted-foreground">
                  <span className="text-foreground font-medium">В чём разница: </span>
                  {current.diff}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Nav */}
      <div className="flex items-center gap-3 mt-6">
        <Button
          variant="outline"
          onClick={prev}
          disabled={step === 0}
          className="gap-1.5"
        >
          <ArrowLeft className="h-4 w-4" /> Назад
        </Button>
        <Button onClick={next} disabled={!isRevealed} className="flex-1 gap-1.5">
          {step === total - 1 ? "Завершить" : "Следующий пример"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default AbstractToConcreteTool;
