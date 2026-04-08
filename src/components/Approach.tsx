const points = [
  { num: "01", title: "Осознание", desc: "Выявление автоматических мыслей и глубинных убеждений" },
  { num: "02", title: "Анализ", desc: "Проверка когнитивных искажений и паттернов мышления" },
  { num: "03", title: "Изменение", desc: "Формирование новых поведенческих стратегий" },
  { num: "04", title: "Практика", desc: "Домашние задания и закрепление навыков между сессиями" },
];

const Approach = () => (
  <section id="approach" className="section-padding bg-secondary/50">
    <div className="container mx-auto px-4">
      <div className="max-w-2xl mx-auto text-center space-y-4 mb-16">
        <span className="text-xs font-medium text-primary uppercase tracking-widest">Подход</span>
        <h2 className="font-heading text-3xl md:text-4xl text-foreground font-bold tracking-tight">
          Как строится работа
        </h2>
        <p className="text-muted-foreground leading-relaxed text-sm">
          Когнитивно-поведенческая терапия — структурированный, научно обоснованный метод
        </p>
      </div>
      <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-4">
        {points.map((p) => (
          <div key={p.num} className="glass rounded-2xl p-8 space-y-3 hover:border-primary/30 transition-colors duration-300">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary font-mono text-sm font-semibold">
              {p.num}
            </span>
            <h3 className="font-heading text-lg text-foreground font-semibold">{p.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Approach;
