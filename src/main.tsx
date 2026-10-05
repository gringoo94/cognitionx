import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initWebVitals } from "./lib/web-vitals";

// After a new deploy, old tabs reference hashed chunks that no longer exist.
// Reload once to pick up the fresh build instead of showing a blank screen.
const RELOAD_KEY = "chunk-reload-at";
const reloadOnStaleChunk = () => {
  const last = Number(sessionStorage.getItem(RELOAD_KEY) || 0);
  if (Date.now() - last < 10000) return; // avoid reload loops
  sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
  window.location.reload();
};
window.addEventListener("vite:preloadError", (e) => {
  e.preventDefault();
  reloadOnStaleChunk();
});
const isChunkError = (msg: string) =>
  /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module/i.test(msg);
window.addEventListener("unhandledrejection", (e) => {
  if (isChunkError(String(e.reason?.message ?? e.reason ?? ""))) reloadOnStaleChunk();
});
window.addEventListener("error", (e) => {
  if (isChunkError(String(e.message ?? ""))) reloadOnStaleChunk();
});

createRoot(document.getElementById("root")!).render(<App />);

// Defer Web Vitals init so it never competes with hydration / LCP
if ("requestIdleCallback" in window) {
  requestIdleCallback(() => initWebVitals(), { timeout: 3000 });
} else {
  setTimeout(initWebVitals, 1500);
}
