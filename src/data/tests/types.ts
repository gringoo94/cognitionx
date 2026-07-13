export type LikertOption = { value: number; label: string };

export interface ScoringResult {
  score: number;
  maxScore: number;
  level: "minimal" | "mild" | "moderate" | "moderate-severe" | "severe" | "low" | "high" | "normal";
  levelLabel: string;
  interpretation: string;
  recommendation: string;
  /** Optional severity color: 'success' | 'warning' | 'danger' | 'info' */
  tone: "success" | "warning" | "danger" | "info";
}

export interface TestSubScale {
  key: string;
  name: string;
  /** 1-based question numbers belonging to this subscale */
  items: number[];
}

export interface TestConfig {
  slug: string;
  /** Short name (e.g. "PHQ-9") */
  code: string;
  /** Full title used as <h1> */
  title: string;
  /** Tagline shown in hub card */
  tagline: string;
  /** SEO title (≤60) */
  seoTitle: string;
  /** SEO description (≤160) */
  seoDescription: string;
  /** Theme cluster */
  cluster:
    | "depression"
    | "anxiety"
    | "burnout"
    | "stress"
    | "self-esteem"
    | "it"
    | "cbt-tools"
    | "trauma"
    | "sleep"
    | "addiction"
    | "relationships"
    | "personality"
    | "eating";
  /** Visible cluster label */
  clusterLabel: string;
  /** Author / source line */
  authorNote: string;
  /** Approx. minutes */
  durationMin: number;
  /** Audience description */
  audience: string;
  /** Intro paragraphs (rendered above test) */
  intro: string[];
  /** "About the method" — paragraphs rendered below */
  about: string[];
  /** Sources (links or APA refs) */
  sources: { label: string; url?: string }[];
  /** Likert scale options shared for all questions */
  scale: LikertOption[];
  /** Optional per-question scale override (for tests with mixed scales like AUDIT) */
  perQuestionScale?: (LikertOption[] | null)[];
  /** Question texts in display order */
  questions: string[];
  /** 1-based question numbers that should be reverse-scored */
  reverseItems?: number[];
  /** Optional sub-scales rendered in result */
  subscales?: TestSubScale[];
  /** Step mode: 'one' shows all on one page; 'paged' one-by-one */
  layout: "one" | "paged";
  /** Compute result from raw answers (0-indexed array, length = questions.length) */
  scoring: (answers: number[]) => ScoringResult;
  /** Related test slugs */
  related: string[];
  /** FAQ */
  faq: { q: string; a: string }[];
  /** Optional SEO/UX blocks rendered on the test page */
  symptoms?: string[];
  whatNext?: { when: string; action: string }[];
  compareWith?: { code: string; slug?: string; note: string }[];
  relatedArticles?: { title: string; slug: string }[];
}
