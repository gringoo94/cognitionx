import { Mail, Send } from "lucide-react";

const Footer = () => (
  <footer className="bg-footer text-footer-foreground py-16">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <p className="font-heading text-lg">Дмитрий Яцко</p>
        <div className="flex items-center gap-8 text-sm text-footer-foreground/60">
          <a href="https://t.me/darrroo04" className="flex items-center gap-2 hover:text-footer-foreground transition-colors">
            <Send className="w-4 h-4" /> Telegram
          </a>
          <a href="mailto:digitdarrroo0@gmail.com" className="flex items-center gap-2 hover:text-footer-foreground transition-colors">
            <Mail className="w-4 h-4" /> Email
          </a>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-footer-foreground/10 text-center">
        <p className="text-xs text-footer-foreground/30">© 2026</p>
      </div>
    </div>
  </footer>
);

export default Footer;
