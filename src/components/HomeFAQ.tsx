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

import { homeFaq, homeFaqSchema } from "@/data/homeSchemas";

export { homeFaq, homeFaqSchema };

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
