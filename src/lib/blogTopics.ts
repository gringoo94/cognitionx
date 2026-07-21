// Editorial grouping for /blog. Does not touch article data.
// A post belongs to a topic if any of its tags matches (case-insensitive
// substring, either direction) any of the topic's tag hints.

export type TopicId =
  | "trevoga"
  | "depressiya"
  | "otnosheniya"
  | "emocii"
  | "resheniya"
  | "kpt"
  | "shema"
  | "instrumenty";

export interface Topic {
  id: TopicId;
  label: string;
  tags: string[];
}

export const TOPICS: Topic[] = [
  {
    id: "trevoga",
    label: "Тревога и паника",
    tags: [
      "тревога",
      "паника",
      "паническ",
      "социальная тревожность",
      "окр",
      "птср",
      "сон",
      "бессонниц",
      "страх",
      "неопределённост",
      "неопределенност",
    ],
  },
  {
    id: "depressiya",
    label: "Депрессия и выгорание",
    tags: [
      "депресси",
      "выгорани",
      "безнадёжност",
      "безнадежност",
      "поведенческая активация",
      "работа",
    ],
  },
  {
    id: "otnosheniya",
    label: "Отношения",
    tags: [
      "отношения",
      "привязанност",
      "семь",
      "одиночеств",
      "границ",
      "созависимост",
    ],
  },
  {
    id: "emocii",
    label: "Эмоции и самооценка",
    tags: [
      "эмоци",
      "самооценк",
      "стыд",
      "вин",
      "самокритик",
      "перфекциониз",
      "гнев",
      "обид",
      "сожален",
    ],
  },
  {
    id: "resheniya",
    label: "Принятие решений",
    tags: [
      "принятие решений",
      "ценност",
      "изменени",
      "fomo",
      "сожален",
      "самопонимани",
      "выбор",
    ],
  },
  {
    id: "kpt",
    label: "КПТ и психотерапия",
    tags: [
      "кпт",
      "психотерапи",
      "психообразовани",
      "выбор специалист",
      "о терапии",
      "первая сесси",
    ],
  },
  {
    id: "shema",
    label: "Схема-терапия",
    tags: [
      "схема-терапи",
      "схема",
      "убеждени",
      "избегани",
      "поведенческий эксперимент",
    ],
  },
  {
    id: "instrumenty",
    label: "Тесты и инструменты",
    tags: [
      "тест",
      "шкал",
      "опросник",
      "bai",
      "bdi",
      "bhs",
      "mdq",
      "gad-7",
      "gad7",
      "phq-9",
      "phq9",
      "pcl-5",
      "spin",
      "eat-26",
      "eat26",
      "pswq",
      "isi",
      "who-5",
      "who5",
      "atq",
      "ders",
      "rrs",
      "ucla",
      "y-bocs",
      "ybocs",
      "audit",
      "cips",
      "das",
      "fmps",
      "lay",
      "maas",
      "cd-risc",
      "cdrisc",
      "bfi",
      "rosenberg",
      "ecr",
      "bat",
      "инструмент",
    ],
  },
];

const norm = (s: string) => s.toLowerCase().trim();

export function postMatchesTopic(tags: string[], topicId: TopicId): boolean {
  const topic = TOPICS.find((t) => t.id === topicId);
  if (!topic) return false;
  const lowerTags = tags.map(norm);
  return topic.tags.some((hint) => {
    const h = norm(hint);
    return lowerTags.some((t) => t.includes(h) || h.includes(t));
  });
}

export function topicForPost(tags: string[]): TopicId | null {
  for (const t of TOPICS) {
    if (postMatchesTopic(tags, t.id)) return t.id;
  }
  return null;
}

// Editorial recommendations (top of /blog, sort=recommended, page 1)
export const FEATURED_SLUGS = {
  hero: "5-principov-kpt",
  secondary: ["8-prepyatstvij-na-puti-k-peremenam", "kak-izbavitsya-ot-trevogi"],
};
