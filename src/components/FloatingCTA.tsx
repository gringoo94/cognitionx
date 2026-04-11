import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const FloatingCTA = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <Button
      size="lg"
      className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg shadow-primary/25 gap-2 animate-in fade-in slide-in-from-bottom-4"
      asChild
    >
      <a href="/#booking">
        Записаться <ArrowUp className="w-4 h-4" />
      </a>
    </Button>
  );
};

export default FloatingCTA;
