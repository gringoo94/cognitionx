import { useRef, useEffect, useState, useCallback } from "react";

interface EmotionCategory {
  label: string[];
  color: string;
  tc: string;
  emotions: string[];
  hint: string;
}

const DATA: EmotionCategory[] = [
  { label: ["Things aren't", "what they seem"], color: "#c8b0e0", tc: "#5a3585",
    emotions: ["Nostalgia", "Cognitive dissonance", "Paradox", "Irony", "Sarcasm", "Schadenfreude", "Freudenfreude"],
    hint: "Feelings that arise when reality and expectation don't match." },
  { label: ["We fall", "short"], color: "#d8a8cc", tc: "#7a2a60",
    emotions: ["Shame", "Self-compassion", "Perfectionism", "Guilt", "Embarrassment", "Humiliation", "Amusement", "Bittersweetness"],
    hint: "Emotions tied to measuring ourselves against a standard — and finding a gap." },
  { label: ["We search", "for connection"], color: "#a0c8a0", tc: "#2a5a2a",
    emotions: ["Loneliness", "Invisibility", "Insecurity", "Disconnection", "Connection", "Fitting in", "Belonging"],
    hint: "The longing to be seen, known and accepted by others." },
  { label: ["To", "self-assess"], color: "#f0c87a", tc: "#7a5000",
    emotions: ["Humility", "Hubris", "Pride"],
    hint: "How we evaluate our own worth, ability and place in the world." },
  { label: ["Life is", "good"], color: "#f5a050", tc: "#7a3800",
    emotions: ["Joy", "Happiness", "Calm", "Contentment", "Gratitude", "Foreboding joy", "Relief", "Tranquility"],
    hint: "Positive states — some carry the shadow of fearing their loss." },
  { label: ["We're with", "others"], color: "#b0cce0", tc: "#1a4060",
    emotions: ["Comparative suffering", "Hurt", "Boundaries", "Sympathy", "Empathy", "Pity", "Compassion"],
    hint: "Emotions that arise specifically in response to other people's pain." },
  { label: ["The heart", "is open"], color: "#e8a898", tc: "#7a2a1a",
    emotions: ["Love", "Lovelessness", "Defensiveness", "Betrayal", "Self-trust", "Heartbreak", "Flooding", "Trust"],
    hint: "At the intersection of vulnerability and intimacy." },
  { label: ["We feel", "wronged"], color: "#e8c840", tc: "#6a5000",
    emotions: ["Anger", "Contempt", "Disgust", "Dehumanization", "Hate", "Self-righteousness"],
    hint: "Moral emotions signalling a perceived violation of fairness or dignity." },
  { label: ["Things don't", "go as planned"], color: "#b0c890", tc: "#3a5020",
    emotions: ["Frustration", "Resignation", "Discouragement", "Regret", "Expectations", "Disappointment", "Boredom"],
    hint: "When outcomes diverge from what we hoped, planned or needed." },
  { label: ["It's beyond", "us"], color: "#80b8a8", tc: "#1a5040",
    emotions: ["Surprise", "Interest", "Curiosity", "Confusion", "Wonder", "Awe"],
    hint: "Expansive emotions that open us to something larger than ourselves." },
  { label: ["We're", "hurting"], color: "#88bc90", tc: "#1a4a28",
    emotions: ["Grief", "Sadness", "Despair", "Hopelessness", "Anguish"],
    hint: "The deep pain emotions — often the most isolating to carry alone." },
  { label: ["Things are", "uncertain"], color: "#e08080", tc: "#7a1a1a",
    emotions: ["Stress", "Overwhelm", "Anxiety", "Worry", "Avoidance", "Excitement", "Dread", "Fear", "Vulnerability"],
    hint: "Our nervous system's response to threat, real or imagined." },
  { label: ["We", "compare"], color: "#e8a858", tc: "#7a4000",
    emotions: ["Jealousy", "Envy", "Resentment", "Admiration", "Reverence", "Comparison"],
    hint: "Social comparison cuts both ways — it can diminish or inspire." },
];

const SIZE = 660;
const CX = 330;
const CY = 330;
const R_IN = 58;
const R_CAT_IN = 118;
const R_CAT_OUT = 214;
const R_EM_OUT = 322;
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
        radialText(ctx, [d.emotions[j]], emid, (R_CAT_OUT + R_EM_OUT) / 2, 8.5, d.tc);
      }

      radialText(ctx, d.label, mid, (R_CAT_IN + R_CAT_OUT) / 2, 9.5, active ? lighter(d.tc, 30) : d.tc, 13);
    }

    // Inner circles
    ctx.beginPath();
    ctx.arc(CX, CY, R_CAT_IN, 0, 2 * Math.PI);
    ctx.fillStyle = "#f7f6f3";
    ctx.fill();
    ctx.strokeStyle = "rgba(55,53,47,.08)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(CX, CY, R_IN, 0, 2 * Math.PI);
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    ctx.font = "600 10px Inter,system-ui,sans-serif";
    ctx.fillStyle = "#73726d";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("THE PLACES", CX, CY - 13);
    ctx.fillText("WE GO", CX, CY);
    ctx.fillText("WHEN...", CX, CY + 13);
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
