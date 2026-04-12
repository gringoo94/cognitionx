import { motion } from "framer-motion";
import { Shield, Lock, FileText, Eye } from "lucide-react";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, delay },
});

const items = [
  {
    icon: Lock,
    title: "Конфиденциальность",
    desc: "Всё, что вы рассказываете, остаётся между нами. Я не передаю информацию третьим лицам.",
  },
  {
    icon: Shield,
    title: "Профессиональная этика",
    desc: "Работаю в соответствии с этическими принципами EABCT (Европейская ассоциация КПТ) и АОАППМ.",
  },
  {
    icon: FileText,
    title: "Информированное согласие",
    desc: "Перед началом работы мы обсуждаем формат, условия и ваши права как клиента.",
  },
  {
    icon: Eye,
    title: "Границы компетенций",
    desc: "Если ваш запрос выходит за рамки моей компетенции, я честно скажу об этом и помогу найти нужного специалиста.",
  },
];

const Ethics = () => (
  <section className="bg-foreground text-background">
    <div className="max-w-4xl mx-auto px-6 py-20 md:py-28">
      <motion.div {...fade()} className="text-center mb-14">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Этика и конфиденциальность</h2>
        <p className="mt-3 text-sm opacity-60 max-w-xl mx-auto">
          Безопасность — основа терапевтических отношений
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-6">
        {items.map((item, i) => (
          <motion.div
            key={item.title}
            {...fade(0.06 * i)}
            className="flex gap-4 p-5 rounded-xl border border-background/10"
          >
            <div className="w-10 h-10 rounded-lg bg-background/10 flex items-center justify-center flex-shrink-0">
              <item.icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold mb-1">{item.title}</h3>
              <p className="text-xs leading-relaxed opacity-70">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Ethics;
