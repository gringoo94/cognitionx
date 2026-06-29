import { Link } from "react-router-dom";
import { ArrowRight, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackCta } from "@/lib/trackCta";

interface Props {
  topic?: string;
  variant?: "default" | "soft";
}

/**
 * Reusable CTA block для статей кластера «принятие решений / неопределённость».
 * Ведёт в /tools/decision-matrix — оттуда пользователь дальше переходит к GPT-разбору или /start.
 */
const DecisionMatrixCta = ({ topic, variant = "default" }: Props) => {
  const isSoft = variant === "soft";

  return (
    <aside
      className={
        isSoft
          ? "my-8 rounded-2xl border border-border bg-card p-5 md:p-6"
          : "my-10 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 p-6 md:p-8"
      }
      aria-label="Матрица выбора — инструмент для принятия решений"
    >
      <div className="flex items-center gap-2 text-xs font-medium text-primary mb-2">
        <Compass className="w-4 h-4" /> Бесплатный инструмент
      </div>
      <h3 className="text-lg md:text-xl font-bold tracking-tight">
        Не можете принять решение?
      </h3>
      <p className="mt-2 text-sm md:text-base text-muted-foreground leading-relaxed">
        Попробуйте <strong>Матрицу выбора</strong> — короткий кликабельный инструмент,
        который помогает разложить сложный выбор по вариантам, страхам, ценностям
        и первому безопасному шагу. Это не тест и не диагноз: инструмент не выбирает
        за вас, а помогает увидеть структуру выбора.
      </p>
      <div className="mt-4 flex flex-col sm:flex-row gap-3">
        <Button asChild size="lg" className="rounded-lg gap-2">
          <Link
            to="/tools/decision-matrix"
            onClick={() => trackCta("blog_decision_matrix_cta", { topic })}
          >
            Открыть Матрицу выбора <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
        <Button asChild size="lg" variant="ghost" className="rounded-lg gap-2">
          <Link
            to="/start"
            onClick={() => trackCta("blog_decision_matrix_cta_start", { topic })}
          >
            Не знаю с чего начать
          </Link>
        </Button>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        После результата можно скопировать промпт и продолжить разбор в GPT-помощнике.
      </p>
    </aside>
  );
};

export default DecisionMatrixCta;
