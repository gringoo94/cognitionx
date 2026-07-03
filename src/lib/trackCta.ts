import { supabase } from "@/integrations/supabase/client";

/**
 * Лог клика по CTA в таблицу cta_clicks.
 * Безопасно вызывается из обработчиков — не блокирует переход и тихо падает.
 */
export const trackCta = (name: string, meta?: Record<string, unknown>) => {
  try {
    const path =
      typeof window !== "undefined" ? window.location.pathname : null;
    const referrer =
      typeof document !== "undefined" ? document.referrer || null : null;
    const userAgent =
      typeof navigator !== "undefined" ? navigator.userAgent : null;

    void supabase
      .from("cta_clicks")
      .insert([
        {
          name,
          path: path ?? undefined,
          referrer: referrer ?? undefined,
          user_agent: userAgent ?? undefined,
          meta: (meta ?? null) as never,
        },
      ])
      .then(() => undefined, () => undefined);
  } catch {
    /* analytics never blocks UX */
  }

  // Mirror to GTM dataLayer for GA4/Pixel consumers
  try {
    const w = window as unknown as { dataLayer?: unknown[] };
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({ event: "cta_click", cta_name: name, ...(meta || {}) });
  } catch {
    /* ignore */
  }

  // Yandex Metrika goal
  try {
    const w = window as unknown as { ym?: (id: number, method: string, target: string, params?: Record<string, unknown>) => void };
    if (typeof w.ym === "function") {
      w.ym(97350684, "reachGoal", name, meta || {});
    }
  } catch {
    /* ignore */
  }
};
