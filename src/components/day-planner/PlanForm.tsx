import { Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  type DayPlan,
  type Pillar,
  type PillarType,
  energyPrinciple,
  pillarHint,
  pillarLabel,
} from "@/lib/dayPlanner";

interface Props {
  day: DayPlan;
  onChange: (next: DayPlan) => void;
}

const PillarCard = ({
  pillar,
  onChange,
}: {
  pillar: Pillar;
  onChange: (next: Pillar) => void;
}) => {
  const type = pillar.type;
  const tint: Record<PillarType, string> = {
    necessary: "border-l-primary/70",
    pleasure: "border-l-amber-500/70",
    mastery: "border-l-emerald-500/70",
  };

  return (
    <div className={`rounded-xl border border-border/60 border-l-4 ${tint[type]} bg-card/40 p-4 md:p-5 space-y-3`}>
      <div>
        <div className="text-xs uppercase tracking-wider font-semibold text-primary">
          {pillarLabel[type]}
        </div>
        <p className="text-xs text-muted-foreground italic mt-1">{pillarHint[type]}</p>
      </div>
      <div>
        <Label className="text-xs text-muted-foreground">Действие</Label>
        <Input
          placeholder="Что именно?"
          value={pillar.action}
          onChange={(e) => onChange({ ...pillar, action: e.target.value })}
        />
      </div>
      <div>
        <Label className="text-xs text-muted-foreground">Минимальная версия</Label>
        <Input
          placeholder="Самый маленький шаг, который вы точно сможете"
          value={pillar.minimal}
          onChange={(e) => onChange({ ...pillar, minimal: e.target.value })}
        />
      </div>
      <div>
        <Label className="text-xs text-muted-foreground">Время или сигнал</Label>
        <Input
          placeholder="Например: после завтрака"
          value={pillar.when}
          onChange={(e) => onChange({ ...pillar, when: e.target.value })}
        />
      </div>
    </div>
  );
};

const PlanForm = ({ day, onChange }: Props) => {
  const updatePillar = (idx: number, next: Pillar) => {
    const pillars = day.pillars.slice();
    pillars[idx] = next;
    onChange({ ...day, pillars, updatedAt: Date.now() });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border/60 bg-card/40 p-4 md:p-5 space-y-4">
        <div>
          <Label className="text-xs text-muted-foreground">Дата плана</Label>
          <Input
            type="date"
            value={day.date}
            onChange={(e) => onChange({ ...day, date: e.target.value, updatedAt: Date.now() })}
            className="max-w-[200px]"
          />
        </div>

        <div>
          <div className="flex items-baseline justify-between mb-2">
            <Label className="text-sm text-foreground">
              Доступная энергия на день
            </Label>
            <span className="text-2xl font-bold tabular-nums text-primary">
              {day.energyForecast}<span className="text-sm text-muted-foreground">/10</span>
            </span>
          </div>
          <Slider
            value={[day.energyForecast]}
            min={0} max={10} step={1}
            onValueChange={(v) => onChange({ ...day, energyForecast: v[0], updatedAt: Date.now() })}
          />
          <div className="mt-3 flex gap-2 items-start text-xs text-muted-foreground leading-relaxed bg-primary/5 border border-primary/15 rounded-lg p-3">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-primary" />
            <span>{energyPrinciple(day.energyForecast)}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {day.pillars.map((p, i) => (
          <PillarCard key={i} pillar={p} onChange={(next) => updatePillar(i, next)} />
        ))}
      </div>

      <div className="rounded-xl border border-border/60 bg-card/40 p-4 md:p-5">
        <Label className="text-xs text-muted-foreground">
          С кем связаться, если станет тяжелее
        </Label>
        <Textarea
          placeholder="Имя, номер, способ связи. Даже одна строка помогает."
          value={day.support}
          onChange={(e) => onChange({ ...day, support: e.target.value, updatedAt: Date.now() })}
          className="mt-1 min-h-[70px]"
        />
      </div>
    </div>
  );
};

export default PlanForm;
