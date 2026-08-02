import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, RotateCcw, AlertCircle, CheckCircle2, AlertTriangle, Info, Download, Loader2, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { TestConfig } from "@/data/tests/types";
import { getTest } from "@/data/tests";
import { generateTestReportPdf } from "@/lib/testReportPdf";
import { deriveRanges } from "@/lib/testRanges";
import {
  subscaleScore,
  subscaleMaxScore,
  subscaleMinScore,
} from "@/lib/testScoring";
import { saveTestHistory } from "@/lib/testHistory";
import { trackContact, trackLead } from "@/lib/metaPixel";

interface TestResultProps {
  config: TestConfig;
  answers: number[];
  onRestart: () => void;
}

const toneStyles = {
  success: "border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300",
  info: "border-blue-500/30 bg-blue-500/5 text-blue-700 dark:text-blue-300",
  warning: "border-amber-500/30 bg-amber-500/5 text-amber-700 dark:text-amber-300",
  danger: "border-red-500/30 bg-red-500/5 text-red-700 dark:text-red-300",
};

const toneIcon = {
  success: CheckCircle2,
  info: Info,
  warning: AlertTriangle,
  danger: AlertCircle,
};

const TestResult = ({ config, answers, onRestart }: TestResultProps) => {
  const result = config.scoring(answers);
  const Icon = toneIcon[result.tone];
  const safeMax = result.maxScore > 0 ? result.maxScore : 1;
  const pct = Math.max(
    0,
    Math.min(100, Math.round((result.score / safeMax) * 100)),
  );
  const rawRanges = deriveRanges(config);
  const ranges = rawRanges.length <= 20 ? rawRanges : [];
  const [userNote, setUserNote] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    saveTestHistory({
      slug: config.slug,
      code: config.code,
      title: config.title,
      score: result.score,
      maxScore: result.maxScore,
      levelLabel: result.levelLabel,
      tone: result.tone,
      takenAt: new Date().toISOString(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.slug]);

  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      await generateTestReportPdf({ config, answers, userNote });
    } catch (e) {
      console.error(e);
      toast.error("Не удалось создать PDF. Попробуйте ещё раз.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Score block */}
      <div className={cn("rounded-2xl border p-6 md:p-8", toneStyles[result.tone])}>
        <div className="flex items-start gap-4">
          <Icon className="h-6 w-6 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <p className="text-xs uppercase tracking-wide opacity-70 mb-1">Ваш результат</p>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">{result.levelLabel}</h2>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-bold">{result.score}</span>
              <span className="text-sm opacity-70">из {result.maxScore} баллов · {pct}%</span>
            </div>
            <div className="h-1.5 bg-current/20 rounded-full overflow-hidden mb-4 max-w-md">
              <div
                className="h-full bg-current rounded-full transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Score ranges */}
      {ranges.length > 1 && (
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="text-sm font-semibold text-foreground mb-1">
            Шкала интерпретации
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            Ваш балл — {result.score}. Он попадает в выделенный диапазон.
          </p>
          <div className="space-y-2">
            {ranges.map((r) => {
              const isCurrent = result.score >= r.min && result.score <= r.max;
              return (
                <div
                  key={`${r.min}-${r.max}`}
                  className={cn(
                    "flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition-colors",
                    isCurrent
                      ? toneStyles[r.tone] + " font-medium"
                      : "border-border bg-muted/20 text-muted-foreground",
                  )}
                >
                  <span>{r.label}</span>
                  <span className="tabular-nums text-xs">
                    {r.min === r.max ? r.min : `${r.min}–${r.max}`} баллов
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Subscales */}
      {config.subscales && config.subscales.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">По подшкалам</h3>
          <div className="space-y-3">
            {config.subscales.map((sub) => {
              const subScore = subscaleScore(config, answers, sub.items);
              const subMax = subscaleMaxScore(config, sub.items);
              const subMin = subscaleMinScore(config, sub.items);
              const range = subMax - subMin || 1;
              const subPct = Math.max(
                0,
                Math.min(100, Math.round(((subScore - subMin) / range) * 100)),
              );
              return (
                <div key={sub.key}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-foreground">{sub.name}</span>
                    <span className="text-muted-foreground">
                      {subScore} из {subMax}
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${subPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Interpretation */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="text-sm font-semibold text-foreground mb-3">Что это значит</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">{result.interpretation}</p>
        <h3 className="text-sm font-semibold text-foreground mb-3">Что делать дальше</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{result.recommendation}</p>
      </div>

      {/* Share / PDF report */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="text-sm font-semibold text-foreground mb-2">
          Отчёт для психолога
        </h3>
        <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
          Скачайте PDF с вашими ответами, баллами и интерпретацией — его можно переслать психологу
          до или во время первой встречи. Данные не сохраняются на сервере.
        </p>
        <label className="block text-xs font-medium text-foreground mb-2">
          Что хочу обсудить (необязательно)
        </label>
        <Textarea
          value={userNote}
          onChange={(e) => setUserNote(e.target.value)}
          placeholder="Например: симптомы появились около месяца назад, мешают работать…"
          rows={3}
          className="mb-4 text-sm"
          maxLength={1500}
        />
        <Button onClick={handleDownload} disabled={isGenerating} className="gap-2">
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Готовлю PDF…
            </>
          ) : (
            <>
              <Download className="h-4 w-4" /> Скачать PDF-отчёт
            </>
          )}
        </Button>
      </div>


      {/* CTA — cluster + severity aware */}
      {(() => {
        const clusterToProblem: Record<string, { href: string; label: string } | undefined> = {
          depression: { href: "/depression", label: "Подробнее: терапия депрессии" },
          anxiety: { href: "/anxiety", label: "Подробнее: терапия тревоги" },
          burnout: { href: "/burnout", label: "Подробнее: работа с выгоранием" },
          stress: { href: "/stress", label: "Подробнее: работа со стрессом" },
          "self-esteem": { href: "/self-esteem", label: "Подробнее: самооценка" },
          it: { href: "/psiholog-dlya-it", label: "Подробнее: психолог для IT" },
          "cbt-tools": { href: "/cbt-therapy", label: "Что такое КПТ" },
          trauma: { href: "/cbt-therapy", label: "КПТ при травме" },
          sleep: { href: "/stress", label: "Сон, стресс и восстановление" },
          addiction: { href: "/addiction", label: "Подробнее: зависимости" },
          relationships: { href: "/co-dependency", label: "Подробнее: созависимость и отношения" },
          personality: { href: "/schema-therapy", label: "Что такое схема-терапия" },
          eating: undefined,
        };
        const problem = clusterToProblem[config.cluster];
        const urgent = result.tone === "danger" || result.tone === "warning";
        const tgText = encodeURIComponent(
          `Здравствуйте! Прошёл(а) тест ${config.code} — результат: ${result.levelLabel} (${result.score}/${result.maxScore}). Хочу обсудить.`,
        );
        return (
          <div
            className={cn(
              "rounded-2xl border p-6 md:p-8",
              urgent
                ? "border-primary/40 bg-gradient-to-br from-primary/10 to-primary/15"
                : "border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10",
            )}
          >
            <div className="flex items-center justify-center gap-2 mb-2 text-primary">
              {urgent ? <AlertCircle className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
              <span className="text-xs font-semibold uppercase tracking-wider">
                {urgent ? "Рекомендую следующий шаг" : "Что дальше"}
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-2 text-center">
              {urgent
                ? `Результат «${result.levelLabel}» — стоит обсудить со специалистом`
                : `Хотите обсудить результат с психологом?`}
            </h3>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto mb-6 text-center">
              {urgent ? (
                <>
                  Я работаю с {config.clusterLabel.toLowerCase()} в формате КПТ и схема-терапии.
                  Первый шаг — бесплатная 20-минутная встреча: познакомимся, обсудим запрос, без обязательств.
                </>
              ) : (
                <>
                  Если хочется разобраться глубже — приходите на бесплатное 20-минутное знакомство.
                  Расскажу, как работаю с {config.clusterLabel.toLowerCase()}.
                </>
              )}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-xl mx-auto">
              <Button asChild size="lg" className="gap-2">
                <Link
                  to="/free-consultation"
                  onClick={() => {
                    trackLead(`test_result_cta_${config.code}`, {
                      content_category: config.cluster,
                    });
                  }}
                >
                  Бесплатная встреча — 20 мин <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2">
                <a
                  href={`https://t.me/gringoo94?text=${tgText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    trackContact(`test_result_tg_${config.code, { }` });
                  }}
                >
                  <Send className="h-4 w-4" /> Написать в Telegram
                </a>
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 justify-center items-center mt-5 text-xs">
              {problem && (
                <Link
                  to={problem.href}
                  className="text-primary hover:underline underline-offset-4"
                >
                  {problem.label} →
                </Link>
              )}
              <button
                onClick={onRestart}
                className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Пройти тест заново
              </button>
            </div>
          </div>
        );
      })()}

      {/* Disclaimer */}
      <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Важно:</strong> результат теста — не диагноз. {config.code} — это
          скрининговый инструмент. Диагностика психического расстройства возможна только после клинического
          интервью со специалистом.
        </p>
      </div>

      {/* Related tests */}
      {config.related.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Связанные тесты</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {config.related.map((slug) => {
              const t = getTest(slug);
              if (!t) return null;
              return (
                <Link
                  key={slug}
                  to={`/tools/tests/${slug}`}
                  className="block rounded-xl border border-border p-4 hover:border-primary/40 hover:bg-primary/5 transition-colors group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      {t.code}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {t.title}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TestResult;
