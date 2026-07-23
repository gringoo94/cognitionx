import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  type DayPlan,
  type Pillar,
  pillarLabel,
  statusLabel,
} from "@/lib/dayPlanner";

interface Props {
  day: DayPlan;
  onChange: (next: DayPlan) => void;
}

const statusOrder: Pillar["status"][] = ["planned", "done", "minimal", "skipped"];

const ReviewList = ({ day, onChange }: Props) => {
  const updatePillar = (idx: number, next: Pillar) => {
    const pillars = day.pillars.slice();
    pillars[idx] = next;
    onChange({ ...day, pillars, updatedAt: Date.now() });
  };

  const hasAnyAction = day.pillars.some((p) => p.action.trim());

  if (!hasAnyAction) {
    return (
      <div className="rounded-xl border border-dashed border-border/60 bg-card/30 p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Сначала заполните план во вкладке «План на день» — тогда здесь появятся опоры для отметки.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border/60 bg-card/40 p-4 md:p-5">
        <p className="text-sm text-muted-foreground leading-relaxed">
          После действия отметьте три показателя. Полезное действие не обязано сразу
          улучшать настроение — визит к врачу может почти не дать удовольствия, но иметь
          высокий показатель результата и смысла.
        </p>
      </div>

      {day.pillars.map((p, i) =>
        p.action.trim() ? (
          <div key={i} className="rounded-xl border border-border/60 bg-card/40 p-4 md:p-5 space-y-4">
            <div>
              <div className="text-xs uppercase tracking-wider font-semibold text-primary">
                {pillarLabel[p.type]}
              </div>
              <div className="text-base font-medium text-foreground mt-1">{p.action}</div>
              {p.when && (
                <div className="text-xs text-muted-foreground mt-1">Когда: {p.when}</div>
              )}
            </div>

            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Статус</Label>
              <div className="flex flex-wrap gap-2">
                {statusOrder.map((s) => (
                  <Button
                    key={s}
                    type="button"
                    size="sm"
                    variant={p.status === s ? "default" : "outline"}
                    onClick={() => updatePillar(i, { ...p, status: s })}
                  >
                    {statusLabel[s]}
                  </Button>
                ))}
              </div>
            </div>

            {(["pleasure", "mastery", "meaning"] as const).map((k) => {
              const label = k === "pleasure" ? "Удовольствие" : k === "mastery" ? "Результат" : "Связь со смыслом";
              return (
                <div key={k}>
                  <div className="flex items-baseline justify-between mb-1">
                    <Label className="text-sm text-foreground">{label}</Label>
                    <span className="text-sm tabular-nums text-muted-foreground">{p[k]}/10</span>
                  </div>
                  <Slider
                    value={[p[k]]} min={0} max={10} step={1}
                    onValueChange={(v) => updatePillar(i, { ...p, [k]: v[0] })}
                  />
                </div>
              );
            })}

            <div>
              <Label className="text-xs text-muted-foreground">Что заметил</Label>
              <Textarea
                placeholder="Короткое наблюдение — одно-два предложения"
                value={p.note}
                onChange={(e) => updatePillar(i, { ...p, note: e.target.value })}
                className="mt-1 min-h-[60px]"
              />
            </div>
          </div>
        ) : null,
      )}
    </div>
  );
};

export default ReviewList;
