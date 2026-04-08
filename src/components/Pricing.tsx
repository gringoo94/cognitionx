import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const plans = [
  { title: "Первая консультация", price: "2 500 ₽", duration: "50 минут", desc: "Знакомство, определение запроса и плана терапии" },
  { title: "Индивидуальная сессия", price: "4 000 ₽", duration: "50 минут", desc: "Регулярная работа в формате КПТ", featured: true },
  { title: "Пакет 4 сессии", price: "14 000 ₽", duration: "4 × 50 минут", desc: "Экономия при оплате пакетом сессий" },
];

const Pricing = () => (
  <section id="pricing" className="py-16 md:py-24 bg-background">
    <div className="container mx-auto px-4">
      <h2 className="font-heading text-3xl md:text-4xl text-foreground text-center mb-4">Цены и услуги</h2>
      <p className="text-muted-foreground text-center mb-12">Стоимость консультации и пакеты услуг</p>
      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {plans.map((p) => (
          <Card key={p.title} className={`text-center ${p.featured ? "border-primary shadow-lg ring-2 ring-primary/20" : ""}`}>
            <CardHeader>
              <CardTitle className="font-heading text-xl">{p.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{p.duration}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-3xl font-bold text-foreground">{p.price}</p>
              <p className="text-sm text-muted-foreground">{p.desc}</p>
              <Button className="w-full" variant={p.featured ? "default" : "outline"} asChild>
                <a href="#booking">Записаться</a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

export default Pricing;
