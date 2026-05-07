import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, delay },
});

export const homeFaq = [
  {
    question: "Что такое когнитивно-поведенческая терапия (КПТ)?",
    answer: "КПТ — один из самых исследованных методов психотерапии. Основная идея: не ситуация определяет наши эмоции, а то, как мы её интерпретируем. В КПТ мы работаем с мыслями, эмоциями и поведением — конкретно, структурированно, с измеримыми результатами.",
  },
  {
    question: "Как проходит первая консультация?",
    answer: "Первая сессия — это знакомство и диагностика. Мы обсудим ваш запрос, я задам уточняющие вопросы, проведу первичную оценку состояния и предложу план работы. Длительность — 50 минут. Никакой подготовки не нужно.",
  },
  {
    question: "Сколько стоит консультация?",
    answer: "Первая встреча-знакомство (15 минут) — бесплатно. Полная первая консультация — 25 €. Регулярная сессия — 30 €. Пакет из 4 сессий — 100 € (25 € за сессию). Длительность — 50 минут. Оплата до сессии.",
  },
  {
    question: "Онлайн-терапия действительно работает?",
    answer: "Да. Десятки мета-анализов подтверждают: онлайн-КПТ по эффективности сопоставима с очной терапией при депрессии, тревоге и панических атаках. Вам нужны только стабильный интернет и тихое место.",
  },
  {
    question: "Сколько сессий нужно для результата?",
    answer: "Зависит от проблемы. Обычно 8–20 сессий. При панических атаках — 8–12 сессий. При депрессии — 12–20. Первые улучшения часто заметны через 4–6 сессий. Точнее скажу после первичной консультации.",
  },
  {
    question: "С какими проблемами вы работаете?",
    answer: "Депрессия, тревожные расстройства, панические атаки, выгорание, созависимость, прокрастинация, синдром самозванца, социальная тревожность. Основной метод — КПТ.",
  },
  {
    question: "Чем КПТ отличается от других видов терапии?",
    answer: "КПТ — краткосрочная, структурированная терапия с домашними заданиями и измеримым прогрессом. Вы понимаете, что происходит на каждой сессии. Это не просто разговоры — это тренировка новых навыков мышления и поведения.",
  },
  {
    question: "Нужно ли мне принимать лекарства?",
    answer: "Это решение принимает врач-психиатр, не психолог. КПТ эффективна как самостоятельный метод при лёгкой и умеренной депрессии/тревоге. При тяжёлых состояниях комбинация с медикаментами даёт лучший результат. При необходимости направлю к специалисту.",
  },
  {
    question: "Я не уверен, что мне нужен психолог. Как понять?",
    answer: "Если что-то мешает вам жить — плохое настроение, тревога, отсутствие энергии, проблемы в отношениях — и это длится больше двух недель, стоит попробовать. Первая сессия поможет разобраться, нужна ли вам терапия.",
  },
  {
    question: "Как записаться на консультацию?",
    answer: "Напишите мне в Telegram (@gringoo94) или заполните форму на сайте. Я свяжусь с вами в течение дня и мы договоримся о времени.",
  },
];

export const homeFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: homeFaq.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

const HomeFAQ = () => (
  <section id="faq" className="max-w-3xl mx-auto px-6 py-20 md:py-28">
    <motion.h2
      {...fade()}
      className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-center"
    >
      Частые <span className="text-primary">вопросы</span>
    </motion.h2>
    <motion.p
      {...fade(0.05)}
      className="mt-3 text-sm text-muted-foreground text-center max-w-lg mx-auto"
    >
      Ответы на вопросы, которые чаще всего задают перед первой консультацией
    </motion.p>

    <motion.div {...fade(0.1)} className="mt-10">
      <Accordion type="single" collapsible className="space-y-3">
        {homeFaq.map((faq, i) => (
          <AccordionItem
            key={i}
            value={`faq-${i}`}
            className="border border-border rounded-xl px-5 data-[state=open]:border-primary/20 transition-colors"
          >
            <AccordionTrigger className="text-sm font-medium text-left py-4 hover:no-underline">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </motion.div>
  </section>
);

export default HomeFAQ;
