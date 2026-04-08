import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { ArrowRight } from "lucide-react";

const BookingForm = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Заявка отправлена", description: "Я свяжусь с вами в ближайшее время." });
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <section id="booking" className="section-padding bg-foreground">
      <div className="container mx-auto px-4 max-w-md">
        <div className="text-center space-y-4 mb-12">
          <p className="text-xs uppercase tracking-[0.2em] text-primary-foreground/50">Контакт</p>
          <h2 className="font-heading text-3xl md:text-4xl text-primary-foreground tracking-tight">
            Запись
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Имя"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="bg-primary-foreground/5 border-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/30 rounded-xl h-12"
          />
          <Input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="bg-primary-foreground/5 border-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/30 rounded-xl h-12"
          />
          <Input
            type="tel"
            placeholder="Телефон"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="bg-primary-foreground/5 border-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/30 rounded-xl h-12"
          />
          <Textarea
            placeholder="Ваш запрос (необязательно)"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="bg-primary-foreground/5 border-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/30 rounded-xl min-h-[100px]"
          />
          <Button type="submit" size="lg" className="w-full rounded-full bg-primary-foreground text-foreground hover:bg-primary-foreground/90 gap-2">
            Отправить
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </section>
  );
};

export default BookingForm;
