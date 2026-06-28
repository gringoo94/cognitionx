import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowLeft,
  ArrowRight,
  Send,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/**
 * /start — soft-offer quiz used as the primary CTA on geo / landing pages.
 * 6 short steps + contact, posts to notify-telegram. No payment, no obligations.
 */

type Step = {
  id: keyof Answers;
  title: string;
  hint?: string;
  options: { value: string; label: string; description?: string }[];
};

interface Answers {
  situation: string;
  duration: string;
  severity: string;
  location: string;
  experience: string;
  format: string;
}

const STEPS: Step[] = [
  {
    id: "situation",
    title: "Что сейчас больше всего мешает жить?",
    hint: "Если подходит несколько — выберите главное.",
    options: [
      { value: "Тревога, постоянное напряжение", label: "Тревога, постоянное напряжение" },
      { value: "Подавленность, апатия, нет сил", label: "Подавленность, апатия, нет сил" },
      { value: "Выгорание и истощение", label: "Выгорание и истощение" },
      { value: "Отношения, одиночество, привязанность", label: "Отношения, одиночество, привязанность" },
      { value: "Самооценка, самокритика, самозванец", label: "Самооценка, самокритика, самозванец" },
      { value: "Адаптация после переезда / эмиграция", label: "Адаптация после переезда / эмиграция" },
      { value: "Другое — расскажу в конце", label: "Другое — расскажу в конце" },
    ],
  },
  {
    id: "duration",
    title: "Как давно это продолжается?",
    options: [
      { value: "Меньше месяца", label: "Меньше месяца" },
      { value: "1–6 месяцев", label: "1–6 месяцев" },
      { value: "Полгода – год", label: "Полгода – год" },
      { value: "Больше года", label: "Больше года" },
      { value: "Сколько себя помню", label: "Сколько себя помню" },
    ],
  },
  {
    id: "severity",
    title: "Насколько это сейчас влияет на жизнь?",
    hint: "Честно — это нужно мне, чтобы понять формат.",
    options: [
      { value: "Фоном, но в целом справляюсь", label: "Фоном, но в целом справляюсь" },
      { value: "Заметно мешает работе и отношениям", label: "Заметно мешает работе и отношениям" },
      { value: "Тяжело, многое даётся через силу", label: "Тяжело, многое даётся через силу" },
      { value: "Очень тяжело, бывают мысли что не хочется жить", label: "Очень тяжело, бывают мысли что не хочется жить" },
    ],
  },
  {
    id: "location",
    title: "Откуда вы и какой часовой пояс?",
    hint: "Это нужно, чтобы предложить удобное время сессии.",
    options: [
      { value: "Европа (UTC+0/+2)", label: "Европа (UTC+0/+2)" },
      { value: "Москва / СНГ (UTC+3)", label: "Москва / СНГ (UTC+3)" },
      { value: "Кишинёв / EET (UTC+2/+3)", label: "Кишинёв / EET (UTC+2/+3)" },
      { value: "Грузия / Армения (UTC+4)", label: "Грузия / Армения (UTC+4)" },
      { value: "Азия (UTC+5…+8)", label: "Азия (UTC+5…+8)" },
      { value: "США / Канада", label: "США / Канада" },
      { value: "Другое — напишу", label: "Другое — напишу" },
    ],
  },
  {
    id: "experience",
    title: "Был ли уже опыт терапии?",
    options: [
      { value: "Никогда", label: "Никогда" },
      { value: "Пробовал(а) — не зашло", label: "Пробовал(а) — не зашло" },
      { value: "Был положительный опыт, ищу нового специалиста", label: "Был положительный опыт, ищу нового специалиста" },
      { value: "Сейчас уже хожу к терапевту", label: "Сейчас уже хожу к терапевту" },
    ],
  },
  {
    id: "format",
    title: "Что вам сейчас хотелось бы?",
    options: [
      { value: "Понять, в какую сторону копать", label: "Понять, в какую сторону копать" },
      { value: "Разовый разбор ситуации", label: "Разовый разбор ситуации" },
      { value: "Регулярную работу (8–20 сессий)", label: "Регулярную работу (8–20 сессий)" },
      { value: "Пока не знаю — поэтому и здесь", label: "Пока не знаю — поэтому и здесь" },
    ],
  },
];

