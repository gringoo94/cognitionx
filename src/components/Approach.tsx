import { CheckCircle } from "lucide-react";

const points = [
  "Осознание автоматических мыслей и убеждений",
  "Проверка когнитивных искажений",
  "Формирование новых поведенческих паттернов",
  "Развитие навыков саморегуляции",
  "Практические домашние задания между сессиями",
  "Научно доказанная эффективность",
];

const Approach = () => (
  <section className="py-16 md:py-24 bg-card">
    <div className="container mx-auto px-4 max-w-3xl">
      <h2 className="font-heading text-3xl md:text-4xl text-foreground text-center mb-4">
        То, на что опирается наша работа в рамках КПТ
      </h2>
      <p className="text-muted-foreground text-center mb-10">
        Когнитивно-поведенческая терапия — это структурированный, научно обоснованный подход
      </p>
      <div className="grid md:grid-cols-2 gap-4">
        {points.map((p) => (
          <div key={p} className="flex items-start gap-3 p-4 rounded-lg bg-background">
            <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <span className="text-foreground text-sm">{p}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Approach;
