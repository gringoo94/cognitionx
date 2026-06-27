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
import { rrs } from "./rrs";
import { pcl5 } from "./pcl5";
import { isi } from "./isi";
import { audit } from "./audit";
import { ecr } from "./ecr";
import { bfi10 } from "./bfi10";
import { ders16 } from "./ders16";
import { who5 } from "./who5";
import { mdq } from "./mdq";
import { ybocs } from "./ybocs";
import { spin } from "./spin";
import { eat26 } from "./eat26";
import { maas } from "./maas";
import { cdrisc10 } from "./cdrisc10";
import { ucla3 } from "./ucla3";
import { bdi2 } from "./bdi2";
import { bai } from "./bai";
import { bhs } from "./bhs";
import { psyage } from "./psyage";
import { pswq } from "./pswq";
import { miniSpin } from "./miniSpin";

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
  rrs,
  pcl5,
  isi,
  audit,
  ecr,
  bfi10,
  ders16,
  who5,
  mdq,
  ybocs,
  spin,
  eat26,
  maas,
  cdrisc10,
  ucla3,
  bdi2,
  bai,
  bhs,
  psyage,
  pswq,
  miniSpin,
];

export const testsBySlug: Record<string, TestConfig> = Object.fromEntries(
  tests.map((t) => [t.slug, t]),
);

export const getTest = (slug: string): TestConfig | undefined => testsBySlug[slug];

export type { TestConfig } from "./types";