const contactSchema = z.object({
  contact: z
    .string()
    .trim()
    .min(3, { message: "Укажите Telegram (@username) или email" })
    .max(200),
  name: z.string().trim().max(100).optional().or(z.literal("")),
  extra: z.string().trim().max(2000).optional().or(z.literal("")),
});

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay },
});

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Главная", item: "https://cognitionx.cloud/" },
    { "@type": "ListItem", position: 2, name: "Понять, с чего начать", item: "https://cognitionx.cloud/start" },
  ],
};

const StartQuizPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({
    situation: "",
    duration: "",
    severity: "",
    location: "",
    experience: "",
    format: "",
  });
  const [contact, setContact] = useState("");
  const [name, setName] = useState("");
  const [extra, setExtra] = useState("");
  const [loading, setLoading] = useState(false);
  const totalSteps = STEPS.length + 1; // + contact step
  const progress = Math.round(((step + 1) / totalSteps) * 100);

  const currentStep = step < STEPS.length ? STEPS[step] : null;

  const pick = (value: string) => {
    if (!currentStep) return;
    setAnswers((prev) => ({ ...prev, [currentStep.id]: value }));
    setTimeout(() => setStep((s) => s + 1), 120);
  };

  const summary = useMemo(() => {
    return STEPS.map((s) => `• ${s.title}\n  → ${answers[s.id] || "—"}`).join("\n");
  }, [answers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = contactSchema.safeParse({ contact, name, extra });
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
      "🧭 /start — заявка на первичный разбор",
      "",
      summary,
      "",
      parsed.data.extra ? `Дополнительно:\n${parsed.data.extra}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      // Best-effort log to contact_submissions (RLS may reject anonymous insert — that's OK).
      try {
        await supabase.from("contact_submissions").insert({
          name: parsed.data.name || "—",
          email: parsed.data.contact.includes("@") ? parsed.data.contact : "",
          messenger: parsed.data.contact,
          message: messageText,
        });
      } catch {
        /* ignore — Telegram is the source of truth */
      }

      await supabase.functions.invoke("notify-telegram", {
        body: {
          name: parsed.data.name || "—",
          email: parsed.data.contact.includes("@") ? parsed.data.contact : "",
          messenger: parsed.data.contact,
          message: messageText,
          source: "🧭 /start quiz",
          page: typeof window !== "undefined" ? window.location.href : null,
        },
      });

      navigate("/thank-you");
    } catch {
      toast({
        title: "Ошибка",
        description: "Не удалось отправить. Напишите мне в Telegram @gringoo94.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="Понять, с чего начать — короткий опросник | Дмитрий Яцко"
        description="5 минут, 6 вопросов — и я отправлю первичный разбор в Telegram. Без оплаты и без обязательств. Поможет понять, какой формат психологической работы подойдёт именно вам."
        path="/start"
        schema={[breadcrumbSchema]}
      />
      <Navbar />

      <main className="max-w-2xl mx-auto px-6 py-12 md:py-20">
        <motion.nav {...fade()} className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary transition-colors">
            Главная
          </Link>
          <span>/</span>
          <span className="text-foreground">Понять, с чего начать</span>
        </motion.nav>

        <motion.div {...fade(0.05)} className="mb-2 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs font-medium text-primary">
          <Sparkles className="w-3.5 h-3.5" />
          3–5 минут · бесплатно · без обязательств
        </motion.div>

        <motion.h1 {...fade(0.1)} className="text-3xl md:text-4xl font-bold tracking-tight mt-3">
          Понять, с чего начать
        </motion.h1>
        <motion.p {...fade(0.15)} className="mt-3 text-muted-foreground leading-relaxed">
          6 коротких вопросов. На их основе я отправлю в Telegram первичный разбор: подходит ли терапия вашему запросу, с какого формата лучше начать, нужна ли психиатрия параллельно. Без оплаты — это не сессия, а навигация.
        </motion.p>

        {/* Progress */}
        <div className="mt-8">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Шаг {Math.min(step + 1, totalSteps)} из {totalSteps}</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Quiz body */}
        <section className="mt-10">
          {currentStep ? (
            <motion.div key={currentStep.id} {...fade()}>
              <h2 className="text-xl md:text-2xl font-semibold leading-snug">
                {currentStep.title}
              </h2>
              {currentStep.hint && (
                <p className="text-sm text-muted-foreground mt-2">{currentStep.hint}</p>
              )}

              <div className="mt-6 grid gap-3">
                {currentStep.options.map((opt) => {
                  const selected = answers[currentStep.id] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => pick(opt.value)}
                      className={`text-left rounded-xl border p-4 transition-all hover:border-primary/60 hover:bg-primary/5 ${
                        selected
                          ? "border-primary bg-primary/10"
                          : "border-border bg-card"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                            selected ? "border-primary bg-primary" : "border-muted-foreground/40"
                          }`}
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium">{opt.label}</div>
                          {opt.description && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {opt.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={step === 0}
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" /> Назад
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!answers[currentStep.id]}
                  onClick={() => setStep((s) => s + 1)}
                  className="gap-2"
                >
                  Дальше <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.form key="contact" {...fade()} onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-xl md:text-2xl font-semibold leading-snug">
                Куда отправить разбор?
              </h2>
              <p className="text-sm text-muted-foreground">
                Удобнее всего — Telegram. Я посмотрю ваши ответы и в течение 1–2 рабочих дней пришлю короткий разбор. Без рассылок, без последующих звонков.
              </p>

              <Input
                placeholder="Telegram (@username) или email"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
                maxLength={200}
                className="h-12 rounded-lg"
              />
              <Input
                placeholder="Имя (как к вам обращаться) — необязательно"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
                className="h-12 rounded-lg"
              />
              <Textarea
                placeholder="Если хотите добавить контекст словами — здесь (необязательно)"
                value={extra}
                onChange={(e) => setExtra(e.target.value)}
                maxLength={2000}
                className="rounded-lg min-h-[100px]"
              />

              <div className="rounded-lg border border-border bg-muted/30 p-4 text-xs text-muted-foreground space-y-1.5">
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  Что я НЕ делаю
                </div>
                <ul className="space-y-1 pl-6 list-disc">
                  <li>Не подписываю на рассылку.</li>
                  <li>Не звоню без вашего запроса.</li>
                  <li>Не передаю данные третьим лицам.</li>
                </ul>
              </div>

              <Button type="submit" size="lg" className="w-full rounded-lg gap-2" disabled={loading}>
                {loading ? "Отправка..." : "Отправить и получить разбор"}{" "}
                {!loading && <Send className="w-4 h-4" />}
              </Button>

              <div className="flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Назад к вопросам
                </button>
                <Link to="/free-consultation" className="text-muted-foreground hover:text-foreground">
                  Или сразу записаться на встречу →
                </Link>
              </div>
            </motion.form>
          )}
        </section>

        {/* Trust footer */}
        <motion.div {...fade(0.2)} className="mt-12 grid sm:grid-cols-3 gap-4 text-xs text-muted-foreground">
          {[
            "Опросник остаётся между нами",
            "Разбор — текстом в Telegram",
            "Дальше — только если сами захотите",
          ].map((t) => (
            <div key={t} className="flex items-start gap-2 rounded-lg border border-border bg-card p-3">
              <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span>{t}</span>
            </div>
          ))}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default StartQuizPage;
