import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

type TechniqueId = "concrete" | "absorption" | "compassion";

const techniques: Record<
  TechniqueId,
  { title: string; en: string; short: string; details: string }
> = {
  concrete: {
    title: "Конкретизация",
    en: "Becoming Concrete",
    short:
      "Переформулировать вопросы «почему» → «как, что, когда». Образно воссоздать ситуацию секунда за секундой. If-Then план как замена.",
    details:
      "Закройте глаза и вспомните момент руминации как будто он происходит прямо сейчас. Опишите следующие 10 минут как сцену из фильма: что именно произошло, кто что сказал, где были руки. Это разворачивает мышление из оценочного («я плохой») в процессуальное («вот что именно случилось»).",
  },
  absorption: {
    title: "Поглощение",
    en: "Absorption / Flow",
    short:
      "Образно воссоздать состояние «потока». Пиковые переживания полного погружения как контр-руминация.",
    details:
      "Запишите 5 воспоминаний, когда вы были полностью поглощены деятельностью — готовка, спорт, музыка, разговор, работа руками. Используйте их образно как «якорь» при появлении триггеров. Absorption — прямой физиологический антагонист руминации, а не просто отвлечение.",
  },
  compassion: {
    title: "Сострадание",
    en: "Self-Compassion",
    short:
      "Образно воссоздать момент заботы о другом или о себе. Выйти из самокритики в тёплый режим.",
    details:
      "Воссоздайте момент, когда вы были добры к кому-то важному или к себе. Не «думай о хорошем» — а конкретная работа с переключением режима через телесно-эмоциональный образ: тон голоса, поза, тепло в груди. Источник — работа Пола Гилберта (CFT), встроенная в RFCBT.",
  },
};

const RfcbtModesDiagram = () => {
  const [active, setActive] = useState<TechniqueId | null>(null);

  return (
    <div className="my-10 rounded-2xl border border-border bg-card p-5 md:p-8">
      <h3 className="text-center text-sm uppercase tracking-[0.2em] text-muted-foreground mb-6">
        Два режима мышления в RFCBT
      </h3>

      {/* Two modes */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="rounded-xl p-5 text-white" style={{ background: "hsl(12 65% 28%)" }}>
          <div className="text-lg font-semibold">Абстрактный режим</div>
          <div className="text-sm opacity-80">дезадаптивный, бесплодный</div>
        </div>
        <div className="relative rounded-xl p-5 text-white" style={{ background: "hsl(165 55% 22%)" }}>
          <div className="text-lg font-semibold">Конкретный режим</div>
          <div className="text-sm opacity-80">адаптивный, конструктивный</div>
          <ArrowRight className="hidden md:block absolute -left-7 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="rounded-xl p-5 text-white space-y-3" style={{ background: "hsl(12 60% 22%)" }}>
          <Row label="Вопрос:" value="«Почему это происходит со мной?»" />
          <Row label="Фокус:" value="значения, оценка, последствия" />
          <Row
            label="Эффект:"
            value="обобщения, застревание, ↑ депрессия, ухудшение памяти и problem-solving"
          />
        </div>
        <div className="rounded-xl p-5 text-white space-y-3" style={{ background: "hsl(165 50% 18%)" }}>
          <Row label="Вопрос:" value="«Как именно это произошло?»" />
          <Row label="Фокус:" value="конкретные детали, контекст, шаги" />
          <Row
            label="Эффект:"
            value="решение задач, снижение руминации, эмоциональная устойчивость"
          />
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border my-6" />

      <h3 className="text-center text-sm uppercase tracking-[0.2em] text-muted-foreground mb-6">
        Три техники переключения
      </h3>

      <div className="grid md:grid-cols-3 gap-4">
        {(Object.keys(techniques) as TechniqueId[]).map((id) => {
          const t = techniques[id];
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => setActive(isActive ? null : id)}
              className={`text-left rounded-xl p-5 text-white transition-all ${
                isActive ? "ring-2 ring-primary scale-[1.01]" : "hover:brightness-110"
              }`}
              style={{ background: "hsl(252 45% 35%)" }}
            >
              <div className="text-lg font-semibold">{t.title}</div>
              <div className="text-sm opacity-80 mb-3">{t.en}</div>
              <div
                className="rounded-lg p-3 text-sm leading-relaxed"
                style={{ background: "hsl(0 0% 18%)" }}
              >
                {t.short}
              </div>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 rounded-xl border border-primary/30 bg-primary/5 p-5 text-sm leading-relaxed text-foreground">
              <div className="font-semibold mb-2">
                {techniques[active].title} — как делать
              </div>
              {techniques[active].details}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-center text-xs text-muted-foreground mt-4">
        нажми на технику, чтобы узнать больше
      </p>
    </div>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <div>
    <div className="font-semibold text-sm">{label}</div>
    <div className="text-sm opacity-90">{value}</div>
  </div>
);

export default RfcbtModesDiagram;
