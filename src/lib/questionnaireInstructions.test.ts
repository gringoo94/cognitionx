import { describe, expect, it } from "vitest";
import { pcl5 } from "@/data/tests/pcl5";
import { ybocs } from "@/data/tests/ybocs";
import { mdq } from "@/data/tests/mdq";
import { audit } from "@/data/tests/audit";
import { isi } from "@/data/tests/isi";
import { deriveRanges } from "./testRanges";
import { subscaleScore, subscaleMaxScore } from "./testScoring";
import type { TestConfig } from "@/data/tests/types";

const answersForTotal = (config: TestConfig, total: number) => {
  let remaining = total;
  return config.questions.map((_, i) => {
    const scale = config.perQuestionScale?.[i] ?? config.scale;
    const choices = scale.map((opt) => opt.value).sort((a, b) => b - a);
    const answer = choices.find((value) => value <= remaining) ?? 0;
    remaining -= answer;
    return answer;
  });
};

describe("Primary-source questionnaire scoring", () => {
  // VA: research cutoffs 31–33, chosen total-score reference 33; no severity bands at 20/50.
  it("PCL-5 uses only the declared 33-point reference, with a maximum of 80", () => {
    for (const score of [0, 20, 31, 32]) {
      expect(pcl5.scoring(answersForTotal(pcl5, score)).level).toBe("low");
    }
    for (const score of [33, 50, 80]) {
      const result = pcl5.scoring(answersForTotal(pcl5, score));
      expect(result.level).toBe("moderate");
      expect(result.score).toBe(score);
      expect(result.maxScore).toBe(80);
    }
    expect(deriveRanges(pcl5).map(({ min, max }) => [min, max])).toEqual([[0, 32], [33, 80]]);
  });

  // Y-BOCS: time, interference, distress, resistance, control; two 0–20 subscales.
  it("Y-BOCS has item-specific anchors and no reversed resistance items", () => {
    expect(ybocs.perQuestionScale).toHaveLength(10);
    expect(ybocs.perQuestionScale?.[0]).toEqual(ybocs.perQuestionScale?.[5]);
    expect(ybocs.perQuestionScale?.[3]).toEqual(ybocs.perQuestionScale?.[8]);
    expect(ybocs.perQuestionScale?.[3]).not.toEqual(ybocs.perQuestionScale?.[4]);
    expect(ybocs.reverseItems ?? []).toEqual([]);
    expect(ybocs.scoring(Array(10).fill(4)).score).toBe(40);
    expect(subscaleScore(ybocs, Array(10).fill(4), [1, 2, 3, 4, 5])).toBe(20);
    expect(subscaleMaxScore(ybocs, [6, 7, 8, 9, 10])).toBe(20);
  });

  it("Y-BOCS retains conventional approximate boundaries at 8, 16, 24 and 32", () => {
    expect(deriveRanges(ybocs).map(({ min, max }) => [min, max])).toEqual([
      [0, 7], [8, 15], [16, 23], [24, 31], [32, 40],
    ]);
  });

  // MDQ published algorithm: ≥7 yes + concurrent symptoms + moderate/serious problems.
  it("MDQ requires all three conditions, not just seven symptoms", () => {
    const symptoms = (n: number, concurrent: number, impairment: number) => [
      ...Array.from({ length: 13 }, (_, i) => i < n ? 1 : 0), concurrent, impairment,
    ];
    expect(mdq.scoring(symptoms(6, 1, 2)).level).toBe("normal");
    expect(mdq.scoring(symptoms(7, 1, 2)).level).toBe("moderate-severe");
    expect(mdq.scoring(symptoms(7, 1, 3)).level).toBe("moderate-severe");
    expect(mdq.scoring(symptoms(7, 0, 2)).level).toBe("mild");
    expect(mdq.scoring(symptoms(7, 1, 1)).level).toBe("mild");
    expect(mdq.scoring(symptoms(13, 1, 3)).score).toBe(13);
  });

  it("MDQ does not create misleading total-score bands for the page or PDF", () => {
    expect(deriveRanges(mdq)).toEqual([]);
  });

  // WHO AUDIT manual: intervention zones I–IV at 8, 16, 20; items 9/10 score 0/2/4.
  it("AUDIT preserves WHO intervention-zone boundaries and mixed scales", () => {
    expect(deriveRanges(audit).map(({ min, max }) => [min, max])).toEqual([
      [0, 7], [8, 15], [16, 19], [20, 40],
    ]);
    expect(audit.perQuestionScale?.[8]?.map((o) => o.value)).toEqual([0, 2, 4]);
    expect(audit.perQuestionScale?.[9]?.map((o) => o.value)).toEqual([0, 2, 4]);
    expect(audit.scoring([0, 0, 0, 0, 0, 0, 0, 0, 2, 4]).score).toBe(6);
    expect(audit.scoring(Array(10).fill(4)).maxScore).toBe(40);
  });

  // Morin form: all 7 items 0–4, bands 0–7 / 8–14 / 15–21 / 22–28.
  it("ISI preserves published boundaries and maximum", () => {
    expect(deriveRanges(isi).map(({ min, max }) => [min, max])).toEqual([
      [0, 7], [8, 14], [15, 21], [22, 28],
    ]);
    expect(isi.scoring(Array(7).fill(4)).score).toBe(28);
    expect(isi.perQuestionScale?.[3]?.map((o) => o.value)).toEqual([0, 1, 2, 3, 4]);
  });
});