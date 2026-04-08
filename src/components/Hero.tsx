import heroPhoto from "@/assets/hero-photo.png";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => (
  <section className="relative min-h-[90vh] flex items-center pt-16">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
        <div className="flex-1 space-y-8 max-w-xl">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Психолог · КПТ-терапевт
            </p>
            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl text-foreground leading-[1.1] tracking-tight">
              Дмитрий
              <br />
              Яцко
            </h1>
          </div>
          <p className="text-base text-muted-foreground leading-relaxed max-w-md">
            Помогаю справиться с тревогой, депрессией, выгоранием и сложностями в отношениях. 
            Работаю онлайн и очно.
          </p>
          <div className="flex items-center gap-4">
            <Button size="lg" className="rounded-full px-8 gap-2" asChild>
              <a href="#booking">
                Записаться
                <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
            <Button size="lg" variant="ghost" className="rounded-full text-muted-foreground" asChild>
              <a href="#about">Узнать больше</a>
            </Button>
          </div>
        </div>
        <div className="flex-shrink-0">
          <div className="w-72 h-80 md:w-80 md:h-[28rem] rounded-3xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
            <img
              src={heroPhoto}
              alt="Дмитрий Яцко — психолог"
              width={512}
              height={640}
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Hero;
