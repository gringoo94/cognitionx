import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, delay },
});

const plans = [
  {
    title: "Первая встреча",
    price: "20",
    duration: "50 мин",
    features: ["Знакомство и определение запроса", "Диагностика проблемы", "План работы"],
  },
  {
    title: "Сессия",
    price: "30",
    duration: "50 мин",
    featured: true,
    features: ["Работа в формате КПТ", "Домашние задания", "Поддержка между сессиями"],
  },
  {
    title: "Пакет × 4",
    price: "25",
    priceNote: "за сессию",
    totalPrice: "100 € за 4 сессии",
    duration: "4 × 50 мин",
    features: ["Экономия 20 € по сравнению с разовыми", "Регулярная работа", "Приоритетная запись"],
  },
];

const Pricing = () => (
  <section id="pricing" className="bg-card border-y border-border">
    <div className="max-w-4xl mx-auto px-6 py-24 md:py-32">
      <motion.div {...fade()} className="text-center mb-14">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
          Стоимость
        </h2>
        <p className="text-muted-foreground mt-3 text-sm md:text-base max-w-xl mx-auto">
          Прозрачные цены без скрытых платежей
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((p, i) => (
          <motion.div
            key={p.title}
            {...fade(0.08 * i)}
            className={`rounded-2xl p-6 md:p-8 flex flex-col border transition-colors ${
              p.featured
                ? "border-primary bg-primary text-primary-foreground shadow-lg"
                : "border-border bg-background hover:border-primary/30"
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
            <div className="mt-6">
              <span className="text-4xl font-bold tracking-tight">{p.price}</span>
              <span className={`text-sm ml-1 ${p.featured ? "text-primary-foreground/70" : "text-muted-foreground"}`}>€{(p as any).priceNote ? ` ${(p as any).priceNote}` : ""}</span>
              {(p as any).totalPrice && (
                <p className={`text-xs mt-1 ${p.featured ? "text-primary-foreground/60" : "text-muted-foreground/70"}`}>{(p as any).totalPrice}</p>
              )}
            </div>
            <ul className="mt-6 space-y-3 flex-1">
              {p.features.map((f, fi) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${p.featured ? "text-accent" : "text-accent"}`} />
                  <span className={`${p.featured ? "text-primary-foreground/90" : "text-muted-foreground"} ${(p as any).boldFirst && fi === 0 ? "font-bold" : ""}`}>{f}</span>
                </li>
              ))}
            </ul>
            <Button
              className={`mt-8 w-full ${
                p.featured
                  ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                  : ""
              }`}
              variant={p.featured ? "default" : "outline"}
              asChild
            >
              <a href="#booking">Записаться</a>
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Pricing;
