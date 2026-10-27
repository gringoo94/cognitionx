import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ZoomIn } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { trackCta } from "@/lib/trackCta";
const heroPhoto = "/hero-photo.webp";
const heroPhotoAvif = "/hero-photo.avif";

const HeroPoster = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex justify-center">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Открыть изображение в полном размере"
        className="group relative w-64 sm:w-80 md:w-[22rem] lg:w-[26rem] aspect-[4/5] rounded-lg overflow-hidden cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <picture>
          <source srcSet={heroPhotoAvif} type="image/avif" />
          <source srcSet={heroPhoto} type="image/webp" />
          <img
            src={heroPhoto}
            alt="Фото психолога Дмитрия Яцко — КПТ-терапевт, консультации онлайн и очно"
            className="w-full h-full object-contain"
            loading="eager"
            {...({ fetchpriority: "high" } as any)}
            width={1080}
            height={1350}
            decoding="async"
          />
        </picture>
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1.5 text-xs font-medium text-foreground shadow-md">
          <ZoomIn className="w-3.5 h-3.5" /> Увеличить
        </span>
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[min(95vw,calc(90vh*0.8))] p-0 overflow-hidden border-0 bg-transparent shadow-none">
          <DialogTitle className="sr-only">Дмитрий Яцко — полный размер</DialogTitle>
          <picture>
            <source srcSet={heroPhotoAvif} type="image/avif" />
            <img src={heroPhoto} alt="Дмитрий Яцко — полный размер" className="w-full h-auto max-h-[90vh] object-contain rounded-lg" width={1080} height={1350} />
          </picture>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, delay },
});

const Hero = () => (
  <section className="max-w-7xl mx-auto px-6 pt-12 md:pt-20 pb-12 md:pb-16">
    <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
      {/* Text */}
      <div className="text-left">
        <motion.div
          {...fade(0)}
          className="text-sm font-medium text-primary mb-5"
        >
          КПТ и схема-терапия
        </motion.div>

        <motion.h1
          {...fade(0.05)}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.12]"
        >
          Дмитрий <span className="text-primary">Яцко</span>
          <span className="block mt-3 text-xl sm:text-2xl md:text-2xl lg:text-3xl font-medium text-muted-foreground">
            Клинический психолог, когнитивно-поведенческий терапевт
          </span>
        </motion.h1>

        <motion.p
          {...fade(0.1)}
          className="mt-6 text-base md:text-lg text-muted-foreground max-w-lg leading-relaxed"
        >
          Тревога, подавленность, выгорание или сложности в отношениях? На консультации разберём, что с вами происходит и какой следующий шаг подойдёт вам.
        </motion.p>


        <motion.div {...fade(0.2)} className="mt-7">
          <Button size="lg" className="h-auto min-h-12 w-full sm:w-auto gap-2 whitespace-normal rounded-lg px-6 py-3 text-base" asChild>
            <a href="/booking" onClick={() => trackCta("home_hero_booking")}>
              Записаться на консультацию <ArrowRight className="w-4 h-4 shrink-0" />
            </a>
          </Button>
        </motion.div>

        <motion.p {...fade(0.22)} className="mt-3 text-xs leading-relaxed text-muted-foreground">
          Ближайшая запись — примерно через две недели. Время согласуем в Telegram или WhatsApp.
        </motion.p>

        <motion.div
          {...fade(0.25)}
          className="mt-6 flex flex-wrap items-center gap-6 text-sm text-muted-foreground"
        >
          {[
            { value: "200+", label: "клиентов" },
            { value: "5 лет", label: "опыта" },
            { value: "Онлайн", label: "из любой точки" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <span className="block text-lg font-bold text-foreground">{s.value}</span>
              <span className="text-xs">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <HeroPoster />
    </div>
  </section>
);

export default Hero;
