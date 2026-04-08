const points = [
  { num: "01", title: "Осознание", desc: "Выявление автоматических мыслей и глубинных убеждений" },
  { num: "02", title: "Анализ", desc: "Проверка когнитивных искажений и паттернов мышления" },
  { num: "03", title: "Изменение", desc: "Формирование новых поведенческих стратегий" },
  { num: "04", title: "Практика", desc: "Домашние задания и закрепление навыков между сессиями" },
];

const Approach = () => (
  <section id="approach" className="section-padding">
    <div className="container mx-auto px-4">
      <div className="max-w-2xl mx-auto text-center space-y-6 mb-16">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Подход</p>
        <h2 className="font-heading text-3xl md:text-4xl text-foreground tracking-tight">
          Как строится работа
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Когнитивно-поведенческая терапия — структурированный, научно обоснованный метод
        </p>
      </div>
      <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-px bg-border rounded-2xl overflow-hidden">
        {points.map((p) => (
          <div key={p.num} className="bg-background p-8 md:p-10 space-y-3">
            <span className="text-xs font-mono text-muted-foreground">{p.num}</span>
            <h3 className="font-heading text-xl text-foreground">{p.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Approach;
