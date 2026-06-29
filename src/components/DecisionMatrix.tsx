import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Copy,
  Check,
  MessageCircle,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

// External GPT helper link. Leave as "PASTE_GPT_LINK_HERE" to keep the button
// disabled until a real link is provided.
export const DECISION_MATRIX_GPT_URL = "https://chatgpt.com/g/g-6a420060fe84819184d505b64a86603d-matritsa-vybora-cognitionx";
const isGptLinkReady = (url: string) =>
  !!url && url.trim() !== "" && url !== "PASTE_GPT_LINK_HERE";

// ---------- Types ----------
type Stage = "intro" | "practice" | "result";

interface Answers {
  topic: string;            // single
  topicNote: string;        // optional free text
  format: string;           // single
  variants: string[];       // multi (<=4)
  factors: string[];        // multi (<=5)
  values: string[];         // multi (<=5)
  inaction: string;         // single
  nextStep: string;         // single
  comment: string;          // optional free text
}

const EMPTY: Answers = {
  topic: "",
  topicNote: "",
  format: "",
  variants: [],
  factors: [],
  values: [],
  inaction: "",
  nextStep: "",
  comment: "",
};

const STORAGE_KEY = "decisionMatrixDraft.v2";

// ---------- Options ----------
const TOPICS = [
  "Отношения",
  "Работа / карьера",
  "Деньги",
  "Переезд",
  "Обучение",
  "Здоровье / образ жизни",
  "Семья",
  "Личный проект",
  "Другое",
];

const FORMATS = [
  "Я выбираю между двумя вариантами",
  "У меня 3+ вариантов",
  "Я выбираю: делать или не делать",
  "Я пока не понимаю, какие варианты есть",
  "Я скорее пытаюсь понять, чего хочу",
];

const VARIANTS = [
  "Остаться как есть",
  "Сделать шаг вперёд",
  "Отложить решение",
  "Поговорить с человеком",
  "Сменить работу / проект",
  "Завершить отношения / процесс",
  "Начать обучение",
  "Попросить помощи",
  "Провести маленький эксперимент",
  "Собрать больше информации",
  "Другое",
];

const FACTORS = [
  "Страх ошибиться",
  "Страх потерять стабильность",
  "Страх разочаровать других",
  "Желание роста",
  "Желание безопасности",
  "Усталость",
  "Вина",
  "Обида",
  "Надежда, что станет лучше",
  "Деньги",
  "Время",
  "Ответственность перед другими",
  "Давление со стороны",
  "Непонимание, чего я хочу",
  "Другое",
];

const VALUES = [
  "Свобода",
  "Безопасность",
  "Близость",
  "Честность",
  "Развитие",
  "Спокойствие",
  "Деньги",
  "Самоуважение",
  "Семья",
  "Здоровье",
  "Творчество",
  "Профессиональный рост",
  "Стабильность",
  "Новизна",
  "Забота о себе",
  "Ответственность",
];

const INACTIONS = [
  "Скорее всего, станет хуже",
  "Ничего критичного, но будет неприятно",
  "Я буду дальше сомневаться",
  "Я могу потерять возможность",
  "Я сохраню стабильность",
  "Я выиграю время",
  "Я не знаю",
];

const NEXT_STEPS = [
  "Взять паузу на 24–72 часа",
  "Собрать больше информации",
  "Поговорить с человеком",
  "Посчитать риски, деньги или ресурсы",
  "Провести маленький эксперимент",
  "Обсудить с психологом или специалистом",
  "Заполнить короткий опросник для мини-разбора",
  "Перейти в GPT и разобрать глубже",
];

// ---------- Step definitions ----------
type StepId =
  | "topic" | "format" | "variants" | "factors"
  | "values" | "inaction" | "nextStep";

interface StepDef {
  id: StepId;
  title: string;
  subtitle?: string;
  type: "single" | "multi";
  options: string[];
  max?: number;
  field: keyof Answers;
  required: boolean;
  withTopicNote?: boolean;
  withComment?: boolean;
}

