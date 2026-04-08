const About = () => (
  <section id="about" className="section-padding">
    <div className="container mx-auto px-4">
      <div className="max-w-2xl mx-auto text-center space-y-4 mb-12">
        <span className="text-xs font-medium text-primary uppercase tracking-widest">Обо мне</span>
        <h2 className="font-heading text-3xl md:text-4xl text-foreground font-bold tracking-tight">
          Безопасное пространство для изменений
        </h2>
      </div>
      <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6 space-y-3">
          <p className="text-muted-foreground leading-relaxed text-sm">
            Меня зовут Дмитрий. Я — психолог, практикующий в направлении когнитивно-поведенческой терапии (КПТ). 
            Закончил профильное образование и прошёл сертификацию.
          </p>
        </div>
        <div className="glass rounded-2xl p-6 space-y-3">
          <p className="text-muted-foreground leading-relaxed text-sm">
            Работаю с тревогой, депрессией, паническими атаками, выгоранием. 
            Помогаю клиентам находить ресурсы для изменений и выстраивать здоровое отношение к себе.
          </p>
        </div>
        <div className="md:col-span-2 glass rounded-2xl p-6 text-center border-primary/20">
          <p className="text-muted-foreground leading-relaxed text-sm max-w-xl mx-auto">
            Моя задача — создать безопасное пространство, где вы сможете разобраться в своих переживаниях и найти опору.
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default About;
