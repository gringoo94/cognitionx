import type { TestConfig, ScoringResult } from "@/data/tests/types";

export interface ScoreRange {
  min: number;
  max: number;
  label: string;
  tone: ScoringResult["tone"];
}

/**
 * Derive score ranges from a test's scoring() function by sampling every
 * integer score from 0 to maxScore and grouping consecutive scores that
 * resolve to the same levelLabel. Works without modifying individual tests.
 *
 * Note: scoring() typically takes an answers array, but most tests sum to
 * `score` directly. We craft a synthetic "answers" array that sums to the
 * target score using the minimum and maximum scale values.
 */
export const deriveRanges = (config: TestConfig): ScoreRange[] => {
  const maxScore = config.scoring(
    new Array(config.questions.length).fill(
      config.scale[config.scale.length - 1].value,
    ),
  ).maxScore;

  const scaleMin = config.scale[0].value;
  const scaleMax = config.scale[config.scale.length - 1].value;
  const n = config.questions.length;
  const minTotal = scaleMin * n;

  const buildAnswers = (target: number): number[] | null => {
    // distribute target across n items between scaleMin..scaleMax
    let remaining = target - minTotal;
    if (remaining < 0 || remaining > (scaleMax - scaleMin) * n) return null;
    const per = scaleMax - scaleMin;
    const arr: number[] = [];
    for (let i = 0; i < n; i++) {
      const add = Math.min(per, remaining);
      arr.push(scaleMin + add);
      remaining -= add;
    }
    return arr;
  };

  const ranges: ScoreRange[] = [];
  for (let s = 0; s <= maxScore; s++) {
    const ans = buildAnswers(s);
    if (!ans) continue;
    let res: ScoringResult;
    try {
      res = config.scoring(ans);
    } catch {
      continue;
    }
    // Use the actual produced score (some tests round/clamp)
    const produced = res.score;
    const last = ranges[ranges.length - 1];
    if (last && last.label === res.levelLabel && produced === last.max + 1) {
      last.max = produced;
    } else if (!last || last.label !== res.levelLabel) {
      ranges.push({
        min: produced,
        max: produced,
        label: res.levelLabel,
        tone: res.tone,
      });
    } else {
      last.max = Math.max(last.max, produced);
    }
  }
  return ranges;
};
