import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Send, X } from "lucide-react";
import { trackCta } from "@/lib/trackCta";

// Routes where the FAB should NOT appear
const HIDDEN_PREFIXES = ["/admin", "/thank-you", "/free-consultation"];

const STORAGE_KEY = "fab_telegram_dismissed_at";
const DISMISS_HOURS = 24;

const FloatingTelegramFab = () => {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (HIDDEN_PREFIXES.some((p) => pathname.startsWith(p))) {
      setVisible(false);
      return;
    }
    try {
      const ts = Number(localStorage.getItem(STORAGE_KEY) || 0);
      if (ts && Date.now() - ts < DISMISS_HOURS * 3600 * 1000) {
        setVisible(false);
        return;
      }
    } catch {
      /* ignore */
    }
    // Slight delay so it doesn't fight the first paint
    const t = window.setTimeout(() => setVisible(true), 1200);
    return () => window.clearTimeout(t);
  }, [pathname]);

  // Auto-expand tooltip once per session after 8s of being visible
  useEffect(() => {
    if (!visible) return;
    try {
      if (sessionStorage.getItem("fab_telegram_hinted") === "1") return;
    } catch {
      /* ignore */
    }
    const t = window.setTimeout(() => {
      setExpanded(true);
      try {
        sessionStorage.setItem("fab_telegram_hinted", "1");
      } catch {
        /* ignore */
      }
      window.setTimeout(() => setExpanded(false), 5000);
    }, 8000);
    return () => window.clearTimeout(t);
  }, [visible]);

  if (!visible) return null;

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  const handleClick = () => {
    trackCta("telegram_fab");
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "Contact", { content_name: "telegram_fab" });
    }
  };

  const compact = pathname === "/blog" || pathname.startsWith("/blog?");

  return (
    <div
      className="fixed right-5 z-50 flex items-end gap-2 print:hidden"
      style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 1.25rem)" }}
    >
      {expanded && !compact && (
        <div className="hidden sm:block mb-1 max-w-[220px] rounded-xl bg-foreground text-background text-xs px-3 py-2 shadow-lg animate-in fade-in slide-in-from-bottom-2">
          Есть вопрос? Напишите — отвечу в течение дня.
        </div>
      )}
      <div className="relative group">
        <button
          type="button"
          aria-label="Закрыть"
          onClick={handleDismiss}
          className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-background border border-border text-muted-foreground hover:text-foreground flex items-center justify-center shadow-sm z-10"
        >
          <X className="w-3 h-3" />
        </button>
        {compact ? (
          <a
            href="https://t.me/gringoo94"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            aria-label="Написать в Telegram"
            title="Написать в Telegram"
            className="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl shadow-primary/30 hover:bg-primary/90 transition-colors w-[54px] h-[54px]"
          >
            <Send className="w-5 h-5" />
            <span className="pointer-events-none absolute right-full mr-2 whitespace-nowrap rounded-md bg-foreground text-background text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
              Написать в Telegram
            </span>
          </a>
        ) : (
          <a
            href="https://t.me/gringoo94"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            aria-label="Написать в Telegram"
            className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground shadow-xl shadow-primary/30 hover:bg-primary/90 transition-colors h-12 pl-4 pr-5 text-sm font-medium"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Написать в Telegram</span>
            <span className="sm:hidden">Telegram</span>
          </a>
        )}
      </div>
    </div>
  );
};

export default FloatingTelegramFab;
