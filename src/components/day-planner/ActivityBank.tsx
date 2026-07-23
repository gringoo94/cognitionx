import { useMemo, useState } from "react";
import { Plus, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type Activity,
  type ActivityDuration,
  type PillarType,
  ACTIVITY_PRESETS,
  durationLabel,
  durationShort,
  pillarHint,
  pillarLabel,
  uid,
} from "@/lib/dayPlanner";

interface Props {
  activities: Activity[];
  onChange: (next: Activity[]) => void;
}

const TARGETS: Record<PillarType, number> = {
  necessary: 10,
  pleasure: 15,
  mastery: 15,
};

const TINTS: Record<PillarType, string> = {
  necessary: "border-l-primary/70",
  pleasure: "border-l-amber-500/70",
  mastery: "border-l-emerald-500/70",
};

const ActivityBank = ({ activities, onChange }: Props) => {
  const byType = (t: PillarType) => activities.filter((a) => a.type === t);
  const starters = activities.filter((a) => a.starter);

  const upsert = (next: Activity) => {
    const idx = activities.findIndex((a) => a.id === next.id);
    if (idx === -1) onChange([...activities, next]);
    else {
      const copy = activities.slice();
      copy[idx] = next;
      onChange(copy);
    }
  };

  const remove = (id: string) => onChange(activities.filter((a) => a.id !== id));

  const togglePreset = (type: PillarType, title: string) => {
    const existing = activities.find(
      (a) => a.type === type && a.title.toLowerCase() === title.toLowerCase(),
    );
    if (existing) remove(existing.id);
    else
      upsert({
        id: uid(),
        type,
        title,
        feasibility: -1,
        duration: null,
        starter: false,
        source: "preset",
      });
  };

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-border/60 bg-card/40 p-4 md:p-5 text-sm text-muted-foreground leading-relaxed space-y-2">
        <p>
          При депрессии кажется, что ничего не хочется и ничего не поможет. Соберите
          заранее список возможных занятий — вам не нужно делать их сейчас, только собрать.
        </p>
        <p>
          Отметьте подходящие карточки, добавьте свои. Затем оцените выполнимость и время,
          чтобы выбрать <span className="text-foreground font-medium">стартовые</span> —
          с них начнётся план ближайших дней.
        </p>
      </div>

      {(Object.keys(TARGETS) as PillarType[]).map((type, stepIdx) => (
        <TypeSection
          key={type}
          type={type}
          step={stepIdx + 1}
          list={byType(type)}
          onToggle={(title) => togglePreset(type, title)}
          onUpsert={upsert}
          onRemove={remove}
        />
      ))}

      <StartersPanel starters={starters} />
    </div>
  );
};

