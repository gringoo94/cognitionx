import { lazy, type ComponentType } from "react";

// Wraps React.lazy: on a stale/missing chunk (after a redeploy) reload the
// page once to fetch the fresh build instead of crashing to a blank screen.
export function lazyWithRetry<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
) {
  return lazy(async () => {
    try {
      return await factory();
    } catch (err) {
      const key = "chunk-reload-at";
      const last = Number(sessionStorage.getItem(key) || 0);
      if (Date.now() - last > 10000) {
        sessionStorage.setItem(key, String(Date.now()));
        window.location.reload();
        return new Promise<{ default: T }>(() => {}); // wait for reload
      }
      throw err;
    }
  });
}
