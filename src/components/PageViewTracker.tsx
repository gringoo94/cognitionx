import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const PageViewTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Push SPA route change to GTM dataLayer so GA4 / Pixel tags can fire on every navigation
    try {
      const w = window as any;
      w.dataLayer = w.dataLayer || [];
      w.dataLayer.push({
        event: "page_view",
        page_path: location.pathname + location.search,
        page_location: window.location.href,
        page_title: document.title,
      });
    } catch {
      // ignore
    }

    // Yandex Metrika SPA hit
    try {
      const w = window as any;
      if (typeof w.ym === "function") {
        w.ym(97350684, "hit", window.location.href, {
          title: document.title,
          referer: document.referrer || undefined,
        });
      }
    } catch {
      // ignore
    }


    const trackView = async () => {
      try {
        await supabase.from("page_views").insert({
          path: location.pathname,
          referrer: document.referrer || null,
          user_agent: navigator.userAgent,
        });
      } catch {
        // silent fail — analytics should never block UX
      }
    };
    trackView();
  }, [location.pathname]);

  return null;
};

export default PageViewTracker;
