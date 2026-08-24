import { Mail, Send, Phone, Instagram, Linkedin, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

const problemLinks = [
  { label: "Депрессия", href: "/depression" },
  { label: "Тревога", href: "/anxiety" },
  { label: "Панические атаки", href: "/panic-attacks" },
  { label: "Выгорание", href: "/burnout" },
  { label: "Созависимость", href: "/co-dependency" },
  { label: "Зависимости", href: "/addiction" },
  { label: "Самооценка", href: "/self-esteem" },
  { label: "Стресс", href: "/stress" },
];

const methodLinks = [
  { label: "КПТ-терапия", href: "/cbt-therapy" },
  { label: "Схема-терапия", href: "/schema-therapy" },
  { label: "Онлайн-терапия", href: "/online-therapy" },
  { label: "Очная терапия в Кишинёве", href: "/in-person-therapy" },
];

type GeoGroup = {
  region: string;
  href?: string;
  cities?: { label: string; href: string }[];
};

const geoGroups: GeoGroup[] = [
  {
    region: "Европа",
    href: "/psiholog-europa",
    cities: [
      { label: "Берлин", href: "/psiholog-berlin" },
      { label: "Мюнхен", href: "/psiholog-myunhen" },
      { label: "Гамбург", href: "/psiholog-gamburg" },
      { label: "Амстердам", href: "/psiholog-amsterdam" },
      { label: "Роттердам", href: "/psiholog-rotterdam" },
      { label: "Лиссабон", href: "/psiholog-lissabon" },
      { label: "Порту", href: "/psiholog-porto" },
      { label: "Лондон", href: "/psiholog-london" },
      { label: "Варшава", href: "/psiholog-varshava" },
      { label: "Краков", href: "/psiholog-krakov" },
      { label: "Вроцлав", href: "/psiholog-vroclav" },
      { label: "Рига", href: "/psiholog-riga" },
      { label: "Вильнюс", href: "/psiholog-vilnyus" },
      { label: "Белград", href: "/psiholog-belgrad" },
    ],
  },
  {
    region: "Кавказ и СНГ",
    cities: [
      { label: "Тбилиси", href: "/psiholog-tbilisi" },
      { label: "Кишинёв", href: "/psiholog-kishinev" },
      { label: "Москва (онлайн)", href: "/psiholog-moskva" },
    ],
  },
  {
    region: "Азия (Бали, Таиланд)",
    href: "/psiholog-aziya",
  },
  {
    region: "США и Канада (онлайн)",
    href: "/psiholog-usa",
  },
  {
    region: "Для IT-специалистов",
    href: "/psiholog-dlya-it",
  },
];

const Footer = () => (
  <footer className="border-t border-border">
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
        {/* Brand + contacts */}
        <div>
          <p className="text-lg font-bold tracking-tight mb-4">CognitionX</p>
          <div className="flex flex-col gap-3 text-sm text-muted-foreground">
            <a href="https://t.me/gringoo94" target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="flex items-center gap-2 hover:text-foreground transition-colors">
              <Send className="w-4 h-4" aria-hidden="true" /> Telegram
            </a>
            <a href="https://wa.me/447599880865" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="flex items-center gap-2 hover:text-foreground transition-colors">
              <Phone className="w-4 h-4" aria-hidden="true" /> WhatsApp
            </a>
            <a href="https://www.instagram.com/gringo.journal" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex items-center gap-2 hover:text-foreground transition-colors">
              <Instagram className="w-4 h-4" aria-hidden="true" /> Instagram
            </a>
            <a href="mailto:digitalgringoo@gmail.com" aria-label="Email" className="flex items-center gap-2 hover:text-foreground transition-colors">
              <Mail className="w-4 h-4" aria-hidden="true" /> Email
            </a>
            <a href="https://www.linkedin.com/in/dmitrii-iatco/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="flex items-center gap-2 hover:text-foreground transition-colors">
              <Linkedin className="w-4 h-4" aria-hidden="true" /> LinkedIn
            </a>
          </div>
        </div>

        {/* Problems */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Проблемы</p>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            {problemLinks.map((l) => (
              <Link key={l.href} to={l.href} className="hover:text-foreground transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Methods */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Методы</p>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            {methodLinks.map((l) => (
              <Link key={l.href} to={l.href} className="hover:text-foreground transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Geography */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">География</p>
          <div className="flex flex-col gap-1 text-sm text-muted-foreground">
            {geoGroups.map((g) =>
              g.cities && g.cities.length > 0 ? (
                <details key={g.region} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-2 py-1 font-medium text-foreground/80 hover:text-foreground transition-colors">
                    <span>{g.region}</span>
                    <ChevronDown className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-open:rotate-180" />
                  </summary>
                  <div className="flex flex-col gap-1 pl-3 pt-1 pb-2 border-l border-border">
                    {g.href && (
                      <Link to={g.href} className="hover:text-foreground transition-colors text-xs">
                        Все — {g.region}
                      </Link>
                    )}
                    {g.cities.map((c) => (
                      <Link key={c.href} to={c.href} className="hover:text-foreground transition-colors text-xs">
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </details>
              ) : g.href ? (
                <Link
                  key={g.region}
                  to={g.href}
                  className="py-1 font-medium text-foreground/80 hover:text-foreground transition-colors"
                >
                  {g.region}
                </Link>
              ) : (
                <span key={g.region} className="py-1 font-medium text-foreground/80">
                  {g.region}
                </span>
              )
            )}
          </div>

        </div>

        {/* Navigation */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Навигация</p>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Главная</Link>
            <Link to="/about" className="hover:text-foreground transition-colors">Обо мне</Link>
            <Link to="/blog" className="hover:text-foreground transition-colors">Блог</Link>
            <Link to="/tools" className="hover:text-foreground transition-colors">Инструменты</Link>
            <Link to="/contact" className="hover:text-foreground transition-colors">Контакты</Link>
            <a href="/#booking" className="hover:text-foreground transition-colors">Записаться</a>
          </div>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-border text-center">
        <p className="text-xs text-muted-foreground">
          © 2026 CognitionX. Все права защищены. ·{" "}
          <Link to="/privacy" className="hover:text-foreground transition-colors underline">
            Политика конфиденциальности
          </Link>
          {" · "}
          <Link to="/informed-consent" className="hover:text-foreground transition-colors underline">
            Информированное согласие
          </Link>
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
