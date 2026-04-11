import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { ArrowRight } from "lucide-react";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, delay },
});

const BookingForm = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Заявка отправлена", description: "Я свяжусь с вами в ближайшее время." });
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <section id="booking" className="bg-foreground text-background">
      <div className="max-w-md mx-auto px-6 py-24 md:py-32">
        <motion.div {...fade()} className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            Запись на консультацию
          </h2>
          <p className="mt-3 text-sm opacity-60">
            Заполните форму — я свяжусь с вами в течение дня
          </p>
        </motion.div>

        <motion.form {...fade(0.05)} onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Имя"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="bg-background/5 border-background/15 text-background placeholder:text-background/30 h-12 rounded-lg focus:border-accent focus:ring-accent"
          />
          <Input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="bg-background/5 border-background/15 text-background placeholder:text-background/30 h-12 rounded-lg focus:border-accent focus:ring-accent"
          />
          <Input
            type="tel"
            placeholder="Телефон"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="bg-background/5 border-background/15 text-background placeholder:text-background/30 h-12 rounded-lg focus:border-accent focus:ring-accent"
          />
          <Textarea
            placeholder="Ваш запрос (необязательно)"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="bg-background/5 border-background/15 text-background placeholder:text-background/30 rounded-lg min-h-[100px] focus:border-accent focus:ring-accent"
          />
          <Button type="submit" size="lg" className="w-full rounded-lg gap-2 shadow-lg shadow-primary/25">
            Отправить <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.form>
      </div>
    </section>
  );
};

export default BookingForm;
