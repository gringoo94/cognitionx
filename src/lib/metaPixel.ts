/**
 * Meta Pixel conversion tracking.
 *
 * Пиксель грузится лениво (см. index.html), поэтому прямой вызов `window.fbq`
 * в обработчике может произойти до загрузки скрипта — событие теряется.
 * Этот модуль:
 *  - принудительно инициирует загрузку аналитики при первой конверсии,
 *  - буферизует события и отправляет их, как только fbq доступен,
 *  - генерирует event_id для дедупликации (нужно для Conversions API),
 *  - дублирует конверсию в dataLayer (GTM/GA4) и Яндекс.Метрику.
 */

export const META_PIXEL_ID = "1596710061557007";

type PixelParams = Record<string, unknown>;

interface QueuedEvent {
  method: "track" | "trackCustom";
  name: string;
  params: PixelParams;
  eventID: string;
}

interface PixelWindow extends Window {
  fbq?: (...args: unknown[]) => void;
  loadAnalytics?: () => void;
  dataLayer?: unknown[];
  ym?: (id: number, method: string, target: string, params?: PixelParams) => void;
}

const queue: QueuedEvent[] = [];
let flushTimer: ReturnType<typeof setInterval> | null = null;
let waitedMs = 0;
const MAX_WAIT_MS = 15000;
const TICK_MS = 250;

const getWindow = (): PixelWindow | null =>
  typeof window === "undefined" ? null : (window as unknown as PixelWindow);

export const makeEventId = (name: string): string => {
  const rand =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);
  return `${name.toLowerCase()}.${Date.now()}.${rand}`;
};

const flush = () => {
  const w = getWindow();
  if (!w) return;
  if (typeof w.fbq !== "function") return;

  while (queue.length) {
    const ev = queue.shift() as QueuedEvent;
    try {
      w.fbq(ev.method, ev.name, ev.params, { eventID: ev.eventID });
    } catch {
      /* analytics never blocks UX */
    }
  }

  if (flushTimer) {
    clearInterval(flushTimer);
    flushTimer = null;
  }
};

const scheduleFlush = () => {
  const w = getWindow();
  if (!w) return;

  // Разбудить ленивый загрузчик аналитики (index.html) — иначе конверсия
  // от пользователя без скроллов/кликов не долетит до Events Manager.
  try {
    w.loadAnalytics?.();
  } catch {
    /* ignore */
  }

  flush();
  if (!queue.length || flushTimer) return;

  waitedMs = 0;
  flushTimer = setInterval(() => {
    waitedMs += TICK_MS;
    flush();
    if (waitedMs >= MAX_WAIT_MS && flushTimer) {
      clearInterval(flushTimer);
      flushTimer = null;
      queue.length = 0; // сдаёмся — пиксель заблокирован (adblock и т.п.)
    }
  }, TICK_MS);
};

const mirrorToOtherTools = (name: string, params: PixelParams, eventID: string) => {
  const w = getWindow();
  if (!w) return;
  try {
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({ event: `meta_${name.toLowerCase()}`, event_id: eventID, ...params });
  } catch {
    /* ignore */
  }
};

/** Базовая отправка стандартного события Meta Pixel. */
export const trackPixel = (
  name: string,
  params: PixelParams = {},
  options?: { custom?: boolean; eventID?: string },
): string => {
  const eventID = options?.eventID ?? makeEventId(name);
  const payload: PixelParams = {
    ...params,
    source_url: typeof window !== "undefined" ? window.location.href : undefined,
  };

  queue.push({
    method: options?.custom ? "trackCustom" : "track",
    name,
    params: payload,
    eventID,
  });
  scheduleFlush();
  mirrorToOtherTools(name, payload, eventID);
  return eventID;
};

const LEAD_FLAG_KEY = "cx_lead_fired_at";

/** Конверсия «отправлена заявка/форма». */
export const trackLead = (contentName: string, params: PixelParams = {}): string => {
  try {
    sessionStorage.setItem(LEAD_FLAG_KEY, String(Date.now()));
  } catch {
    /* ignore */
  }
  return trackPixel("Lead", {
    content_name: contentName,
    content_category: "consultation",
    currency: "EUR",
    value: 0,
    ...params,
  });
};

/**
 * true, если Lead уже был отправлен формой в последние 60 секунд —
 * страница «Спасибо» не должна дублировать конверсию.
 */
export const leadRecentlyFired = (windowMs = 60000): boolean => {
  try {
    const raw = sessionStorage.getItem(LEAD_FLAG_KEY);
    if (!raw) return false;
    return Date.now() - Number(raw) < windowMs;
  } catch {
    return false;
  }
};

/** Конверсия «клик по кнопке связи» (Telegram, WhatsApp, email, звонок). */
export const trackContact = (contentName: string, params: PixelParams = {}): string =>
  trackPixel("Contact", { content_name: contentName, ...params });

/** Подписка на рассылку. */
export const trackSubscribe = (contentName: string, params: PixelParams = {}): string =>
  trackPixel("Subscribe", {
    content_name: contentName,
    currency: "EUR",
    value: 0,
    predicted_ltv: 0,
    ...params,
  });

/** Пользователь начал заполнять форму (микро-конверсия для оптимизации). */
export const trackInitiateForm = (contentName: string, params: PixelParams = {}): string =>
  trackPixel("InitiateCheckout", { content_name: contentName, ...params });

/** Кастомное событие (например, прохождение теста). */
export const trackCustomPixel = (name: string, params: PixelParams = {}): string =>
  trackPixel(name, params, { custom: true });
