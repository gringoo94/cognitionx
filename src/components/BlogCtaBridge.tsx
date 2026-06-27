import { Link } from "react-router-dom";
import { Gift, Send, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackCta } from "@/lib/trackCta";

interface BlogCtaBridgeProps {
  topic?: string;
}

const BlogCtaBridge = ({ topic }: BlogCtaBridgeProps) => {
  const tgMessage = topic
    ? `Здравствуйте! Прочитал(а) статью про «${topic}» — хочу обсудить свой случай.`
    : "Здравствуйте! Хочу обсудить запрос с психологом.";
  const tgUrl = `https://t.me/gringoo94?text=${encodeURIComponent(tgMessage)}`;

  return (
    <div className="mt-10 rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/5 to-accent/5 p-7 md:p-9">
      <div className="flex items-center gap-2 text-xs font-medium text-accent">
        <Gift className="w-4 h-4" /> Бесплатно · без обязательств
      </div>
      <h3 className="mt-3 text-xl md:text-2xl font-bold tracking-tight">
        Узнали себя в статье?
      </h3>
      <p className="mt-2 text-sm md:text-base text-muted-foreground leading-relaxed">
        Запишитесь на 20-минутную встречу-знакомство — обсудим ваш запрос и решим,
        подходим ли мы друг другу. Или просто напишите мне в Telegram, отвечу в течение дня.
      </p>
      <div className="mt-5 flex flex-col sm:flex-row gap-3">
        <Button asChild size="lg" className="rounded-lg gap-2">
          <Link
            to="/free-consultation"
            onClick={() => trackCta("blog_cta_free_consultation", { topic })}
          >
            <Gift className="w-4 h-4" /> Бесплатная встреча
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="rounded-lg gap-2">
          <a
            href={tgUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              trackCta("blog_cta_telegram", { topic });
              if ((window as any).fbq) {
                (window as any).fbq("track", "Contact", { content_name: "blog_cta_telegram" });
              }
            }}
          >
            <Send className="w-4 h-4" /> Написать в Telegram
          </a>
        </Button>
        <Button asChild size="lg" variant="ghost" className="rounded-lg gap-2">
          <a href="/#booking" onClick={() => trackCta("blog_cta_paid_booking", { topic })}>
            Платная консультация <ArrowRight className="w-4 h-4" />
          </a>
        </Button>
      </div>
    </div>
  );
};

export default BlogCtaBridge;
