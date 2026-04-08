const About = () => (
  <section id="about" className="section-padding">
    <div className="container mx-auto px-4">
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Обо мне</p>
        <h2 className="font-heading text-3xl md:text-4xl text-foreground tracking-tight">
          Безопасное пространство для изменений
        </h2>
      </div>
      <div className="max-w-3xl mx-auto mt-12 grid md:grid-cols-2 gap-x-16 gap-y-8">
        <p className="text-muted-foreground leading-relaxed">
          Меня зовут Дмитрий. Я — психолог, практикующий в направлении когнитивно-поведенческой терапии (КПТ). 
          Закончил профильное образование и прошёл сертификацию.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Работаю с тревогой, депрессией, паническими атаками, выгоранием. 
          Помогаю клиентам находить ресурсы для изменений и выстраивать здоровое отношение к себе.
        </p>
        <p className="text-muted-foreground leading-relaxed md:col-span-2 text-center max-w-xl mx-auto border-t border-border pt-8">
          Моя задача — создать безопасное пространство, где вы сможете разобраться в своих переживаниях и найти опору.
        </p>
      </div>
    </div>
  </section>
);

export default About;
