import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

import { testimonials, testimonialsSchema } from "@/data/homeSchemas";

export { testimonialsSchema };

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, delay },
});

const Testimonials = () => (
  <section className="max-w-6xl mx-auto px-6 py-24 md:py-32">
    <motion.div {...fade()} className="text-center mb-14">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
        Отзывы клиентов
      </h2>
      <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
        Реальные истории людей, которым удалось справиться с трудностями
      </p>
    </motion.div>

    <Carousel
      opts={{ align: "start", loop: true }}
      className="w-full"
    >
      <CarouselContent className="-ml-4">
        {testimonials.map((t, i) => (
          <CarouselItem key={i} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3">
            <div className="relative rounded-2xl border border-border bg-card p-6 flex flex-col gap-4 h-full">
              <Quote className="w-5 h-5 text-primary/40" />
              <p className="text-sm leading-relaxed text-muted-foreground flex-1">
                {t.text}
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-border">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                  {t.initials}
                </div>
                <span className="text-xs text-muted-foreground">{t.topic}</span>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="-left-4 md:-left-12" />
      <CarouselNext className="-right-4 md:-right-12" />
    </Carousel>
  </section>
);

export default Testimonials;
