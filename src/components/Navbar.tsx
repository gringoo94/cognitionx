import { useState, useRef, useEffect } from "react";
import { Menu, X, ChevronDown, Brain, HeartPulse, Flame, Users, Shield, Zap, MonitorSmartphone, Sparkles, Pill } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.webp";

const specGroups = [
  {
    title: "Проблемы",
    links: [
      { label: "Депрессия", href: "/depression", icon: Brain },
      { label: "Тревога", href: "/anxiety", icon: HeartPulse },
      { label: "Панические атаки", href: "/panic-attacks", icon: Zap },
      { label: "Выгорание", href: "/burnout", icon: Flame },
      { label: "Созависимость", href: "/co-dependency", icon: Users },
      { label: "Самооценка", href: "/self-esteem", icon: Shield },
      { label: "Стресс", href: "/stress", icon: Sparkles },
      { label: "Зависимость", href: "/addiction", icon: Pill },
    ],
  },
  {
    title: "Методы",
    links: [
      { label: "КПТ-терапия", href: "/cbt-therapy", icon: Brain },
      { label: "Схема-терапия", href: "/schema-therapy", icon: Brain },
    ],
  },
  {
    title: "Формат",
    links: [
      { label: "Онлайн-терапия", href: "/online-therapy", icon: MonitorSmartphone },
    ],
  },
];

const links = [
  { label: "О терапевте", href: "/#about" },
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

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
    setSpecOpen(false);
  }, [location.pathname]);

  const isActive = (href: string) => {
    if (href.startsWith("/#")) return location.pathname === "/" && location.hash === href.slice(1);
    return location.pathname === href;
  };

  const isHashLink = (href: string) => href.startsWith("/#");

  const renderDesktopLink = (l: { label: string; href: string }) => {
    const active = isActive(l.href);
    const className = `relative py-1 transition-colors duration-200 ${
      active ? "text-primary font-medium" : "hover:text-primary"
    }`;

    if (isHashLink(l.href)) {
      return (
        <a key={l.href} href={l.href} className={className}>
          {l.label}
          {active && (
            <motion.span
              layoutId="nav-indicator"
              className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-primary"
            />
          )}
        </a>
      );
    }
    return (
      <Link key={l.href} to={l.href} className={className}>
        {l.label}
        {active && (
          <motion.span
            layoutId="nav-indicator"
            className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-primary"
          />
        )}
      </Link>
    );
  };

  const renderMobileLink = (l: { label: string; href: string }) => {
    const active = isActive(l.href);
    const className = `block py-3 px-2 rounded-lg transition-colors duration-200 ${
      active ? "text-primary font-medium bg-primary/5" : "hover:text-primary hover:bg-muted"
    }`;

    if (isHashLink(l.href)) {
      return (
        <a key={l.href} href={l.href} onClick={() => setOpen(false)} className={className}>
          {l.label}
        </a>
      );
    }
    return (
      <Link key={l.href} to={l.href} onClick={() => setOpen(false)} className={className}>
        {l.label}
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/60">
      <div className="flex items-center justify-between max-w-6xl mx-auto px-6 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <img
            src={logo}
            alt="CognitionX — психологическая помощь, КПТ и схема-терапия онлайн"
            className="h-8 w-8 transition-transform duration-300 group-hover:scale-105"
            width={32}
            height={32}
            decoding="async"
          />

          <span className="text-lg font-bold tracking-tight hidden sm:inline">
            CognitionX
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-5 text-sm text-muted-foreground">
          {links.slice(0, 2).map(renderDesktopLink)}

          {/* Specializations dropdown */}
          <div ref={specRef} className="relative">
            <button
              onClick={() => setSpecOpen(!specOpen)}
              className={`flex items-center gap-1 py-1 transition-colors duration-200 ${
                specOpen ? "text-primary" : "hover:text-primary"
              }`}
            >
              Специализации
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${specOpen ? "rotate-180" : ""}`}
              />
            </button>
            <AnimatePresence>
              {specOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[480px] rounded-xl border border-border/60 bg-card/95 backdrop-blur-md shadow-xl p-4 z-50"
                >
                  <div className="grid grid-cols-3 gap-4">
                    {specGroups.map((group) => (
                      <div key={group.title}>
                        <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-2 px-2">
                          {group.title}
                        </h4>
                        <div className="space-y-0.5">
                          {group.links.map((l) => {
                            const Icon = l.icon;
                            const active = isActive(l.href);
                            return (
                              <Link
                                key={l.href}
                                to={l.href}
                                onClick={() => setSpecOpen(false)}
                                className={`flex items-center gap-2 px-2 py-2 rounded-lg text-sm transition-colors duration-150 ${
                                  active
                                    ? "text-primary bg-primary/5 font-medium"
                                    : "text-muted-foreground hover:text-primary hover:bg-muted/60"
                                }`}
                              >
                                <Icon className="w-4 h-4 shrink-0" />
                                {l.label}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {links.slice(2).map(renderDesktopLink)}
        </div>

        {/* CTA + burger */}
        <div className="flex items-center gap-3">
          <Button size="sm" asChild className="hidden lg:inline-flex shadow-sm hover:shadow-md transition-shadow">
            <a href="/#booking">Записаться</a>
          </Button>
          <button
            className="lg:hidden text-foreground p-1.5 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
          >
            <div>
              <AnimatePresence mode="wait" initial={false}>
                {open ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden border-t border-border/60"
          >
            <div className="bg-card/95 backdrop-blur-md p-5 space-y-1 text-sm text-muted-foreground">
              {links.slice(0, 2).map(renderMobileLink)}

              {/* Mobile specializations */}
              <div>
                <button
                  onClick={() => setSpecOpen(!specOpen)}
                  className={`flex items-center justify-between w-full py-3 px-2 rounded-lg transition-colors duration-200 ${
                    specOpen ? "text-primary bg-primary/5" : "hover:text-primary hover:bg-muted"
                  }`}
                >
                  Специализации
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${specOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {specOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-2 pl-3 border-l-2 border-primary/20 space-y-1 py-1">
                        {specGroups.map((group) => (
                          <div key={group.title}>
                            <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mt-2 mb-1 px-2">
                              {group.title}
                            </h4>
                            {group.links.map((l) => {
                              const Icon = l.icon;
                              const active = isActive(l.href);
                              return (
                                <Link
                                  key={l.href}
                                  to={l.href}
                                  onClick={() => { setOpen(false); setSpecOpen(false); }}
                                  className={`flex items-center gap-2.5 py-2.5 px-2 rounded-lg text-sm transition-colors duration-150 ${
                                    active
                                      ? "text-primary font-medium bg-primary/5"
                                      : "hover:text-primary hover:bg-muted/60"
                                  }`}
                                >
                                  <Icon className="w-4 h-4 shrink-0" />
                                  {l.label}
                                </Link>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="border-t border-border/40 my-2" />

              {links.slice(2).map(renderMobileLink)}

              <div className="pt-2">
                <Button size="sm" className="w-full" asChild>
                  <a href="/#booking" onClick={() => setOpen(false)}>Записаться</a>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
