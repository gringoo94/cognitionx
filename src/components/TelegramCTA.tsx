import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackContact } from "@/lib/metaPixel";

const TelegramCTA = () => (
  <section className="bg-primary text-primary-foreground">
    <div className="max-w-3xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-sm font-medium"
      >
        Есть вопросы? Напишите мне — отвечу в течение дня
      </motion.p>
      <Button
        size="sm"
        variant="secondary"
        className="gap-2 rounded-full"
        asChild
      >
        <a
          href="https://t.me/gringoo94"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            trackContact("telegram_cta");
          }}
        >
          <Send className="w-4 h-4" /> Написать в Telegram
        </a>
      </Button>
    </div>
  </section>
);

export default TelegramCTA;
