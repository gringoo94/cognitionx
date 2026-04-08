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
      <div className="text-center space-y-4 mb-12">
        <span className="text-xs font-medium text-primary uppercase tracking-widest">Подготовка</span>
        <h2 className="font-heading text-3xl md:text-4xl text-foreground font-bold tracking-tight">
          Перед первой встречей
        </h2>
      </div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={item} className="glass rounded-xl flex items-center gap-5 p-5 hover:border-primary/30 transition-colors duration-300">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary font-mono text-xs font-semibold shrink-0">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-foreground text-sm">{item}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Checklist;
