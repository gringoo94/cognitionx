import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Send, Clock, CheckCircle2, Globe, Video, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trackLead } from "@/lib/metaPixel";
import { trackCta } from "@/lib/trackCta";
import {
  specialists,
  getSpecialist,
  PSYCHIATRIST_INTRO_LABEL,
  type Specialist,
} from "@/data/specialists";

const schema = z.object({
  name: z.string().trim().min(2, { message: "Укажите имя (минимум 2 символа)" }).max(100),
  contact: z
    .string()
    .trim()
    .min(3, { message: "Укажите телефон или Telegram для связи" })
    .max(120),
  preferredChannel: z.string().trim().min(1, { message: "Выберите способ связи" }).max(50),
  preferredTime: z.string().trim().max(200).optional().or(z.literal("")),
  topic: z.string().trim().max(2000).optional().or(z.literal("")),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Нужно согласие на обработку данных" }),
  }),
});

const CHANNELS = ["Telegram", "WhatsApp", "Звонок"] as const;

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
  name: "Бесплатная 20-минутная консультация с психологом",
  serviceType: "Психологическое консультирование",
  description:
    "Бесплатная 20-минутная онлайн-консультация со специалистом команды CognitionX. Познакомимся, обсудим запрос и формат дальнейшей работы. Без обязательств.",
  url: "https://cognitionx.cloud/free-consultation",
  provider: { "@id": "https://cognitionx.cloud/#organization" },
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

type Selection = { kind: "specialist"; specialist: Specialist } | { kind: "match" } | null;

const Avatar = ({ initials }: { initials: string }) => (
  <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-xl font-bold flex-shrink-0">
    {initials}
  </div>
);

const SpecialistCard = ({
  s,
  onSelect,
}: {
  s: Specialist;
  onSelect: () => void;
}) => (
  <div className="flex flex-col h-full rounded-2xl border border-border bg-card p-6 hover:shadow-lg transition-shadow">
    <div className="flex items-center gap-4">
      <Avatar initials={s.initials} />
      <div>
        <h3 className="text-lg font-semibold">{s.name}</h3>
        <p className="text-sm text-muted-foreground">{s.role}</p>
      </div>
    </div>

    {s.note && (
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground bg-muted/50 rounded-lg p-3">
        {s.note}
      </p>
    )}

    <ul className="mt-4 space-y-1.5 text-sm">
      {s.topics.map((t) => (
        <li key={t} className="flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
          <span className="text-muted-foreground">{t}</span>
        </li>
      ))}
    </ul>

    <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
      <p className="flex items-center gap-2">
        <Globe className="w-3.5 h-3.5" /> {s.languages.join(", ")}
      </p>
      <p className="flex items-center gap-2">
        <Video className="w-3.5 h-3.5" /> {s.formats.join(" · ")}
      </p>
      <p className="flex items-center gap-2">
        <Clock className="w-3.5 h-3.5" /> {s.availability}
      </p>
    </div>

    <p className="mt-4 text-sm">
      <span className="text-muted-foreground">Дальнейшая консультация: </span>
      <span className="font-medium text-foreground">{s.price}</span>
    </p>

    {s.freeIntro ? (
      <p className="mt-2 text-xs text-accent">
        {s.isPsychiatrist
          ? `Бесплатные 20 минут — ${PSYCHIATRIST_INTRO_LABEL.toLowerCase()}`
          : "Бесплатная 20-минутная консультация-знакомство"}
      </p>
    ) : (
      <p className="mt-2 text-xs text-muted-foreground">Бесплатное знакомство сейчас недоступно</p>
    )}

    <Button className="mt-5 w-full rounded-lg mt-auto" onClick={onSelect}>
      {s.freeIntro ? "Выбрать специалиста" : "Записаться на платную консультацию"}
    </Button>
  </div>
);

