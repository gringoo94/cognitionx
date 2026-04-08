import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const links = [
  { label: "Обо мне", href: "#about" },
  { label: "Специализации", href: "#specs" },
  { label: "Подход", href: "#approach" },
  { label: "Цены", href: "#pricing" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <a href="#" className="font-heading text-lg text-foreground tracking-tight">
          Дмитрий Яцко
        </a>
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[13px] text-muted-foreground hover:text-foreground transition-colors duration-200 tracking-wide uppercase"
            >
              {l.label}
            </a>
          ))}
          <Button size="sm" className="rounded-full px-6 text-xs tracking-wide" asChild>
            <a href="#booking">Записаться</a>
          </Button>
        </div>
        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-background p-6 space-y-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block text-sm text-muted-foreground hover:text-foreground uppercase tracking-wide"
            >
              {l.label}
            </a>
          ))}
          <Button size="sm" className="w-full rounded-full" asChild>
            <a href="#booking" onClick={() => setOpen(false)}>Записаться</a>
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
