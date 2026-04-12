import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, RotateCcw, MessageCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  questions,
  schemas,
  scaleLabels,
  domainNames,
  domainColors,
} from "@/data/schemaQuizData";

type Answers = Record<number, number>;

interface SchemaScore {
  id: string;
  name: string;
  domain: string;
  domainIndex: number;
  score: number;
  maxScore: number;
  percent: number;
  description: string;
  example: string;
}

const SchemaQuiz = () => {
  const [step, setStep] = useState<"intro" | "quiz" | "results">("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [direction, setDirection] = useState(1);

  const q = questions[current];
  const total = questions.length;
  const progress = Object.keys(answers).length / total;

  const handleAnswer = (value: number) => {
    setAnswers((prev) => ({ ...prev, [q.id]: value }));
    if (current < total - 1) {
      setDirection(1);
      setTimeout(() => setCurrent((c) => c + 1), 200);
    }
  };

  const goBack = () => {
    if (current > 0) {
      setDirection(-1);
      setCurrent((c) => c - 1);
    }
  };

  const results: SchemaScore[] = useMemo(() => {
    if (step !== "results") return [];
    return schemas
      .map((s) => {
        const qs = questions.filter((q) => q.schemaId === s.id);
        const score = qs.reduce((sum, q) => sum + (answers[q.id] || 1), 0);
        const maxScore = qs.length * 6;
        return {
          id: s.id,
          name: s.name,
          domain: s.domain,
          domainIndex: s.domainIndex,
          score,
          maxScore,
          percent: Math.round((score / maxScore) * 100),
          description: s.description,
          example: s.example,
        };
      })
      .sort((a, b) => b.percent - a.percent);
  }, [step, answers]);

  const topSchemas = results.slice(0, 3);
  const canFinish = Object.keys(answers).length === total;

  const restart = () => {
    setStep("intro");
    setCurrent(0);
    setAnswers({});
  };

  // --- INTRO ---
  if (step === "intro") {
    return (
      <div className="max-w-xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-2">
            <span className="text-3xl">🔍</span>
          </div>
          <h2 className="text-2xl font-bold">Экспресс-тест: ваши схемы</h2>
          <p className="text-muted-foreground leading-relaxed">
            36 утверждений помогут определить, какие из 18 ранних дезадаптивных схем 
            (по модели Джеффри Янга) могут быть активны у вас. Оцените каждое утверждение 
            по шкале от «совсем нет» до «точно про меня».
          </p>
          <p className="text-xs text-muted-foreground">
            ⏱ Занимает 5-7 минут. Результаты не сохраняются и не передаются.
          </p>
          <div className="rounded-xl border border-border bg-card p-4 text-left">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Дисклеймер:</strong> Этот тест — инструмент самопознания, а не диагностический 
              инструмент. Он не заменяет профессиональную оценку. Для полной диагностики схем 
              используется опросник YSQ-S3 из 90 вопросов в рамках работы с терапевтом.
            </p>
          </div>
          <Button size="lg" onClick={() => setStep("quiz")} className="gap-2">
            Начать тест <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    );
  }

  // --- RESULTS ---
  if (step === "results") {
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-bold">Ваш профиль схем</h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              Высокие баллы указывают на схемы, которые могут влиять на ваши чувства, 
              отношения и решения. Это не диагноз, а отправная точка для самопознания.
            </p>
          </div>

          {/* Top 3 */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Ваши ведущие схемы
            </h3>
            {topSchemas.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}
                className="rounded-xl border border-border bg-card p-5"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary mr-2">
                      #{i + 1}
                    </span>
                    <span className="font-semibold">{s.name}</span>
                  </div>
                  <span className="text-lg font-bold text-primary">{s.percent}%</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                  {s.description}
                </p>
                <p className="text-xs text-muted-foreground italic">
                  Пример: {s.example}
                </p>
                <div className="mt-3 text-xs text-muted-foreground">
                  Домен: {s.domain}
                </div>
              </motion.div>
            ))}
          </div>

          {/* All schemas by domain */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Все 18 схем
            </h3>
            {domainNames.map((domain, di) => {
              const domainSchemas = results.filter((s) => s.domainIndex === di);
              return (
                <div key={domain} className="rounded-xl border border-border bg-card p-5">
                  <h4 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: domainColors[di] }}>
                    {domain}
                  </h4>
                  <div className="space-y-3">
                    {domainSchemas.map((s) => (
                      <div key={s.id}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">{s.name}</span>
                          <span className="text-xs font-medium text-muted-foreground">{s.percent}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${s.percent}%` }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="h-full rounded-full"
                            style={{
                              backgroundColor: s.percent >= 67 ? domainColors[di] : s.percent >= 40 ? "hsl(var(--muted-foreground))" : "hsl(var(--muted-foreground) / 0.4)",
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center space-y-4">
            <MessageCircle className="w-8 h-8 text-primary mx-auto" />
            <h3 className="text-xl font-bold">Хотите разобраться глубже?</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Полная диагностика схем (YSQ-S3, 90 вопросов) + работа с imagery rescripting 
              и техникой стульев — в рамках индивидуальной терапии.
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
              <RotateCcw className="w-4 h-4" /> Пройти снова
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/schema-therapy" className="gap-2">
                О схема-терапии <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // --- QUIZ ---
  return (
    <div className="max-w-xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span>Вопрос {current + 1} из {total}</span>
          <span>{Math.round(progress * 100)}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-primary"
            animate={{ width: `${((current + 1) / total) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={q.id}
          custom={direction}
          initial={{ opacity: 0, x: direction * 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -direction * 40 }}
          transition={{ duration: 0.25 }}
          className="mb-8"
        >
          <p className="text-lg sm:text-xl font-medium leading-snug text-center min-h-[4rem] flex items-center justify-center">
            {q.text}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Scale */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-8">
        {scaleLabels.map((s) => (
          <button
            key={s.value}
            onClick={() => handleAnswer(s.value)}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-200
              ${answers[q.id] === s.value
                ? "border-primary bg-primary/10 text-primary shadow-sm"
                : "border-border bg-card hover:border-primary/30 hover:bg-primary/5 text-foreground"
              }`}
          >
            <span className="text-lg font-bold">{s.value}</span>
            <span className="text-[10px] leading-tight text-center">{s.label}</span>
          </button>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={goBack}
          disabled={current === 0}
          className="gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Назад
        </Button>

        {canFinish && (
          <Button onClick={() => setStep("results")} className="gap-2">
            Показать результат <ArrowRight className="w-4 h-4" />
          </Button>
        )}

        {!canFinish && current === total - 1 && (
          <p className="text-xs text-muted-foreground">
            Ответьте на все вопросы
          </p>
        )}
      </div>
    </div>
  );
};

export default SchemaQuiz;
