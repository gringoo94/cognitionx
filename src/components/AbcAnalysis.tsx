import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, RotateCcw, MessageCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";

type StepKey = "A" | "B" | "C" | "D" | "E";

const steps: {
  key: StepKey;
  title: string;
  subtitle: string;
  prompt: string;
  hint: string;
  placeholder: string;
  color: string;
}[] = [
  {
    key: "A",
    title: "Событие",
    subtitle: "Activating event",
    prompt: "Что произошло?",
    hint: "Опишите ситуацию так, как её зафиксировала бы камера: где, когда, что именно случилось, что было сказано или сделано. Без оценок, выводов и догадок о чужих намерениях.",
    placeholder: "Например: вчера в 19:40 я отправил коллеге сообщение по проекту. К концу дня он его не прочитал.",
    color: "text-sky-400",
  },
  {
    key: "B",
    title: "Мысль",
    subtitle: "Belief",
    prompt: "О чём вы подумали?",
    hint: "Что пронеслось в голове сразу после события — буквально, своими словами. Часто это короткие фразы: «он на меня злится», «я опять всё испортил», «так будет всегда». Запишите всё, не отбирая «правильное».",
    placeholder: "Например: «Я написал что-то не то. Он обиделся. Завтра будет холодно общаться».",
    color: "text-violet-400",
  },
  {
    key: "C",
    title: "Эмоция и реакция",
    subtitle: "Consequence",
    prompt: "Что вы почувствовали и что сделали?",
    hint: "Назовите эмоцию одним словом и оцените её силу от 0 до 100. Отметьте, что происходило в теле и какой возник импульс — что захотелось сделать или, наоборот, чего избежать.",
    placeholder: "Например: тревога 75, напряжение в груди, хотелось каждые пять минут проверять мессенджер.",
    color: "text-rose-400",
  },
  {
    key: "D",
    title: "Проверка мысли",
    subtitle: "Disputation",
    prompt: "Насколько эта мысль соответствует фактам?",
    hint: "Какие данные подтверждают мысль, а какие — противоречат ей? Есть ли другие объяснения произошедшему? Что бы вы сказали близкому человеку, если бы он пришёл к вам с такой мыслью?",
    placeholder: "Например: прямых признаков обиды нет. Он часто отвечает на следующий день. Сегодня у него был дедлайн. Если бы это рассказал друг, я бы сказал, что он накручивает.",
    color: "text-emerald-400",
  },
  {
    key: "E",
    title: "Новый взгляд",
    subtitle: "New effect",
    prompt: "Какая формулировка точнее — и что с эмоцией теперь?",
    hint: "Цель — не «думать позитивно», а сформулировать мысль, которая ближе к реальности и которой вы действительно можете верить. Снова оцените эмоцию от 0 до 100: чаще всего её интенсивность снижается, даже если не уходит совсем.",
    placeholder: "Например: «Я не знаю, почему он молчит. Скорее всего, дело не во мне. Дождусь утра и спрошу напрямую». Тревога 35.",
    color: "text-amber-400",
  },
];

