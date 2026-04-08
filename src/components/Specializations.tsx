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
  <section className="py-16 md:py-24 bg-background">
    <div className="container mx-auto px-4">
      <h2 className="font-heading text-3xl md:text-4xl text-foreground text-center mb-12">
        Мои ключевые специализации
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {specs.map((s) => (
          <div key={s.title} className="group flex flex-col items-center text-center space-y-3 p-4 rounded-xl hover:bg-card transition-colors">
            <div className="w-32 h-32 rounded-xl overflow-hidden bg-secondary">
              <img src={s.img} alt={s.title} width={512} height={512} loading="lazy" className="w-full h-full object-cover" />
            </div>
            <p className="text-sm font-medium text-foreground">{s.title}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Specializations;
