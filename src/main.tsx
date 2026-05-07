import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initWebVitals } from "./lib/web-vitals";

createRoot(document.getElementById("root")!).render(<App />);

// Defer Web Vitals init so it never competes with hydration / LCP
if ("requestIdleCallback" in window) {
  requestIdleCallback(() => initWebVitals(), { timeout: 3000 });
} else {
  setTimeout(initWebVitals, 1500);
}
