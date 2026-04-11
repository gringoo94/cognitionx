import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import heroPhoto from "@/assets/hero-photo.png";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, delay },
});

const Hero = () => (
  <section className="max-w-7xl mx-auto px-6 pt-20 md:pt-32 pb-24">
    <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
      {/* Text */}
      <div className="text-center md:text-left order-2 md:order-1">
        <motion.div
          {...fade(0)}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-xs font-medium text-primary mb-7"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Психолог · КПТ-терапевт
        </motion.div>

        <motion.h1
          {...fade(0.05)}
          className="text-4xl sm:text-5xl md:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.08]"
        >
          Дмитрий
          <br />
          <span className="text-primary">Яцко</span>
        </motion.h1>

        <motion.p
          {...fade(0.1)}
          className="mt-6 text-base md:text-lg text-muted-foreground max-w-lg leading-relaxed"
        >
          Помогаю справиться с тревогой, депрессией, выгоранием и сложностями в отношениях. Работаю онлайн и очно.
        </motion.p>

        <motion.div
          {...fade(0.15)}
          className="mt-9 flex flex-col sm:flex-row items-center md:items-start gap-3"
        >
          <Button size="lg" className="gap-2 text-base px-8 hover:scale-[1.02] hover:shadow-lg transition-all" asChild>
            <a href="#booking">
              Записаться <ArrowRight className="w-4 h-4" />
            </a>
          </Button>
          <Button variant="outline" size="lg" className="text-base px-8 hover:scale-[1.02] hover:shadow-md transition-all" asChild>
            <a href="#approach">Как я работаю</a>
          </Button>
        </motion.div>

        <motion.p {...fade(0.2)} className="mt-4 text-xs text-muted-foreground">
          Первая консультация — 2 500 ₽ · Онлайн или очно
        </motion.p>
      </div>

      {/* Photo */}
      <motion.div {...fade(0.2)} className="flex justify-center order-1 md:order-2">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl scale-110" />
          <div className="relative w-72 h-80 sm:w-80 sm:h-[22rem] md:w-[22rem] md:h-[28rem] lg:w-[26rem] lg:h-[32rem] rounded-3xl overflow-hidden shadow-2xl">
            <img
              src={heroPhoto}
              alt="Дмитрий Яцко — психолог"
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default Hero;
