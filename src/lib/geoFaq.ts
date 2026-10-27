export interface GeoFaqItem {
  question: string;
  answer: string;
}

// Keep a short consultation answer distinct from the existing preparation guide.
export const firstMeetingFaq: GeoFaqItem = {
  question: "Как проходит первая встреча?",
  answer: "Консультация длится 50 минут и стоит 45 €. Обсудим, что вас беспокоит, и наметим возможные следующие шаги. Вы сможете задать вопросы и решить, хотите ли продолжать работу.",
};

export const durationFaq: GeoFaqItem = {
  question: "Сколько может длиться терапия?",
  answer: "Это зависит от запроса и вашей ситуации. Ориентировочную длительность обсудим на первой встрече, а по ходу работы будем пересматривать план вместе с вами.",
};

export function buildLandingFaq(items: GeoFaqItem[]): GeoFaqItem[] {
  const practical = items.filter((item) =>
    /оплат|стоит|валют|страхов|полис|покрывает.*сесс|покрывает.*работ/i.test(item.question),
  );
  return [firstMeetingFaq, ...practical.slice(0, 2), durationFaq];
}