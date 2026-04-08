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
  <section id="specs" className="section-padding relative overflow-hidden">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
    <div className="container mx-auto px-4 relative">
      <div className="max-w-2xl mx-auto text-center space-y-4 mb-16">
        <span className="text-xs font-medium text-accent uppercase tracking-widest">Специализации</span>
        <h2 className="font-heading text-3xl md:text-4xl text-foreground font-bold tracking-tight">
          С чем я работаю
        </h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
        {specs.map((s) => (
          <div key={s.title} className="group glass rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
            <div className="aspect-square overflow-hidden">
              <img
                src={s.img}
                alt={s.title}
                width={512}
                height={512}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4">
              <p className="text-sm font-medium text-foreground">{s.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Specializations;
