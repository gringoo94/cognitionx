import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Copy,
  Printer,
  Check,
  MessageCircle,
  Compass,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

// External GPT helper link. Leave as "PASTE_GPT_LINK_HERE" to keep the button
// disabled until a real link is provided.
export const DECISION_MATRIX_GPT_URL = "PASTE_GPT_LINK_HERE";
const isGptLinkReady = (url: string) =>
  !!url && url.trim() !== "" && url !== "PASTE_GPT_LINK_HERE";

// ---------- Types ----------
type Stage = "intro" | "setup" | "practice" | "result";

type DecisionType =
  | "work"
  | "emigration"
  | "relationships"
  | "therapy"
  | "family"
  | "money"
  | "study"
  | "other";

interface Answers {
  decisionType: DecisionType | "";
  decision: string;
  nameA: string;
  descriptionA: string;
  nameB: string;
  descriptionB: string;
  prosA: string;
  consA: string;
  prosB: string;
  consB: string;
  values: string[];
  mainValue: string;
  fears: string[];
  worstCase: string;
  externalInfluences: string[];
  expectations: string;
  inactionCost: string;
  reversibility: string;
  bodyA: string[];
  bodyB: string[];
  catastrophizing: string;
  factsVsAssumptions: string;
  experiment: string;
  nextStep: string;
  clarity: number;
}

const EMPTY: Answers = {
  decisionType: "",
  decision: "",
  nameA: "",
  descriptionA: "",
  nameB: "",
  descriptionB: "",
  prosA: "",
  consA: "",
  prosB: "",
  consB: "",
  values: [],
  mainValue: "",
  fears: [],
  worstCase: "",
  externalInfluences: [],
  expectations: "",
  inactionCost: "",
  reversibility: "",
  bodyA: [],
  bodyB: [],
  catastrophizing: "",
  factsVsAssumptions: "",
  experiment: "",
  nextStep: "",
  clarity: 5,
};

const STORAGE_KEY = "decisionMatrixDraft";

const DECISION_TYPES: { value: DecisionType; label: string }[] = [
  { value: "work", label: "Работа / карьера" },
  { value: "emigration", label: "Эмиграция / переезд" },
  { value: "relationships", label: "Отношения" },
  { value: "therapy", label: "Терапия / помощь" },
  { value: "family", label: "Семья" },
  { value: "money", label: "Деньги" },
  { value: "study", label: "Учёба" },
  { value: "other", label: "Другое" },
];

const VALUES = [
  "Безопасность", "Свобода", "Близость", "Развитие", "Стабильность",
  "Здоровье", "Деньги", "Семья", "Честность", "Автономия",
  "Принадлежность", "Смысл", "Спокойствие", "Профессиональный рост",
  "Творчество", "Забота о себе", "Справедливость", "Признание",
  "Духовность", "Игра / лёгкость",
];

const FEARS = [
  "Ошибиться", "Разочаровать других", "Потерять деньги", "Остаться одному",
  "Потерять стабильность", "Не справиться", "Пожалеть", "Быть осуждённым",
  "Сделать больно другому", "Выбрать неправильно", "Начать и бросить",
  "Столкнуться с неизвестностью", "Потерять время", "Потерять отношения",
  "Потерять себя",
];

const INFLUENCES = [
  "Партнёр", "Родители", "Дети", "Друзья", "Коллеги", "Руководитель",
  "Общество / культура", "Финансовые обязательства",
  "Никто явно, но я чувствую давление",
];

const REVERSIBILITY = [
  "Почти полностью обратимо",
  "Частично обратимо",
  "Трудно обратимо",
  "Почти необратимо",
  "Не знаю",
];

const BODY_SENSATIONS = [
  "Облегчение", "Напряжение", "Сжатие в груди", "Тяжесть",
  "Энергию", "Спокойствие", "Страх", "Злость", "Пустоту",
  "Интерес", "Не понимаю",
];

// ---------- Step definitions ----------
type StepId =
  | "decision" | "varA" | "varB" | "prosA" | "consA" | "prosB" | "consB"
  | "values" | "fears" | "external" | "inaction" | "reversibility"
  | "body" | "catastrophizing" | "experiment" | "nextStep" | "clarity";

interface StepDef {
  id: StepId;
  title: string;
  required: boolean;
  isValid: (a: Answers) => boolean;
}

