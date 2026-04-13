import { useState } from "react";
import { motion } from "framer-motion";
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

const BookingForm = () => {
  const [form, setForm] = useState({ name: "", email: "", messenger: "", message: "" });
  const [wellbeing, setWellbeing] = useState([5]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("contact_submissions").insert({
      name: form.name,
      email: form.email,
      messenger: form.messenger || null,
      message: form.message || `Заявка с главной страницы (самочувствие: ${wellbeing[0]}/10)`,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Ошибка", description: "Не удалось отправить заявку. Попробуйте позже.", variant: "destructive" });
      return;
    }
    toast({ title: "Заявка отправлена", description: "Я свяжусь с вами в ближайшее время." });
    // Meta Pixel: Lead event
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "Lead", { content_name: "booking_form" });
    }
    setForm({ name: "", email: "", messenger: "", message: "" });

    // Send Telegram notification (fire-and-forget)
    supabase.functions.invoke("notify-telegram", {
      body: { name: form.name, email: form.email, messenger: form.messenger, message: form.message || `Заявка с главной страницы (самочувствие: ${wellbeing[0]}/10)` },
    }).catch(() => {});
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
            placeholder="Telegram / WhatsApp (@username или номер)"
            value={form.messenger}
            onChange={(e) => setForm({ ...form, messenger: e.target.value })}
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
