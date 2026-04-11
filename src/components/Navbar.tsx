import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const links = [
  { label: "Обо мне", href: "#about" },
  { label: "Подход", href: "#approach" },
  { label: "Специализации", href: "#specs" },
  { label: "Цены", href: "#pricing" },
  { label: "Блог", href: "/blog" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="flex items-center justify-between max-w-6xl mx-auto px-6 py-3.5">
        <a href="#" className="text-lg font-bold tracking-tight">
          Д. Яцко
        </a>
        <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-foreground transition-colors">
              {l.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Button size="sm" asChild className="hidden md:inline-flex">
            <a href="#booking">Записаться</a>
          </Button>
          <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-card p-6 space-y-4">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block text-sm text-muted-foreground hover:text-foreground">
              {l.label}
            </a>
          ))}
          <Button size="sm" className="w-full" asChild>
            <a href="#booking" onClick={() => setOpen(false)}>Записаться</a>
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
