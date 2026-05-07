import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/hooks/use-toast";
import { ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, delay },
});

const bookingSchema = z.object({
  name: z.string().trim().min(2, { message: "Укажите имя (минимум 2 символа)" }).max(100),
  email: z.string().trim().email({ message: "Введите корректный email" }).max(255),
  messenger: z.string().trim().max(100).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
});

const BookingForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", messenger: "", message: "" });
  const [wellbeing, setWellbeing] = useState([5]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = bookingSchema.safeParse(form);
    if (!parsed.success) {
      toast({
        title: "Проверьте форму",
        description: parsed.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const messageText = parsed.data.message || `Заявка с главной страницы (самочувствие: ${wellbeing[0]}/10)`;
    const { error } = await supabase.from("contact_submissions").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      messenger: parsed.data.messenger || null,
      message: messageText,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Ошибка", description: "Не удалось отправить заявку. Попробуйте позже.", variant: "destructive" });
      return;
    }
    // Send Telegram notification (fire-and-forget)
    supabase.functions.invoke("notify-telegram", {
      body: { name: parsed.data.name, email: parsed.data.email, messenger: parsed.data.messenger, message: messageText },
    }).catch(() => {});

    setForm({ name: "", email: "", messenger: "", message: "" });
    navigate("/thank-you");
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
            maxLength={100}
            autoComplete="name"
            className="bg-background/5 border-background/15 text-background placeholder:text-background/30 h-12 rounded-lg focus:border-accent focus:ring-accent"
          />
          <Input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            maxLength={255}
            autoComplete="email"
            className="bg-background/5 border-background/15 text-background placeholder:text-background/30 h-12 rounded-lg focus:border-accent focus:ring-accent"
          />
          <Input
            placeholder="Telegram / WhatsApp (@username или номер)"
            value={form.messenger}
            onChange={(e) => setForm({ ...form, messenger: e.target.value })}
            maxLength={100}
            className="bg-background/5 border-background/15 text-background placeholder:text-background/30 h-12 rounded-lg focus:border-accent focus:ring-accent"
          />
          <div className="space-y-2">
            <label className="text-xs opacity-60">
              Как вы оцениваете своё самочувствие сейчас? <span className="font-bold text-sm opacity-100">{wellbeing[0]}/10</span>
            </label>
            <Slider
              value={wellbeing}
              onValueChange={setWellbeing}
              max={10}
              min={0}
              step={1}
              className="[&_[role=slider]]:bg-background [&_[role=slider]]:border-background/40"
            />
            <div className="flex justify-between text-[10px] opacity-40">
              <span>Очень плохо</span>
              <span>Отлично</span>
            </div>
          </div>
          <Textarea
            placeholder="Ваш запрос (необязательно)"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            maxLength={2000}
            className="bg-background/5 border-background/15 text-background placeholder:text-background/30 rounded-lg min-h-[100px] focus:border-accent focus:ring-accent"
          />
          <Button type="submit" size="lg" disabled={loading} className="w-full rounded-lg gap-2 shadow-lg shadow-primary/25">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Отправить <ArrowRight className="w-4 h-4" /></>}
          </Button>
        </motion.form>
      </div>
    </section>
  );
};

export default BookingForm;
