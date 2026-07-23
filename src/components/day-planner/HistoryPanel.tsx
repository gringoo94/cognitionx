import { useMemo, useState } from "react";
import { Trash2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  type DayPlan,
  avg,
  formatDateRu,
  lastNDays,
  pillarLabel,
  sparkline,
  statusLabel,
  type DayPlannerState,
} from "@/lib/dayPlanner";

interface Props {
  state: DayPlannerState;
  onDeleteDay: (date: string) => void;
}

const Spark = ({ values, label, color }: { values: number[]; label: string; color: string }) => {
  const path = sparkline(values, 120, 28);
  const last = values.length ? values[values.length - 1].toFixed(1) : "—";
  return (
    <div className="flex items-center gap-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground w-20">{label}</div>
      <svg width={120} height={28} className="flex-shrink-0" aria-hidden>
        <path d={path} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="text-xs tabular-nums text-muted-foreground w-10 text-right">{last}</div>
    </div>
  );
};

const HistoryPanel = ({ state, onDeleteDay }: Props) => {
  const days = useMemo(() => lastNDays(state, 14), [state]);
  const [openDate, setOpenDate] = useState<string | null>(null);

  const chronological = useMemo(() => days.slice().reverse(), [days]);

  const energyValues = chronological.map((d) => d.energyForecast);
  const pleasureValues = chronological.map((d) =>
    avg(d.pillars.filter((p) => p.action.trim()).map((p) => p.pleasure)),
  );
  const masteryValues = chronological.map((d) =>
    avg(d.pillars.filter((p) => p.action.trim()).map((p) => p.mastery)),
  );

  if (days.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border/60 bg-card/30 p-8 text-center">
        <p className="text-sm text-muted-foreground">
          История появится, когда вы сохраните первый план.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border/60 bg-card/40 p-4 md:p-5 space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Последние {days.length} дн.</h3>
        <Spark values={energyValues} label="Энергия" color="hsl(var(--primary))" />
        <Spark values={pleasureValues} label="Удовол." color="rgb(245 158 11)" />
        <Spark values={masteryValues} label="Результ." color="rgb(16 185 129)" />
      </div>

      <div className="space-y-2">
        {days.map((d) => {
          const active = d.pillars.filter((p) => p.action.trim());
          const done = active.filter((p) => p.status === "done" || p.status === "minimal").length;
          const isOpen = openDate === d.date;
          return (
            <div key={d.date} className="rounded-xl border border-border/60 bg-card/40 overflow-hidden">
              <button
                onClick={() => setOpenDate(isOpen ? null : d.date)}
                className="w-full flex items-center gap-3 p-4 hover:bg-card/70 transition-colors text-left"
              >
                <ChevronRight
                  className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? "rotate-90" : ""}`}
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground">{formatDateRu(d.date)}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Энергия {d.energyForecast}/10 · выполнено {done} из {active.length || 3}
                  </div>
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 space-y-3 border-t border-border/60 pt-3">
                  {active.length === 0 && (
                    <p className="text-xs text-muted-foreground italic">План не заполнен.</p>
                  )}
                  {active.map((p, i) => (
                    <div key={i} className="text-sm">
                      <div className="text-[10px] uppercase tracking-wider text-primary font-semibold">
                        {pillarLabel[p.type]} · {statusLabel[p.status]}
                      </div>
                      <div className="text-foreground">{p.action}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Удов. {p.pleasure} · Результ. {p.mastery} · Смысл {p.meaning}
                      </div>
                      {p.note && <div className="text-xs text-muted-foreground italic mt-1">«{p.note}»</div>}
                    </div>
                  ))}
                  {d.support && (
                    <div className="text-xs text-muted-foreground">
                      <span className="uppercase tracking-wider text-[10px]">Поддержка: </span>
                      {d.support}
                    </div>
                  )}
                  <Button
                    variant="ghost" size="sm"
                    onClick={() => {
                      if (confirm(`Удалить план за ${formatDateRu(d.date)}?`)) onDeleteDay(d.date);
                    }}
                    className="gap-2 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Удалить день
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HistoryPanel;
