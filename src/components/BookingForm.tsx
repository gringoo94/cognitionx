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

  const inputClasses = "bg-primary-foreground/5 border-primary-foreground/15 text-primary-foreground placeholder:text-primary-foreground/30 rounded-lg h-12 focus:border-accent focus:ring-accent";

  return (
    <section id="booking" className="section-padding bg-foreground relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      <div className="container mx-auto px-4 max-w-md relative">
        <div className="text-center space-y-4 mb-12">
          <span className="text-xs font-medium text-accent uppercase tracking-widest">Контакт</span>
          <h2 className="font-heading text-3xl md:text-4xl text-primary-foreground font-bold tracking-tight">
            Запись на консультацию
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input placeholder="Имя" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className={inputClasses} />
          <Input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className={inputClasses} />
          <Input type="tel" placeholder="Телефон" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClasses} />
          <Textarea placeholder="Ваш запрос (необязательно)" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="bg-primary-foreground/5 border-primary-foreground/15 text-primary-foreground placeholder:text-primary-foreground/30 rounded-lg min-h-[100px] focus:border-accent focus:ring-accent" />
          <Button type="submit" size="lg" className="w-full rounded-lg bg-primary hover:bg-primary/90 gap-2 shadow-lg shadow-primary/25">
            Отправить
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </section>
  );
};

export default BookingForm;
