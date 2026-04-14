import { useRef, useEffect, useState, useCallback } from "react";

interface EmotionCategory {
  label: string[];
  color: string;
  tc: string;
  emotions: string[];
  hint: string;
}

const DATA: EmotionCategory[] = [
  { label: ["Всё не то,", "чем кажется"], color: "#c8b0e0", tc: "#5a3585",
    emotions: ["Ностальгия", "Когнитивный диссонанс", "Парадокс", "Ирония", "Сарказм", "Злорадство", "Сорадование"],
    hint: "Чувства, возникающие когда реальность не совпадает с ожиданиями." },
  { label: ["Мы не", "дотягиваем"], color: "#d8a8cc", tc: "#7a2a60",
    emotions: ["Стыд", "Самосострадание", "Перфекционизм", "Вина", "Неловкость", "Унижение", "Веселье", "Горько-сладкое чувство"],
    hint: "Эмоции, связанные с оценкой себя по стандарту — и обнаружением разрыва." },
  { label: ["Мы ищем", "связь"], color: "#a0c8a0", tc: "#2a5a2a",
    emotions: ["Одиночество", "Ощущение невидимости", "Неуверенность в себе", "Отчуждённость", "Близость", "Желание вписаться", "Принадлежность"],
    hint: "Стремление быть увиденным, понятым и принятым другими." },
  { label: ["Оценка", "себя"], color: "#f0c87a", tc: "#7a5000",
    emotions: ["Смирение", "Высокомерие", "Гордость"],
    hint: "Как мы оцениваем собственную ценность, способности и место в мире." },
  { label: ["Жизнь", "хороша"], color: "#f5a050", tc: "#7a3800",
    emotions: ["Радость", "Счастье", "Спокойствие", "Удовлетворённость", "Благодарность", "Тревожная радость", "Облегчение", "Умиротворение"],
    hint: "Позитивные состояния — некоторые несут в себе тень страха их потерять." },
  { label: ["Мы рядом", "с другими"], color: "#b0cce0", tc: "#1a4060",
    emotions: ["Сравнение страданий", "Обида", "Границы", "Сочувствие", "Эмпатия", "Жалость", "Сострадание"],
    hint: "Эмоции, возникающие в ответ на боль других людей." },
  { label: ["Сердце", "открыто"], color: "#e8a898", tc: "#7a2a1a",
    emotions: ["Любовь", "Отсутствие любви", "Защитная реакция", "Предательство", "Доверие к себе", "Разбитое сердце", "Эмоц. захлёстывание", "Доверие"],
    hint: "На пересечении уязвимости и близости." },
  { label: ["Нас", "обидели"], color: "#e8c840", tc: "#6a5000",
    emotions: ["Гнев", "Презрение", "Отвращение", "Обесчеловечивание", "Ненависть", "Праведный гнев"],
    hint: "Моральные эмоции, сигнализирующие о нарушении справедливости или достоинства." },
  { label: ["Всё идёт", "не по плану"], color: "#b0c890", tc: "#3a5020",
    emotions: ["Фрустрация", "Покорность судьбе", "Уныние", "Сожаление", "Ожидания", "Разочарование", "Скука"],
    hint: "Когда результаты расходятся с тем, на что мы надеялись или что планировали." },
  { label: ["Это больше", "нас"], color: "#80b8a8", tc: "#1a5040",
    emotions: ["Удивление", "Интерес", "Любопытство", "Замешательство", "Изумление", "Благоговение"],
    hint: "Расширяющие эмоции, открывающие нас чему-то большему." },
  { label: ["Нам", "больно"], color: "#88bc90", tc: "#1a4a28",
    emotions: ["Горе", "Печаль", "Отчаяние", "Безнадёжность", "Душевная боль"],
    hint: "Глубокие болезненные эмоции — часто самые изолирующие." },
  { label: ["Всё", "неопределённо"], color: "#e08080", tc: "#7a1a1a",
    emotions: ["Стресс", "Перегруженность", "Тревога", "Беспокойство", "Избегание", "Возбуждение", "Предчувствие беды", "Страх", "Уязвимость"],
    hint: "Реакция нервной системы на угрозу — реальную или воображаемую." },
  { label: ["Мы", "сравниваем"], color: "#e8a858", tc: "#7a4000",
    emotions: ["Ревность", "Зависть", "Горькая обида", "Восхищение", "Почтение", "Сравнение"],
    hint: "Социальное сравнение работает в обе стороны — может подавлять или вдохновлять." },
];

const SIZE = 740;
const CX = 370;
const CY = 370;
const R_IN = 62;
const R_CAT_IN = 62;
const R_CAT_OUT = 214;
const R_EM_OUT = 360;
const N = DATA.length;
const SLICE = (2 * Math.PI) / N;
const START = -Math.PI / 2;

function lighter(hex: string, amt: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, (n >> 16) + amt);
  const g = Math.min(255, ((n >> 8) & 255) + amt);
  const b = Math.min(255, (n & 255) + amt);
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
}

function wedge(ctx: CanvasRenderingContext2D, a1: number, a2: number, r1: number, r2: number, fill: string) {
  ctx.beginPath();
  ctx.arc(CX, CY, r2, a1, a2);
  ctx.arc(CX, CY, r1, a2, a1, true);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,.75)";
  ctx.lineWidth = 1.2;
  ctx.stroke();
}

