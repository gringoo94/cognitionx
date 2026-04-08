import heroPhoto from "@/assets/hero-photo.png";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => (
  <section className="relative min-h-[90vh] flex items-center pt-16 overflow-hidden">
    {/* Gradient orbs */}
    <div className="absolute top-20 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
    <div className="absolute bottom-20 -right-32 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />

    <div className="container mx-auto px-4 relative">
      <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
        <div className="flex-1 space-y-8 max-w-xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-xs font-medium text-primary">Психолог · КПТ-терапевт</span>
          </div>
          <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl text-foreground leading-[1.1] font-bold tracking-tight">
            Дмитрий
            <br />
            <span className="text-primary">Яцко</span>
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed max-w-md">
            Помогаю справиться с тревогой, депрессией, выгоранием и сложностями в отношениях. 
            Работаю онлайн и очно.
          </p>
          <div className="flex items-center gap-4">
            <Button size="lg" className="rounded-lg px-8 gap-2 shadow-lg shadow-primary/25" asChild>
              <a href="#booking">
                Записаться
                <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" className="rounded-lg" asChild>
              <a href="#about">Узнать больше</a>
            </Button>
          </div>
        </div>
        <div className="flex-shrink-0">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 rounded-3xl blur-2xl scale-105" />
            <div className="relative w-72 h-80 md:w-80 md:h-[28rem] rounded-3xl overflow-hidden border border-border/50 shadow-xl">
              <img src={heroPhoto} alt="Дмитрий Яцко — психолог" width={512} height={640} className="w-full h-full object-cover object-top" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Hero;