const STEPS: StepDef[] = [
  { id: "decision", title: "Решение", required: true, isValid: (a) => a.decision.trim().length > 0 },
  { id: "varA", title: "Вариант A", required: true, isValid: (a) => a.nameA.trim().length > 0 },
  { id: "varB", title: "Вариант B", required: true, isValid: (a) => a.nameB.trim().length > 0 },
  { id: "prosA", title: "Плюсы A", required: false, isValid: () => true },
  { id: "consA", title: "Цена A", required: false, isValid: () => true },
  { id: "prosB", title: "Плюсы B", required: false, isValid: () => true },
  { id: "consB", title: "Цена B", required: false, isValid: () => true },
  { id: "values", title: "Ценности", required: false, isValid: () => true },
  { id: "fears", title: "Страхи", required: false, isValid: () => true },
  { id: "external", title: "Чужие ожидания", required: false, isValid: () => true },
  { id: "inaction", title: "Цена бездействия", required: false, isValid: () => true },
  { id: "reversibility", title: "Обратимость", required: false, isValid: () => true },
  { id: "body", title: "Тело", required: false, isValid: () => true },
  { id: "catastrophizing", title: "Катастрофизация", required: false, isValid: () => true },
  { id: "experiment", title: "Эксперимент", required: true, isValid: (a) => a.experiment.trim().length > 0 },
  { id: "nextStep", title: "Шаг на 48 часов", required: true, isValid: (a) => a.nextStep.trim().length > 0 },
  { id: "clarity", title: "Ясность", required: false, isValid: () => true },
];

// ---------- Helpers ----------
const toggle = (arr: string[], v: string) =>
  arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

const track = (event: string) => {
  try {
    // @ts-expect-error gtag
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      // @ts-expect-error gtag
      window.gtag("event", event, { tool: "decision_matrix" });
    }
  } catch {
    /* noop */
  }
};

