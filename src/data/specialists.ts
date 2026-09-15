export type Specialist = {
  id: string;
  name: string;
  /** Полное имя для заголовков форм и уведомлений */
  fullName: string;
  /** Имя в творительном падеже: «консультация с ...» */
  withName: string;
  /** Имя в дательном падеже: «отправить заявку ...» */
  toName: string;
  initials: string;
  role: string;
  topics: string[];
  languages: string[];
  formats: string[];
  /** Стоимость дальнейшей (платной) консультации */
  price: string;
  availability: string;
  /** Доступно ли бесплатное 20-минутное знакомство */
  freeIntro: boolean;
  isPsychiatrist?: boolean;
  note?: string;
};

/** Цены психологов команды — синхронизированы с основным прайсом сайта */
export const TEAM_PRICE = "35 € разовая · 30 € регулярная";

export const specialists: Specialist[] = [
  {
    id: "nastya",
    name: "Настя",
    withName: "Настей",
    toName: "Насте",
    fullName: "Настя",
    initials: "Н",
    role: "КПТ-психолог",
    topics: ["Тревога и панические атаки", "Стресс и перегрузка", "Самооценка", "Отношения"],
    languages: ["Русский", "Английский"],
    formats: ["Онлайн"],
    price: TEAM_PRICE,
    availability: "Ближайшие слоты — на этой неделе",
    freeIntro: true,
  },
  {
    id: "zhenya",
    name: "Женя",
    withName: "Женей",
    toName: "Жене",
    fullName: "Женя",
    initials: "Ж",
    role: "КПТ-психолог",
    topics: ["Депрессия", "Выгорание", "Прокрастинация", "Потеря смысла"],
    languages: ["Русский"],
    formats: ["Онлайн"],
    price: TEAM_PRICE,
    availability: "Ближайшие слоты — на этой неделе",
    freeIntro: true,
  },
  {
    id: "yulya",
    name: "Юля",
    withName: "Юлей",
    toName: "Юле",
    fullName: "Юля",
    initials: "Ю",
    role: "КПТ-психолог",
    topics: ["Отношения и границы", "Созависимость", "Перфекционизм", "Тревога о будущем"],
    languages: ["Русский", "Румынский"],
    formats: ["Онлайн", "Очно (Кишинёв)"],
    price: TEAM_PRICE,
    availability: "Ближайшие слоты — на следующей неделе",
    freeIntro: true,
  },
  {
    id: "anna",
    name: "Анна",
    withName: "Анной",
    toName: "Анне",
    fullName: "Анна",
    initials: "А",
    role: "Врач-психиатр",
    topics: [
      "Медицинская оценка состояния",
      "Подбор медикаментозного лечения",
      "Коррекция назначенной терапии",
      "Депрессивные и тревожные расстройства",
    ],
    languages: ["Русский", "Румынский"],
    formats: ["Онлайн", "Очно (Кишинёв)"],
    price: "Стоимость уточняется",
    availability: "Ближайшие слоты — на следующей неделе",
    freeIntro: true,
    isPsychiatrist: true,
    note:
      "Консультация психиатра подходит, если вам необходима медицинская оценка состояния, обсуждение медикаментозного лечения или коррекция назначенной терапии.",
  },
  {
    id: "dmitrii",
    name: "Дмитрий",
    withName: "Дмитрием",
    toName: "Дмитрию",
    fullName: "Дмитрий Яцко",
    initials: "ДЯ",
    role: "КПТ-психолог, схема-терапевт",
    topics: ["Депрессия", "Тревога и панические атаки", "Выгорание", "Схема-терапия"],
    languages: ["Русский", "Румынский", "Английский"],
    formats: ["Онлайн", "Очно (Кишинёв)"],
    price: "35 € разовая · 30 € регулярная",
    availability: "Только платные консультации, без бесплатного знакомства",
    freeIntro: false,
    note:
      "Дмитрий временно не берёт новых клиентов на бесплатное знакомство. Записаться сразу на платную консультацию можно — по мере освобождения слотов.",
  },
];

/** Текст для короткого разговора с психиатром — это не медицинская консультация */
export const PSYCHIATRIST_INTRO_LABEL =
  "Короткий предварительный разговор для уточнения запроса и формата дальнейшей консультации";

export const getSpecialist = (id: string | null) =>
  specialists.find((s) => s.id === id) ?? null;