const FreeConsultationPage = () => {
  const [selection, setSelection] = useState<Selection>(null);
  const [submitted, setSubmitted] = useState<Selection>(null);
  const [form, setForm] = useState({
    name: "",
    contact: "",
    preferredChannel: "Telegram",
    preferredTime: "",
    topic: "",
    consent: false,
  });
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLDivElement>) =>
    setTimeout(() => ref.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);

  const select = (next: Selection) => {
    setSelection(next);
    setSubmitted(null);
    trackCta(
      next?.kind === "specialist"
        ? `free_consultation_select_${next.specialist.id}`
        : "free_consultation_select_match"
    );
    scrollTo(formRef);
  };


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

    const isPaid = selection?.kind === "specialist" && !selection.specialist.freeIntro;
    const format =
      selection?.kind === "match"
        ? "Подбор специалиста"
        : isPaid
        ? "Платная консультация"
        : "Бесплатная 20-минутная консультация";

    const messageText = [
      `📩 ${format}`,
      selection?.kind === "specialist"
        ? `Специалист: ${selection.specialist.fullName} (${selection.specialist.role})`
        : "Специалист: не выбран — нужен подбор",
      `Связь: ${parsed.data.preferredChannel} — ${parsed.data.contact}`,
      parsed.data.preferredTime ? `Удобное время: ${parsed.data.preferredTime}` : null,
      parsed.data.topic ? `Запрос: ${parsed.data.topic}` : "Без дополнительного запроса",
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const { error } = await supabase.from("contact_submissions").insert({
        name: parsed.data.name,
        email: `${parsed.data.preferredChannel}: ${parsed.data.contact}`,
        messenger: parsed.data.contact,
        message: messageText,
      });
      if (error) throw error;

      try {
        await supabase.functions.invoke("notify-telegram", {
          body: {
            name: parsed.data.name,
            email: parsed.data.contact,
            messenger: parsed.data.contact,
            message: messageText,
            source: `📩 ${format}${
              selection?.kind === "specialist" ? ` — ${selection.specialist.fullName}` : ""
            }`,
            page: typeof window !== "undefined" ? window.location.href : null,
          },
        });
      } catch (err) {
        console.error("notify-telegram failed", err);
      }

      const id = selection?.kind === "specialist" ? selection.specialist.id : "match";
      trackCta(`free_consultation_form_submit_${id}`);
      trackLead("free_consultation_form", { content_category: "free_intro_call", content_name: id });

      setSubmitted(selection);
      setSelection(null);
      setForm({
        name: "",
        contact: "",
        preferredChannel: "Telegram",
        preferredTime: "",
        topic: "",
        consent: false,
      });
      scrollTo(formRef);
    } catch {
      toast({
        title: "Ошибка",
        description: "Не удалось отправить заявку. Попробуйте ещё раз.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const confirmationText = () => {
    if (submitted?.kind === "specialist") {
      return submitted.specialist.freeIntro
        ? `Заявка отправлена. ${submitted.specialist.name} или администратор свяжется с вами, чтобы согласовать время 20-минутной консультации.`
        : `Заявка отправлена. ${submitted.specialist.name} или администратор свяжется с вами, чтобы согласовать время платной консультации.`;
    }
    return "Заявка отправлена. Администратор свяжется с вами, предложит подходящего специалиста и согласует время 20-минутной консультации.";
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="Бесплатная 20-минутная консультация — выбрать специалиста"
        description="Выберите специалиста команды CognitionX и запишитесь на бесплатную 20-минутную консультацию: КПТ-психологи и врач-психиатр. Онлайн и очно, без обязательств."
        path="/free-consultation"
        schema={[serviceSchema, breadcrumbSchema]}
      />
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-16 md:py-24">
        <motion.nav {...fade()} className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary transition-colors">Главная</Link>
          <span>/</span>
          <span className="text-foreground">Бесплатная консультация</span>
        </motion.nav>

        {/* Верхний блок */}
        <motion.h1 {...fade(0.05)} className="text-3xl md:text-4xl font-bold tracking-tight max-w-2xl">
          Бесплатная 20-минутная консультация
        </motion.h1>

        <motion.p {...fade(0.1)} className="mt-4 text-muted-foreground leading-relaxed max-w-2xl">
          Познакомьтесь со специалистом, кратко расскажите о своей ситуации и уточните, подходит ли вам дальнейшая работа.
        </motion.p>

        <motion.div {...fade(0.12)} className="mt-7">
          <Button size="lg" className="rounded-lg" onClick={() => scrollTo(listRef)}>
            Выбрать специалиста
          </Button>
        </motion.div>

        <motion.p
          {...fade(0.15)}
          className="mt-6 text-sm text-muted-foreground leading-relaxed bg-muted/50 border border-border rounded-xl p-4 max-w-2xl"
        >
          Дмитрий временно не принимает новых клиентов на бесплатные знакомства из-за высокой нагрузки. Возобновление планируется не раньше ноября 2026 года. Сейчас вы можете записаться на консультацию к одному из специалистов команды.
        </motion.p>

        {/* Карточки */}
        <div ref={listRef} className="scroll-mt-24 mt-14">
          <h2 className="text-xl md:text-2xl font-semibold">Выберите специалиста</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {specialists.map((s) => (
              <SpecialistCard
                key={s.id}
                s={s}
                onSelect={() => select({ kind: "specialist", specialist: s })}
              />
            ))}
          </div>

          {/* Помощь с выбором */}
          <div className="mt-8 rounded-2xl border border-dashed border-border p-6 text-center">
            <HelpCircle className="w-6 h-6 text-primary mx-auto" />
            <h3 className="mt-3 text-lg font-semibold">Не знаете, кого выбрать?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Кратко опишите запрос — мы предложим подходящего специалиста.
            </p>
            <Button variant="outline" className="mt-4 rounded-lg" onClick={() => select({ kind: "match" })}>
              Помогите выбрать специалиста
            </Button>
          </div>
        </div>

        {/* Форма / подтверждение */}
        <div ref={formRef} className="scroll-mt-24 mt-14">
          {submitted && (
            <div className="rounded-2xl border border-accent/30 bg-accent/5 p-6 max-w-2xl">
              <CheckCircle2 className="w-7 h-7 text-accent" />
              <p className="mt-3 text-base leading-relaxed">{confirmationText()}</p>
              <Button variant="ghost" size="sm" className="mt-4" asChild>
                <Link to="/" className="gap-2">
                  <ArrowLeft className="w-4 h-4" /> На главную
                </Link>
              </Button>
            </div>
          )}

          {selection && (
            <section className="max-w-2xl">
              <h2 className="text-xl md:text-2xl font-semibold">
                {selection.kind === "specialist"
                  ? `Заявка на консультацию с ${selection.specialist.withName}`
                  : "Заявка на подбор специалиста"}
              </h2>

              {selection.kind === "specialist" && selection.specialist.isPsychiatrist && (
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed bg-muted/50 rounded-lg p-4">
                  {selection.specialist.note} Бесплатные 20 минут — это{" "}
                  {PSYCHIATRIST_INTRO_LABEL.toLowerCase()}, а не медицинская консультация.
                </p>
              )}

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
                  placeholder="Телефон или Telegram (@username или номер)"
                  value={form.contact}
                  onChange={(e) => setForm({ ...form, contact: e.target.value })}
                  required
                  maxLength={120}
                  className="h-12 rounded-lg"
                />

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Предпочтительный способ связи</p>
                  <div className="flex flex-wrap gap-2">
                    {CHANNELS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setForm({ ...form, preferredChannel: c })}
                        className={`px-4 h-10 rounded-lg border text-sm transition-colors ${
                          form.preferredChannel === c
                            ? "border-primary bg-primary/10 text-primary font-medium"
                            : "border-border text-muted-foreground hover:border-primary/40"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <Input
                    placeholder="Удобное время (например, будни вечером)"
                    value={form.preferredTime}
                    onChange={(e) => setForm({ ...form, preferredTime: e.target.value })}
                    maxLength={200}
                    className="h-12 rounded-lg pl-9"
                  />
                </div>

                <Textarea
                  placeholder="С чем вы хотели бы обратиться? (необязательно)"
                  value={form.topic}
                  onChange={(e) => setForm({ ...form, topic: e.target.value })}
                  maxLength={2000}
                  className="rounded-lg min-h-[100px]"
                />

                <label className="flex items-start gap-3 text-sm text-muted-foreground cursor-pointer">
                  <Checkbox
                    checked={form.consent}
                    onCheckedChange={(v) => setForm({ ...form, consent: v === true })}
                    className="mt-0.5"
                  />
                  <span>
                    Согласен на обработку персональных данных согласно{" "}
                    <Link to="/privacy" className="text-primary hover:underline">
                      политике конфиденциальности
                    </Link>
                  </span>
                </label>

                <Button type="submit" size="lg" className="w-full rounded-lg gap-2" disabled={loading}>
                  {loading
                    ? "Отправка..."
                    : selection.kind === "specialist"
                    ? `Отправить заявку ${selection.specialist.toName}`
                    : "Отправить заявку на подбор"}
                  {!loading && <Send className="w-4 h-4" />}
                </Button>

                <button
                  type="button"
                  onClick={() => {
                    setSelection(null);
                    scrollTo(listRef);
                  }}
                  className="w-full text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  Выбрать другого специалиста
                </button>
              </form>
            </section>
          )}
        </div>

        {!selection && !submitted && (
          <div className="mt-14">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/" className="gap-2">
                <ArrowLeft className="w-4 h-4" /> На главную
              </Link>
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default FreeConsultationPage;
