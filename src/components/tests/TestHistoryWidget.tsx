import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { History, ArrowRight, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  clearTestHistory,
  getLatestPerTest,
  type TestHistoryEntry,
} from "@/lib/testHistory";
import { Button } from "@/components/ui/button";

const toneDot: Record<TestHistoryEntry["tone"], string> = {
  success: "bg-emerald-500",
  info: "bg-blue-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

const TestHistoryWidget = () => {
  const [entries, setEntries] = useState<TestHistoryEntry[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setEntries(getLatestPerTest());
  }, []);

  if (!mounted || entries.length === 0) return null;

  return (
    <section
      className="rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/5 to-transparent p-6 md:p-7 mb-10"
      aria-labelledby="history-heading"
    >
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <History className="h-4 w-4" />
          </div>
          <div>
            <h2 id="history-heading" className="text-base font-semibold text-foreground">
              Вы недавно проходили
            </h2>
            <p className="text-xs text-muted-foreground">
              История хранится только в вашем браузере
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground hover:text-destructive"
          onClick={() => {
            clearTestHistory();
            setEntries([]);
          }}
        >
          <Trash2 className="h-3.5 w-3.5 mr-1" />
          Очистить
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {entries.slice(0, 6).map((e) => (
          <Link
            key={`${e.slug}-${e.takenAt}`}
            to={`/tools/tests/${e.slug}`}
            className="group flex items-start gap-3 rounded-xl border border-border bg-card p-3.5 hover:border-primary/40 hover:bg-primary/5 transition-colors"
          >
            <span
              className={cn("mt-1.5 h-2 w-2 flex-shrink-0 rounded-full", toneDot[e.tone])}
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  {e.code}
                </span>
                <span className="text-[10px] text-muted-foreground">·</span>
                <span className="text-[10px] text-muted-foreground">
                  {formatDate(e.takenAt)}
                </span>
              </div>
              <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                {e.title}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {e.levelLabel} · {e.score}/{e.maxScore}
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
          </Link>
        ))}
      </div>
    </section>
  );
};

export default TestHistoryWidget;
