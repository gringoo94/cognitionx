import { motion } from "framer-motion";
import aboutPhotoAsset from "@/assets/about-photo.jpg.asset.json";

const aboutPhoto = aboutPhotoAsset.url;


const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, delay },
});

const About = () => (
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
            Обо мне
          </motion.h2>
          <motion.blockquote
            {...fade(0.1)}
            className="mt-6 text-base sm:text-lg md:text-xl leading-relaxed opacity-80 italic"
          >
            «Каждый человек способен измениться — нужно только безопасное пространство и подходящие инструменты».
          </motion.blockquote>
          <motion.p {...fade(0.15)} className="mt-5 text-xs sm:text-sm opacity-50">
            Меня зовут Дмитрий. Я психолог, работаю в КПТ и схема-терапии — методах с доказанной эффективностью.
          </motion.p>
        </div>
      </div>
    </div>
  </section>
);

export default About;
