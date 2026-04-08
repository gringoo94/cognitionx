import { Check } from "lucide-react";

const items = [
  "Подготовьте комфортное место для разговора",
  "Позаботьтесь о стабильном интернет-соединении",
  "Подумайте о своём запросе: что вас беспокоит?",
  "Будьте готовы к честному диалогу",
  "Помните: всё, что обсуждается — конфиденциально",
];

const Checklist = () => (
  <section className="py-16 md:py-24 bg-card">
    <div className="container mx-auto px-4 max-w-2xl">
      <h2 className="font-heading text-3xl md:text-4xl text-foreground text-center mb-10">
        Памятка перед первой встречей
      </h2>
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 bg-background p-4 rounded-lg">
            <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
            <span className="text-foreground text-sm">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default Checklist;
