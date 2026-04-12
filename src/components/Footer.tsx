import { Mail, Send, Phone, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const specLinks = [
  { label: "Депрессия", href: "/depression" },
  { label: "Тревога", href: "/anxiety" },
  { label: "Панические атаки", href: "/panic-attacks" },
  { label: "Выгорание", href: "/burnout" },
  { label: "Созависимость", href: "/co-dependency" },
  { label: "Зависимости", href: "/addiction" },
  { label: "КПТ-терапия", href: "/cbt-therapy" },
  { label: "Онлайн-терапия", href: "/online-therapy" },
];

const Footer = () => (
  <footer className="border-t border-border">
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand + contacts */}
        <div>
          <p className="text-lg font-bold tracking-tight mb-4">CognitionX</p>
          <div className="flex flex-col gap-3 text-sm text-muted-foreground">
            <a href="https://t.me/gringoo94" className="flex items-center gap-2 hover:text-foreground transition-colors">
              <Send className="w-4 h-4" /> Telegram
            </a>
            <a href="https://wa.me/447599880865" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-foreground transition-colors">
              <Phone className="w-4 h-4" /> WhatsApp
            </a>
            <a href="https://www.instagram.com/gringo.journal" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-foreground transition-colors">
              <Instagram className="w-4 h-4" /> Instagram
            </a>
            <a href="mailto:digitalgringoo@gmail.com" className="flex items-center gap-2 hover:text-foreground transition-colors">
              <Mail className="w-4 h-4" /> Email
            </a>
            <a href="https://www.linkedin.com/in/dmitrii-iatco/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-foreground transition-colors">
              <Linkedin className="w-4 h-4" /> LinkedIn
            </a>
          </div>
        </div>

        {/* Specializations */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Специализации</p>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            {specLinks.map((l) => (
              <Link key={l.href} to={l.href} className="hover:text-foreground transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Навигация</p>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Главная</Link>
            <Link to="/blog" className="hover:text-foreground transition-colors">Блог</Link>
            <Link to="/tools" className="hover:text-foreground transition-colors">Инструменты</Link>
            <a href="/#booking" className="hover:text-foreground transition-colors">Записаться</a>
          </div>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-border text-center">
        <p className="text-xs text-muted-foreground">© 2026 CognitionX. Все права защищены.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
