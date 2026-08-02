import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, ArrowLeft, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { leadRecentlyFired, trackLead } from "@/lib/metaPixel";

const ThankYou = () => {
  useEffect(() => {
    // Форма уже отправила Lead со своим content_name — не дублируем конверсию.
    if (!leadRecentlyFired()) {
      trackLead("thank_you_page");
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SEOHead
        title="Спасибо за заявку — Психолог Дмитрий Яцко"
        description="Ваша заявка отправлена. Я свяжусь с вами в ближайшее время."
        path="/thank-you"
        noindex
      />
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full text-center"
        >
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Спасибо за заявку!
          </h1>

          <p className="mt-4 text-muted-foreground leading-relaxed">
            Я получил вашу заявку и свяжусь с вами в течение дня. Обычно отвечаю в Telegram или по email.
          </p>

          <div className="mt-8 space-y-3">
            <Button asChild size="lg" className="w-full rounded-lg gap-2">
              <a href="https://t.me/gringoo94" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-4 h-4" /> Написать в Telegram
              </a>
            </Button>

            <Button variant="outline" size="lg" asChild className="w-full rounded-lg gap-2">
              <Link to="/">
                <ArrowLeft className="w-4 h-4" /> На главную
              </Link>
            </Button>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default ThankYou;
