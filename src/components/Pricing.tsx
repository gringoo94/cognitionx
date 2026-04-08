import { Button } from "@/components/ui/button";

const plans = [
  { title: "Первая встреча", price: "2 500", duration: "50 мин", desc: "Знакомство и определение запроса" },
  { title: "Сессия", price: "4 000", duration: "50 мин", desc: "Регулярная работа в формате КПТ", featured: true },
  { title: "Пакет × 4", price: "14 000", duration: "4 × 50 мин", desc: "Экономия при оплате пакетом" },
];

const Pricing = () => (
  <section id="pricing" className="section-padding">
    <div className="container mx-auto px-4">
      <div className="max-w-2xl mx-auto text-center space-y-4 mb-16">
        <span className="text-xs font-medium text-accent uppercase tracking-widest">Стоимость</span>
        <h2 className="font-heading text-3xl md:text-4xl text-foreground font-bold tracking-tight">
          Цены
        </h2>
      </div>
      <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
        {plans.map((p) => (
          <div
            key={p.title}
            className={`rounded-2xl p-8 flex flex-col items-center text-center space-y-6 transition-all duration-300 ${
              p.featured
                ? "bg-primary text-primary-foreground shadow-2xl shadow-primary/30 scale-[1.03]"
                : "glass hover:border-primary/30"
            }`}
          >
            <div className="space-y-1">
              <p className={`text-xs uppercase tracking-widest font-medium ${p.featured ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                {p.title}
              </p>
              <p className={`text-sm ${p.featured ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                {p.duration}
              </p>
            </div>
            <div>
              <span className="text-4xl font-bold tracking-tight">{p.price}</span>
              <span className={`text-sm ml-1 ${p.featured ? "text-primary-foreground/70" : "text-muted-foreground"}`}>₽</span>
            </div>
            <p className={`text-sm leading-relaxed ${p.featured ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
              {p.desc}
            </p>
            <Button
              className={`w-full rounded-lg ${
                p.featured
                  ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
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
