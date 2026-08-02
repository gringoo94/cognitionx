import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Gift, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackCta } from "@/lib/trackCta";
import { trackContact, trackCustomPixel } from "@/lib/metaPixel";

const HIDDEN_PREFIXES = ["/admin", "/thank-you", "/free-consultation", "/contact"];
const STORAGE_KEY = "exit_intent_seen_at";
const COOLDOWN_DAYS = 7;

const ExitIntentPopup = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (HIDDEN_PREFIXES.some((p) => pathname.startsWith(p))) return;

    try {
      const ts = Number(localStorage.getItem(STORAGE_KEY) || 0);
      if (ts && Date.now() - ts < COOLDOWN_DAYS * 24 * 3600 * 1000) return;
    } catch {
      /* ignore */
    }

    let triggered = false;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    const trigger = () => {
      if (triggered) return;
      triggered = true;
      setOpen(true);
      try {
        localStorage.setItem(STORAGE_KEY, String(Date.now()));
      } catch {
        /* ignore */
      }
      trackCta("exit_intent_shown", { path: pathname });
      trackCustomPixel("ExitIntentShown", { path: pathname });
    };

    // Desktop: mouse leaves top of viewport
    const onMouseOut = (e: MouseEvent) => {
      if (e.clientY <= 0 && !e.relatedTarget) trigger();
    };

    // Mobile: scroll up after scrolling down significantly
    let maxScroll = 0;
    let lastScroll = 0;
    const onScroll = () => {
      const y = window.scrollY;
      if (y > maxScroll) maxScroll = y;
      if (maxScroll > 600 && lastScroll - y > 80) trigger();
      lastScroll = y;
    };

    // Fallback: time on page > 60s
    const timeoutId = window.setTimeout(trigger, 60000);

    if (isMobile) {
      window.addEventListener("scroll", onScroll, { passive: true });
    } else {
      document.addEventListener("mouseout", onMouseOut);
    }

    return () => {
      window.clearTimeout(timeoutId);
      document.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  if (!open) return null;

  const close = () => setOpen(false);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/60 backdrop-blur-sm p-4 animate-in fade-in"
      onClick={close}
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-background border border-border shadow-2xl p-7 animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Закрыть"
          onClick={close}
          className="absolute top-3 right-3 w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-full bg-accent/15 flex items-center justify-center mb-4">
          <Gift className="w-6 h-6 text-accent" />
        </div>

        <h3 className="text-xl font-bold tracking-tight">Подождите — есть бесплатный вариант</h3>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          20-минутная встреча-знакомство без оплаты. Познакомимся, обсудим запрос и решим,
          подходим ли мы друг другу. Без обязательств.
        </p>

        <div className="mt-5 flex flex-col gap-2">
          <Button asChild size="lg" className="w-full rounded-lg gap-2">
            <Link
              to="/free-consultation"
              onClick={() => {
                trackCta("exit_intent_free_consultation");
                close();
              }}
            >
              <Gift className="w-4 h-4" /> Записаться бесплатно
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="w-full rounded-lg gap-2">
            <a
              href="https://t.me/gringoo94"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackCta("exit_intent_telegram");
                trackContact("exit_intent_telegram");
                close();
              }}
            >
              <Send className="w-4 h-4" /> Спросить в Telegram
            </a>
          </Button>
        </div>

        <button
          type="button"
          onClick={close}
          className="mt-4 w-full text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Нет, спасибо
        </button>
      </div>
    </div>
  );
};

export default ExitIntentPopup;
