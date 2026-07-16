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
      "Перейти от глобальной оценки к одному эпизоду: что произошло, что я заметил, как понял ситуацию и что сделал дальше.",
    details:
      "Выберите относительно переносимую ситуацию. Восстановите только те детали, которые помогают увидеть последовательность событий и следующий шаг. Если воспроизведение усиливает дистресс, остановитесь и верните внимание к окружающей обстановке; тяжёлые или травматические эпизоды лучше разбирать со специалистом.",
  },
  absorption: {
    title: "Поглощённость",
    en: "Absorption / Flow",
    short:
      "Вернуть внимание к текущей деятельности и непосредственному опыту — движению, звукам, ощущениям и последовательности действий.",
    details:
      "Вспомните деятельность, в которой вам обычно легче участвовать полностью: готовку, музыку, спорт, разговор или работу руками. Выберите небольшой доступный элемент и попробуйте включиться в него на несколько минут. Это альтернативный режим внимания, а не «физиологический антагонист» руминации и не способ навсегда избегать важной проблемы.",
  },
  compassion: {
    title: "Самосострадание",
    en: "Self-Compassion",
    short:
      "Сменить унижающий тон на поддерживающий, сохраняя ответственность и контакт с реальностью.",
    details:
      "Представьте, каким тоном вы говорили бы с важным человеком в похожей ситуации. Назовите, что было болезненным или ошибочным, и сформулируйте один ответственный следующий шаг без глобальной оценки личности. Самосострадание не означает оправдывать поступок или «думать о хорошем».",
  },
};

const RfcbtModesDiagram = () => {
  const [active, setActive] = useState<TechniqueId | null>("concrete");

  return (
    <div className="my-10 rounded-2xl border border-border bg-card p-5 md:p-8">
      <h3 className="text-center text-sm uppercase tracking-[0.2em] text-muted-foreground mb-6">
        Два режима мышления в RFCBT
      </h3>

      {/* Two modes */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="rounded-xl p-5 text-white" style={{ background: "hsl(12 65% 28%)" }}>
          <div className="text-lg font-semibold">Абстрактно-оценочный режим</div>
          <div className="text-sm opacity-80">обобщает и оценивает</div>
        </div>
        <div className="relative rounded-xl p-5 text-white" style={{ background: "hsl(165 55% 22%)" }}>
          <div className="text-lg font-semibold">Конкретно-ситуативный режим</div>
          <div className="text-sm opacity-80">возвращает к эпизоду и действиям</div>
          <ArrowRight className="hidden md:block absolute -left-7 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="rounded-xl p-5 text-white space-y-3" style={{ background: "hsl(12 60% 22%)" }}>
          <Row label="Вопрос:" value="«Что это говорит обо мне и моей жизни?»" />
          <Row label="Фокус:" value="значения, оценки, широкие последствия" />
          <Row
            label="Возможный эффект:"
            value="глобальные выводы, застревание, меньше ясности о следующем действии"
          />
        </div>
        <div className="rounded-xl p-5 text-white space-y-3" style={{ background: "hsl(165 50% 18%)" }}>
          <Row label="Вопрос:" value="«Что произошло в этой ситуации и что я могу сделать дальше?»" />
          <Row label="Фокус:" value="наблюдаемые детали, последовательность, контекст, следующий шаг" />
          <Row
            label="Возможный эффект:"
            value="более точное понимание и возвращение к решению задачи"
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
              aria-pressed={isActive}
              className={`text-left rounded-xl p-5 text-white transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
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
        нажмите на технику, чтобы узнать больше
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
