// Production-only Core Web Vitals reporting.
// Sends metrics to:
//  1) Yandex Metrika (params)  — visible in your existing dashboard
//  2) GA4 / GTM dataLayer      — visible in GA4 → Reports → Engagement → Events
//  3) console.table on ?debug-vitals — quick local check
//
// Metric thresholds (Google):
//   LCP good < 2500ms   needs-improvement < 4000ms
//   INP good < 200ms    needs-improvement < 500ms
//   CLS good < 0.1      needs-improvement < 0.25
//   FCP good < 1800ms   needs-improvement < 3000ms
//   TTFB good < 800ms   needs-improvement < 1800ms

import { onCLS, onINP, onLCP, onFCP, onTTFB, type Metric } from "web-vitals";

declare global {
  interface Window {
    ym?: (id: number, action: string, ...args: unknown[]) => void;
    dataLayer?: Array<Record<string, unknown>>;
    __webVitals?: Metric[];
  }
}

const YM_ID = 97350684;
const debug =
  typeof window !== "undefined" &&
  window.location.search.includes("debug-vitals");

function rate(name: string, value: number): "good" | "needs-improvement" | "poor" {
  const t: Record<string, [number, number]> = {
    LCP: [2500, 4000],
    INP: [200, 500],
    CLS: [0.1, 0.25],
    FCP: [1800, 3000],
    TTFB: [800, 1800],
  };
  const [g, n] = t[name] ?? [Infinity, Infinity];
  if (value <= g) return "good";
  if (value <= n) return "needs-improvement";
  return "poor";
}

function report(metric: Metric) {
  const value = Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value);
  const rating = rate(metric.name, metric.value);
  const path = window.location.pathname;

  // 1) Yandex Metrika
  try {
    window.ym?.(YM_ID, "params", {
      web_vitals: {
        [metric.name]: { value, rating, path },
      },
    });
  } catch {
    // ignore
  }

  // 2) GA4 / GTM
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "web_vitals",
      metric_name: metric.name,
      metric_value: value,
      metric_rating: rating,
      metric_id: metric.id,
      page_path: path,
    });
  } catch {
    // ignore
  }

  // 3) Debug
  if (debug) {
    window.__webVitals = window.__webVitals || [];
    window.__webVitals.push(metric);
    // eslint-disable-next-line no-console
    console.log(
      `%c[web-vitals] ${metric.name} = ${value}${metric.name === "CLS" ? "" : "ms"} (${rating})`,
      `color:${rating === "good" ? "#16a34a" : rating === "poor" ? "#dc2626" : "#d97706"};font-weight:bold`,
    );
  }
}

export function initWebVitals() {
  if (typeof window === "undefined") return;
  // Skip in preview/dev hosts so noisy data doesn't pollute prod metrics
  const host = window.location.hostname;
  if (host.includes("lovableproject.com") || host === "localhost") {
    if (!debug) return;
  }
  onLCP(report);
  onINP(report);
  onCLS(report);
  onFCP(report);
  onTTFB(report);
}
