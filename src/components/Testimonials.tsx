import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    text: "После нескольких месяцев работы с Дмитрием я научилась распознавать тревожные мысли и не поддаваться им. Качество жизни изменилось кардинально.",
    initials: "А. К.",
    topic: "Тревога",
  },
  {
    text: "Я пришёл с выгоранием — не мог заставить себя работать. КПТ-подход помог разобраться в причинах и выстроить здоровый ритм.",
    initials: "М. С.",
    topic: "Выгорание",
  },
  {
    text: "Панические атаки мучили меня два года. Через 10 сессий я впервые за долгое время почувствовала себя в безопасности.",
    initials: "Е. Л.",
    topic: "Панические атаки",
  },
  {
    text: "Дмитрий помог мне выйти из созависимых отношений и научиться ставить границы. Очень благодарна за структурный подход.",
    initials: "О. В.",
    topic: "Созависимость",
  },
  {
    text: "Работаю с Дмитрием онлайн уже полгода. Депрессия отступила, появились силы и желание жить.",
    initials: "И. Д.",
    topic: "Депрессия",
  },
];

export const testimonialsSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Психолог Дмитрий Яцко",
  review: testimonials.map((t) => ({
    "@type": "Review",
    reviewBody: t.text,
    author: { "@type": "Person", name: t.initials },
    reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
  })),
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5",
    reviewCount: String(testimonials.length),
  },
};

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, delay },
});

const Testimonials = () => (
  <section className="max-w-6xl mx-auto px-6 py-24 md:py-32">
    <motion.div {...fade()} className="text-center mb-14">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
        Отзывы клиентов
      </h2>
      <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
        Реальные истории людей, которым удалось справиться с трудностями
      </p>
    </motion.div>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {testimonials.map((t, i) => (
        <motion.div
          key={i}
          {...fade(i * 0.05)}
          className="relative rounded-2xl border border-border bg-card p-6 flex flex-col gap-4"
        >
          <Quote className="w-5 h-5 text-primary/40" />
          <p className="text-sm leading-relaxed text-muted-foreground flex-1">
            {t.text}
          </p>
          <div className="flex items-center gap-3 pt-2 border-t border-border">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
              {t.initials}
            </div>
            <span className="text-xs text-muted-foreground">{t.topic}</span>
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);

export default Testimonials;
