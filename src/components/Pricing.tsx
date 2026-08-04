import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Gift } from "lucide-react";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, delay },
});

const plans = [
  {
    title: "Разовая консультация",
    price: "40",
    duration: "50 мин",
    featured: true,
    features: ["Работа в формате КПТ", "Домашние задания", "Поддержка между сессиями"],
  },
  {
    title: "Пакет × 4",
    price: "35",
    priceNote: "за сессию",
    totalPrice: "140 € за 4 сессии",
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

      <motion.div
        {...fade(0.05)}
        className="mb-10 rounded-2xl border border-accent/30 bg-accent/5 p-5 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/15 flex items-center justify-center">
            <Gift className="w-6 h-6 text-accent" />
          </div>
          <div>
            <p className="font-semibold text-sm sm:text-base">Бесплатная встреча-знакомство — 20 минут</p>
            <p className="text-muted-foreground text-xs sm:text-sm mt-0.5">
              Познакомимся, обсудим ваш запрос и решим, подходим ли мы друг другу
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-xs font-medium text-accent bg-accent/10 px-3 py-1 rounded-full whitespace-nowrap">
            Без обязательств
          </span>
          <Button size="sm" variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground" asChild>
            <Link to="/free-consultation">Записаться</Link>
          </Button>
        </div>
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
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${p.featured ? "text-accent" : "text-accent"}`} />
                  <span className={p.featured ? "text-primary-foreground/90" : "text-muted-foreground"}>{f}</span>
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
