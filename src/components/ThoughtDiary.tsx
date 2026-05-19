import { useMemo, useState } from "react";

type AfterShort = "lighter" | "same" | "worse" | "unnoticed";
type AfterLong = "heavier" | "fatigue" | "bad-sleep" | "no-change" | "better";
type DiffFactor =
  | "busy"
  | "not-alone"
  | "moving"
  | "no-phone"
  | "slept-well"
  | "engaged"
  | "unknown";

const afterShortOpts: { id: AfterShort; label: string }[] = [
  { id: "lighter", label: "Немного легче" },
  { id: "same", label: "Без изменений" },
  { id: "worse", label: "Хуже" },
  { id: "unnoticed", label: "Не заметил" },
];

const afterLongOpts: { id: AfterLong; label: string }[] = [
  { id: "heavier", label: "Стало тяжелее" },
  { id: "fatigue", label: "Усталость" },
  { id: "bad-sleep", label: "Плохой сон" },
  { id: "no-change", label: "Без изменений" },
  { id: "better", label: "Немного лучше" },
];

const diffFactorOpts: { id: DiffFactor; label: string }[] = [
  { id: "busy", label: "Был занят" },
  { id: "not-alone", label: "Был не один" },
  { id: "moving", label: "Двигался, не лежал" },
  { id: "no-phone", label: "Не брал телефон" },
  { id: "slept-well", label: "Хорошо спал до этого" },
  { id: "engaged", label: "Был увлечён чем-то" },
  { id: "unknown", label: "Не знаю" },
];

const initialState = {
  date: "",
  time: "",
  place: "",
  before: "",
  anxiety: 5,
  sadness: 5,
  irritation: 5,
  thoughts: "",
  style: "" as "" | "why" | "what",
  afterShort: new Set<AfterShort>(),
  afterLong: new Set<AfterLong>(),
  afterText: "",
  notRumination: "",
  diffFactors: new Set<DiffFactor>(),
};

