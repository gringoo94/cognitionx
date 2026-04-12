import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Laptop, User, CreditCard, ClipboardList } from "lucide-react";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, delay },
});

const SessionPrep = () => (
  <section className="bg-card border-y border-border">
    <div className="max-w-3xl mx-auto px-6 py-20 md:py-28">
      <motion.div {...fade()} className="text-center mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Памятка перед первой встречей</h2>
        <p className="text-muted-foreground mt-3 text-sm md:text-base max-w-xl mx-auto">
          Чтобы первая сессия прошла комфортно
        </p>
      </motion.div>

      <motion.div {...fade(0.05)}>
        <Accordion type="multiple" className="space-y-3">
          <AccordionItem value="tech" className="border rounded-xl px-5">
            <AccordionTrigger className="hover:no-underline">
              <span className="flex items-center gap-3 text-sm font-semibold">
                <Laptop className="w-5 h-5 text-primary" /> Техническая подготовка
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground leading-relaxed space-y-2">
              <p>• Сессии проходят в Zoom или Google Meet</p>
              <p>• Убедитесь, что камера и микрофон работают</p>
              <p>• Выберите тихое место, где вас не будут отвлекать</p>
              <p>• Стабильное интернет-соединение</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="personal" className="border rounded-xl px-5">
            <AccordionTrigger className="hover:no-underline">
              <span className="flex items-center gap-3 text-sm font-semibold">
                <User className="w-5 h-5 text-primary" /> Личная готовность
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground leading-relaxed space-y-2">
              <p>• Не нужно «готовить речь» — приходите как есть</p>
              <p>• Можно заранее подумать о том, что вас беспокоит</p>
              <p>• Если волнуетесь — это нормально, мы начнём мягко</p>
              <p>• Первая встреча — знакомство, не лечение</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="what-to-expect" className="border rounded-xl px-5">
            <AccordionTrigger className="hover:no-underline">
              <span className="flex items-center gap-3 text-sm font-semibold">
                <ClipboardList className="w-5 h-5 text-primary" /> Что будет на первой встрече
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground leading-relaxed space-y-2">
              <p>• Познакомимся и обсудим ваш запрос</p>
              <p>• Я задам уточняющие вопросы, чтобы понять ситуацию</p>
              <p>• Объясню, как работает КПТ применительно к вашему случаю</p>
              <p>• Вместе решим, подходит ли вам этот формат работы</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="payment" className="border rounded-xl px-5">
            <AccordionTrigger className="hover:no-underline">
              <span className="flex items-center gap-3 text-sm font-semibold">
                <CreditCard className="w-5 h-5 text-primary" /> Оплата и организация
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground leading-relaxed space-y-2">
              <p>• Оплата производится до сессии</p>
              <p>• Отмена или перенос — минимум за 24 часа</p>
              <p>• Длительность первой встречи — 50 минут</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </motion.div>
    </div>
  </section>
);

export default SessionPrep;
