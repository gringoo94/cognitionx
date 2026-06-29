import { useState, useEffect, useMemo } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

/* ── Types ── */
interface BAEntry {
  id: string;
  activity: string;
  date: string;
  category: string;
  mood: number;
  mastery: number;
  pleasure: number;
}

const CATEGORIES = [
  { label: "Физическая", color: "hsl(var(--primary))" },
  { label: "Социальная", color: "hsl(170 70% 45%)" },
  { label: "Работа", color: "hsl(35 90% 55%)" },
  { label: "Отдых", color: "hsl(340 75% 55%)" },
  { label: "Быт", color: "hsl(220 10% 60%)" },
  { label: "Творчество", color: "hsl(280 65% 55%)" },
];

const STORAGE_KEY = "ba-diary-entries";

const moodColor = (v: number) =>
  v <= 3 ? "hsl(0 72% 55%)" : v <= 5 ? "hsl(35 90% 55%)" : v <= 7 ? "hsl(50 85% 50%)" : "hsl(150 60% 45%)";

const catColor = (cat: string) => CATEGORIES.find((c) => c.label === cat)?.color ?? "hsl(var(--muted-foreground))";

/* ── Component ── */
const BehavioralActivationDiary = () => {
  const [entries, setEntries] = useState<BAEntry[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [tab, setTab] = useState<"add" | "history" | "analytics">("add");

  // Form state
  const [activity, setActivity] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [category, setCategory] = useState("Физическая");
  const [mood, setMood] = useState(5);
  const [mastery, setMastery] = useState(5);
  const [pleasure, setPleasure] = useState(5);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const addEntry = () => {
    if (!activity.trim()) return;
    const entry: BAEntry = {
      id: crypto.randomUUID(),
      activity: activity.trim().slice(0, 200),
      date,
      category,
      mood,
      mastery,
      pleasure,
    };
    setEntries((prev) => [entry, ...prev]);
    setActivity("");
    setMood(5);
    setMastery(5);
    setPleasure(5);
    setTab("history");
  };

  const removeEntry = (id: string) => setEntries((prev) => prev.filter((e) => e.id !== id));

  /* ── Analytics ── */
  const stats = useMemo(() => {
    if (!entries.length) return null;
    const avgMood = entries.reduce((s, e) => s + e.mood, 0) / entries.length;
    const avgMastery = entries.reduce((s, e) => s + e.mastery, 0) / entries.length;
    const avgPleasure = entries.reduce((s, e) => s + e.pleasure, 0) / entries.length;

    const byCat: Record<string, { count: number; moodSum: number }> = {};
    entries.forEach((e) => {
      if (!byCat[e.category]) byCat[e.category] = { count: 0, moodSum: 0 };
      byCat[e.category].count++;
      byCat[e.category].moodSum += e.mood;
    });

    return { avgMood, avgMastery, avgPleasure, total: entries.length, byCat };
  }, [entries]);

  /* ── Grouped history ── */
  const grouped = useMemo(() => {
    const map: Record<string, BAEntry[]> = {};
    entries.forEach((e) => {
      if (!map[e.date]) map[e.date] = [];
      map[e.date].push(e);
    });
    return Object.entries(map).sort(([a], [b]) => b.localeCompare(a));
  }, [entries]);

  const tabs = [
    { id: "add" as const, label: "Добавить запись" },
    { id: "history" as const, label: "История" },
    { id: "analytics" as const, label: "Аналитика" },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card p-5 md:p-7 my-10">
      {/* Header */}
      <div className="mb-5">
        <span className="text-3xl mb-2 block">🧠</span>
        <h3 className="text-xl font-bold text-foreground tracking-tight">Поведенческая активация</h3>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
          Фиксируйте активности и отслеживайте их влияние на настроение.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border mb-5 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              tab === t.id
                ? "text-foreground border-foreground"
                : "text-muted-foreground border-transparent hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Add Tab ── */}
      {tab === "add" && (
        <div className="space-y-5">
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground mb-3">
              Новая запись
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="flex-1">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground block mb-1">
                  Активность
                </label>
                <Input
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                  placeholder="Прогулка, уборка, звонок другу…"
                  maxLength={200}
                  className="bg-background"
                />
              </div>
              <div className="sm:w-40">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground block mb-1">
                  Дата
                </label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-background"
                />
              </div>
            </div>

            {/* Categories */}
            <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground mb-2">
              Категория
            </p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {CATEGORIES.map((c) => (
                <button
                  key={c.label}
                  onClick={() => setCategory(c.label)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                    category === c.label
                      ? "border-transparent text-foreground"
                      : "border-border text-muted-foreground hover:bg-muted/50"
                  }`}
                  style={category === c.label ? { background: c.color + "22", borderColor: c.color + "44" } : {}}
                >
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c.color }} />
                  {c.label}
                </button>
              ))}
            </div>

            {/* Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              {[
                { label: "Настроение", value: mood, set: setMood },
                { label: "Мастерство", value: mastery, set: setMastery },
                { label: "Удовольствие", value: pleasure, set: setPleasure },
              ].map((s) => (
                <div key={s.label} className="rounded-md border border-border bg-background p-3">
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
                      {s.label}
                    </span>
                    <span className="text-xl font-bold text-foreground">{s.value}</span>
                  </div>
                  <Slider
                    value={[s.value]}
                    onValueChange={([v]) => s.set(v)}
                    min={1}
                    max={10}
                    step={1}
                    thumbAriaLabel={s.label}
                  />
                </div>
              ))}
            </div>

            <Button onClick={addEntry} disabled={!activity.trim()} className="w-full gap-2">
              <Plus className="h-4 w-4" /> Добавить запись
            </Button>
          </div>
        </div>
      )}

      {/* ── History Tab ── */}
      {tab === "history" && (
        <div className="space-y-5">
          {entries.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-10">
              Записей пока нет. Добавьте первую активность.
            </p>
          ) : (
            grouped.map(([date, items]) => {
              const dayAvg = items.reduce((s, e) => s + e.mood, 0) / items.length;
              return (
                <div key={date}>
                  <div className="flex justify-between items-center border-b border-border/50 pb-1.5 mb-2">
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
                      {new Date(date).toLocaleDateString("ru", { day: "numeric", month: "long" })}
                    </span>
                    <span className="text-xs font-semibold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ background: moodColor(dayAvg) }} />
                      {dayAvg.toFixed(1)}
                    </span>
                  </div>
                  <div className="rounded-lg border border-border overflow-hidden">
                    {/* Header row - desktop */}
                    <div className="hidden sm:grid grid-cols-[1fr_80px_50px_50px_50px_34px] bg-muted/50 border-b border-border">
                      {["Активность", "Категория", "😊", "⚡", "✨", ""].map((h, i) => (
                        <span key={i} className="px-2.5 py-1.5 text-[11px] uppercase tracking-wider font-semibold text-muted-foreground text-center first:text-left">
                          {h}
                        </span>
                      ))}
                    </div>
                    {items.map((e) => (
                      <div
                        key={e.id}
                        className="grid grid-cols-[1fr_auto_34px] sm:grid-cols-[1fr_80px_50px_50px_50px_34px] border-b border-border/30 last:border-0 items-center hover:bg-muted/30 transition-colors"
                      >
                        <div className="px-2.5 py-2 flex items-center gap-2 text-sm">
                          <span
                            className="inline-flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded font-medium"
                            style={{ background: catColor(e.category) + "18", color: catColor(e.category) }}
                          >
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: catColor(e.category) }} />
                            {e.category.slice(0, 3)}
                          </span>
                          <span className="truncate text-foreground">{e.activity}</span>
                        </div>
                        {/* Desktop columns */}
                        <span className="hidden sm:flex px-2.5 py-2 text-xs text-muted-foreground justify-center">{e.category}</span>
                        <span className="hidden sm:flex px-2.5 py-2 justify-center">
                          <span
                            className="w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center text-white"
                            style={{ background: moodColor(e.mood) }}
                          >
                            {e.mood}
                          </span>
                        </span>
                        <span className="hidden sm:flex px-2.5 py-2 text-xs text-muted-foreground justify-center">{e.mastery}</span>
                        <span className="hidden sm:flex px-2.5 py-2 text-xs text-muted-foreground justify-center">{e.pleasure}</span>
                        {/* Mobile mood chip */}
                        <span className="sm:hidden flex px-2 py-2 justify-center">
                          <span
                            className="w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center text-white"
                            style={{ background: moodColor(e.mood) }}
                          >
                            {e.mood}
                          </span>
                        </span>
                        <button
                          onClick={() => removeEntry(e.id)}
                          className="px-2 py-2 text-muted-foreground/50 hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ── Analytics Tab ── */}
      {tab === "analytics" && (
        <div className="space-y-5">
          {!stats ? (
            <p className="text-center text-sm text-muted-foreground py-10">
              Добавьте хотя бы одну запись для аналитики.
            </p>
          ) : (
            <>
              {/* Summary cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: "Записей", value: stats.total.toString() },
                  { label: "Ср. настроение", value: stats.avgMood.toFixed(1) },
                  { label: "Ср. мастерство", value: stats.avgMastery.toFixed(1) },
                  { label: "Ср. удовольствие", value: stats.avgPleasure.toFixed(1) },
                ].map((s) => (
                  <div key={s.label} className="rounded-lg border border-border bg-muted/30 p-3">
                    <div className="text-xl font-bold text-foreground">{s.value}</div>
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* By category */}
              <div>
                <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground mb-3">
                  Настроение по категориям
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Object.entries(stats.byCat).map(([cat, data]) => {
                    const avg = data.moodSum / data.count;
                    return (
                      <div key={cat} className="rounded-lg border border-border bg-muted/30 p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-2 h-2 rounded-full" style={{ background: catColor(cat) }} />
                          <span className="text-sm font-medium text-foreground">{cat}</span>
                          <span className="ml-auto text-sm font-bold" style={{ color: moodColor(avg) }}>
                            {avg.toFixed(1)}
                          </span>
                        </div>
                        <div className="h-1 rounded-full bg-border overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${(avg / 10) * 100}%`, background: moodColor(avg) }}
                          />
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1">{data.count} записей</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      <p className="text-[11px] text-muted-foreground text-center mt-5">
        Данные сохраняются в вашем браузере и не передаются на сервер.
      </p>
    </div>
  );
};

export default BehavioralActivationDiary;
