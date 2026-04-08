import specAnxiety from "@/assets/spec-anxiety.png";
import specDepression from "@/assets/spec-depression.png";
import specRelationships from "@/assets/spec-relationships.png";
import specSelfesteem from "@/assets/spec-selfesteem.png";
import specBurnout from "@/assets/spec-burnout.png";
import specGrief from "@/assets/spec-grief.png";

const specs = [
  { title: "Тревога и панические атаки", img: specAnxiety },
  { title: "Депрессия и апатия", img: specDepression },
  { title: "Отношения и коммуникация", img: specRelationships },
  { title: "Самооценка и уверенность", img: specSelfesteem },
  { title: "Выгорание и стресс", img: specBurnout },
  { title: "Потери и переживания", img: specGrief },
];

const Specializations = () => (
  <section id="specs" className="section-padding bg-secondary">
    <div className="container mx-auto px-4">
      <div className="max-w-2xl mx-auto text-center space-y-6 mb-16">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Специализации</p>
        <h2 className="font-heading text-3xl md:text-4xl text-foreground tracking-tight">
          С чем я работаю
        </h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
        {specs.map((s) => (
          <div
            key={s.title}
            className="group relative aspect-square rounded-2xl overflow-hidden cursor-default"
          >
            <img
              src={s.img}
              alt={s.title}
              width={512}
              height={512}
              loading="lazy"
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-foreground/40 group-hover:bg-foreground/20 transition-colors duration-500 flex items-end p-4 md:p-6">
              <p className="text-primary-foreground text-sm md:text-base font-medium leading-snug">
                {s.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Specializations;
