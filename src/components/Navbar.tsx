import { useState, useRef, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const specLinks = [
  { label: "Депрессия", href: "/depression" },
  { label: "Тревога", href: "/anxiety" },
  { label: "Панические атаки", href: "/panic-attacks" },
  { label: "Выгорание", href: "/burnout" },
  { label: "Созависимость", href: "/co-dependency" },
  { label: "КПТ-терапия", href: "/cbt-therapy" },
  { label: "Онлайн-терапия", href: "/online-therapy" },
];

const links = [
  { label: "Обо мне", href: "/#about" },
  { label: "Подход", href: "/#approach" },
  { label: "Цены", href: "/#pricing" },
  { label: "Блог", href: "/blog" },
  { label: "Инструменты", href: "/tools" },
  { label: "Контакты", href: "/contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [specOpen, setSpecOpen] = useState(false);
  const specRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (specRef.current && !specRef.current.contains(e.target as Node)) {
        setSpecOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const isHashLink = (href: string) => href.startsWith("/#");

  const renderLink = (l: { label: string; href: string }, onClick?: () => void) => {
    if (isHashLink(l.href)) {
      return (
        <a key={l.href} href={l.href} onClick={onClick} className="block hover:text-foreground transition-colors">
          {l.label}
        </a>
      );
    }
    return (
      <Link key={l.href} to={l.href} onClick={onClick} className="block hover:text-foreground transition-colors">
        {l.label}
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="flex items-center justify-between max-w-6xl mx-auto px-6 py-3.5">
        <Link to="/" className="text-lg font-bold tracking-tight">
          CognitionX
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          {links.slice(0, 2).map((l) => renderLink(l))}

          {/* Specializations dropdown */}
          <div ref={specRef} className="relative">
            <button
              onClick={() => setSpecOpen(!specOpen)}
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              Специализации
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${specOpen ? "rotate-180" : ""}`} />
            </button>
            {specOpen && (
              <div className="absolute top-full left-0 mt-2 w-52 rounded-lg border border-border bg-card shadow-lg py-2 z-50">
                {specLinks.map((l) => (
                  <Link
                    key={l.href}
                    to={l.href}
                    onClick={() => setSpecOpen(false)}
                    className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {links.slice(2).map((l) => renderLink(l))}
        </div>
        <div className="flex items-center gap-3">
          <Button size="sm" asChild className="hidden md:inline-flex">
            <a href="/#booking">Записаться</a>
          </Button>
          <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-card p-6 space-y-4 text-sm text-muted-foreground">
          {links.slice(0, 2).map((l) => renderLink(l, () => setOpen(false)))}
          <div>
            <button
              onClick={() => setSpecOpen(!specOpen)}
              className="flex items-center gap-1 hover:text-foreground transition-colors w-full"
            >
              Специализации
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${specOpen ? "rotate-180" : ""}`} />
            </button>
            {specOpen && (
              <div className="mt-2 ml-3 space-y-3">
                {specLinks.map((l) => (
                  <Link
                    key={l.href}
                    to={l.href}
                    onClick={() => { setOpen(false); setSpecOpen(false); }}
                    className="block hover:text-foreground transition-colors"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
          {links.slice(2).map((l) => renderLink(l, () => setOpen(false)))}
          <Button size="sm" className="w-full" asChild>
            <a href="/#booking" onClick={() => setOpen(false)}>Записаться</a>
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
