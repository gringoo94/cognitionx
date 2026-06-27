// Lightweight client-side test history (localStorage only — no PII leaves the browser).

export interface TestHistoryEntry {
  slug: string;
  code: string;
  title: string;
  score: number;
  maxScore: number;
  levelLabel: string;
  tone: "success" | "warning" | "danger" | "info";
  takenAt: string; // ISO date
}

const KEY = "psy.test-history.v1";
const MAX_ENTRIES = 30;

function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getTestHistory(): TestHistoryEntry[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (e) => e && typeof e.slug === "string" && typeof e.score === "number",
    );
  } catch {
    return [];
  }
}

export function saveTestHistory(entry: TestHistoryEntry) {
  if (!isBrowser()) return;
  try {
    const list = getTestHistory();
    // Dedupe: same slug within 5 min -> replace
    const fiveMinAgo = Date.now() - 5 * 60_000;
    const filtered = list.filter(
      (e) => !(e.slug === entry.slug && new Date(e.takenAt).getTime() > fiveMinAgo),
    );
    filtered.unshift(entry);
    window.localStorage.setItem(KEY, JSON.stringify(filtered.slice(0, MAX_ENTRIES)));
  } catch {
    /* quota or serialization issue — silently skip */
  }
}

export function clearTestHistory() {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* noop */
  }
}

/** Most recent entry per slug, sorted by recency. */
export function getLatestPerTest(): TestHistoryEntry[] {
  const seen = new Set<string>();
  const out: TestHistoryEntry[] = [];
  for (const entry of getTestHistory()) {
    if (seen.has(entry.slug)) continue;
    seen.add(entry.slug);
    out.push(entry);
  }
  return out;
}
