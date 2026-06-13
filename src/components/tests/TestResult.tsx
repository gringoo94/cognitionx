import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, RotateCcw, AlertCircle, CheckCircle2, AlertTriangle, Info, Download, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { TestConfig } from "@/data/tests/types";
import { getTest } from "@/data/tests";
import { generateTestReportPdf } from "@/lib/testReportPdf";

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

const sumByItems = (answers: number[], items: number[]) =>
  items.reduce((s, n) => s + (answers[n - 1] ?? 0), 0);

const TestResult = ({ config, answers, onRestart }: TestResultProps) => {
  const result = config.scoring(answers);
  const Icon = toneIcon[result.tone];
  const pct = Math.round((result.score / result.maxScore) * 100);

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

      {/* Subscales */}
      {config.subscales && config.subscales.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">По подшкалам</h3>
          <div className="space-y-3">
            {config.subscales.map((sub) => {
              const subScore = sumByItems(answers, sub.items);
              const subMax = sub.items.length * (config.scale[config.scale.length - 1].value);
              const subMin = sub.items.length * (config.scale[0].value);
              const range = subMax - subMin || 1;
              const subPct = Math.round(((subScore - subMin) / range) * 100);
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

      {/* CTA */}
      <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-6 md:p-8 text-center">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Хотите обсудить результат с психологом?
        </h3>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto mb-6">
          Я работаю с {config.clusterLabel.toLowerCase()} и смежными темами в формате КПТ и схема-терапии.
          Первая встреча — знакомство и оценка запроса.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg">
            <Link to="/contact" className="gap-2">
              Записаться на консультацию <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" onClick={onRestart} className="gap-2">
            <RotateCcw className="h-4 w-4" /> Пройти заново
          </Button>
        </div>
      </div>

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