function radialText(ctx: CanvasRenderingContext2D, lines: string[], midA: number, midR: number, fs: number, color: string, lh?: number) {
  ctx.save();
  ctx.translate(CX, CY);
  ctx.rotate(midA);
  ctx.font = `600 ${fs}px Inter,system-ui,sans-serif`;
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const lhh = lh || fs * 1.32;
  for (let i = 0; i < lines.length; i++) {
    const yo = (i - (lines.length - 1) / 2) * lhh;
    ctx.fillText(lines[i], midR, yo);
  }
  ctx.restore();
}

function getIdx(x: number, y: number): number {
  const dx = x - CX;
  const dy = y - CY;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist < R_CAT_IN || dist > R_EM_OUT) return -1;
  const ang = Math.atan2(dy, dx);
  const rel = (ang - START + 4 * Math.PI) % (2 * Math.PI);
  return Math.floor(rel / SLICE) % N;
}

const EmotionWheel = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selected, setSelected] = useState(-1);
  const [hovered, setHovered] = useState(-1);

  const draw = useCallback((sel: number, hov: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, SIZE, SIZE);

    for (let i = 0; i < N; i++) {
      const d = DATA[i];
      const a1 = START + i * SLICE;
      const a2 = a1 + SLICE;
      const mid = a1 + SLICE / 2;
      const active = i === sel || i === hov;

      const catFill = active ? lighter(d.color, 38) : d.color;
      wedge(ctx, a1, a2, R_CAT_IN, R_CAT_OUT, catFill);

      const ne = d.emotions.length;
      for (let j = 0; j < ne; j++) {
        const ea1 = a1 + (j * SLICE) / ne;
        const ea2 = ea1 + SLICE / ne;
        const emFill = active ? lighter(d.color, 65) : lighter(d.color, 32);
        wedge(ctx, ea1, ea2, R_CAT_OUT, R_EM_OUT, emFill);
        const emid = ea1 + SLICE / ne / 2;
        radialText(ctx, [d.emotions[j]], emid, (R_CAT_OUT + R_EM_OUT) / 2, 11.5, d.tc);
      }

      radialText(ctx, d.label, mid, (R_CAT_IN + R_CAT_OUT) / 2, 12, active ? lighter(d.tc, 30) : d.tc, 15);
    }

    // Center circle
    ctx.beginPath();
    ctx.arc(CX, CY, R_IN, 0, 2 * Math.PI);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.strokeStyle = "rgba(55,53,47,.08)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.font = "600 12px Inter,system-ui,sans-serif";
    ctx.fillStyle = "#73726d";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("КУДА МЫ", CX, CY - 15);
    ctx.fillText("УХОДИМ,", CX, CY);
    ctx.fillText("КОГДА...", CX, CY + 15);
  }, []);

  useEffect(() => {
    draw(selected, hovered);
  }, [selected, hovered, draw]);

  const getPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const r = canvas.getBoundingClientRect();
    const sc = SIZE / r.width;
    const src = "touches" in e ? e.touches[0] : e;
    return { x: (src.clientX - r.left) * sc, y: (src.clientY - r.top) * sc };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const p = getPos(e);
    const idx = getIdx(p.x, p.y);
    if (idx !== hovered) setHovered(idx);
    const canvas = canvasRef.current;
    if (canvas) canvas.style.cursor = idx >= 0 ? "pointer" : "default";
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const p = getPos(e);
    const idx = getIdx(p.x, p.y);
    if (idx < 0) return;
    setSelected((prev) => (prev === idx ? -1 : idx));
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const p = getPos(e);
    const idx = getIdx(p.x, p.y);
    if (idx < 0) return;
    setSelected((prev) => (prev === idx ? -1 : idx));
  };

  const selectedData = selected >= 0 ? DATA[selected] : null;

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-2">
        Колесо эмоций
      </h2>
      <p className="text-muted-foreground mb-8">
        Нажмите на любой сектор, чтобы узнать больше об эмоциях в этой категории.
      </p>

      <div className="w-full max-w-[660px] mx-auto">
        <canvas
          ref={canvasRef}
          width={SIZE}
          height={SIZE}
          className="w-full h-auto block cursor-pointer"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHovered(-1)}
          onClick={handleClick}
          onTouchStart={handleTouchStart}
        />
      </div>

      <div className="max-w-[660px] mx-auto mt-4 min-h-[56px]">
        {!selectedData ? (
          <p className="text-sm text-muted-foreground text-center leading-relaxed">
            Нажми на любой сектор, чтобы увидеть эмоции
          </p>
        ) : (
          <div>
            <div className="flex items-center gap-2.5 mb-3 pb-2.5 border-b border-border">
              <div
                className="w-3.5 h-3.5 rounded-full shrink-0"
                style={{ background: selectedData.color }}
              />
              <h3 className="text-base font-medium text-foreground leading-tight">
                {selectedData.label.join(" ")}
              </h3>
            </div>
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
              {selectedData.hint}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {selectedData.emotions.map((em) => (
                <span
                  key={em}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{
                    background: lighter(selectedData.color, 42),
                    color: selectedData.tc,
                    borderColor: lighter(selectedData.color, 10),
                    borderWidth: "0.5px",
                    borderStyle: "solid",
                  }}
                >
                  {em}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmotionWheel;
