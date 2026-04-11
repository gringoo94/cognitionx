import { Mail, Send } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border">
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-lg font-bold tracking-tight">Дмитрий Яцко</p>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <a href="https://t.me/darrroo04" className="flex items-center gap-2 hover:text-foreground transition-colors">
            <Send className="w-4 h-4" /> Telegram
          </a>
          <a href="mailto:digitdarrroo0@gmail.com" className="flex items-center gap-2 hover:text-foreground transition-colors">
            <Mail className="w-4 h-4" /> Email
          </a>
        </div>
      </div>
      <div className="mt-8 pt-6 border-t border-border text-center">
        <p className="text-xs text-muted-foreground">© 2026</p>
      </div>
    </div>
  </footer>
);

export default Footer;
