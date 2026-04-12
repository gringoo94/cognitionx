import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { GraduationCap, Award, Brain, BookOpen } from "lucide-react";

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
      <p className="text-muted-foreground mt-3 text-sm md:text-base max-w-xl mx-auto">
        Прозрачность — часть моей профессиональной этики
      </p>
    </motion.div>

    <motion.div {...fade(0.05)}>
      <Accordion type="multiple" className="space-y-3">
        <AccordionItem value="education" className="border rounded-xl px-5">
          <AccordionTrigger className="hover:no-underline">
            <span className="flex items-center gap-3 text-sm font-semibold">
              <GraduationCap className="w-5 h-5 text-primary" /> Образование
            </span>
          </AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground leading-relaxed space-y-2">
            <p>• МолдГУ, психология (2016); магистратура — клиническая психология</p>
            <p>• Базовый курс КПТ + две ступени специализации по депрессии (CBTLAB, с 2023)</p>
            <p>• Клинические аспекты тревожных, депрессивных и зависимых расстройств (стандарты APA)</p>
            <p>• Курсы и конференции Минского центра КПТ</p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="certs" className="border rounded-xl px-5">
          <AccordionTrigger className="hover:no-underline">
            <span className="flex items-center gap-3 text-sm font-semibold">
              <Award className="w-5 h-5 text-primary" /> Сертификаты и верификация
            </span>
          </AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground leading-relaxed space-y-2">
            <p>• Все дипломы и сертификаты верифицированы платформой <a href="https://www.b17.ru/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">B17.ru</a></p>
            <p>• Практика по международным стандартам <span className="font-medium">EABCT</span>, регулярные супервизии</p>
            <p>• Сооснователь <a href="https://cbtlab.md" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">CBTLAB</a> — первый КПТ-центр в Молдове</p>
            <p>• Основатель <span className="font-medium">Rolelit</span> — тренажёр для психологов</p>
            <p>• Волонтёрская практика в MedHub и Initiativa Pozitiva</p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="methods" className="border rounded-xl px-5">
          <AccordionTrigger className="hover:no-underline">
            <span className="flex items-center gap-3 text-sm font-semibold">
              <Brain className="w-5 h-5 text-primary" /> Методы и подходы
            </span>
          </AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground leading-relaxed space-y-2">
            <p>• КПТ (когнитивно-поведенческая терапия) — основной метод</p>
            <p>• ACT (терапия принятия и ответственности)</p>
            <p>• Схема-терапия</p>
            <p>• Мотивационное интервьюирование (MI)</p>
            <p>• Элементы Smart Recovery при работе с зависимостями</p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="interests" className="border rounded-xl px-5">
          <AccordionTrigger className="hover:no-underline">
            <span className="flex items-center gap-3 text-sm font-semibold">
              <BookOpen className="w-5 h-5 text-primary" /> Профессиональные интересы
            </span>
          </AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground leading-relaxed space-y-2">
            <p>• Доказательная психотерапия и её популяризация</p>
            <p>• Цифровые инструменты для психического здоровья</p>
            <p>• Psychoeducation и self-help на основе КПТ</p>
            <p className="italic mt-2">«Обучение не заканчивается — оно продолжается с каждым новым человеком на сессии»</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </motion.div>
  </section>
);

export default AboutDetailed;
