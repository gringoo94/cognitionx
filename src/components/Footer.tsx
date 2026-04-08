import { Mail, Send } from "lucide-react";

const Footer = () => (
  <footer className="bg-footer text-footer-foreground py-12">
    <div className="container mx-auto px-4 text-center space-y-4">
      <h3 className="font-heading text-2xl">Контакты</h3>
      <div className="flex flex-col items-center gap-2 text-sm opacity-80">
        <a href="https://t.me/darrroo04" className="flex items-center gap-2 hover:opacity-100 transition-opacity">
          <Send className="w-4 h-4" /> Telegram: @darrroo04
        </a>
        <a href="mailto:digitdarrroo0@gmail.com" className="flex items-center gap-2 hover:opacity-100 transition-opacity">
          <Mail className="w-4 h-4" /> digitdarrroo0@gmail.com
        </a>
      </div>
      <p className="text-xs opacity-50 pt-4">© 2026 Дмитрий Яцко. Все права защищены.</p>
    </div>
  </footer>
);

export default Footer;
