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
  "Я клинический психолог, работаю в КПТ и схема-терапии. Ко мне приходят с тревогой, апатией и выгоранием — когда сил тянуть дальше уже нет. Мы разбираем, что именно вас держит, и шаг за шагом собираем опору. Без оценок и советов «просто соберись».";

const DEFAULT_QUOTE =
  "«Каждый человек способен измениться — нужно только безопасное пространство и подходящие инструменты».";

const About = ({
  heading = "Меня зовут Дмитрий",
  text = DEFAULT_TEXT,
  quote = DEFAULT_QUOTE,
  chips = ["КПТ", "Схема-терапия", "Регулярная супервизия", "Онлайн и очно"],
  ctaLabel = "Бесплатное знакомство 20 минут",
  ctaTo = "/free-consultation",
}: AboutProps = {}) => (
  <section id="about" className="bg-foreground text-background">
    <div className="max-w-5xl mx-auto px-6 py-20 md:py-28">
      <div className="grid md:grid-cols-[minmax(0,18rem)_1fr] gap-10 md:gap-14 items-center">
        {/* Фото */}
        <motion.div {...fade()} className="flex justify-center md:justify-start">
          <div className="relative">
            <div className="absolute -inset-3 rounded-3xl bg-primary/20 blur-2xl" />
            <div className="relative w-56 h-64 sm:w-64 sm:h-80 md:w-72 md:h-[22rem] rounded-3xl overflow-hidden shadow-2xl">
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
          </div>
        </motion.div>

        {/* Текст */}
        <div className="text-center md:text-left">
          <motion.h2
            {...fade(0.05)}
            className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight"
          >
            {heading}
          </motion.h2>
          <motion.p
            {...fade(0.1)}
            className="mt-5 text-base sm:text-lg leading-relaxed opacity-80"
          >
            {text}
          </motion.p>
          {quote && (
            <motion.blockquote
              {...fade(0.15)}
              className="mt-6 text-sm sm:text-base leading-relaxed opacity-60 italic"
            >
              {quote}
            </motion.blockquote>
          )}

          <motion.ul
            {...fade(0.2)}
            className="mt-6 flex flex-wrap justify-center md:justify-start gap-2"
          >
            {chips.map((chip) => (
              <li
                key={chip}
                className="rounded-full border border-background/25 px-3 py-1 text-xs sm:text-sm opacity-80"
              >
                {chip}
              </li>
            ))}
          </motion.ul>
          <motion.div {...fade(0.25)} className="mt-8">
            <Button asChild size="lg" variant="secondary">
              <Link
                to={ctaTo}
                onClick={() => trackContact("about_free_consultation")}
              >
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
