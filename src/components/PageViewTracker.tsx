import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const PageViewTracker = () => {
  const location = useLocation();

  useEffect(() => {
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
