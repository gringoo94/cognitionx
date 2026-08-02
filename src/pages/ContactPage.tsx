import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Send, MessageCircle, Mail, Phone, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trackLead } from "@/lib/metaPixel";
import { trackCta } from "@/lib/trackCta";

const contactSchema = z.object({
  name: z.string().trim().min(2, { message: "Укажите имя (минимум 2 символа)" }).max(100),
  email: z.string().trim().email({ message: "Введите корректный email" }).max(255),
  messenger: z.string().trim().max(100).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
});

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.45, delay },
});

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Психолог Дмитрий Яцко",
  url: "https://cognitionx.cloud",
  description: "Когнитивно-поведенческая и схема-терапия онлайн и очно. Депрессия, тревога, панические атаки, выгорание.",
  areaServed: ["Кишинёв", "Молдова", "Онлайн"],
  serviceType: "Психологическая консультация",
  provider: { "@type": "Person", name: "Дмитрий Яцко" },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    availableLanguage: ["Russian", "Romanian"],
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Главная", item: "https://cognitionx.cloud/" },
    { "@type": "ListItem", position: 2, name: "Контакты", item: "https://cognitionx.cloud/contact" },
  ],
};

const ContactPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", messenger: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      toast({
        title: "Проверьте форму",
        description: parsed.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const messageText = parsed.data.message || "Заявка со страницы контактов (без дополнительного запроса)";
    try {
      const { error } = await supabase.from("contact_submissions").insert({
        name: parsed.data.name,
        email: parsed.data.email,
        messenger: parsed.data.messenger || null,
        message: messageText,
      });
      if (error) throw error;
      // Send Telegram notification — await to avoid request being cancelled by navigation
      try {
        await supabase.functions.invoke("notify-telegram", {
          body: {
            name: parsed.data.name,
            email: parsed.data.email,
            messenger: parsed.data.messenger,
            message: messageText,
            source: "ContactPage (страница контактов)",
            page: typeof window !== "undefined" ? window.location.href : null,
          },
        });
      } catch (e) {
        console.error("notify-telegram failed", e);
      }

      trackCta("contact_form_submit");
      trackLead("contact_form", { content_category: "contact_page" });

      setForm({ name: "", email: "", messenger: "", message: "" });
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
        title="Контакты — психолог Дмитрий Яцко | Запись"
        description="Запись к психологу: онлайн и очно. Telegram, форма, email. Первая сессия — знакомство и диагностика."
        path="/contact"
        schema={[serviceSchema, breadcrumbSchema]}
      />
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <motion.nav {...fade()} className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary transition-colors">Главная</Link>
          <span>/</span>
          <span className="text-foreground">Контакты</span>
        </motion.nav>

        <motion.h1 {...fade(0.05)} className="text-3xl md:text-4xl font-bold tracking-tight">
          Контакты
        </motion.h1>

        <motion.p {...fade(0.1)} className="mt-4 text-muted-foreground leading-relaxed">
          Выберите удобный способ связи или заполните форму — я свяжусь с вами в течение дня.
        </motion.p>

        {/* Contact methods */}
        <motion.div {...fade(0.1)} className="mt-8 grid sm:grid-cols-2 gap-4">
          <a
            href="https://t.me/gringoo94"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-border bg-card p-6 hover:border-primary/30 transition-all hover:shadow-lg group flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">Telegram</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Быстрый способ связи</p>
            </div>
          </a>

          <a
            href="mailto:digitalgringoo@gmail.com"
            className="rounded-xl border border-border bg-card p-6 hover:border-primary/30 transition-all hover:shadow-lg group flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">Email</h3>
              <p className="text-xs text-muted-foreground mt-0.5">digitalgringoo@gmail.com</p>
            </div>
          </a>

          <a
            href="https://wa.me/447599880865"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-border bg-card p-6 hover:border-primary/30 transition-all hover:shadow-lg group flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">WhatsApp</h3>
              <p className="text-xs text-muted-foreground mt-0.5">+44 7599 880865</p>
            </div>
          </a>

          <a
            href="https://www.instagram.com/gringo.journal"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-border bg-card p-6 hover:border-primary/30 transition-all hover:shadow-lg group flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Instagram className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">Instagram</h3>
              <p className="text-xs text-muted-foreground mt-0.5">@gringo.journal</p>
            </div>
          </a>
        </motion.div>

        {/* Form */}
        <motion.section {...fade(0.1)} className="mt-12">
          <h2 className="text-xl font-bold mb-6">Форма записи</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <label htmlFor="contact-name" className="sr-only">Имя</label>
            <Input
              id="contact-name"
              placeholder="Имя"
              aria-label="Имя"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              maxLength={100}
              autoComplete="name"
              className="h-12 rounded-lg"
            />
            <label htmlFor="contact-email" className="sr-only">Email</label>
            <Input
              id="contact-email"
              type="email"
              placeholder="Email"
              aria-label="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              maxLength={255}
              autoComplete="email"
              className="h-12 rounded-lg"
            />
            <label htmlFor="contact-messenger" className="sr-only">Telegram или WhatsApp</label>
            <Input
              id="contact-messenger"
              placeholder="Telegram / WhatsApp (@username или номер)"
              aria-label="Telegram или WhatsApp"
              value={form.messenger}
              onChange={(e) => setForm({ ...form, messenger: e.target.value })}
              maxLength={100}
              className="h-12 rounded-lg"
            />
            <label htmlFor="contact-message" className="sr-only">Ваш запрос</label>
            <Textarea
              id="contact-message"
              placeholder="Ваш запрос (необязательно)"
              aria-label="Ваш запрос"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              maxLength={2000}
              className="rounded-lg min-h-[100px]"
            />
            <Button type="submit" size="lg" className="w-full rounded-lg gap-2" disabled={loading}>
              {loading ? "Отправка..." : "Отправить"} {!loading && <Send className="w-4 h-4" />}
            </Button>
          </form>
        </motion.section>

        {/* Info */}
        <motion.section {...fade(0.1)} className="mt-12 rounded-2xl border border-border bg-card p-6">
          <h2 className="font-bold mb-3">Как проходит запись</h2>
          <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
            <li>Вы оставляете заявку через форму или Telegram</li>
            <li>Я связываюсь с вами в течение дня</li>
            <li>Мы договариваемся о времени первой сессии</li>
            <li>Первая сессия — знакомство, диагностика и план работы</li>
          </ol>
        </motion.section>

        <motion.div {...fade(0.1)} className="mt-8">
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

export default ContactPage;
