import { motion } from "framer-motion";
import { GraduationCap, Award, BookOpen, Globe } from "lucide-react";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, delay },
});

const AboutDetailed = () => (
  <section className="max-w-3xl mx-auto px-6 py-20 md:py-28">
    <motion.div {...fade()} className="text-center mb-12">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Образование и профессиональное развитие</h2>
      <p className="text-muted-foreground mt-4 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
        Все дипломы и сертификаты моей профессиональной подготовки проверены и верифицированы платформой{" "}
        <a href="https://www.b17.ru/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">B17</a>,
        что подтверждает их подлинность и соответствие международным стандартам.
      </p>
    </motion.div>

    <div className="space-y-6">
      <motion.div {...fade(0.05)} className="flex gap-4 p-5 rounded-xl border border-border bg-card">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <GraduationCap className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-bold mb-1">Базовое образование</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Я окончил Молдавский государственный университет по специальности психология в 2016 и продолжаю обучение в магистратуре по клинической психологии. С первых лет практики меня особенно привлекла когнитивно-поведенческая терапия — за её сочетание структуры, научной точности и человеческого подхода.
          </p>
        </div>
      </motion.div>

      <motion.div {...fade(0.1)} className="flex gap-4 p-5 rounded-xl border border-border bg-card">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Award className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-bold mb-1">Специализация в КПТ</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            С 2023 года прохожу обучение в Когнитивно-поведенческой лаборатории{" "}
            <a href="https://cbtlab.md" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">CBTLAB</a>{" "}
            Дениса Иванова, где завершил базовый курс КПТ и две ступени специализации по работе с депрессией.
          </p>
        </div>
      </motion.div>

      <motion.div {...fade(0.15)} className="flex gap-4 p-5 rounded-xl border border-border bg-card">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <BookOpen className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-bold mb-1">Непрерывное обучение</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Дополнительно изучаю клинические аспекты тревожных, депрессивных и зависимых расстройств по стандартам American Psychological Association (APA). Регулярно участвую в курсах и конференциях Минского центра когнитивно-поведенческой терапии, что помогает быть в курсе современных направлений и практик.
          </p>
        </div>
      </motion.div>

      <motion.div {...fade(0.2)} className="flex gap-4 p-5 rounded-xl border border-border bg-card">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Globe className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-bold mb-1">Стандарты и супервизия</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            В своей практике я опираюсь на международные стандарты EABCT, прохожу супервизии и участвую в профессиональных обучающих группах.
          </p>
        </div>
      </motion.div>
    </div>

    <motion.p {...fade(0.25)} className="text-center text-sm text-muted-foreground mt-10 italic opacity-70 max-w-xl mx-auto">
      Верю, что в психологии обучение не заканчивается: оно продолжается с каждым новым человеком, который приходит на сессию.
    </motion.p>
  </section>
);

export default AboutDetailed;