// ---------- Component ----------
const DecisionMatrix = () => {
  const [stage, setStage] = useState<Stage>("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Answers>(EMPTY);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [hasDraft, setHasDraft] = useState(false);
  const [copied, setCopied] = useState(false);
  const restoredRef = useRef(false);

  // Detect existing draft on mount
  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object" && parsed.answers) {
          setHasDraft(true);
        }
      }
    } catch {
      /* noop */
    }
  }, []);

  // Autosave
  useEffect(() => {
    if (stage === "intro") return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ stage, current, answers, timestamp: Date.now() }),
      );
    } catch {
      /* noop */
    }
  }, [stage, current, answers]);

  const continueDraft = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      setAnswers({ ...EMPTY, ...parsed.answers });
      setCurrent(typeof parsed.current === "number" ? parsed.current : 0);
      setStage(parsed.stage === "result" ? "result" : "practice");
      setHasDraft(false);
    } catch {
      /* noop */
    }
  };

  const restart = () => {
    setAnswers(EMPTY);
    setCurrent(0);
    setValidationError(null);
    setStage("intro");
    setHasDraft(false);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* noop */ }
    track("decision_matrix_restart");
  };

  const startPractice = () => {
    setStage("setup");
    track("decision_matrix_start");
  };

  const beginSteps = () => {
    setStage("practice");
    setCurrent(0);
  };

  const step = STEPS[current];
  const progress = ((current + 1) / STEPS.length) * 100;

  const next = () => {
    if (step.required && !step.isValid(answers)) {
      setValidationError("Заполните коротко — даже одной фразы достаточно.");
      return;
    }
    setValidationError(null);
    track("decision_matrix_step_completed");
    if (current < STEPS.length - 1) setCurrent((c) => c + 1);
    else {
      setStage("result");
      track("decision_matrix_result_viewed");
    }
  };

  const prev = () => {
    setValidationError(null);
    if (current > 0) setCurrent((c) => c - 1);
    else setStage("setup");
  };

  // ---------- INTRO ----------
  if (stage === "intro") {
    return (
      <div className="space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            <span className="text-primary">Матрица выбора:</span> разберите сложное решение без давления
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Сначала спокойно распишите свой выбор здесь: варианты, сомнения, страхи, ценности и
            возможный первый шаг. А когда получите результат, сможете открыть GPT-помощника и
            глубже разобрать ситуацию в диалоге.
          </p>
          <p className="text-sm text-muted-foreground/90 italic">
            Не нужно принимать окончательное решение прямо сейчас. Задача матрицы — сначала
            навести порядок в мыслях.
          </p>
        </motion.div>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Как это работает</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { n: "1", t: "Заполните матрицу", d: "Опишите варианты, что вас притягивает, что тревожит и что будет ценой бездействия." },
              { n: "2", t: "Получите структурированный результат", d: "Инструмент соберёт ваши ответы в понятную карту выбора — без попытки решить за вас." },
              { n: "3", t: "Разберите глубже в GPT", d: "Скопируйте готовый промпт и откройте GPT-помощника, чтобы уточнить ценности, страхи и следующий безопасный шаг." },
            ].map((s) => (
              <div key={s.n} className="rounded-xl border border-border bg-card p-4">
                <div className="text-xs font-semibold text-primary mb-2">Шаг {s.n}</div>
                <div className="font-semibold text-sm mb-1.5 leading-snug">{s.t}</div>
                <div className="text-xs text-muted-foreground leading-relaxed">{s.d}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-primary/20 bg-primary/5 p-5 space-y-3">
          <div className="flex items-center gap-2 text-primary">
            <MessageCircle className="h-4 w-4" />
            <h2 className="text-base font-semibold">Можно продолжить разбор в GPT</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            После заполнения матрицы вы сможете скопировать готовый промпт и открыть
            GPT-помощника. Он задаст уточняющие вопросы, поможет отделить факты от страхов и
            сформулировать следующий небольшой шаг. GPT не выбирает за вас и не заменяет
            консультацию.
          </p>
          <Button size="sm" variant="outline" onClick={startPractice} className="gap-2">
            Сначала заполнить матрицу <ArrowRight className="h-4 w-4" />
          </Button>
        </section>

        {hasDraft && (
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-5 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div className="text-sm">
              <div className="font-semibold mb-1">У вас есть незавершённый разбор</div>
              <div className="text-muted-foreground">Можно продолжить с того места, где вы остановились.</div>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button size="sm" onClick={continueDraft}>Продолжить</Button>
              <Button size="sm" variant="outline" onClick={restart}>Начать заново</Button>
            </div>
          </div>
        )}

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Для каких решений подходит</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              "Уехать или остаться?",
              "Менять работу или нет?",
              "Начинать терапию или подождать?",
              "Расставаться или пробовать восстановить отношения?",
              "Переезжать в другую страну?",
              "Говорить прямо или промолчать?",
              "Брать новый проект или отказаться?",
              "Идти к психологу или справиться самому?",
            ].map((t) => (
              <div key={t} className="rounded-xl border border-border bg-card p-3 text-xs text-muted-foreground leading-snug">
                {t}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground leading-relaxed">
          Инструмент не принимает решение за вас и не заменяет консультацию психолога. Он помогает
          структурировать мысли и подготовиться к разговору со специалистом.
        </section>

        <section className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 flex gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-sm text-foreground/90 leading-relaxed">
            Если выбор связан с насилием, угрозой безопасности, суицидальными мыслями, зависимостью
            или острым кризисом — не используйте этот инструмент как единственную опору. Обратитесь
            за срочной помощью в вашей стране.
          </p>
        </section>

        <div className="text-center">
          <Button size="lg" onClick={startPractice} className="gap-2">
            Начать разбор <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  // ---------- SETUP ----------
  if (stage === "setup") {
    return (
      <div className="space-y-8 max-w-2xl mx-auto">
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-wider text-primary font-semibold">Шаг 1 из 2</div>
          <h2 className="text-2xl font-bold">Какой выбор вы сейчас разбираете?</h2>
          <p className="text-sm text-muted-foreground">
            Это нужно, чтобы в конце дать чуть более точные подсказки. Можно выбрать «Другое».
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {DECISION_TYPES.map((t) => {
            const active = answers.decisionType === t.value;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => setAnswers((a) => ({ ...a, decisionType: t.value }))}
                className={`rounded-xl border p-3 text-sm text-left transition-colors ${
                  active
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="flex justify-between">
          <Button variant="ghost" onClick={() => setStage("intro")} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Назад
          </Button>
          <Button onClick={beginSteps} disabled={!answers.decisionType} className="gap-2">
            Дальше <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  // ---------- RESULT ----------
  if (stage === "result") {
    return <ResultView answers={answers} onRestart={restart} onCopied={() => setCopied(true)} copied={copied} setCopied={setCopied} />;
  }

  // ---------- PRACTICE ----------
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Шаг {current + 1} из {STEPS.length}</span>
          <span>{step.title}</span>
        </div>
        <Progress value={progress} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="space-y-5"
        >
          <StepBody step={step} answers={answers} setAnswers={setAnswers} />
        </motion.div>
      </AnimatePresence>

      {validationError && (
        <div className="rounded-lg border border-amber-500/40 bg-amber-500/5 p-3 text-sm text-amber-600 dark:text-amber-400">
          {validationError}
        </div>
      )}

      <div className="flex justify-between pt-2">
        <Button variant="ghost" onClick={prev} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Назад
        </Button>
        <Button onClick={next} className="gap-2">
          {current === STEPS.length - 1 ? "Показать результат" : "Дальше"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

// ---------- Step body renderer ----------
const StepBody = ({
  step,
  answers,
  setAnswers,
}: {
  step: StepDef;
  answers: Answers;
  setAnswers: React.Dispatch<React.SetStateAction<Answers>>;
}) => {
  switch (step.id) {
    case "decision":
      return (
        <Field
          title="Какое решение вы пытаетесь принять?"
          hint="Сформулируйте выбор как вопрос между вариантами."
        >
          <Textarea
            maxLength={500}
            placeholder="Например: уехать или остаться? менять работу или нет? начинать терапию или подождать?"
            value={answers.decision}
            onChange={(e) => setAnswers((a) => ({ ...a, decision: e.target.value }))}
            className="min-h-[120px]"
          />
        </Field>
      );

    case "varA":
      return (
        <div className="space-y-5">
          <Field title="Вариант A">
            <Input
              placeholder="Например: остаться на текущей работе"
              value={answers.nameA}
              onChange={(e) => setAnswers((a) => ({ ...a, nameA: e.target.value }))}
            />
          </Field>
          <Field
            title="Что будет, если вы выберете этот вариант?"
            hint="Опишите, как может выглядеть жизнь через неделю, месяц или год."
          >
            <Textarea
              value={answers.descriptionA}
              onChange={(e) => setAnswers((a) => ({ ...a, descriptionA: e.target.value }))}
              className="min-h-[120px]"
            />
          </Field>
        </div>
      );

    case "varB":
      return (
        <div className="space-y-5">
          <Field title="Вариант B">
            <Input
              placeholder="Например: уволиться и искать новую работу"
              value={answers.nameB}
              onChange={(e) => setAnswers((a) => ({ ...a, nameB: e.target.value }))}
            />
          </Field>
          <Field title="Что будет, если вы выберете этот вариант?">
            <Textarea
              value={answers.descriptionB}
              onChange={(e) => setAnswers((a) => ({ ...a, descriptionB: e.target.value }))}
              className="min-h-[120px]"
            />
          </Field>
        </div>
      );

    case "prosA":
      return (
        <Field
          title="Что хорошего может дать вариант A?"
          hint="Подумайте не только о рациональных плюсах. Что этот вариант даёт телу, нервной системе, отношениям, деньгам, безопасности, ценностям?"
        >
          <Textarea
            value={answers.prosA}
            onChange={(e) => setAnswers((a) => ({ ...a, prosA: e.target.value }))}
            className="min-h-[140px]"
          />
        </Field>
      );

    case "consA":
      return (
        <Field
          title="Какую цену вы заплатите за вариант A?"
          hint="Что придётся терпеть, откладывать или потерять? Что может ухудшиться через месяц или год?"
        >
          <Textarea
            value={answers.consA}
            onChange={(e) => setAnswers((a) => ({ ...a, consA: e.target.value }))}
            className="min-h-[140px]"
          />
        </Field>
      );

    case "prosB":
      return (
        <Field title="Что хорошего может дать вариант B?">
          <Textarea
            value={answers.prosB}
            onChange={(e) => setAnswers((a) => ({ ...a, prosB: e.target.value }))}
            className="min-h-[140px]"
          />
        </Field>
      );

    case "consB":
      return (
        <Field title="Какую цену вы заплатите за вариант B?">
          <Textarea
            value={answers.consB}
            onChange={(e) => setAnswers((a) => ({ ...a, consB: e.target.value }))}
            className="min-h-[140px]"
          />
        </Field>
      );

    case "values":
      return (
        <div className="space-y-5">
          <Field title="Какие ценности стоят за этим выбором?" hint="Выберите всё, что откликается.">
            <ChipMulti
              options={VALUES}
              value={answers.values}
              onChange={(v) => setAnswers((a) => ({ ...a, values: v }))}
              accent="emerald"
            />
          </Field>
          <Field title="Какая ценность сейчас кажется самой важной?">
            <Input
              value={answers.mainValue}
              onChange={(e) => setAnswers((a) => ({ ...a, mainValue: e.target.value }))}
            />
          </Field>
        </div>
      );

    case "fears":
      return (
        <div className="space-y-5">
          <Field title="Чего вы больше всего боитесь?">
            <ChipMulti
              options={FEARS}
              value={answers.fears}
              onChange={(v) => setAnswers((a) => ({ ...a, fears: v }))}
              accent="amber"
            />
          </Field>
          <Field title="Если самый страшный сценарий случится, что именно произойдёт?">
            <Textarea
              value={answers.worstCase}
              onChange={(e) => setAnswers((a) => ({ ...a, worstCase: e.target.value }))}
            />
          </Field>
        </div>
      );

    case "external":
      return (
        <div className="space-y-5">
          <Field title="Кто ещё влияет на это решение?">
            <ChipMulti
              options={INFLUENCES}
              value={answers.externalInfluences}
              onChange={(v) => setAnswers((a) => ({ ...a, externalInfluences: v }))}
            />
          </Field>
          <Field title="Чего, как вам кажется, от вас ждут?">
            <Textarea
              value={answers.expectations}
              onChange={(e) => setAnswers((a) => ({ ...a, expectations: e.target.value }))}
            />
          </Field>
        </div>
      );

    case "inaction":
      return (
        <Field
          title="Что будет, если вы ничего не выберете?"
          hint="Иногда «не выбирать» — тоже выбор. Какую цену вы уже платите за откладывание?"
        >
          <Textarea
            value={answers.inactionCost}
            onChange={(e) => setAnswers((a) => ({ ...a, inactionCost: e.target.value }))}
            className="min-h-[140px]"
          />
        </Field>
      );

    case "reversibility":
      return (
        <Field
          title="Насколько это решение обратимо?"
          hint="Если решение хотя бы частично обратимо, возможно, не нужно выбирать «навсегда». Можно начать с эксперимента."
        >
          <RadioGroup
            value={answers.reversibility}
            onValueChange={(v) => setAnswers((a) => ({ ...a, reversibility: v }))}
            className="space-y-2"
          >
            {REVERSIBILITY.map((r) => (
              <label
                key={r}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 cursor-pointer hover:border-primary/40"
              >
                <RadioGroupItem value={r} id={r} />
                <span className="text-sm">{r}</span>
              </label>
            ))}
          </RadioGroup>
        </Field>
      );

    case "body":
      return (
        <div className="space-y-5">
          <Field title={`Когда я представляю вариант A${answers.nameA ? ` (${answers.nameA})` : ""}, я чувствую…`}>
            <ChipMulti
              options={BODY_SENSATIONS}
              value={answers.bodyA}
              onChange={(v) => setAnswers((a) => ({ ...a, bodyA: v }))}
            />
          </Field>
          <Field title={`Когда я представляю вариант B${answers.nameB ? ` (${answers.nameB})` : ""}, я чувствую…`}>
            <ChipMulti
              options={BODY_SENSATIONS}
              value={answers.bodyB}
              onChange={(v) => setAnswers((a) => ({ ...a, bodyB: v }))}
            />
          </Field>
        </div>
      );

    case "catastrophizing":
      return (
        <div className="space-y-5">
          <Field
            title="Какие страшные сценарии крутятся в голове?"
            hint="Катастрофизация — когда мозг сразу показывает худший сценарий как почти неизбежный."
          >
            <Textarea
              value={answers.catastrophizing}
              onChange={(e) => setAnswers((a) => ({ ...a, catastrophizing: e.target.value }))}
            />
          </Field>
          <Field title="Что из этого факт, а что предположение?">
            <Textarea
              value={answers.factsVsAssumptions}
              onChange={(e) => setAnswers((a) => ({ ...a, factsVsAssumptions: e.target.value }))}
            />
          </Field>
        </div>
      );

    case "experiment":
      return (
        <Field
          title="Какой маленький эксперимент можно сделать без окончательного решения?"
          hint={experimentHintByType(answers.decisionType)}
        >
          <Textarea
            value={answers.experiment}
            onChange={(e) => setAnswers((a) => ({ ...a, experiment: e.target.value }))}
            className="min-h-[140px]"
          />
        </Field>
      );

    case "nextStep":
      return (
        <Field
          title="Какой один шаг вы готовы сделать в ближайшие 48 часов?"
          hint="Маленький, реальный шаг. Не «решить всю жизнь», а сделать одно действие."
        >
          <Textarea
            value={answers.nextStep}
            onChange={(e) => setAnswers((a) => ({ ...a, nextStep: e.target.value }))}
            className="min-h-[120px]"
          />
        </Field>
      );

    case "clarity":
      return (
        <Field title="Насколько стало яснее?">
          <div className="space-y-4">
            <Slider
              min={0}
              max={10}
              step={1}
              value={[answers.clarity]}
              onValueChange={([v]) => setAnswers((a) => ({ ...a, clarity: v }))}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0 — всё так же запутано</span>
              <span className="font-semibold text-foreground">{answers.clarity}</span>
              <span>10 — понимаю следующий шаг</span>
            </div>
          </div>
        </Field>
      );

    default:
      return null;
  }
};

const experimentHintByType = (t: DecisionType | ""): string => {
  switch (t) {
    case "work":
      return "Например: обновить резюме, поговорить с руководителем, взять отпуск, обсудить нагрузку, посмотреть вакансии.";
    case "emigration":
      return "Например: пожить в городе 1–2 недели, посчитать бюджет, поговорить с людьми, узнать документы.";
    case "relationships":
      return "Например: провести один честный разговор, договориться о сроке наблюдения, пойти на одну консультацию.";
    case "therapy":
      return "Например: начать с одной диагностической консультации, а не с обязательства на долгий курс.";
    default:
      return "Маленький шаг, который ничего не решает «навсегда», но даёт реальную информацию.";
  }
};

// ---------- UI primitives ----------
const Field = ({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-3">
    <div>
      <h3 className="text-lg font-semibold leading-snug">{title}</h3>
      {hint && <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{hint}</p>}
    </div>
    {children}
  </div>
);

const ChipMulti = ({
  options,
  value,
  onChange,
  accent = "primary",
}: {
  options: string[];
  value: string[];
  onChange: (v: string[]) => void;
  accent?: "primary" | "emerald" | "amber";
}) => {
  const activeCls =
    accent === "emerald"
      ? "border-emerald-500/60 bg-emerald-500/10 text-foreground"
      : accent === "amber"
      ? "border-amber-500/60 bg-amber-500/10 text-foreground"
      : "border-primary bg-primary/10 text-foreground";
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = value.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(toggle(value, opt))}
            className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
              active ? activeCls : "border-border bg-card text-muted-foreground hover:border-primary/40"
            }`}
          >
            <span className="inline-flex items-center gap-1.5">
              {active && <Check className="h-3 w-3" />}
              {opt}
            </span>
          </button>
        );
      })}
    </div>
  );
};

// ---------- Result ----------
const ResultView = ({
  answers,
  onRestart,
  copied,
  setCopied,
  onCopied,
}: {
  answers: Answers;
  onRestart: () => void;
  copied: boolean;
  setCopied: (v: boolean) => void;
  onCopied: () => void;
}) => {
  const observations = useMemo(() => {
    const list: string[] = [];
    if (answers.inactionCost.trim().length > 30) {
      list.push("Вы подробно описали цену бездействия. Возможно, откладывание уже само по себе стало источником напряжения.");
    }
    if (answers.fears.length >= 4) {
      list.push("В ответах много страхов. Это не значит, что вариант плохой — возможно, нервная система пытается защитить вас от неопределённости.");
    }
    if (
      answers.reversibility === "Почти полностью обратимо" ||
      answers.reversibility === "Частично обратимо"
    ) {
      list.push("Если решение хотя бы частично обратимо, можно начать не с окончательного выбора, а с маленького эксперимента.");
    }
    if (answers.clarity <= 3) {
      list.push("Похоже, выбор всё ещё сильно заряжен. Это нормально: иногда решение невозможно «додумать» в одиночку. Можно принести этот результат на диагностическую консультацию.");
    }
    if (answers.decisionType === "therapy") {
      list.push("Если выбор связан с терапией, не обязательно сразу решаться на долгий курс. Можно начать с одной диагностической консультации.");
    }
    return list;
  }, [answers]);

  const text = useMemo(() => buildResultText(answers), [answers]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onCopied();
      track("decision_matrix_copy_result");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* noop */
    }
  };

  const print = () => {
    if (typeof window !== "undefined") window.print();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3"
      >
        <CheckCircle2 className="h-10 w-10 text-primary mx-auto" />
        <h2 className="text-2xl font-bold">Ваш разбор выбора</h2>
        <p className="text-sm text-muted-foreground">
          Это не готовый ответ, а карта: что стоит за выбором, где страхи, где ценности, и какой
          следующий шаг можно сделать без давления.
        </p>
      </motion.div>

      <div className="space-y-3 print:space-y-2">
        <ResultBlock title="Решение">{answers.decision || "—"}</ResultBlock>

        <ResultBlock title={`Вариант A${answers.nameA ? `: ${answers.nameA}` : ""}`}>
          {answers.descriptionA && <p className="mb-2"><span className="text-muted-foreground">Как выглядит: </span>{answers.descriptionA}</p>}
          {answers.prosA && <p className="mb-2"><span className="text-emerald-500">Что даёт: </span>{answers.prosA}</p>}
          {answers.consA && <p><span className="text-amber-500">Цена: </span>{answers.consA}</p>}
          {!answers.descriptionA && !answers.prosA && !answers.consA && <span className="text-muted-foreground italic">— не заполнено —</span>}
        </ResultBlock>

        <ResultBlock title={`Вариант B${answers.nameB ? `: ${answers.nameB}` : ""}`}>
          {answers.descriptionB && <p className="mb-2"><span className="text-muted-foreground">Как выглядит: </span>{answers.descriptionB}</p>}
          {answers.prosB && <p className="mb-2"><span className="text-emerald-500">Что даёт: </span>{answers.prosB}</p>}
          {answers.consB && <p><span className="text-amber-500">Цена: </span>{answers.consB}</p>}
          {!answers.descriptionB && !answers.prosB && !answers.consB && <span className="text-muted-foreground italic">— не заполнено —</span>}
        </ResultBlock>

        {(answers.values.length > 0 || answers.mainValue) && (
          <ResultBlock title="Ценности">
            {answers.values.length > 0 && <p className="mb-2">{answers.values.join(", ")}</p>}
            {answers.mainValue && <p><span className="text-muted-foreground">Главная: </span>{answers.mainValue}</p>}
          </ResultBlock>
        )}

        {(answers.fears.length > 0 || answers.worstCase) && (
          <ResultBlock title="Страхи">
            {answers.fears.length > 0 && <p className="mb-2">{answers.fears.join(", ")}</p>}
            {answers.worstCase && <p><span className="text-muted-foreground">Страшный сценарий: </span>{answers.worstCase}</p>}
          </ResultBlock>
        )}

        {(answers.externalInfluences.length > 0 || answers.expectations) && (
          <ResultBlock title="Чужие ожидания">
            {answers.externalInfluences.length > 0 && <p className="mb-2">{answers.externalInfluences.join(", ")}</p>}
            {answers.expectations && <p>{answers.expectations}</p>}
          </ResultBlock>
        )}

        {answers.inactionCost && <ResultBlock title="Цена бездействия">{answers.inactionCost}</ResultBlock>}
        {answers.reversibility && <ResultBlock title="Обратимость решения">{answers.reversibility}</ResultBlock>}

        {(answers.bodyA.length > 0 || answers.bodyB.length > 0) && (
          <ResultBlock title="Телесная реакция">
            {answers.bodyA.length > 0 && <p className="mb-1"><span className="text-muted-foreground">A: </span>{answers.bodyA.join(", ")}</p>}
            {answers.bodyB.length > 0 && <p><span className="text-muted-foreground">B: </span>{answers.bodyB.join(", ")}</p>}
          </ResultBlock>
        )}

        {(answers.catastrophizing || answers.factsVsAssumptions) && (
          <ResultBlock title="Катастрофизация">
            {answers.catastrophizing && <p className="mb-2">{answers.catastrophizing}</p>}
            {answers.factsVsAssumptions && <p><span className="text-muted-foreground">Факты vs предположения: </span>{answers.factsVsAssumptions}</p>}
          </ResultBlock>
        )}

        <ResultBlock title="Первый безопасный эксперимент" accent="blue">{answers.experiment}</ResultBlock>
        <ResultBlock title="Шаг на ближайшие 48 часов" accent="primary">{answers.nextStep}</ResultBlock>
        <ResultBlock title="Уровень ясности">{answers.clarity} из 10</ResultBlock>
      </div>

      {observations.length > 0 && (
        <section className="rounded-xl border border-primary/20 bg-primary/5 p-5 space-y-2 print:hidden">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-primary font-semibold">
            <Compass className="h-4 w-4" /> Что заметно в ответах
          </div>
          <ul className="space-y-2 text-sm text-foreground/90 leading-relaxed">
            {observations.map((o, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-primary mt-1.5 h-1 w-1 rounded-full bg-primary shrink-0" />
                <span>{o}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 md:p-8 text-center space-y-4 print:hidden">
        <MessageCircle className="w-8 h-8 text-primary mx-auto" />
        <h3 className="text-xl font-bold">Хотите разобрать это решение вместе?</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          Сложные решения часто невозможно «додумать» в одиночку — внутри смешиваются страхи,
          ценности, вина, ожидания других и усталость от неопределённости. Отправьте результат
          через короткий опросник — я посмотрю ответы и подскажу, с чего можно начать.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
          <Button asChild size="lg" className="gap-2">
            <Link
              to="/start?source=decision-matrix"
              onClick={() => track("decision_matrix_send_to_start")}
            >
              Отправить на мини-разбор
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="gap-2">
            <Link
              to="/contact"
              onClick={() => track("decision_matrix_contact_click")}
            >
              Записаться на диагностическую консультацию
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 justify-center print:hidden">
        <Button variant="outline" size="sm" onClick={copy} className="gap-2">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Скопировано" : "Скопировать результат"}
        </Button>
        <Button variant="outline" size="sm" onClick={print} className="gap-2">
          <Printer className="h-4 w-4" /> Распечатать / сохранить PDF
        </Button>
        <Button variant="outline" size="sm" onClick={onRestart} className="gap-2">
          <RotateCcw className="h-4 w-4" /> Пройти заново
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/tools">К другим инструментам</Link>
        </Button>
      </div>
    </div>
  );
};

const ResultBlock = ({
  title,
  children,
  accent,
}: {
  title: string;
  children: React.ReactNode;
  accent?: "blue" | "primary";
}) => {
  const border =
    accent === "blue"
      ? "border-sky-500/30 bg-sky-500/5"
      : accent === "primary"
      ? "border-primary/30 bg-primary/5"
      : "border-border bg-card";
  return (
    <div className={`rounded-xl border p-4 ${border}`}>
      <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">
        {title}
      </div>
      <div className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">{children}</div>
    </div>
  );
};

const buildResultText = (a: Answers): string => {
  const lines: string[] = [];
  lines.push("Матрица выбора — результат");
  lines.push("");
  lines.push(`Решение: ${a.decision || "—"}`);
  if (a.decisionType) {
    const t = DECISION_TYPES.find((d) => d.value === a.decisionType);
    if (t) lines.push(`Тип выбора: ${t.label}`);
  }
  lines.push("");
  lines.push(`Вариант A: ${a.nameA || "—"}`);
  if (a.descriptionA) lines.push(`  Как выглядит: ${a.descriptionA}`);
  if (a.prosA) lines.push(`  Что даёт: ${a.prosA}`);
  if (a.consA) lines.push(`  Цена: ${a.consA}`);
  lines.push("");
  lines.push(`Вариант B: ${a.nameB || "—"}`);
  if (a.descriptionB) lines.push(`  Как выглядит: ${a.descriptionB}`);
  if (a.prosB) lines.push(`  Что даёт: ${a.prosB}`);
  if (a.consB) lines.push(`  Цена: ${a.consB}`);
  lines.push("");
  if (a.values.length) lines.push(`Ценности: ${a.values.join(", ")}`);
  if (a.mainValue) lines.push(`Главная ценность: ${a.mainValue}`);
  if (a.fears.length) lines.push(`Страхи: ${a.fears.join(", ")}`);
  if (a.worstCase) lines.push(`Страшный сценарий: ${a.worstCase}`);
  if (a.externalInfluences.length) lines.push(`Чужое влияние: ${a.externalInfluences.join(", ")}`);
  if (a.expectations) lines.push(`Ожидания: ${a.expectations}`);
  if (a.inactionCost) lines.push(`Цена бездействия: ${a.inactionCost}`);
  if (a.reversibility) lines.push(`Обратимость: ${a.reversibility}`);
  if (a.bodyA.length) lines.push(`Тело (A): ${a.bodyA.join(", ")}`);
  if (a.bodyB.length) lines.push(`Тело (B): ${a.bodyB.join(", ")}`);
  if (a.catastrophizing) lines.push(`Страшные сценарии: ${a.catastrophizing}`);
  if (a.factsVsAssumptions) lines.push(`Факты vs предположения: ${a.factsVsAssumptions}`);
  lines.push("");
  lines.push(`Первый безопасный эксперимент: ${a.experiment || "—"}`);
  lines.push(`Шаг на 48 часов: ${a.nextStep || "—"}`);
  lines.push(`Уровень ясности: ${a.clarity}/10`);
  return lines.join("\n");
};

export default DecisionMatrix;
