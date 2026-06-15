import type { LikertOption } from "./types";

// Common shared Likert scales

export const PHQ_GAD_SCALE: LikertOption[] = [
  { value: 0, label: "Совсем нет" },
  { value: 1, label: "Несколько дней" },
  { value: 2, label: "Больше половины дней" },
  { value: 3, label: "Почти каждый день" },
];

export const FREQ_5_SCALE: LikertOption[] = [
  { value: 0, label: "Никогда" },
  { value: 1, label: "Редко" },
  { value: 2, label: "Иногда" },
  { value: 3, label: "Часто" },
  { value: 4, label: "Всегда / почти всегда" },
];

export const PSS_SCALE: LikertOption[] = [
  { value: 0, label: "Никогда" },
  { value: 1, label: "Почти никогда" },
  { value: 2, label: "Иногда" },
  { value: 3, label: "Довольно часто" },
  { value: 4, label: "Очень часто" },
];

export const ROSENBERG_SCALE: LikertOption[] = [
  { value: 0, label: "Совершенно не согласен" },
  { value: 1, label: "Не согласен" },
  { value: 2, label: "Согласен" },
  { value: 3, label: "Полностью согласен" },
];

export const CIPS_SCALE: LikertOption[] = [
  { value: 1, label: "Совсем не верно" },
  { value: 2, label: "Скорее не верно" },
  { value: 3, label: "Иногда верно" },
  { value: 4, label: "Часто верно" },
  { value: 5, label: "Очень верно" },
];

export const LAY_SCALE: LikertOption[] = [
  { value: 1, label: "Совсем не про меня" },
  { value: 2, label: "Скорее не про меня" },
  { value: 3, label: "Нейтрально" },
  { value: 4, label: "Скорее про меня" },
  { value: 5, label: "Полностью про меня" },
];

export const FMPS_SCALE: LikertOption[] = [
  { value: 1, label: "Совсем не согласен" },
  { value: 2, label: "Не согласен" },
  { value: 3, label: "Нейтрально" },
  { value: 4, label: "Согласен" },
  { value: 5, label: "Полностью согласен" },
];

export const DAS_SCALE: LikertOption[] = [
  { value: 1, label: "Полностью не согласен" },
  { value: 2, label: "Не согласен" },
  { value: 3, label: "Скорее не согласен" },
  { value: 4, label: "Нейтрально" },
  { value: 5, label: "Скорее согласен" },
  { value: 6, label: "Согласен" },
  { value: 7, label: "Полностью согласен" },
];

export const ATQ_SCALE: LikertOption[] = [
  { value: 1, label: "Совсем нет" },
  { value: 2, label: "Иногда" },
  { value: 3, label: "Умеренно часто" },
  { value: 4, label: "Часто" },
  { value: 5, label: "Постоянно" },
];

export const RRS_SCALE: LikertOption[] = [
  { value: 1, label: "Почти никогда" },
  { value: 2, label: "Иногда" },
  { value: 3, label: "Часто" },
  { value: 4, label: "Почти всегда" },
];

export const PCL5_SCALE: LikertOption[] = [
  { value: 0, label: "Совсем нет" },
  { value: 1, label: "Немного" },
  { value: 2, label: "Умеренно" },
  { value: 3, label: "Довольно сильно" },
  { value: 4, label: "Очень сильно" },
];

export const ISI_SCALE: LikertOption[] = [
  { value: 0, label: "0 — нет" },
  { value: 1, label: "1 — слабо" },
  { value: 2, label: "2 — умеренно" },
  { value: 3, label: "3 — сильно" },
  { value: 4, label: "4 — очень сильно" },
];

export const ECR_SCALE: LikertOption[] = [
  { value: 1, label: "1 — совсем не про меня" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
  { value: 4, label: "4 — нейтрально" },
  { value: 5, label: "5" },
  { value: 6, label: "6" },
  { value: 7, label: "7 — полностью про меня" },
];

export const BFI_SCALE: LikertOption[] = [
  { value: 1, label: "Совсем не согласен" },
  { value: 2, label: "Скорее не согласен" },
  { value: 3, label: "Нейтрально" },
  { value: 4, label: "Скорее согласен" },
  { value: 5, label: "Полностью согласен" },
];

export const DERS_SCALE: LikertOption[] = [
  { value: 1, label: "Почти никогда (0–10%)" },
  { value: 2, label: "Иногда (11–35%)" },
  { value: 3, label: "Примерно в половине случаев (36–65%)" },
  { value: 4, label: "Бо́льшую часть времени (66–90%)" },
  { value: 5, label: "Почти всегда (91–100%)" },
];