const STEPS: StepDef[] = [
  { id: "topic", title: "О чём ваш выбор?", type: "single", options: TOPICS, field: "topic", required: true, withTopicNote: true },
  { id: "format", title: "Как выглядит выбор?", type: "single", options: FORMATS, field: "format", required: true },
  { id: "variants", title: "Какие варианты сейчас есть в голове?", subtitle: "Можно выбрать до 4 вариантов.", type: "multi", options: VARIANTS, max: 4, field: "variants", required: true },
  { id: "factors", title: "Что сейчас сильнее всего влияет на выбор?", subtitle: "Можно выбрать до 5 вариантов.", type: "multi", options: FACTORS, max: 5, field: "factors", required: true },
  { id: "values", title: "Что для вас здесь важно?", subtitle: "Можно выбрать до 5 ценностей.", type: "multi", options: VALUES, max: 5, field: "values", required: true },
  { id: "inaction", title: "Что будет, если пока ничего не менять?", type: "single", options: INACTIONS, field: "inaction", required: true },
  { id: "nextStep", title: "Какой следующий шаг кажется самым безопасным?", type: "single", options: NEXT_STEPS, field: "nextStep", required: true, withComment: true },
];

// ---------- Helpers ----------
const track = (event: string) => {
  try {
    // @ts-expect-error gtag
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      // @ts-expect-error gtag
      window.gtag("event", event, { tool: "decision_matrix" });
    }
  } catch { /* noop */ }
};

