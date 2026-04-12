import { motion } from "framer-motion";
import { ExternalLink, BookOpen, Brain, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, delay },
});

const projects = [
  {
    icon: BookOpen,
    title: "CognitionX",
    desc: "Блог и практика. Статьи о КПТ, психообразование, инструменты самопомощи.",
    url: "https://cognitionx.cloud",
  },
  {
    icon: Brain,
    title: "CBTLAB",
    desc: "Первый КПТ-центр в Молдове. Сооснователь проекта — обучение и супервизия.",
    url: "https://cbtlab.md",
  },
  {
    icon: HeartHandshake,
    title: "MedHub & Initiativa Pozitiva",
    desc: "Волонтёрские бесплатные консультации для тех, кто не может позволить себе частную терапию.",
    url: null,
  },
];

const Projects = () => (
  <section className="max-w-4xl mx-auto px-6 py-20 md:py-28">
    <motion.div {...fade()} className="text-center mb-14">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Практика и проекты</h2>
      <p className="text-muted-foreground mt-3 text-sm md:text-base max-w-xl mx-auto">
        Помимо частной практики, я участвую в проектах, которые делают психологическую помощь доступнее
      </p>
    </motion.div>

    <div className="grid md:grid-cols-3 gap-6">
      {projects.map((p, i) => (
        <motion.div
          key={p.title}
          {...fade(0.08 * i)}
          className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-4"
        >
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <p.icon className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-base font-bold">{p.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed flex-1">{p.desc}</p>
          {p.url && (
            <Button variant="outline" size="sm" className="gap-1.5 w-fit" asChild>
              <a href={p.url} target="_blank" rel="noopener noreferrer">
                Перейти <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </Button>
          )}
        </motion.div>
      ))}
    </div>
  </section>
);

export default Projects;