const ThoughtDiary = () => {
  const [s, setS] = useState(initialState);
  const [showSummary, setShowSummary] = useState(false);

  const update = <K extends keyof typeof initialState>(
    key: K,
    value: (typeof initialState)[K],
  ) => setS((prev) => ({ ...prev, [key]: value }));

  const toggle = <T,>(set: Set<T>, value: T) => {
    const next = new Set(set);
    next.has(value) ? next.delete(value) : next.add(value);
    return next;
  };

  const progress = useMemo(() => {
    let filled = 0;
    if (s.before.trim()) filled++;
    if (s.thoughts.trim()) filled++;
    if (s.style) filled++;
    if (s.afterShort.size || s.afterLong.size || s.afterText.trim()) filled++;
    if (s.notRumination.trim() || s.diffFactors.size) filled++;
    return (filled / 5) * 100;
  }, [s]);

  const handleSubmit = () => {
    setShowSummary(true);
    setTimeout(() => {
      document.getElementById("td-summary")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const handleReset = () => {
    if (!confirm("Очистить все поля?")) return;
    setS({
      ...initialState,
      afterShort: new Set(),
      afterLong: new Set(),
      diffFactors: new Set(),
    });
    setShowSummary(false);
  };

  const handlePrint = () => window.print();

  const styleLabel =
    s.style === "why"
      ? "«Почему»-мысли (абстрактные, руминативные)"
      : s.style === "what"
      ? "«Что именно»-мысли (конкретные, процессные)"
      : "—";

  return (
    <div className="thought-diary">
      <style>{`
        .thought-diary {
          font-family: 'Lora', Georgia, serif;
          --td-bg: #F4F1EC;
          --td-surface: #FDFCF9;
          --td-surface2: #F0EDE6;
          --td-border: #D8D2C8;
          --td-border2: #C8C0B4;
          --td-ink: #1C1A16;
          --td-ink2: #3A3630;
          --td-ink3: #7A7268;
          --td-ink4: #A09890;
          --td-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
          background: var(--td-bg);
          color: var(--td-ink);
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid var(--td-border);
        }
        .thought-diary * { box-sizing: border-box; }

        .td-header { background: var(--td-ink); padding: 32px 24px 28px; position: relative; overflow: hidden; }
        .td-header::before { content: ''; position: absolute; width: 300px; height: 300px; border-radius: 50%; border: 1px solid rgba(244,241,236,0.06); top: -120px; right: -80px; }
        .td-header::after { content: ''; position: absolute; width: 150px; height: 150px; border-radius: 50%; border: 1px solid rgba(244,241,236,0.04); bottom: -60px; left: 40px; }
        .td-label { font-family: var(--td-mono); font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: rgba(244,241,236,0.4); margin-bottom: 10px; position: relative; }
        .td-title { font-size: 24px; font-weight: 400; color: #F4F1EC; line-height: 1.2; margin-bottom: 8px; position: relative; }
        .td-title em { font-style: italic; opacity: 0.6; }
        .td-desc { font-size: 13px; color: rgba(244,241,236,0.55); line-height: 1.6; max-width: 440px; font-style: italic; position: relative; }

        .td-meta { background: var(--td-surface2); border-bottom: 1px solid var(--td-border); padding: 14px 24px; display: flex; gap: 12px; flex-wrap: wrap; }
        .td-meta-field { display: flex; flex-direction: column; gap: 3px; flex: 1; min-width: 120px; }
        .td-meta-label { font-family: var(--td-mono); font-size: 9px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--td-ink4); }
        .td-meta-input { font-family: 'Lora', Georgia, serif; font-size: 13px; color: var(--td-ink); background: transparent; border: none; border-bottom: 1px solid var(--td-border2); padding: 3px 0; outline: none; width: 100%; transition: border-color 0.15s; }
        .td-meta-input:focus { border-bottom-color: var(--td-ink); }
        .td-meta-input::placeholder { color: var(--td-ink4); font-style: italic; }

        .td-main { padding: 20px 20px 40px; max-width: 640px; margin: 0 auto; }

        .td-intro { background: var(--td-surface); border: 1px solid var(--td-border); border-radius: 10px; padding: 16px 18px; margin-bottom: 20px; font-size: 13.5px; color: var(--td-ink2); line-height: 1.7; font-style: italic; }

        .td-progress { height: 3px; background: var(--td-border); border-radius: 2px; margin-bottom: 16px; overflow: hidden; }
        .td-progress-fill { height: 100%; background: var(--td-ink); border-radius: 2px; transition: width 0.4s ease; }

        .td-step { background: var(--td-surface); border-radius: 12px; overflow: hidden; margin-bottom: 14px; border: 1px solid var(--td-border); transition: box-shadow 0.2s; }
        .td-step:focus-within { box-shadow: 0 2px 12px rgba(0,0,0,0.08); border-color: var(--td-border2); }
        .td-step-head { padding: 13px 16px 11px; display: flex; align-items: flex-start; gap: 12px; border-bottom: 1px solid var(--td-border); }
        .td-step-num { width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: var(--td-mono); font-size: 11px; font-weight: 500; flex-shrink: 0; margin-top: 1px; color: white; }
        .td-step-meta { flex: 1; }
        .td-step-title { font-size: 15px; font-weight: 500; line-height: 1.2; margin-bottom: 3px; }
        .td-step-hint { font-size: 12px; font-style: italic; color: var(--td-ink3); line-height: 1.5; }
        .td-step-body { padding: 14px 16px; }

        .td-s1 .td-step-head { background: #F0EEFF; border-color: #C4BAF0; }
        .td-s1 .td-step-num { background: #3B2E8A; }
        .td-s1 .td-step-title { color: #3B2E8A; }
        .td-s2 .td-step-head { background: #EBF5EE; border-color: #90CCA8; }
        .td-s2 .td-step-num { background: #1A5C36; }
        .td-s2 .td-step-title { color: #1A5C36; }
        .td-s3 .td-step-head { background: #FDF3E8; border-color: #E0B878; }
        .td-s3 .td-step-num { background: #7A3A00; }
        .td-s3 .td-step-title { color: #7A3A00; }
        .td-s4 .td-step-head { background: #EBF0F8; border-color: #90A8D0; }
        .td-s4 .td-step-num { background: #1A3A6A; }
        .td-s4 .td-step-title { color: #1A3A6A; }
        .td-s5 .td-step-head { background: #F8EBF2; border-color: #D090B0; }
        .td-s5 .td-step-num { background: #5C1A3A; }
        .td-s5 .td-step-title { color: #5C1A3A; }
        .td-s6 .td-step-head { background: #EBF5EB; border-color: #88C088; }
        .td-s6 .td-step-num { background: #2A4A2A; }
        .td-s6 .td-step-title { color: #2A4A2A; }

        .td-textarea { font-family: 'Lora', Georgia, serif; font-size: 14px; color: var(--td-ink); background: var(--td-bg); border: 1px solid var(--td-border); border-radius: 8px; padding: 10px 12px; width: 100%; resize: vertical; min-height: 80px; outline: none; line-height: 1.65; transition: border-color 0.15s, background 0.15s; }
        .td-textarea:focus { border-color: var(--td-border2); background: var(--td-surface); }
        .td-textarea::placeholder { color: var(--td-ink4); font-style: italic; font-size: 13px; }

        .td-mood-group { margin-bottom: 12px; }
        .td-mood-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
        .td-mood-name { font-size: 13px; color: var(--td-ink2); }
        .td-mood-value { font-family: var(--td-mono); font-size: 12px; color: var(--td-ink3); min-width: 32px; text-align: right; }
        .td-range { width: 100%; height: 4px; appearance: none; -webkit-appearance: none; background: var(--td-border); border-radius: 2px; outline: none; cursor: pointer; }
        .td-range::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 16px; height: 16px; border-radius: 50%; background: var(--td-ink); cursor: pointer; transition: transform 0.1s; }
        .td-range::-webkit-slider-thumb:active { transform: scale(1.3); }
        .td-range::-moz-range-thumb { width: 16px; height: 16px; border-radius: 50%; background: var(--td-ink); cursor: pointer; border: none; }
        .td-anchors { display: flex; justify-content: space-between; font-family: var(--td-mono); font-size: 9px; color: var(--td-ink4); margin-top: 3px; }

        .td-style-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        @media (max-width: 480px) { .td-style-grid { grid-template-columns: 1fr; } }
        .td-style-opt { border: 1px solid var(--td-border); border-radius: 8px; padding: 10px 12px; cursor: pointer; transition: all 0.15s; background: var(--td-bg); }
        .td-style-opt:hover { border-color: var(--td-border2); }
        .td-style-opt.selected { border-color: var(--td-ink); background: var(--td-surface); }
        .td-style-opt-label { font-family: var(--td-mono); font-size: 10px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 4px; display: flex; align-items: center; gap: 6px; }
        .td-style-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; border: 2px solid currentColor; transition: background 0.15s; }
        .td-style-opt.selected .td-style-dot { background: currentColor; }
        .td-style-example { font-size: 11.5px; color: var(--td-ink3); font-style: italic; line-height: 1.5; }
        .td-opt-why .td-style-opt-label { color: #C0392B; }
        .td-opt-what .td-style-opt-label { color: #1A5C36; }

        .td-after-group { margin-bottom: 12px; }
        .td-after-label { font-family: var(--td-mono); font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--td-ink3); margin-bottom: 6px; }
        .td-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px; }
        .td-chip { font-family: var(--td-mono); font-size: 10px; letter-spacing: 0.04em; padding: 4px 10px; border-radius: 20px; border: 1px solid var(--td-border); cursor: pointer; background: var(--td-bg); color: var(--td-ink3); transition: all 0.15s; user-select: none; }
        .td-chip:hover { border-color: var(--td-border2); color: var(--td-ink2); }
        .td-chip.active { background: var(--td-ink); color: var(--td-bg); border-color: var(--td-ink); }

        .td-actions { display: flex; gap: 10px; margin-top: 24px; }
        .td-btn-primary { font-family: var(--td-mono); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; background: var(--td-ink); color: var(--td-bg); border: none; border-radius: 8px; padding: 13px 24px; cursor: pointer; flex: 1; transition: opacity 0.15s; }
        .td-btn-primary:hover { opacity: 0.8; }
        .td-btn-secondary { font-family: var(--td-mono); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; background: transparent; color: var(--td-ink3); border: 1px solid var(--td-border); border-radius: 8px; padding: 13px 20px; cursor: pointer; transition: all 0.15s; }
        .td-btn-secondary:hover { border-color: var(--td-border2); color: var(--td-ink2); }

        .td-summary { background: var(--td-surface); border: 1px solid var(--td-border); border-radius: 12px; padding: 20px; margin-top: 20px; }
        .td-summary-title { font-size: 17px; font-weight: 500; margin-bottom: 16px; color: var(--td-ink); }
        .td-summary-row { margin-bottom: 14px; padding-bottom: 14px; border-bottom: 1px solid var(--td-border); }
        .td-summary-row:last-of-type { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
        .td-summary-row-label { font-family: var(--td-mono); font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--td-ink4); margin-bottom: 5px; }
        .td-summary-row-value { font-size: 13.5px; color: var(--td-ink2); line-height: 1.65; white-space: pre-wrap; }
        .td-summary-print { font-family: var(--td-mono); font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; background: transparent; color: var(--td-ink3); border: 1px dashed var(--td-border2); border-radius: 8px; padding: 10px 18px; cursor: pointer; margin-top: 14px; width: 100%; transition: all 0.15s; }
        .td-summary-print:hover { border-color: var(--td-ink); color: var(--td-ink); }

        @media print {
          .td-header { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .td-btn-primary, .td-btn-secondary, .td-meta, .td-actions { display: none !important; }
          .td-step { break-inside: avoid; }
        }
      `}</style>

      <header className="td-header">
        <div className="td-label">Рабочий лист · Между сессиями</div>
        <h2 className="td-title">
          Мои мысли — <em>что за ними стоит</em>
        </h2>
        <p className="td-desc">
          Заполни этот лист, когда заметишь, что снова начинаешь прокручивать одно и то же.
          Не нужно делать это в момент руминации — подойди к нему позже, когда будет спокойнее.
        </p>
      </header>

      <div className="td-meta">
        <div className="td-meta-field">
          <label className="td-meta-label">Дата</label>
          <input
            type="date"
            className="td-meta-input"
            value={s.date}
            onChange={(e) => update("date", e.target.value)}
          />
        </div>
        <div className="td-meta-field">
          <label className="td-meta-label">Примерное время</label>
          <input
            type="text"
            className="td-meta-input"
            placeholder="например, вечером"
            value={s.time}
            onChange={(e) => update("time", e.target.value)}
          />
        </div>
        <div className="td-meta-field">
          <label className="td-meta-label">Где происходило</label>
          <input
            type="text"
            className="td-meta-input"
            placeholder="дома, в дороге..."
            value={s.place}
            onChange={(e) => update("place", e.target.value)}
          />
        </div>
      </div>

      <div className="td-main">
        <div className="td-intro">
          Это не анализ и не самокритика. Это наблюдение — как учёный, который изучает интересное явление.
          Просто опиши, что было.
        </div>

        <div className="td-progress">
          <div className="td-progress-fill" style={{ width: `${progress}%` }} />
        </div>

        {/* Step 1 */}
        <section className="td-step td-s1">
          <div className="td-step-head">
            <div className="td-step-num">1</div>
            <div className="td-step-meta">
              <div className="td-step-title">Что было прямо перед</div>
              <div className="td-step-hint">
                Что ты делал за 5–10 минут до того, как заметил мысли? Что произошло, что увидел, услышал?
              </div>
            </div>
          </div>
          <div className="td-step-body">
            <textarea
              className="td-textarea"
              placeholder="Лежал в кровати после ужина, смотрел телефон..."
              value={s.before}
              onChange={(e) => update("before", e.target.value)}
            />
          </div>
        </section>

        {/* Step 2 */}
        <section className="td-step td-s2">
          <div className="td-step-head">
            <div className="td-step-num">2</div>
            <div className="td-step-meta">
              <div className="td-step-title">Настроение в тот момент</div>
              <div className="td-step-hint">
                Как ты себя чувствовал прямо перед тем, как мысли начались? Отметь на шкале.
              </div>
            </div>
          </div>
          <div className="td-step-body">
            {([
              ["anxiety", "Тревога"],
              ["sadness", "Подавленность"],
              ["irritation", "Раздражение"],
            ] as const).map(([key, label]) => (
              <div className="td-mood-group" key={key}>
                <div className="td-mood-row">
                  <span className="td-mood-name">{label}</span>
                  <span className="td-mood-value">{s[key]}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={10}
                  step={1}
                  value={s[key]}
                  className="td-range"
                  onChange={(e) => update(key, Number(e.target.value))}
                />
                <div className="td-anchors">
                  <span>0 — нет</span>
                  <span>10 — очень сильно</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Step 3 */}
        <section className="td-step td-s3">
          <div className="td-step-head">
            <div className="td-step-num">3</div>
            <div className="td-step-meta">
              <div className="td-step-title">О чём были мысли</div>
              <div className="td-step-hint">Опиши своими словами — о чём ты думал? Не оценивай, просто опиши.</div>
            </div>
          </div>
          <div className="td-step-body">
            <textarea
              className="td-textarea"
              placeholder="Что снова всё бессмысленно, что я опять не справился..."
              value={s.thoughts}
              onChange={(e) => update("thoughts", e.target.value)}
            />
          </div>
        </section>

        {/* Step 4 */}
        <section className="td-step td-s4">
          <div className="td-step-head">
            <div className="td-step-num">4</div>
            <div className="td-step-meta">
              <div className="td-step-title">Как выглядели мысли</div>
              <div className="td-step-hint">
                Это важный шаг. Мысли задавали вопросы «почему» — или «что именно произошло»?
              </div>
            </div>
          </div>
          <div className="td-step-body">
            <div className="td-style-grid">
              <label
                className={`td-style-opt td-opt-why${s.style === "why" ? " selected" : ""}`}
                onClick={() => update("style", "why")}
              >
                <div className="td-style-opt-label">
                  <span className="td-style-dot" />
                  «Почему»-мысли
                </div>
                <div className="td-style-example">
                  «Почему я такой? Зачем вообще стараться? Почему это всегда со мной?»
                </div>
              </label>
              <label
                className={`td-style-opt td-opt-what${s.style === "what" ? " selected" : ""}`}
                onClick={() => update("style", "what")}
              >
                <div className="td-style-opt-label">
                  <span className="td-style-dot" />
                  «Что именно»-мысли
                </div>
                <div className="td-style-example">
                  «Что конкретно произошло? Как это началось? Что я мог сделать иначе?»
                </div>
              </label>
            </div>
          </div>
        </section>

        {/* Step 5 */}
        <section className="td-step td-s5">
          <div className="td-step-head">
            <div className="td-step-num">5</div>
            <div className="td-step-meta">
              <div className="td-step-title">Что было после</div>
              <div className="td-step-hint">Как изменилось настроение? Сразу, и потом — через час, утром?</div>
            </div>
          </div>
          <div className="td-step-body">
            <div className="td-after-group">
              <div className="td-after-label">Через 5–10 минут</div>
              <div className="td-chips">
                {afterShortOpts.map((opt) => (
                  <span
                    key={opt.id}
                    className={`td-chip${s.afterShort.has(opt.id) ? " active" : ""}`}
                    onClick={() => update("afterShort", toggle(s.afterShort, opt.id))}
                  >
                    {opt.label}
                  </span>
                ))}
              </div>
            </div>
            <div className="td-after-group">
              <div className="td-after-label">Через час и позже</div>
              <div className="td-chips">
                {afterLongOpts.map((opt) => (
                  <span
                    key={opt.id}
                    className={`td-chip${s.afterLong.has(opt.id) ? " active" : ""}`}
                    onClick={() => update("afterLong", toggle(s.afterLong, opt.id))}
                  >
                    {opt.label}
                  </span>
                ))}
              </div>
            </div>
            <textarea
              className="td-textarea"
              placeholder="Что-то ещё заметил? (необязательно)"
              value={s.afterText}
              onChange={(e) => update("afterText", e.target.value)}
            />
          </div>
        </section>

        {/* Step 6 */}
        <section className="td-step td-s6">
          <div className="td-step-head">
            <div className="td-step-num">6</div>
            <div className="td-step-meta">
              <div className="td-step-title">Когда это не случается</div>
              <div className="td-step-hint">
                Это самый важный вопрос. Бывало ли так, что похожий момент — а мысли не застряли?
                Что тогда было иначе?
              </div>
            </div>
          </div>
          <div className="td-step-body">
            <textarea
              className="td-textarea"
              placeholder="Опиши такой момент..."
              value={s.notRumination}
              onChange={(e) => update("notRumination", e.target.value)}
            />
            <div style={{ marginTop: 12 }}>
              <div className="td-after-label">Что было иначе в тот раз?</div>
              <div className="td-chips">
                {diffFactorOpts.map((opt) => (
                  <span
                    key={opt.id}
                    className={`td-chip${s.diffFactors.has(opt.id) ? " active" : ""}`}
                    onClick={() => update("diffFactors", toggle(s.diffFactors, opt.id))}
                  >
                    {opt.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="td-actions">
          <button type="button" className="td-btn-primary" onClick={handleSubmit}>
            Сохранить и посмотреть итог
          </button>
          <button type="button" className="td-btn-secondary" onClick={handleReset}>
            Очистить
          </button>
        </div>

        {showSummary && (
          <div id="td-summary" className="td-summary">
            <div className="td-summary-title">Итог этого эпизода</div>

            <div className="td-summary-row">
              <div className="td-summary-row-label">Когда / где</div>
              <div className="td-summary-row-value">
                {[s.date, s.time, s.place].filter(Boolean).join(" · ") || "—"}
              </div>
            </div>

            <div className="td-summary-row">
              <div className="td-summary-row-label">Что было до</div>
              <div className="td-summary-row-value">{s.before || "—"}</div>
            </div>

            <div className="td-summary-row">
              <div className="td-summary-row-label">Настроение (0–10)</div>
              <div className="td-summary-row-value">
                Тревога: {s.anxiety} · Подавленность: {s.sadness} · Раздражение: {s.irritation}
              </div>
            </div>

            <div className="td-summary-row">
              <div className="td-summary-row-label">О чём мысли</div>
              <div className="td-summary-row-value">{s.thoughts || "—"}</div>
            </div>

            <div className="td-summary-row">
              <div className="td-summary-row-label">Стиль мыслей</div>
              <div className="td-summary-row-value">{styleLabel}</div>
            </div>

            <div className="td-summary-row">
              <div className="td-summary-row-label">После</div>
              <div className="td-summary-row-value">
                Через 5–10 мин:{" "}
                {[...s.afterShort].map((id) => afterShortOpts.find((o) => o.id === id)?.label).join(", ") || "—"}
                {"\n"}
                Через час+:{" "}
                {[...s.afterLong].map((id) => afterLongOpts.find((o) => o.id === id)?.label).join(", ") || "—"}
                {s.afterText ? `\n${s.afterText}` : ""}
              </div>
            </div>

            <div className="td-summary-row">
              <div className="td-summary-row-label">Когда мысли не застревают</div>
              <div className="td-summary-row-value">
                {s.notRumination || "—"}
                {s.diffFactors.size
                  ? `\nФакторы: ${[...s.diffFactors]
                      .map((id) => diffFactorOpts.find((o) => o.id === id)?.label)
                      .join(", ")}`
                  : ""}
              </div>
            </div>

            <button type="button" className="td-summary-print" onClick={handlePrint}>
              Распечатать / сохранить как PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThoughtDiary;
