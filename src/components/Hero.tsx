import heroPhoto from "@/assets/hero-photo.png";
import { Button } from "@/components/ui/button";

const Hero = () => (
  <section className="relative overflow-hidden bg-background">
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
        <div className="flex-1 space-y-6">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-foreground leading-tight">
            Дмитрий Яцко
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg">
            Психолог · КПТ-терапевт. Помогаю справиться с тревогой, депрессией, 
            выгоранием и сложностями в отношениях. Работаю онлайн и очно.
          </p>
          <div className="flex gap-4">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
              <a href="#booking">Записаться</a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#about">Узнать больше</a>
            </Button>
          </div>
        </div>
        <div className="flex-shrink-0">
          <div className="w-64 h-72 md:w-80 md:h-96 rounded-2xl bg-secondary overflow-hidden flex items-end justify-center">
            <img src={heroPhoto} alt="Дмитрий Яцко — психолог" width={512} height={640} className="w-full h-full object-cover object-top" />
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Hero;
