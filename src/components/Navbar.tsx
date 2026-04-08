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
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <a href="#" className="font-heading text-lg font-semibold text-foreground">
          Д. Яцко
        </a>
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              {l.label}
            </a>
          ))}
          <Button size="sm" className="rounded-lg px-6" asChild>
            <a href="#booking">Записаться</a>
          </Button>
        </div>
        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-card p-6 space-y-4">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block text-sm text-muted-foreground hover:text-primary">
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
