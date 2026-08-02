import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Gift, Send, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trackLead } from "@/lib/metaPixel";

const schema = z.object({
  name: z.string().trim().min(2, { message: "Укажите имя (минимум 2 символа)" }).max(100),
  email: z.string().trim().email({ message: "Введите корректный email" }).max(255),
  messenger: z.string().trim().max(100).optional().or(z.literal("")),
  preferredTime: z.string().trim().max(200).optional().or(z.literal("")),
  topic: z.string().trim().max(2000).optional().or(z.literal("")),
});

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.45, delay },
});

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Главная", item: "https://cognitionx.cloud/" },
    { "@type": "ListItem", position: 2, name: "Бесплатная встреча", item: "https://cognitionx.cloud/free-consultation" },
  ],
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://cognitionx.cloud/free-consultation#service",
  name: "Бесплатная встреча-знакомство с психологом (20 минут)",
  serviceType: "Психологическое консультирование",
  description:
    "20-минутная онлайн-встреча-знакомство с психологом Дмитрием Яцко. Обсуждаем запрос, формат работы и решаем, подходим ли друг другу. Без обязательств.",
  url: "https://cognitionx.cloud/free-consultation",
  provider: { "@id": "https://cognitionx.cloud/#person" },
  brand: { "@id": "https://cognitionx.cloud/#organization" },
  areaServed: { "@type": "Place", name: "Онлайн / по всему миру" },
  availableLanguage: ["Russian", "Romanian", "English"],
  audience: {
    "@type": "PeopleAudience",
    audienceType: "Взрослые, рассматривающие психотерапию",
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "EUR",
    availability: "https://schema.org/InStock",
    url: "https://cognitionx.cloud/free-consultation",
  },
};

const FreeConsultationPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", messenger: "", preferredTime: "", topic: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast({
        title: "Проверьте форму",
        description: parsed.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const messageText = [
      "🎁 Заявка на БЕСПЛАТНУЮ встречу-знакомство (20 мин)",
      parsed.data.preferredTime ? `Удобное время: ${parsed.data.preferredTime}` : null,
      parsed.data.topic ? `Запрос: ${parsed.data.topic}` : "Без дополнительного запроса",
    ].filter(Boolean).join("\n");

    try {
      const { error } = await supabase.from("contact_submissions").insert({
        name: parsed.data.name,
        email: parsed.data.email,
        messenger: parsed.data.messenger || null,
        message: messageText,
      });
      if (error) throw error;

      try {
        await supabase.functions.invoke("notify-telegram", {
          body: {
            name: parsed.data.name,
            email: parsed.data.email,
            messenger: parsed.data.messenger,
            message: messageText,
            source: "🎁 Бесплатная встреча-знакомство (20 мин)",
            page: typeof window !== "undefined" ? window.location.href : null,
          },
        });
      } catch (e) {
        console.error("notify-telegram failed", e);
      }

      trackCta("free_consultation_form_submit");
      trackLead("free_consultation_form", { content_category: "free_intro_call" });

      setForm({ name: "", email: "", messenger: "", preferredTime: "", topic: "" });
      navigate("/thank-you");
    } catch {
      toast({ title: "Ошибка", description: "Не удалось отправить заявку. Попробуйте ещё раз.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="Бесплатная встреча-знакомство — психолог Дмитрий Яцко"
        description="20-минутная бесплатная встреча-знакомство с психологом. Познакомимся, обсудим запрос и решим, подходим ли друг другу. Без обязательств."
        path="/free-consultation"
        schema={[serviceSchema, breadcrumbSchema]}
      />
      <Navbar />

      <main className="max-w-2xl mx-auto px-6 py-16 md:py-24">
        <motion.nav {...fade()} className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary transition-colors">Главная</Link>
          <span>/</span>
          <span className="text-foreground">Бесплатная встреча</span>
        </motion.nav>

        <motion.div {...fade(0.05)} className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-accent/15 flex items-center justify-center">
            <Gift className="w-6 h-6 text-accent" />
          </div>
          <span className="text-xs font-medium text-accent bg-accent/10 px-3 py-1 rounded-full">
            Без обязательств
          </span>
        </motion.div>

        <motion.h1 {...fade(0.05)} className="text-3xl md:text-4xl font-bold tracking-tight">
          Бесплатная встреча-знакомство
        </motion.h1>

        <motion.p {...fade(0.1)} className="mt-4 text-muted-foreground leading-relaxed">
          20 минут, чтобы познакомиться, коротко обсудить ваш запрос и решить, подходим ли мы друг другу. Это не консультация и не диагностика — только знакомство.
        </motion.p>

        <motion.ul {...fade(0.12)} className="mt-6 space-y-2 text-sm">
          {[
            "Длительность — 20 минут",
            "Без оплаты и без обязательств",
            "Онлайн (Telegram / Google Meet / Zoom)",
          ].map((t) => (
            <li key={t} className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">{t}</span>
            </li>
          ))}
        </motion.ul>

        <motion.section {...fade(0.15)} className="mt-10">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Имя"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              maxLength={100}
              autoComplete="name"
              className="h-12 rounded-lg"
            />
            <Input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              maxLength={255}
              autoComplete="email"
              className="h-12 rounded-lg"
            />
            <Input
              placeholder="Telegram / WhatsApp (@username или номер)"
              value={form.messenger}
              onChange={(e) => setForm({ ...form, messenger: e.target.value })}
              maxLength={100}
              className="h-12 rounded-lg"
            />
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Удобное время для встречи (например, будни вечером)"
                value={form.preferredTime}
                onChange={(e) => setForm({ ...form, preferredTime: e.target.value })}
                maxLength={200}
                className="h-12 rounded-lg pl-9"
              />
            </div>
            <Textarea
              placeholder="С чем хотите познакомиться / коротко о запросе (необязательно)"
              value={form.topic}
              onChange={(e) => setForm({ ...form, topic: e.target.value })}
              maxLength={2000}
              className="rounded-lg min-h-[100px]"
            />
            <Button type="submit" size="lg" className="w-full rounded-lg gap-2" disabled={loading}>
              {loading ? "Отправка..." : "Записаться на бесплатную встречу"}{" "}
              {!loading && <Send className="w-4 h-4" />}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Это бесплатно. Если захотите продолжить — обсудим формат полной консультации.
            </p>
          </form>
        </motion.section>

        <motion.div {...fade(0.2)} className="mt-10">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/" className="gap-2">
              <ArrowLeft className="w-4 h-4" /> На главную
            </Link>
          </Button>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default FreeConsultationPage;
