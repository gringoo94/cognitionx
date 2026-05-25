import { useState } from "react";
import { z } from "zod";
import { Mail, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const emailSchema = z
  .string()
  .trim()
  .email({ message: "Введите корректный email" })
  .max(255, { message: "Email слишком длинный" });

interface BlogSubscribeFormProps {
  source?: string;
  variant?: "inline" | "card";
  title?: string;
  description?: string;
}

const BlogSubscribeForm = ({
  source = "blog",
  variant = "card",
  title = "Подпишитесь на новые статьи",
  description = "Раз в пару недель — без спама. Только новые тексты о схема-терапии, КПТ и психологической самопомощи.",
}: BlogSubscribeFormProps) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      toast({
        title: "Проверьте email",
        description: parsed.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from("blog_subscribers")
      .insert({ email: parsed.data, source });
    setLoading(false);

    if (error) {
      // Уже подписан — обрабатываем как успех
      if (error.code === "23505") {
        setDone(true);
        toast({
          title: "Вы уже подписаны",
          description: "Этот email уже в списке. Спасибо!",
        });
        return;
      }
      toast({
        title: "Не удалось подписаться",
        description: "Попробуйте ещё раз через минуту.",
        variant: "destructive",
      });
      return;
    }

    // Telegram notification (fire-and-forget — здесь нет навигации, поэтому безопасно)
    supabase.functions.invoke("notify-telegram", {
      body: {
        name: "Подписка на блог",
        email: parsed.data,
        messenger: null,
        message: `Новая подписка на рассылку (source: ${source})`,
        source: `BlogSubscribeForm (${source})`,
        page: typeof window !== "undefined" ? window.location.href : null,
      },
    }).catch((e) => console.error("notify-telegram failed", e));

    setDone(true);
    setEmail("");
    toast({
      title: "Готово!",
      description: "Вы подписаны на новые статьи.",
    });
  };

  if (done) {
    return (
      <div
        className={
          variant === "card"
            ? "p-6 rounded-2xl bg-primary/5 border border-primary/10 text-center"
            : "p-4 rounded-xl bg-primary/5 border border-primary/10 text-center"
        }
      >
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 mb-3">
          <Check className="w-5 h-5 text-primary" />
        </div>
        <p className="text-sm font-medium">Спасибо! Вы в списке.</p>
        <p className="text-xs text-muted-foreground mt-1">
          Напишу, когда выйдет новая статья.
        </p>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className="p-4 rounded-xl bg-muted/40 border border-border">
        <div className="flex items-center gap-2 mb-2">
          <Mail className="w-4 h-4 text-primary" />
          <p className="text-sm font-semibold">Новые статьи на почту</p>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Без спама. Только новые тексты.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            maxLength={255}
            required
            className="h-9 text-sm"
          />
          <Button type="submit" size="sm" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Подписаться"}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-8 rounded-2xl bg-primary/5 border border-primary/10">
      <div className="flex items-center gap-2 mb-2">
        <Mail className="w-5 h-5 text-primary" />
        <h3 className="text-xl font-bold">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-5">{description}</p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <Input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          maxLength={255}
          required
          className="flex-1"
        />
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Отправка...
            </>
          ) : (
            "Подписаться"
          )}
        </Button>
      </form>
      <p className="text-xs text-muted-foreground mt-3">
        Нажимая «Подписаться», вы соглашаетесь получать письма о новых статьях. Отписаться можно в любой момент.
      </p>
    </div>
  );
};

export default BlogSubscribeForm;
