const items = [
  "Подготовьте комфортное место для разговора",
  "Позаботьтесь о стабильном интернет-соединении",
  "Подумайте: что вас беспокоит?",
  "Будьте готовы к честному диалогу",
  "Всё обсуждаемое — конфиденциально",
];

const Checklist = () => (
  <section className="section-padding">
    <div className="container mx-auto px-4 max-w-2xl">
      <div className="text-center space-y-6 mb-12">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Подготовка</p>
        <h2 className="font-heading text-3xl md:text-4xl text-foreground tracking-tight">
          Перед первой встречей
        </h2>
      </div>
      <ol className="space-y-0 divide-y divide-border">
        {items.map((item, i) => (
          <li key={item} className="flex items-center gap-6 py-5">
            <span className="text-xs font-mono text-muted-foreground w-6 text-right shrink-0">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-foreground text-sm leading-relaxed">{item}</span>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

export default Checklist;
