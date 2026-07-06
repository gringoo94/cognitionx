import { useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Phase = "inhale" | "hold-in" | "exhale" | "hold-out";

type Pattern = {
  id: string;
  name: string;
  short: string;
  description: string;
  phases: Partial<Record<Phase, number>>;
  recommended?: boolean;
};

const PATTERNS: Pattern[] = [
  {
    id: "4-6",
    name: "Простая: 4 — 6",
    short: "4-6",
    description: "Вдох 4 счёта, выдох 6. Без задержек. Универсально при тревоге.",
    phases: { inhale: 4, exhale: 6 },
    recommended: true,
  },
  {
    id: "4-7-8",
    name: "4 — 7 — 8",
    short: "4-7-8",
    description: "Вдох 4, пауза 7, выдох 8. Сильнее замедляет пульс. Не подходит, если задержка неприятна.",
    phases: { inhale: 4, "hold-in": 7, exhale: 8 },
  },
  {
    id: "box",
    name: "Квадрат: 4 — 4 — 4 — 4",
    short: "4-4-4-4",
    description: "Равные фазы. Подходит для концентрации, но при острой тревоге лучше 4-6.",
    phases: { inhale: 4, "hold-in": 4, exhale: 4, "hold-out": 4 },
  },
];

const PHASE_LABEL: Record<Phase, string> = {
  inhale: "Вдох",
  "hold-in": "Задержка",
  exhale: "Выдох",
  "hold-out": "Пауза",
};

const PHASE_ORDER: Phase[] = ["inhale", "hold-in", "exhale", "hold-out"];

function useBeep() {
  const ctxRef = useRef<AudioContext | null>(null);
  return (freq: number) => {
    try {
      if (!ctxRef.current) {
        ctxRef.current = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
      }
      const ctx = ctxRef.current;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = freq;
      g.gain.value = 0.0001;
      o.connect(g);
      g.connect(ctx.destination);
      const now = ctx.currentTime;
      g.gain.exponentialRampToValueAtTime(0.08, now + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
      o.start(now);
      o.stop(now + 0.2);
    } catch {
      /* ignore */
    }
  };
}

const BreathingExercise = () => {
  const [patternId, setPatternId] = useState<string>("4-6");
  const [running, setRunning] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [phase, setPhase] = useState<Phase>("inhale");
  const [elapsedInPhase, setElapsedInPhase] = useState(0); // seconds
  const [cycles, setCycles] = useState(0);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const beep = useBeep();

  const pattern = useMemo(
    () => PATTERNS.find((p) => p.id === patternId) ?? PATTERNS[0],
    [patternId],
  );

  const activePhases = useMemo(
    () => PHASE_ORDER.filter((p) => (pattern.phases[p] ?? 0) > 0),
    [pattern],
  );

  const currentDuration = pattern.phases[phase] ?? 0;

  // Animation loop
  useEffect(() => {
    if (!running) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTsRef.current = null;
      return;
    }
    const step = (ts: number) => {
      if (lastTsRef.current === null) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;
      setElapsedInPhase((prev) => {
        const next = prev + dt;
        const dur = pattern.phases[phase] ?? 0;
        if (next >= dur) {
          const idx = activePhases.indexOf(phase);
          const nextPhase = activePhases[(idx + 1) % activePhases.length];
          if (nextPhase === activePhases[0]) {
            setCycles((c) => c + 1);
          }
          setPhase(nextPhase);
          if (soundOn) beep(nextPhase === "exhale" ? 330 : 440);
          return 0;
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [running, phase, pattern, activePhases, soundOn, beep]);

  const reset = () => {
    setRunning(false);
    setPhase(activePhases[0]);
    setElapsedInPhase(0);
    setCycles(0);
  };

  const toggle = () => {
    if (!running) {
      if (soundOn) beep(440);
    }
    setRunning((r) => !r);
  };

  // Circle scale: expands during inhale, holds full/empty during holds, shrinks on exhale
  const progress = currentDuration > 0 ? elapsedInPhase / currentDuration : 0;
  const scale =
    phase === "inhale"
      ? 0.55 + progress * 0.45
      : phase === "exhale"
      ? 1 - progress * 0.45
      : phase === "hold-in"
      ? 1
      : 0.55;

  const remaining = Math.max(0, Math.ceil(currentDuration - elapsedInPhase));

  return (
    <div className="rounded-3xl border border-border bg-card/40 backdrop-blur-sm p-6 md:p-10">
      {/* Pattern chooser */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {PATTERNS.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              setPatternId(p.id);
              setRunning(false);
              setPhase(PHASE_ORDER.find((ph) => (p.phases[ph] ?? 0) > 0) as Phase);
              setElapsedInPhase(0);
              setCycles(0);
            }}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium border transition-all",
              patternId === p.id
                ? "bg-primary text-primary-foreground border-primary shadow"
                : "border-border hover:border-primary/40 bg-background/50",
            )}
          >
            {p.short}
            {p.recommended && patternId !== p.id && (
              <span className="ml-1.5 text-[10px] uppercase tracking-wider text-primary">
                рек.
              </span>
            )}
          </button>
        ))}
      </div>

      <p className="text-sm text-muted-foreground text-center max-w-md mx-auto mb-8 leading-relaxed">
        {pattern.description}
      </p>

      {/* Animated circle */}
      <div className="relative aspect-square max-w-sm mx-auto mb-8">
        <div
          className="absolute inset-0 rounded-full bg-primary/10 blur-2xl transition-transform ease-linear"
          style={{
            transform: `scale(${scale * 1.1})`,
            transitionDuration: "80ms",
          }}
        />
        <div
          className="absolute inset-0 rounded-full border border-primary/20"
          style={{ transform: "scale(1)" }}
        />
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/40 to-primary/10 border border-primary/40 flex flex-col items-center justify-center transition-transform ease-linear"
          style={{
            transform: `scale(${scale})`,
            transitionDuration: "80ms",
          }}
        >
          <div className="text-3xl md:text-4xl font-semibold text-foreground">
            {PHASE_LABEL[phase]}
          </div>
          <div className="mt-2 text-5xl md:text-6xl font-bold text-primary tabular-nums">
            {running ? remaining : currentDuration}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <Button size="lg" onClick={toggle} className="gap-2 min-w-[140px]">
          {running ? (
            <>
              <Pause className="w-4 h-4" /> Пауза
            </>
          ) : (
            <>
              <Play className="w-4 h-4" /> {cycles > 0 ? "Продолжить" : "Начать"}
            </>
          )}
        </Button>
        <Button variant="outline" size="lg" onClick={reset} className="gap-2">
          <RotateCcw className="w-4 h-4" /> Сброс
        </Button>
        <Button
          variant="ghost"
          size="lg"
          onClick={() => setSoundOn((s) => !s)}
          className="gap-2"
          aria-label={soundOn ? "Выключить звук" : "Включить звук"}
        >
          {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </Button>
      </div>

      {/* Cycle counter */}
      <div className="flex justify-center gap-8 text-center">
        <div>
          <div className="text-3xl font-semibold tabular-nums">{cycles}</div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">
            Циклов
          </div>
        </div>
        <div>
          <div className="text-3xl font-semibold tabular-nums text-primary">
            {Math.max(0, 6 - cycles)}
          </div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">
            До цели (6)
          </div>
        </div>
      </div>

      {cycles >= 6 && (
        <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/5 p-4 text-center text-sm">
          <strong>Хорошо.</strong> Заметьте — стало ли дыхание глубже, а плечи мягче.
          Даже 10–20% снижения тревоги — уже победа.
        </div>
      )}
    </div>
  );
};

export default BreathingExercise;