const buildGptPrompt = (a: Answers): string => {
  const parts: string[] = [];
  const str = (v: unknown) => (typeof v === "string" ? v : "");
  const arr = (v: unknown) => (Array.isArray(v) ? (v as string[]) : []);
  const topicNote = str(a.topicNote).trim();
  const comment = str(a.comment).trim();
  parts.push("Я прошёл(ла) кликабельную Матрицу выбора на сайте CognitionX.");
  parts.push("");
  parts.push("Моя карта выбора:");
  parts.push("");
  if (a.topic) {
    parts.push("Тема:");
    parts.push(a.topic);
    parts.push("");
  }
  if (topicNote) {
    parts.push("Если я описал(а) ситуацию своими словами:");
    parts.push(topicNote);
    parts.push("");
  }
  if (a.format) {
    parts.push("Формат выбора:");
    parts.push(a.format);
    parts.push("");
  }
  if (arr(a.variants).length) {
    parts.push("Варианты, которые сейчас видны:");
    arr(a.variants).forEach((v) => parts.push(`— ${v}`));
    parts.push("");
  }
  if (arr(a.factors).length) {
    parts.push("Что сильнее всего влияет на выбор:");
    arr(a.factors).forEach((v) => parts.push(`— ${v}`));
    parts.push("");
  }
  if (arr(a.values).length) {
    parts.push("Какие ценности здесь затронуты:");
    arr(a.values).forEach((v) => parts.push(`— ${v}`));
    parts.push("");
  }
  if (a.inaction) {
    parts.push("Если ничего не менять:");
    parts.push(a.inaction);
    parts.push("");
  }
  if (a.nextStep) {
    parts.push("Первый безопасный шаг:");
    parts.push(a.nextStep);
    parts.push("");
  }
  if (comment) {
    parts.push("Дополнительный комментарий:");
    parts.push(comment);
    parts.push("");
  }
  parts.push("Помоги мне глубже разобрать этот выбор.");
  parts.push("");
  parts.push("Важно:");
  parts.push("— не выбирай за меня;");
  parts.push("— не давай категоричных советов;");
  parts.push("— не ставь диагнозов;");
  parts.push("— помоги отделить факты от страхов;");
  parts.push("— помоги понять, какие ценности стоят за каждым вариантом;");
  parts.push("— задай мне 3–5 уточняющих вопросов;");
  parts.push("— в конце помоги сформулировать один маленький безопасный шаг на ближайшие 24–72 часа.");
  return parts.join("\n");
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

  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object" && parsed.answers) setHasDraft(true);
      }
    } catch { /* noop */ }
  }, []);

  useEffect(() => {
    if (stage === "intro") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ stage, current, answers, timestamp: Date.now() }));
    } catch { /* noop */ }
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
    } catch { /* noop */ }
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
    setStage("practice");
    setCurrent(0);
    track("decision_matrix_start");
  };

  const step = STEPS[current];
  const progress = ((current + 1) / STEPS.length) * 100;

  const isStepValid = (s: StepDef, a: Answers): boolean => {
    if (!s.required) return true;
    const v = a[s.field];
    if (s.type === "single") return typeof v === "string" && v.length > 0;
    return Array.isArray(v) && v.length > 0;
  };

  const next = () => {
    if (!isStepValid(step, answers)) {
      setValidationError("Выберите хотя бы один вариант.");
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
    else setStage("intro");
  };

  const toggleSingle = (s: StepDef, value: string) => {
    setAnswers((a) => ({ ...a, [s.field]: value }));
    setValidationError(null);
  };

  const toggleMulti = (s: StepDef, value: string) => {
    setAnswers((a) => {
      const arr = (a[s.field] as string[]) || [];
      const has = arr.includes(value);
      if (has) return { ...a, [s.field]: arr.filter((x) => x !== value) };
      if (s.max && arr.length >= s.max) {
        toast.message(`Можно выбрать не больше ${s.max}.`);
        return a;
      }
      return { ...a, [s.field]: [...arr, value] };
    });
    setValidationError(null);
  };

  const copyPrompt = async () => {
    const prompt = buildGptPrompt(answers);
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      toast.success("Промпт скопирован. Теперь откройте GPT и вставьте его в чат.");
      track("decision_matrix_gpt_prompt_copied");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Не удалось скопировать. Скопируйте промпт вручную из текстового поля ниже.");
    }
  };

  const openGpt = () => {
    if (!isGptLinkReady(DECISION_MATRIX_GPT_URL)) return;
    track("decision_matrix_gpt_opened");
    window.open(DECISION_MATRIX_GPT_URL, "_blank", "noopener,noreferrer");
  };

  // ---------- INTRO ----------
  if (stage === "intro") {
    return (
      <div className="space-y-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            <span className="text-primary">Матрица выбора:</span> соберите карту сложного решения за 2–3 минуты
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Не нужно сразу формулировать идеальный ответ. Вы можете пройти матрицу в кликабельном
            формате: выбрать тему, факторы, страхи, ценности и возможный следующий шаг. А если
            захотите разобрать ситуацию глубже — после результата можно открыть GPT-помощника.
          </p>
          <p className="text-sm text-muted-foreground/90 italic">
            Большую часть инструмента можно пройти без текста — просто выбирая подходящие варианты.
          </p>
        </motion.div>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Как это работает</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { n: "1", t: "10–15 кликов", d: "Выбираете тему, варианты, факторы, ценности и следующий шаг." },
              { n: "2", t: "Карта выбора", d: "Инструмент собирает ваши ответы в понятную структуру — без диагнозов." },
              { n: "3", t: "GPT или мини-разбор", d: "Можно скопировать промпт для GPT-помощника или отправить результат Дмитрию." },
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
            После заполнения матрицы вы сможете скопировать готовый промпт и открыть GPT-помощника.
            Он задаст уточняющие вопросы, поможет отделить факты от страхов и сформулировать
            следующий небольшой шаг. GPT не выбирает за вас и не заменяет консультацию.
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
            Начать <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  // ---------- PRACTICE ----------
  if (stage === "practice") {
    const selectedSingle = answers[step.field] as string;
    const selectedMulti = (answers[step.field] as string[]) || [];

    return (
      <div className="space-y-8 max-w-2xl mx-auto">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-semibold text-primary uppercase tracking-wider">
              Шаг {current + 1} из {STEPS.length}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="space-y-5"
          >
            <div className="space-y-2">
              <h2 className="text-2xl font-bold leading-tight">{step.title}</h2>
              {step.subtitle && (
                <p className="text-sm text-muted-foreground">{step.subtitle}</p>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-2">
              {step.options.map((opt) => {
                const active =
                  step.type === "single" ? selectedSingle === opt : selectedMulti.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() =>
                      step.type === "single" ? toggleSingle(step, opt) : toggleMulti(step, opt)
                    }
                    className={`text-left rounded-xl border p-3.5 text-sm transition-colors ${
                      active
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border bg-card hover:border-primary/40"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div
                        className={`mt-0.5 h-4 w-4 rounded-full border shrink-0 flex items-center justify-center ${
                          active ? "border-primary bg-primary" : "border-muted-foreground/40"
                        }`}
                      >
                        {active && <Check className="h-3 w-3 text-primary-foreground" />}
                      </div>
                      <span className="leading-snug">{opt}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {step.withTopicNote && (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Если хотите, опишите выбор одной фразой
                  <span className="text-muted-foreground font-normal"> (необязательно)</span>
                </label>
                <Textarea
                  value={answers.topicNote}
                  onChange={(e) => setAnswers((a) => ({ ...a, topicNote: e.target.value }))}
                  placeholder="Например: не понимаю, оставаться ли на текущей работе или искать новую"
                  className="min-h-[80px]"
                />
              </div>
            )}

            {step.withComment && (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Что важно добавить своими словами?
                  <span className="text-muted-foreground font-normal"> (необязательно)</span>
                </label>
                <Textarea
                  value={answers.comment}
                  onChange={(e) => setAnswers((a) => ({ ...a, comment: e.target.value }))}
                  placeholder="Любые детали, которые не поместились в варианты. Это попадёт в промпт для GPT."
                  className="min-h-[80px]"
                />
              </div>
            )}

            {validationError && (
              <div className="text-sm text-destructive">{validationError}</div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between gap-3 pt-2">
          <Button variant="ghost" onClick={prev} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Назад
          </Button>
          <Button onClick={next} className="gap-2">
            {current === STEPS.length - 1 ? "Показать карту выбора" : "Далее"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  // ---------- RESULT ----------
  const gptReady = isGptLinkReady(DECISION_MATRIX_GPT_URL);
  const promptText = buildGptPrompt(answers);

  const Block = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">{title}</div>
      <div className="text-sm text-foreground/90 leading-relaxed">{children}</div>
    </div>
  );

  const List = ({ items }: { items: string[] }) =>
    items.length ? (
      <ul className="space-y-1">
        {items.map((i) => (
          <li key={i}>— {i}</li>
        ))}
      </ul>
    ) : (
      <span className="text-muted-foreground">—</span>
    );

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="text-xs uppercase tracking-wider text-primary font-semibold">Готово</div>
        <h2 className="text-3xl font-bold">Ваша карта выбора</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Это не готовое решение, а карта ситуации. Она помогает увидеть, из чего состоит выбор:
          где факты, где страхи, где ценности и какой шаг можно сделать без резкого решения.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <Block title="Тема">{answers.topic || "—"}</Block>
        <Block title="Формат выбора">{answers.format || "—"}</Block>
        {(answers.topicNote || "").trim() && (
          <div className="sm:col-span-2">
            <Block title="Своими словами">{(answers.topicNote || "").trim()}</Block>
          </div>
        )}
        <div className="sm:col-span-2">
          <Block title="Варианты, которые сейчас видны">
            <List items={answers.variants || []} />
          </Block>
        </div>
        <Block title="Что влияет на выбор">
          <List items={answers.factors || []} />
        </Block>
        <Block title="Какие ценности затронуты">
          <List items={answers.values || []} />
        </Block>
        <Block title="Если ничего не менять">{answers.inaction || "—"}</Block>
        <Block title="Первый безопасный шаг">{answers.nextStep || "—"}</Block>
        {(answers.comment || "").trim() && (
          <div className="sm:col-span-2">
            <Block title="Дополнительный комментарий">{(answers.comment || "").trim()}</Block>
          </div>
        )}
      </div>

      {/* GPT block */}
      <section className="rounded-xl border border-primary/20 bg-primary/5 p-5 space-y-4 print:hidden">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-primary">
            <MessageCircle className="h-4 w-4" />
            <h3 className="text-lg font-semibold">Разобрать глубже в GPT</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Вы уже собрали основу. Теперь можно скопировать готовый промпт и открыть GPT-помощника.
            Он задаст уточняющие вопросы, поможет отделить факты от страхов и сформулировать
            следующий небольшой шаг.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={copyPrompt} className="gap-2">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Скопировано" : "Скопировать промпт для GPT"}
          </Button>
          <Button
            variant="outline"
            onClick={openGpt}
            disabled={!gptReady}
            className="gap-2"
            title={gptReady ? "" : "GPT-помощник скоро будет доступен."}
          >
            <ExternalLink className="h-4 w-4" />
            {gptReady ? "Открыть GPT-помощника" : "GPT-помощник скоро будет доступен"}
          </Button>
          <Button variant="ghost" asChild className="gap-2">
            <Link
              to="/start?source=decision-matrix-clickable-result"
              onClick={() => track("decision_matrix_start_from_gpt_block")}
            >
              Отправить Дмитрию на мини-разбор
            </Link>
          </Button>
        </div>

        <details className="text-xs text-muted-foreground">
          <summary className="cursor-pointer hover:text-foreground">Показать текст промпта</summary>
          <pre className="mt-2 whitespace-pre-wrap break-words rounded-lg bg-background border border-border p-3 text-xs leading-relaxed max-h-72 overflow-auto">
            {promptText}
          </pre>
        </details>

        <p className="text-xs text-muted-foreground leading-relaxed border-t border-primary/10 pt-3">
          Не вставляйте в GPT данные третьих лиц, пароли, документы и информацию, которой не готовы
          делиться в ChatGPT. Если хотите, чтобы результат посмотрел Дмитрий лично, отправьте его
          через{" "}
          <Link
            to="/start?source=decision-matrix-privacy-note"
            className="underline hover:text-foreground"
          >
            короткий опросник
          </Link>
          .
        </p>
      </section>

      <div className="flex flex-wrap gap-2 print:hidden">
        <Button variant="outline" onClick={restart} className="gap-2">
          <RotateCcw className="h-4 w-4" /> Начать заново
        </Button>
      </div>
    </div>
  );
};

export default DecisionMatrix;
