import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

const BookingForm = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Заявка отправлена!", description: "Я свяжусь с вами в ближайшее время." });
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <section id="booking" className="py-16 md:py-24 bg-foreground">
      <div className="container mx-auto px-4 max-w-lg">
        <h2 className="font-heading text-3xl md:text-4xl text-background text-center mb-8">
          Запись на консультацию
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Ваше имя"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="bg-background/10 border-background/20 text-background placeholder:text-background/50"
          />
          <Input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="bg-background/10 border-background/20 text-background placeholder:text-background/50"
          />
          <Input
            type="tel"
            placeholder="Телефон"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="bg-background/10 border-background/20 text-background placeholder:text-background/50"
          />
          <Textarea
            placeholder="Опишите ваш запрос (необязательно)"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="bg-background/10 border-background/20 text-background placeholder:text-background/50"
          />
          <Button type="submit" size="lg" className="w-full">
            Отправить заявку
          </Button>
        </form>
      </div>
    </section>
  );
};

export default BookingForm;