const TypeSection = ({
  type,
  step,
  list,
  onToggle,
  onUpsert,
  onRemove,
}: {
  type: PillarType;
  step: number;
  list: Activity[];
  onToggle: (title: string) => void;
  onUpsert: (next: Activity) => void;
  onRemove: (id: string) => void;
}) => {
  const [custom, setCustom] = useState("");
  const target = TARGETS[type];
  const presets = ACTIVITY_PRESETS[type];
  const chosenTitles = useMemo(
    () => new Set(list.map((a) => a.title.toLowerCase())),
    [list],
  );

  const addCustom = () => {
    const t = custom.trim();
    if (!t) return;
    if (chosenTitles.has(t.toLowerCase())) {
      setCustom("");
      return;
    }
    onUpsert({
      id: uid(),
      type,
      title: t,
      feasibility: -1,
      duration: null,
      starter: false,
      source: "custom",
    });
    setCustom("");
  };

  return (
    <section
      className={`rounded-xl border border-border/60 border-l-4 ${TINTS[type]} bg-card/30 p-4 md:p-5 space-y-4`}
    >
      <header>
        <div className="text-xs uppercase tracking-wider font-semibold text-primary">
          Шаг {step}. {pillarLabel[type]}
        </div>
        <p className="text-xs text-muted-foreground italic mt-1">{pillarHint[type]}</p>
        <p className="text-xs text-muted-foreground mt-2">
          Цель: <span className="text-foreground font-medium">не менее {target}</span> ·
          сейчас: <span className="text-foreground font-medium">{list.length}</span>
        </p>
      </header>

      <div>
        <Label className="text-xs text-muted-foreground">Готовые карточки</Label>
        <div className="mt-2 flex flex-wrap gap-2">
          {presets.map((p) => {
            const active = chosenTitles.has(p.toLowerCase());
            return (
              <button
                key={p}
                type="button"
                onClick={() => onToggle(p)}
                className={`text-xs md:text-sm px-3 py-1.5 rounded-full border transition ${
                  active
                    ? "bg-primary/15 border-primary/40 text-foreground"
                    : "bg-background border-border/60 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {active ? "✓ " : "＋ "}
                {p}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <Label className="text-xs text-muted-foreground">Добавить свою</Label>
        <div className="mt-1 flex gap-2">
          <Input
            placeholder="Например: полить растения"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustom();
              }
            }}
          />
          <Button onClick={addCustom} disabled={!custom.trim()} className="gap-1 shrink-0">
            <Plus className="w-4 h-4" /> Добавить
          </Button>
        </div>
      </div>

      {list.length > 0 && (
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            Шаг 4–5: оценка и стартовые
          </Label>
          <div className="space-y-2">
            {list.map((a) => (
              <ActivityRow
                key={a.id}
                activity={a}
                onChange={onUpsert}
                onRemove={() => onRemove(a.id)}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

const ActivityRow = ({
  activity,
  onChange,
  onRemove,
}: {
  activity: Activity;
  onChange: (next: Activity) => void;
  onRemove: () => void;
}) => {
  const rated = activity.feasibility >= 0;
  const feasibleEnough = activity.feasibility >= 7;
  const shortEnough =
    activity.duration === "u5" ||
    activity.duration === "u15" ||
    activity.duration === "u30";
  const suggested = rated && feasibleEnough && shortEnough;

  return (
    <div className="rounded-lg border border-border/60 bg-background/40 p-3 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="text-sm text-foreground flex-1 min-w-0 break-words">
          {activity.title}
          {suggested && !activity.starter && (
            <span className="ml-2 text-[11px] text-primary/80">рекомендуется в стартовые</span>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 ${
              activity.starter ? "text-amber-500" : "text-muted-foreground hover:text-amber-500"
            }`}
            aria-label={activity.starter ? "Убрать из стартовых" : "В стартовые"}
            onClick={() => onChange({ ...activity, starter: !activity.starter })}
          >
            <Star className={`w-4 h-4 ${activity.starter ? "fill-current" : ""}`} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            aria-label="Удалить"
            onClick={onRemove}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 md:items-center">
        <div>
          <div className="flex items-baseline justify-between mb-1">
            <Label className="text-xs text-muted-foreground">Выполнимо сейчас</Label>
            <span className="text-xs tabular-nums text-foreground">
              {rated ? `${activity.feasibility}/10` : "—"}
            </span>
          </div>
          <Slider
            value={[rated ? activity.feasibility : 0]}
            min={0}
            max={10}
            step={1}
            onValueChange={(v) => onChange({ ...activity, feasibility: v[0] })}
          />
        </div>
        <div className="md:w-[160px]">
          <Label className="text-xs text-muted-foreground">Время</Label>
          <Select
            value={activity.duration ?? ""}
            onValueChange={(v) => onChange({ ...activity, duration: v as ActivityDuration })}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="выбрать" />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(durationLabel) as ActivityDuration[]).map((d) => (
                <SelectItem key={d} value={d}>
                  {durationLabel[d]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

const StartersPanel = ({ starters }: { starters: Activity[] }) => {
  const grouped = (t: PillarType) => starters.filter((a) => a.type === t);
  const counts = {
    necessary: grouped("necessary").length,
    pleasure: grouped("pleasure").length,
    mastery: grouped("mastery").length,
  };
  const ok = counts.necessary >= 2 && counts.pleasure >= 2 && counts.mastery >= 2;

  return (
    <section className="rounded-xl border border-primary/30 bg-primary/5 p-4 md:p-5 space-y-3">
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <h3 className="text-sm font-semibold text-foreground">Ваши стартовые активности</h3>
        <span className="text-xs text-muted-foreground">
          Цель: по 2 на каждый тип, выполнимость ≥7, время ≤ 15–30 мин
        </span>
      </div>
      {starters.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">
          Отметьте <Star className="inline w-3.5 h-3.5 align-[-2px]" /> у активностей,
          с которых готовы начать. Они появятся подсказками на вкладке «План на день».
        </p>
      ) : (
        <div className="grid gap-3 md:grid-cols-3">
          {(["necessary", "pleasure", "mastery"] as PillarType[]).map((t) => (
            <div key={t} className="rounded-lg bg-background/40 border border-border/40 p-3">
              <div className="text-xs uppercase tracking-wider text-primary font-semibold">
                {pillarLabel[t]}
                <span className="ml-2 text-muted-foreground normal-case tracking-normal">
                  {counts[t]}/2
                </span>
              </div>
              <ul className="mt-2 space-y-1 text-sm text-foreground">
                {grouped(t).length === 0 && (
                  <li className="text-xs text-muted-foreground italic">— пусто</li>
                )}
                {grouped(t).map((a) => (
                  <li key={a.id} className="flex items-baseline gap-2">
                    <span className="flex-1 min-w-0 break-words">{a.title}</span>
                    {a.duration && (
                      <span className="text-[11px] text-muted-foreground shrink-0">
                        {durationShort[a.duration]}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      {starters.length > 0 && (
        <p className={`text-xs ${ok ? "text-emerald-500" : "text-muted-foreground"}`}>
          {ok
            ? "Готово: этого хватает, чтобы собрать план на день."
            : "Добавьте ещё стартовых, чтобы получилось по 2 на каждый тип."}
        </p>
      )}
    </section>
  );
};

// keep Checkbox import used to avoid tree-shake surprises in some setups
void Checkbox;

export default ActivityBank;
