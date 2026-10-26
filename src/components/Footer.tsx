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
  { label: "КПТ", href: "/cbt-therapy" },
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

const linkCls = "hover:text-foreground transition-colors";
const headCls = "text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2";
const rowCls = "flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground";

const contacts = [
  { href: "https://t.me/gringoo94", label: "Telegram", Icon: Send },
  { href: "https://wa.me/447599880865", label: "WhatsApp", Icon: Phone },
  { href: "https://www.instagram.com/gringo.journal", label: "Instagram", Icon: Instagram },
  { href: "mailto:digitalgringoo@gmail.com", label: "Email", Icon: Mail },
  { href: "https://www.linkedin.com/in/dmitrii-iatco/", label: "LinkedIn", Icon: Linkedin },
];

const Footer = () => (
  <footer className="border-t border-border">
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <p className="text-lg font-bold tracking-tight">CognitionX</p>
        <div className="flex items-center gap-1">
          {contacts.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              aria-label={label}
              title={label}
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Icon className="w-4 h-4" aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-5">
        <div>
          <p className={headCls}>Проблемы</p>
          <div className={rowCls}>
            {problemLinks.map((l) => (
              <Link key={l.href} to={l.href} className={linkCls}>{l.label}</Link>
            ))}
          </div>
        </div>

        <div>
          <p className={headCls}>Методы</p>
          <div className={rowCls}>
            {methodLinks.map((l) => (
              <Link key={l.href} to={l.href} className={linkCls}>{l.label}</Link>
            ))}
            <Link to="/specialists" className={linkCls}>Специалисты</Link>
          </div>
        </div>

        <div>
          <p className={headCls}>Навигация</p>
          <div className={rowCls}>
            <Link to="/" className={linkCls}>Главная</Link>
            <Link to="/about" className={linkCls}>Обо мне</Link>
            <Link to="/blog" className={linkCls}>Блог</Link>
            <Link to="/tools" className={linkCls}>Инструменты</Link>
            <Link to="/contact" className={linkCls}>Контакты</Link>
            <a href="/booking" className={linkCls}>Записаться</a>
          </div>
        </div>

        <div>
          <p className={headCls}>География</p>
          <div className="flex flex-col text-sm text-muted-foreground">
            {geoGroups.map((g) =>
              g.cities && g.cities.length > 0 ? (
                <details key={g.region} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-2 py-0.5 hover:text-foreground transition-colors">
                    <span>{g.region}</span>
                    <ChevronDown className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-open:rotate-180" />
                  </summary>
                  <div className="flex flex-wrap gap-x-2 gap-y-0.5 pl-3 py-1 border-l border-border text-xs">
                    {g.href && <Link to={g.href} className={linkCls}>Все</Link>}
                    {g.cities.map((c) => (
                      <Link key={c.href} to={c.href} className={linkCls}>{c.label}</Link>
                    ))}
                  </div>
                </details>
              ) : g.href ? (
                <Link key={g.region} to={g.href} className={`py-0.5 ${linkCls}`}>{g.region}</Link>
              ) : null
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-border text-center">
        <p className="text-xs text-muted-foreground">
          © 2026 CognitionX ·{" "}
          <Link to="/privacy" className={`${linkCls} underline`}>Конфиденциальность</Link>
          {" · "}
          <Link to="/informed-consent" className={`${linkCls} underline`}>Информированное согласие</Link>
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
