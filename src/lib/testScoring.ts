import type { LikertOption, TestConfig } from "@/data/tests/types";

const scaleFor = (config: TestConfig, i: number): LikertOption[] =>
  config.perQuestionScale?.[i] ?? config.scale;

const scaleBounds = (opts: LikertOption[]) => {
  const values = opts.map((o) => o.value);
  return { min: Math.min(...values), max: Math.max(...values) };
};

/**
 * Returns the scored contribution of a single question, applying reverse
 * coding when the question is listed in `config.reverseItems` (1-indexed).
 * For reverse items: scored = (scaleMin + scaleMax) - rawAnswer
 */
export const scoredValueForQuestion = (
  config: TestConfig,
  i: number,
  answer: number | undefined,
): number | null => {
  if (answer === undefined || answer === null || Number.isNaN(answer))
    return null;
  const isReverse = config.reverseItems?.includes(i + 1) ?? false;
  if (!isReverse) return answer;
  const { min, max } = scaleBounds(scaleFor(config, i));
  return min + max - answer;
};

/**
 * Sum scored values across a subscale's 1-indexed item list, honoring reverse
 * coding so the displayed subscale total matches the test's own scoring().
 */
export const subscaleScore = (
  config: TestConfig,
  answers: number[],
  items: number[],
): number =>
  items.reduce((sum, q) => {
    const i = q - 1;
    const v = scoredValueForQuestion(config, i, answers[i]);
    return sum + (v ?? 0);
  }, 0);

/** Theoretical maximum for a subscale given each question's scale. */
export const subscaleMaxScore = (
  config: TestConfig,
  items: number[],
): number =>
  items.reduce((sum, q) => {
    const { max } = scaleBounds(scaleFor(config, q - 1));
    return sum + max;
  }, 0);

/** Theoretical minimum for a subscale given each question's scale. */
export const subscaleMinScore = (
  config: TestConfig,
  items: number[],
): number =>
  items.reduce((sum, q) => {
    const { min } = scaleBounds(scaleFor(config, q - 1));
    return sum + min;
  }, 0);

/** Shared mean/bounds for dimensional results in the page and PDF. */
export const subscaleMeanResult = (
  config: TestConfig,
  answers: number[],
  items: number[],
): { score: number; min: number; max: number } => {
  if (items.length === 0) return { score: 0, min: 0, max: 0 };
  return {
    score: subscaleScore(config, answers, items) / items.length,
    min: subscaleMinScore(config, items) / items.length,
    max: subscaleMaxScore(config, items) / items.length,
  };
};