const AbcAnalysis = () => {
  const [stage, setStage] = useState<"intro" | "practice" | "result">("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<StepKey, string>>({
    A: "", B: "", C: "", D: "", E: "",
  });

  const step = steps[current];
  const progress = ((current + 1) / steps.length) * 100;

  const update = (val: string) => setAnswers((p) => ({ ...p, [step.key]: val }));

  const next = () => {
    if (current < steps.length - 1) setCurrent((c) => c + 1);
    else setStage("result");
  };
  const prev = () => current > 0 && setCurrent((c) => c - 1);

  const restart = () => {
    setAnswers({ A: "", B: "", C: "", D: "", E: "" });
    setCurrent(0);
    setStage("intro");
  };

  // ---------- THEORY (intro) ----------
  if (stage === "intro") {
    return (
      <div className="space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            <span className="text-primary">ABC-анализ:</span> как мысли превращают событие в эмоцию
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Кажется очевидным, что нас расстраивают сами события: разговор, письмо, чужое молчание.
            На самом деле между событием и эмоцией всегда есть промежуточное звено — то, как мы это
            событие объясняем себе. ABC-анализ — простой способ сделать это звено видимым и
            проверить, насколько оно соответствует реальности.
          </p>
          <blockquote className="rounded-xl border border-border bg-card p-5 text-sm italic text-muted-foreground">
            «Людей расстраивают не сами вещи, а представления о них».
            <div className="not-italic text-xs mt-2 text-muted-foreground/70">
              — Эпиктет, «Энхиридион», ок. 125 г. н. э.
            </div>
          </blockquote>
        </motion.div>

        {/* Model */}
        <section className="space-y-5">
          <h2 className="text-xl font-semibold">Из чего состоит модель</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Модель предложил психолог Альберт Эллис в 1950-х годах; позже она стала одной из основ
            когнитивно-поведенческой терапии. Она раскладывает любой эмоциональный эпизод на пять
            понятных шагов.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {steps.map((s) => (
              <div
                key={s.key}
                className="rounded-xl border border-border bg-card p-3 text-center"
              >
                <div className={`text-2xl font-bold ${s.color}`}>{s.key}</div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground mt-1">
                  {s.title}
                </div>
                <div className="text-[10px] text-muted-foreground/70 mt-1 leading-tight">
                  {s.key === "A" && "Что произошло — только факты"}
                  {s.key === "B" && "Как вы это объяснили"}
                  {s.key === "C" && "Что почувствовали и сделали"}
                  {s.key === "D" && "Проверка мысли на точность"}
                  {s.key === "E" && "Более точная формулировка"}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
            <div className="text-xs uppercase tracking-wider text-primary font-semibold mb-2">
              Ключевая идея
            </div>
            <p className="text-sm leading-relaxed text-foreground/90">
              Событие (A) не вызывает эмоцию (C) напрямую. Между ними всегда есть интерпретация (B) —
              то, как мы это событие объясняем себе. Именно она во многом определяет силу и оттенок
              переживания. Это не значит, что «достаточно подумать иначе и всё пройдёт». Это значит,
              что у эмоции есть точка, в которой с ней можно работать — не подавляя чувства, а уточняя
              мысль, из которой они выросли.
            </p>
          </div>
        </section>

        {/* Example */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Как это работает — на примере</h2>
          <p className="text-sm text-muted-foreground">
            Коллега прошёл по коридору и не поздоровался. Событие одно, но в зависимости от мысли
            эмоция получается совершенно разной.
          </p>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-4 py-3 font-semibold text-sky-400 w-28 align-top">A — факт</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    Коллега прошёл мимо в коридоре и не поздоровался
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-violet-400 align-top">B — мысль 1</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    «Он на меня злится. Значит, я что-то сделал не так. Вдруг это плохо кончится»
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-rose-400 align-top">C — эмоция</td>
                  <td className="px-4 py-3 text-muted-foreground">Тревога 80, ком в горле, тянет перепроверять переписку</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-violet-400 align-top">B — мысль 2</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    «Скорее всего, он торопился или о чём-то задумался»
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-rose-400 align-top">C — эмоция</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    Лёгкое любопытство, в целом — почти ничего
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground">
            Событие одно и то же. Меняется только мысль — а вместе с ней меняется и эмоция.
          </p>
        </section>

        {/* Steps */}
        <section className="space-y-5">
          <h2 className="text-xl font-semibold">Пятишаговый алгоритм</h2>
          <div className="space-y-3">
            {steps.map((s) => (
              <div
                key={s.key}
                className="flex gap-4 rounded-xl border border-border bg-card p-4"
              >
                <div className={`text-xl font-bold ${s.color} w-6 shrink-0`}>{s.key}</div>
                <div className="text-sm text-muted-foreground leading-relaxed">
                  <span className="text-foreground font-medium">{s.title}.</span>{" "}
                  {s.hint}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Mistakes */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Что мешает — три частые ошибки</h2>
          <ul className="space-y-2 text-sm">
            {[
              "Путать A и B. «Меня игнорировали» — это уже интерпретация, не факт. Факт: «Он не ответил на моё сообщение в течение дня». Чем точнее A, тем яснее становится, где именно «работает» ваша мысль.",
              "Останавливаться на поверхностной мысли. «Он злится» — это не ключевое убеждение. Спросите себя: «А если это правда — что это говорит обо мне?» Обычно нужно 2–3 шага вглубь.",
              "Заменять D на «думать позитивно». Диспут — это не «верить в хорошее», это честный взгляд на доказательства. Если мысль подкрепляется фактами — значит, проблема реальна и нужно другое решение, а не переформулировка.",
            ].map((t, i) => (
              <li
                key={i}
                className="flex gap-3 rounded-xl border border-border bg-card p-4 text-muted-foreground leading-relaxed"
              >
                <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* CTA to practice */}
        <section className="text-center space-y-4 py-4">
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            Практика
          </div>
          <h2 className="text-2xl font-bold">Попробуйте прямо сейчас</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Выберите ситуацию из последнего времени и пройдите по шагам.
          </p>
          <Button size="lg" onClick={() => setStage("practice")} className="gap-2">
            Начать практику <ArrowRight className="h-4 w-4" />
          </Button>
        </section>
      </div>
    );
  }

  // ---------- RESULT ----------
  if (stage === "result") {
    return (
      <div className="max-w-2xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3"
        >
          <CheckCircle2 className="h-10 w-10 text-primary mx-auto" />
          <h2 className="text-2xl font-bold">Ваш ABC-разбор</h2>
          <p className="text-sm text-muted-foreground">
            Сохраните этот текст или скопируйте — это первая запись вашего «дневника мыслей».
          </p>
        </motion.div>

        <div className="space-y-3">
          {steps.map((s, i) => (
            <motion.div
              key={s.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="flex items-baseline gap-3 mb-2">
                <span className={`text-xl font-bold ${s.color}`}>{s.key}</span>
                <span className="font-semibold">{s.title}</span>
                <span className="text-xs text-muted-foreground/70 ml-auto">{s.subtitle}</span>
              </div>
              <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                {answers[s.key] || (
                  <span className="text-muted-foreground italic">— не заполнено —</span>
                )}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center space-y-4">
          <MessageCircle className="w-8 h-8 text-primary mx-auto" />
          <h3 className="text-xl font-bold">Хотите разобрать сложную ситуацию вместе?</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            ABC-анализ — базовый инструмент КПТ. На терапии мы идём глубже: к ключевым убеждениям,
            схемам и ранним опытам, которые формируют автоматические мысли.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <a href="https://t.me/gringoo94">Написать в Telegram</a>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/#booking">Заполнить форму</Link>
            </Button>
          </div>
        </div>

        <div className="flex justify-center gap-3">
          <Button variant="ghost" size="sm" onClick={restart} className="gap-2">
            <RotateCcw className="h-4 w-4" /> Пройти снова
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/tools" className="gap-2">
              К другим инструментам <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // ---------- PRACTICE ----------
  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>Шаг {current + 1} из {steps.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2 mb-8">
        {steps.map((s, i) => (
          <button
            key={s.key}
            onClick={() => setCurrent(i)}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${
              i === current
                ? "border-primary bg-primary/10"
                : answers[s.key]
                ? "border-border bg-card"
                : "border-border/50 bg-card/50"
            }`}
          >
            <span className={`text-base font-bold ${s.color}`}>{s.key}</span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {s.title}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step.key}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          <div>
            <div className={`text-xs uppercase tracking-wider font-semibold ${step.color} mb-1`}>
              {step.key} — {step.subtitle}
            </div>
            <h3 className="text-xl font-bold mb-2">{step.prompt}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{step.hint}</p>
          </div>

          <Textarea
            value={answers[step.key]}
            onChange={(e) => update(e.target.value)}
            placeholder={step.placeholder}
            rows={5}
            className="resize-none"
          />
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between mt-6">
        <Button variant="ghost" size="sm" onClick={prev} disabled={current === 0} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Назад
        </Button>
        <Button onClick={next} className="gap-2">
          {current === steps.length - 1 ? "Показать итог" : "Дальше"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default AbcAnalysis;
