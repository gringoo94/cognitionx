import { describe, expect, it } from "vitest";
import { atq } from "@/data/tests/atq";
import { fmps } from "@/data/tests/fmps";
import { cips } from "@/data/tests/cips";
import { lay } from "@/data/tests/lay";
import { ecr } from "@/data/tests/ecr";
import { deriveRanges } from "./testRanges";
import { subscaleScore, subscaleMeanResult } from "./testScoring";

describe("ATQ, FMPS, CIPS, procrastination and ECR source audit", () => {
  it("ATQ sums 30 frequency responses with endpoints 30 and 150", () => {
    expect(atq.questions).toHaveLength(30);
    expect(atq.scoring(Array(30).fill(1)).score).toBe(30);
    expect(atq.scoring(Array(30).fill(5)).score).toBe(150);
    expect(atq.reverseItems ?? []).toEqual([]);
  });

  it("FMPS reports six original subscales and excludes all six Organization items", () => {
    expect(fmps.questions).toHaveLength(35);
    expect(fmps.subscales?.map((s) => s.items)).toEqual([
      [9, 10, 13, 14, 18, 21, 23, 25, 34], [4, 6, 12, 16, 19, 24, 30],
      [1, 11, 15, 20, 26], [3, 5, 22, 35], [17, 28, 32, 33], [2, 7, 8, 27, 29, 31],
    ]);
    const answers = Array(35).fill(1);
    for (const q of [2, 7, 8, 27, 29, 31]) answers[q - 1] = 5;
    expect(fmps.scoring(answers).score).toBe(29);
    expect(fmps.scoring(Array(35).fill(5)).score).toBe(145);
    expect(fmps.scoring(answers).maxScore).toBe(145);
  });

  it("CIPS preserves the author's 40/60/80 descriptive boundaries and has no reverse items", () => {
    expect(cips.questions).toHaveLength(20);
    expect(cips.reverseItems ?? []).toEqual([]);
    const score = (total: number) => {
      let extra = total - 20;
      return cips.scoring(Array.from({ length: 20 }, () => {
        const add = Math.min(extra, 4); extra -= add; return 1 + add;
      }));
    };
    for (const [total, level] of [[20, "low"], [40, "low"], [41, "moderate"],
      [60, "moderate"], [61, "high"], [80, "high"], [81, "severe"], [100, "severe"]] as const) {
      expect(score(total).score).toBe(total);
      expect(score(total).level).toBe(level);
    }
  });

  it("the adapted procrastination exercise does not reverse reluctance to prepare but reverses punctuality", () => {
    const answers = Array(20).fill(3);
    expect(lay.scoring(answers).score).toBe(60);
    answers[17] = 5;
    expect(lay.scoring(answers).score).toBe(62);
    answers[18] = 5;
    expect(lay.scoring(answers).score).toBe(60);
    expect(lay.reverseItems).toEqual([3, 4, 6, 8, 11, 13, 14, 15, 19, 20]);
  });

  it("ECR-S uses the published reverse key and two six-item dimensions", () => {
    expect(ecr.questions).toHaveLength(12);
    expect(ecr.reverseItems).toEqual([1, 5, 8, 9]);
    const answers = [7, 1, 1, 1, 7, 1, 1, 7, 7, 1, 1, 1];
    expect(subscaleScore(ecr, answers, [1, 3, 5, 7, 9, 11])).toBe(6);
    expect(subscaleScore(ecr, answers, [2, 4, 6, 8, 10, 12])).toBe(6);
    expect(ecr.scoring(answers).score).toBe(12);
    expect(ecr.scoring(answers.map((v) => 8 - v)).score).toBe(84);
    expect(ecr.scoring(answers).maxScore).toBe(84);
  });

  it("ECR-S reports means from 1 to 7 independently for each dimension", () => {
    expect(ecr.scoreDisplay).toBe("subscale-means");
    const answers = [7, 7, 1, 7, 7, 7, 1, 1, 7, 7, 1, 7];
    expect(subscaleMeanResult(ecr, answers, [1, 3, 5, 7, 9, 11])).toEqual({ score: 1, min: 1, max: 7 });
    expect(subscaleMeanResult(ecr, answers, [2, 4, 6, 8, 10, 12])).toEqual({ score: 7, min: 1, max: 7 });
    for (const item of [1, 5, 8, 9]) {
      const baseline = Array(12).fill(4);
      const changed = [...baseline]; changed[item - 1] = 7;
      expect(ecr.scoring(changed).score).toBe(ecr.scoring(baseline).score - 3);
    }
  });

  for (const config of [atq, fmps, lay, ecr]) {
    it(`${config.slug} has no invented total-score bands in results or PDF`, () => {
      expect(config.scoreRangesMode).toBe("continuous");
      expect(deriveRanges(config)).toEqual([]);
    });
  }
});