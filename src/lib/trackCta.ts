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
      .insert({
        name,
        path,
        referrer,
        user_agent: userAgent,
        meta: meta ?? null,
      })
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
};
