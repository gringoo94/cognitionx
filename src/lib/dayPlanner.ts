// Local storage & types for the Day Planner tool (behavioral activation).
// All data is kept in the browser only.

export type PillarType = "necessary" | "pleasure" | "mastery";

export interface Observation {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  action: string;
  energy: number; // 0..10
  pleasure: number; // 0..10
  mastery: number; // 0..10
}

export interface Pillar {
  type: PillarType;
  action: string;
  minimal: string;
  when: string;
  status: "planned" | "done" | "minimal" | "skipped";
  pleasure: number; // 0..10
  mastery: number; // 0..10
  meaning: number; // 0..10
  note: string;
}

export interface DayPlan {
  date: string; // YYYY-MM-DD
  energyForecast: number; // 0..10
  pillars: Pillar[];
  support: string;
  createdAt: number;
  updatedAt: number;
}

export interface DayPlannerState {
  version: 1;
  observations: Observation[];
  days: Record<string, DayPlan>;
}

const STORAGE_KEY = "cx.day-planner.v1";

const emptyState = (): DayPlannerState => ({
  version: 1,
  observations: [],
  days: {},
});

export const emptyPillar = (type: PillarType): Pillar => ({
  type,
  action: "",
  minimal: "",
  when: "",
  status: "planned",
  pleasure: 0,
  mastery: 0,
  meaning: 0,
  note: "",
});

export const emptyDay = (date: string): DayPlan => ({
  date,
  energyForecast: 5,
  pillars: [emptyPillar("necessary"), emptyPillar("pleasure"), emptyPillar("mastery")],
  support: "",
  createdAt: Date.now(),
  updatedAt: Date.now(),
});

export const todayISO = (): string => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export const uid = (): string =>
  Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

export const loadState = (): DayPlannerState => {
  if (typeof window === "undefined") return emptyState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== 1) return emptyState();
    return {
      version: 1,
      observations: Array.isArray(parsed.observations) ? parsed.observations : [],
      days: parsed.days && typeof parsed.days === "object" ? parsed.days : {},
    };
  } catch {
    return emptyState();
  }
};

export const saveState = (state: DayPlannerState): void => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* quota exceeded — ignore */
  }
};

export const exportJson = (state: DayPlannerState): void => {
  const blob = new Blob([JSON.stringify(state, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `day-planner-${todayISO()}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const energyPrinciple = (e: number): string => {
  if (e <= 2) return "Безопасность: еда, вода, лекарства, контакт с поддержкой.";
  if (e <= 4) return "Один необходимый шаг + одно очень маленькое поддерживающее действие.";
  if (e <= 6) return "Несколько коротких блоков с паузами.";
  return "Более обычная нагрузка — без компенсации «потерянных» дней.";
};

export const pillarLabel: Record<PillarType, string> = {
  necessary: "Необходимое",
  pleasure: "Удовольствие / облегчение",
  mastery: "Результат / смысл",
};

export const pillarHint: Record<PillarType, string> = {
  necessary: "Поддерживает базовую жизнь: поесть, лекарства, душ, важное сообщение.",
  pleasure: "Проверка реакции: песня, чай у окна, короткая прогулка, животное.",
  mastery: "Ощущение влияния: одна поверхность, простая еда, маленький этап работы.",
};

export const statusLabel: Record<Pillar["status"], string> = {
  planned: "Запланировано",
  done: "Выполнено",
  minimal: "Минимальная версия",
  skipped: "Не сделано",
};

export const avg = (nums: number[]): number => {
  if (!nums.length) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
};

// Build a sparkline SVG path (0..10 range) for values in chronological order.
export const sparkline = (
  values: number[],
  width = 120,
  height = 28,
): string => {
  if (values.length === 0) return "";
  if (values.length === 1) {
    const y = height - (values[0] / 10) * height;
    return `M0,${y} L${width},${y}`;
  }
  const step = width / (values.length - 1);
  return values
    .map((v, i) => {
      const x = i * step;
      const y = height - (Math.max(0, Math.min(10, v)) / 10) * height;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
};

export const formatDateRu = (iso: string): string => {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    weekday: "short",
  });
};

export const lastNDays = (state: DayPlannerState, n = 14): DayPlan[] => {
  return Object.values(state.days)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, n);
};
