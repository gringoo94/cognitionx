import type { TestConfig } from "./types";
import { phq9 } from "./phq9";
import { gad7 } from "./gad7";
import { bat } from "./bat";
import { pss10 } from "./pss10";
import { cips } from "./cips";
import { rosenberg } from "./rosenberg";
import { lay } from "./lay";
import { fmps } from "./fmps";
import { das } from "./das";
import { atq } from "./atq";

export const tests: TestConfig[] = [
  phq9,
  gad7,
  bat,
  pss10,
  cips,
  rosenberg,
  lay,
  fmps,
  das,
  atq,
];

export const testsBySlug: Record<string, TestConfig> = Object.fromEntries(
  tests.map((t) => [t.slug, t]),
);

export const getTest = (slug: string): TestConfig | undefined => testsBySlug[slug];

export type { TestConfig } from "./types";
