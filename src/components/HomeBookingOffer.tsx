import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackCta } from "@/lib/trackCta";

const HomeBookingOffer = () => (
  <section id="booking" className="bg-foreground text-background">
    <div className="max-w-2xl mx-auto px-6 py-16 md:py-20 text-center">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Запись на консультацию</h2>
      <p className="mt-4 text-background/80 leading-relaxed">
        Обсудим, что вас беспокоит, и определим следующий шаг. Консультация с Дмитрием Яцко — 50 минут, 45 €.
      </p>
      <p className="mt-3 text-sm text-background/60">Онлайн или очно в Кишинёве</p>
      <Button asChild size="lg" className="mt-7 gap-2 w-full sm:w-auto">
        <Link to="/booking" onClick={() => trackCta("home_booking_offer")}>
          Записаться на консультацию <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  </section>
);

export default HomeBookingOffer;