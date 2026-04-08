import { Button } from "@/components/ui/button";

const plans = [
  { title: "Первая встреча", price: "2 500", duration: "50 мин", desc: "Знакомство и определение запроса" },
  { title: "Сессия", price: "4 000", duration: "50 мин", desc: "Регулярная работа в формате КПТ", featured: true },
  { title: "Пакет × 4", price: "14 000", duration: "4 × 50 мин", desc: "Экономия при оплате пакетом" },
];

const Pricing = () => (
  <section id="pricing" className="section-padding bg-secondary">
    <div className="container mx-auto px-4">
      <div className="max-w-2xl mx-auto text-center space-y-6 mb-16">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Стоимость</p>
        <h2 className="font-heading text-3xl md:text-4xl text-foreground tracking-tight">
          Цены
        </h2>
      </div>
      <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
        {plans.map((p) => (
          <div
            key={p.title}
            className={`rounded-2xl p-8 flex flex-col items-center text-center space-y-6 transition-shadow duration-300 ${
              p.featured
                ? "bg-foreground text-primary-foreground shadow-2xl scale-[1.02]"
                : "bg-background border border-border"
            }`}
          >
            <div className="space-y-1">
              <p className={`text-xs uppercase tracking-widest ${p.featured ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                {p.title}
              </p>
              <p className={`text-sm ${p.featured ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                {p.duration}
              </p>
            </div>
            <div>
              <span className="text-4xl font-light tracking-tight">{p.price}</span>
              <span className={`text-sm ml-1 ${p.featured ? "text-primary-foreground/60" : "text-muted-foreground"}`}>₽</span>
            </div>
            <p className={`text-sm leading-relaxed ${p.featured ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
              {p.desc}
            </p>
            <Button
              className={`w-full rounded-full ${
                p.featured
                  ? "bg-primary-foreground text-foreground hover:bg-primary-foreground/90"
                  : ""
              }`}
              variant={p.featured ? "default" : "outline"}
              asChild
            >
              <a href="#booking">Записаться</a>
            </Button>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Pricing;
