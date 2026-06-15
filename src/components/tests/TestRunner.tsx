import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TestConfig } from "@/data/tests/types";

interface TestRunnerProps {
  config: TestConfig;
  onComplete: (answers: number[]) => void;
}

const TestRunner = ({ config, onComplete }: TestRunnerProps) => {
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(config.questions.length).fill(null),
  );
  const [step, setStep] = useState(0);

  const isPaged = config.layout === "paged";
  const total = config.questions.length;
  const answeredCount = answers.filter((a) => a !== null).length;
  const allAnswered = answeredCount === total;

  const setAnswer = (qIndex: number, value: number) => {
    const next = [...answers];
    next[qIndex] = value;
    setAnswers(next);

    // In paged mode, auto-advance after picking
    if (isPaged && qIndex === step && step < total - 1) {
      setTimeout(() => setStep(step + 1), 200);
    }
  };

  const handleSubmit = () => {
    if (!allAnswered) return;
    onComplete(answers as number[]);
  };

  const renderQuestion = (qIndex: number) => {
    const q = config.questions[qIndex];
    const value = answers[qIndex];
    const scale = config.perQuestionScale?.[qIndex] ?? config.scale;
    return (
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <span className="text-xs font-medium text-muted-foreground mt-1 w-6 flex-shrink-0">
            {qIndex + 1}.
          </span>
          <p className="text-base text-foreground leading-relaxed">{q}</p>
        </div>
        <div className="grid gap-2 ml-9">
          {scale.map((opt) => {
            const selected = value === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setAnswer(qIndex, opt.value)}
                className={cn(
                  "text-left text-sm rounded-xl border px-4 py-2.5 transition-all",
                  selected
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-card hover:border-primary/40 text-muted-foreground hover:text-foreground",
                )}
                aria-pressed={selected}
              >
                <span className="inline-flex items-center gap-3">
                  <span
                    className={cn(
                      "inline-flex h-4 w-4 items-center justify-center rounded-full border-2 flex-shrink-0",
                      selected ? "border-primary bg-primary" : "border-muted-foreground/40",
                    )}
                  >
                    {selected && <span className="h-1.5 w-1.5 rounded-full bg-background" />}
                  </span>
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  if (isPaged) {
    const currentAnswered = answers[step] !== null;
    return (
      <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>Вопрос {step + 1} из {total}</span>
            <span>{answeredCount} из {total} отвечено</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((step + 1) / total) * 100}%` }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderQuestion(step)}
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" /> Назад
          </Button>

          {step < total - 1 ? (
            <Button
              size="sm"
              onClick={() => setStep(step + 1)}
              disabled={!currentAnswered}
              className="gap-1"
            >
              Далее <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button size="sm" onClick={handleSubmit} disabled={!allAnswered}>
              Получить результат
            </Button>
          )}
        </div>
      </div>
    );
  }

  // One-page layout
  return (
    <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between text-xs text-muted-foreground">
        <span>{total} вопросов · ~{config.durationMin} мин</span>
        <span>{answeredCount} из {total} отвечено</span>
      </div>

      <div className="space-y-8">
        {config.questions.map((_, i) => (
          <div key={i}>{renderQuestion(i)}</div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-border flex flex-col items-center gap-3">
        <Button onClick={handleSubmit} disabled={!allAnswered} size="lg" className="w-full sm:w-auto">
          Получить результат
        </Button>
        {!allAnswered && (
          <p className="text-xs text-muted-foreground">
            Ответьте на все вопросы, чтобы увидеть результат
          </p>
        )}
      </div>
    </div>
  );
};

export default TestRunner;
