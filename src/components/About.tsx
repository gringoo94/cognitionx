import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { trackContact } from "@/lib/metaPixel";
import aboutPhotoAsset from "@/assets/about-photo.jpg.asset.json";

const aboutPhoto = aboutPhotoAsset.url;


const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, delay },
});

type AboutProps = {
  /** Заголовок секции */
  heading?: string;
  /** Основной абзац — можно переопределить под гео-страницу */
  text?: string;
  /** Цитата под текстом */
  quote?: string;
  /** Чипсы с методами / форматом */
  chips?: string[];
  /** Текст и ссылка кнопки */
  ctaLabel?: string;
  ctaTo?: string;
};

const DEFAULT_TEXT =
  "Я клинический психолог, когнитивно-поведенческий терапевт. Работаю с тревогой, подавленностью, выгоранием и трудностями в отношениях. Вместе мы разбираемся, что поддерживает ваше состояние, и ищем способы справляться с ним в повседневной жизни.";

const DEFAULT_QUOTE =
  "«Не обязательно заранее знать, что с вами происходит. Можно начать с того, что сейчас трудно».";

const PRINCIPLES = [
  {
    title: "Не только разговор",
    text: "Использую КПТ и схема-терапию: исследуем связь мыслей, чувств и действий, замечаем повторяющиеся сценарии и пробуем новые способы реагировать.",
  },
  {
    title: "Общие цели",
    text: "Обсуждаем, что вы хотите изменить и как поймёте, что терапия помогает. Объясняю смысл упражнений и предлагаю то, что подходит вашей ситуации.",
  },
  {
    title: "Без давления",
    text: "Не нужно рассказывать всё на первой встрече. Вы можете сказать, что пока не готовы обсуждать какую-то тему или что предложенное упражнение вам не подходит.",
  },
  {
    title: "Внимание к качеству работы",
    text: "Продолжаю учиться и прохожу супервизию — обсуждаю сложные рабочие вопросы с опытным коллегой, соблюдая конфиденциальность.",
  },
];

const About = ({
  heading = "Меня зовут Дмитрий",
  text = DEFAULT_TEXT,
  quote = DEFAULT_QUOTE,
  chips = ["КПТ", "Схема-терапия", "Регулярная супервизия", "Онлайн и очно"],
  ctaLabel = "Записаться на консультацию",
  ctaTo = "/booking",
}: AboutProps = {}) => (
  <section id="about" className="bg-background text-foreground">
    <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
      <div className="grid md:grid-cols-[minmax(0,20rem)_1fr] gap-10 md:gap-16 items-start">
        <motion.div {...fade()} className="flex justify-center md:justify-start md:sticky md:top-24">
          <div className="w-full max-w-xs">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-muted">
              <img
                src={aboutPhoto}
                alt="Психолог Дмитрий Яцко — КПТ и схема-терапия, консультации онлайн и очно"
                className="w-full h-full object-cover object-top"
                loading="lazy"
                decoding="async"
                width={675}
                height={900}
              />
            </div>
            {quote && (
              <blockquote className="mt-5 border-l-2 border-primary pl-4 text-sm leading-relaxed text-muted-foreground italic">
                {quote}
              </blockquote>
            )}
          </div>
        </motion.div>

        <div>
          <motion.p {...fade(0.05)} className="text-sm font-semibold uppercase tracking-wide text-primary">
            Обо мне
          </motion.p>
          <motion.h2 {...fade(0.05)} className="mt-2 text-3xl md:text-4xl font-bold leading-tight">
            {heading}
          </motion.h2>
          <motion.p {...fade(0.1)} className="mt-5 text-base sm:text-lg leading-relaxed text-muted-foreground">
            {text}
          </motion.p>

          <motion.h3 {...fade(0.15)} className="mt-10 text-lg font-semibold">
            Как я работаю
          </motion.h3>
          <motion.ul {...fade(0.15)} className="mt-4 grid gap-4 sm:grid-cols-2">
            {PRINCIPLES.map((p) => (
              <li key={p.title} className="rounded-xl border border-border bg-muted/40 p-5">
                <p className="font-semibold">{p.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
              </li>
            ))}
          </motion.ul>

          <motion.ul {...fade(0.2)} className="mt-6 flex flex-wrap gap-2">
            {chips.map((chip) => (
              <li key={chip} className="rounded-full border border-border px-3 py-1 text-xs sm:text-sm text-muted-foreground">
                {chip}
              </li>
            ))}
          </motion.ul>
          <motion.div {...fade(0.25)} className="mt-8">
            <Button asChild size="lg">
              <Link to={ctaTo} onClick={() => trackContact("about_free_consultation")}>
                {ctaLabel}
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  </section>
);

export default About;
