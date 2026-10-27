import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Shield, Lock, FileText, Eye } from "lucide-react";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, delay },
});

const expect = [
  "Практические упражнения, которые можно пробовать между встречами",
  "Понятную структуру каждой встречи",
  "Безоценочное, безопасное пространство для разговора",
  "Практику, подобранную с учётом ваших сил",
  "Обсуждение изменений и корректировку плана при необходимости",
];

const dontExpect = [
  "Мгновенное исцеление после одной сессии",
  "Советов «просто не думай об этом»",
  "Давления или осуждения",
  "Требования справляться со всем самостоятельно",
];

const ethics = [
  { icon: Lock, title: "Конфиденциальность", desc: "Содержание встреч конфиденциально. Исключения, связанные с безопасностью и законом, описаны в информированном согласии." },
  { icon: Shield, title: "Профессиональная этика", desc: "Работаю в соответствии с этическими принципами EABCT (Европейская ассоциация КПТ)." },
  { icon: FileText, title: "Информированное согласие", desc: "Перед началом работы мы обсуждаем формат, условия и ваши права как клиента." },
  { icon: Eye, title: "Границы компетенций", desc: "Если ваш запрос выходит за рамки моей компетенции, я честно скажу об этом и помогу найти нужного специалиста." },
];

const tabs = [
  { id: "expect", label: "Чего ожидать" },
  { id: "ethics", label: "Этика и конфиденциальность" },
] as const;

const Expectations = () => {
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("expect");

  return (
    <section className="max-w-4xl mx-auto px-6 py-14 md:py-20">
      <motion.div {...fade()} className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Что ожидать от терапии</h2>
        <p className="text-muted-foreground mt-3 text-sm md:text-base max-w-xl mx-auto">
          Прозрачность и безопасность — основа работы
        </p>
      </motion.div>

      <div role="tablist" className="flex justify-center gap-1 mb-6 rounded-full bg-muted p-1 w-fit mx-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              tab === t.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Both panels stay in the HTML so search engines see all text */}
      <div role="tabpanel" className={tab === "expect" ? "grid md:grid-cols-2 gap-4" : "hidden"}>
        <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
          <h3 className="text-base font-bold mb-4 flex items-center gap-2">
            <Check className="w-5 h-5 text-primary" /> Как будем работать
          </h3>
          <ul className="space-y-2.5">
            {expect.map((e) => (
              <li key={e} className="flex items-start gap-3 text-sm text-muted-foreground">
                <Check className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                {e}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
          <h3 className="text-base font-bold mb-4 flex items-center gap-2">
            <X className="w-5 h-5 text-destructive" /> Чего не стоит ожидать
          </h3>
          <ul className="space-y-2.5">
            {dontExpect.map((e) => (
              <li key={e} className="flex items-start gap-3 text-sm text-muted-foreground">
                <X className="w-4 h-4 mt-0.5 text-destructive/60 flex-shrink-0" />
                {e}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div role="tabpanel" className={tab === "ethics" ? "grid sm:grid-cols-2 gap-4" : "hidden"}>
        {ethics.map((item) => (
          <div key={item.title} className="flex gap-4 p-5 rounded-2xl border border-border bg-card">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <item.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-bold mb-1">{item.title}</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Expectations;
