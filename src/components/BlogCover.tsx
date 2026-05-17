import { useMemo } from "react";

interface BlogCoverProps {
  slug: string;
  title: string;
  tag?: string;
  className?: string;
  /** When true, render larger typography (hero on article page) */
  large?: boolean;
}

// Deterministic hash → hue
function hashSeed(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

const PALETTES: Array<[number, number]> = [
  [212, 260], // blue → violet
  [180, 220], // teal → blue
  [260, 310], // violet → magenta
  [20, 350], // amber → rose
  [160, 200], // emerald → cyan
  [280, 330], // purple → pink
  [200, 240], // sky → indigo
  [340, 20], // pink → amber
];

/**
 * Unified generative blog cover.
 * Deterministic gradient + glow + typographic mark derived from the post slug.
 */
const BlogCover = ({ slug, title, tag, className = "", large = false }: BlogCoverProps) => {
  const { from, to, accent, blob1, blob2 } = useMemo(() => {
    const seed = hashSeed(slug);
    const [h1, h2] = PALETTES[seed % PALETTES.length];
    return {
      from: `hsl(${h1} 55% 12%)`,
      to: `hsl(${h2} 60% 8%)`,
      accent: `hsl(${h1} 90% 70%)`,
      blob1: `hsl(${h1} 90% 60% / 0.55)`,
      blob2: `hsl(${h2} 90% 60% / 0.45)`,
    };
  }, [slug]);

  const titleSize = large
    ? "text-3xl md:text-5xl"
    : "text-base md:text-lg";
  const tagSize = large ? "text-xs md:text-sm" : "text-[10px]";

  return (
    <div
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      aria-hidden="true"
    >
      {/* Soft glow blobs */}
      <div
        className="absolute -top-1/3 -left-1/4 w-2/3 h-2/3 rounded-full blur-3xl"
        style={{ background: blob1 }}
      />
      <div
        className="absolute -bottom-1/3 -right-1/4 w-2/3 h-2/3 rounded-full blur-3xl"
        style={{ background: blob2 }}
      />

      {/* Fine grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.07] mix-blend-overlay"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Content */}
      <div className="relative h-full w-full flex flex-col justify-between p-5 md:p-7 text-white">
        <div className="flex items-center justify-between">
          {tag && (
            <span
              className={`uppercase tracking-[0.18em] font-medium px-2.5 py-1 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm ${tagSize}`}
            >
              {tag}
            </span>
          )}
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ background: accent, boxShadow: `0 0 12px ${accent}` }}
          />
        </div>

        <div
          className={`font-serif font-light leading-[1.05] tracking-tight ${large ? "" : "line-clamp-4"} ${titleSize}`}
          style={{ textShadow: "0 2px 30px rgba(0,0,0,0.35)" }}
        >
          {title}
          <span style={{ color: accent }}>.</span>
        </div>

        <div className="flex items-end justify-between text-[10px] uppercase tracking-[0.25em] opacity-70">
          <span>cognitionx</span>
          <span className="font-mono">{String((hashSeed(slug) % 99) + 1).padStart(2, "0")}</span>
        </div>
      </div>
    </div>
  );
};

export default BlogCover;
