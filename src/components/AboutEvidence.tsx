import { motion } from "framer-motion";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, delay },
});

const AboutEvidence = () => (
  <section className="bg-primary text-primary-foreground">
    <div className="max-w-3xl mx-auto px-6 py-20 md:py-28 text-center">
      <motion.h2
        {...fade()}
        className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight"
      >
        Доказательный подход
        <br className="hidden sm:block" /> к вашему благополучию
      </motion.h2>
      <motion.p
        {...fade(0.05)}
        className="mt-6 text-sm md:text-base leading-relaxed opacity-85 max-w-2xl mx-auto"
      >
        КПТ — один из самых исследованных методов психотерапии. Я помогаю клиентам разобраться в своих мыслях, 
        эмоциях и поведении, чтобы выстроить здоровое отношение к себе и миру.
      </motion.p>
      <motion.p
        {...fade(0.1)}
        className="mt-4 text-xs md:text-sm opacity-60"
      >
        Вот как устроена работа ↓
      </motion.p>
    </div>
  </section>
);

export default AboutEvidence;
