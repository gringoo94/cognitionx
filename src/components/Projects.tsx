import { motion } from "framer-motion";
import { ExternalLink, Send, Brain, HeartHandshake, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, delay },
});

const projects = [
  {
    icon: Send,
    title: "CognitionX",
    tag: "Для всех",
    desc: "Telegram-канал о КПТ: психообразование и упражнения для самопомощи.",
    url: "https://t.me/cognitionx",
  },
  {
    icon: BookOpen,
    title: "CBT Workbook",
    tag: "Для клиентов и терапевтов",
    desc: "Онлайн-тетрадь КПТ: упражнения, дневник настроения, связь с терапевтом.",
    url: "https://cbt-workbook.lovable.app",
  },
  {
    icon: Brain,
    title: "Rolelit",
    tag: "Для психологов",
    desc: "AI-тренажёр: отработка навыков КПТ на смоделированных случаях.",
    url: "https://rolelit.lovable.app",
  },
  {
    icon: HeartHandshake,
    title: "MedHub & Initiativa Pozitiva",
    tag: "Волонтёрство",
    desc: "Социальные и волонтёрские программы психологической помощи в партнёрстве с НКО. Не связано с записью в частную практику.",
    url: null,
  },
];

const Projects = () => (
  <section className="max-w-5xl mx-auto px-6 py-14 md:py-20">
    <motion.div {...fade()} className="text-center mb-8">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Практика и проекты</h2>
      <p className="text-muted-foreground mt-3 text-sm md:text-base max-w-xl mx-auto">
        Помимо частной практики, я участвую в проектах, которые делают психологическую помощь доступнее
      </p>
    </motion.div>

    <div className="grid md:grid-cols-2 gap-4">
      {projects.map((p, i) => {
        const inner = (
          <>
            <div className="w-10 h-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
              <p.icon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-bold">{p.title}</h3>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">{p.tag}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mt-1">{p.desc}</p>
            </div>
            {p.url && <ExternalLink className="w-4 h-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />}
          </>
        );
        const cls = "group h-full rounded-2xl border border-border bg-card p-5 flex items-start gap-4";
        return (
          <motion.div key={p.title} {...fade(0.06 * i)} className="h-full">
            {p.url ? (
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${p.title} — открыть в новой вкладке`}
                className={`${cls} hover:border-primary/40 hover:shadow-md transition-all`}
              >
                {inner}
              </a>
            ) : (
              <div className={`${cls} bg-muted/30`}>{inner}</div>
            )}
          </motion.div>
        );
      })}
    </div>
  </section>
);

export default Projects;
