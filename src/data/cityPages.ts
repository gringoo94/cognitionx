// City-specific copy and geography. Shared therapy sections live in CityLandingPage.
export interface CityFAQ {
  question: string;
  answer: string;
}

export interface CityPageData {
  slug: string;
  city: string;
  cityIn: string;
  cityFor: string;
  country: string;
  countryCode: string;
  currency: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  subtitle: string;
  relatedArticleSlugs?: string[];
  countryPageSlug?: string;
  nearbyCities?: string[];
  faq: CityFAQ[];
}

export const cityPages: CityPageData[] = [
  {
    "slug": "psiholog-berlin",
    "city": "Берлин",
    "cityIn": "в Берлине",
    "cityFor": "для Берлина",
    "country": "Германия",
    "countryCode": "DE",
    "currency": "EUR",
    "metaTitle": "Психолог в Берлине онлайн — КПТ | Дмитрий Яцко",
    "metaDescription": "Психолог для жителей Берлина. КПТ и схема-терапия на русском. Консультация онлайн — 45 €, 50 минут. Дмитрий Яцко.",
    "h1": "Психолог онлайн в Берлине",
    "subtitle": "Не обязательно разбираться со всем в одиночку. Вместе посмотрим, что сейчас даётся трудно и с чего можно начать.",
    "relatedArticleSlugs": [
      "kpt-pri-trevoge",
      "vygoranie-simptomy-vosstanovlenie",
      "kogda-nichego-ne-hochetsya",
      "kak-vybrat-kpt-psihologa",
      "pervaya-sessiya-u-psihologa"
    ],
    "countryPageSlug": "psiholog-germaniya",
    "nearbyCities": [
      "psiholog-myunhen",
      "psiholog-gamburg",
      "psiholog-amsterdam"
    ],
    "faq": [
      {
        "question": "Как оплатить консультацию?",
        "answer": "Оплата в евро банковским переводом, через Wise или Revolut. Детали согласуем перед встречей."
      },
      {
        "question": "Можно ли оплатить через страховку?",
        "answer": "Я работаю вне немецкой системы страхования. Для помощи по страховке нужен специалист, работающий с вашей страховой компанией."
      }
    ]
  },
  {
    "slug": "psiholog-amsterdam",
    "city": "Амстердам",
    "cityIn": "в Амстердаме",
    "cityFor": "для Амстердама",
    "country": "Нидерланды",
    "countryCode": "NL",
    "currency": "EUR",
    "metaTitle": "Психолог в Амстердаме онлайн — КПТ | Дмитрий Яцко",
    "metaDescription": "Психолог для жителей Амстердама. КПТ и схема-терапия на русском. Консультация онлайн — 45 €, 50 минут. Дмитрий Яцко.",
    "h1": "Психолог онлайн в Амстердаме",
    "subtitle": "Когда забот много, свои чувства легко отложить. На встречах можно остановиться и уделить внимание тому, что важно вам.",
    "relatedArticleSlugs": [
      "vygoranie-simptomy-vosstanovlenie",
      "sindrom-samozvantsa",
      "kak-izbavitsya-ot-trevogi",
      "prokrastinaciya",
      "kpt-pri-trevoge"
    ],
    "countryPageSlug": "psiholog-niderlandy",
    "nearbyCities": [
      "psiholog-rotterdam",
      "psiholog-berlin"
    ],
    "faq": [
      {
        "question": "Как оплатить консультацию?",
        "answer": "Оплата в евро банковским переводом, через Wise или Revolut. Детали согласуем перед встречей."
      },
      {
        "question": "Можно ли оплатить через страховку?",
        "answer": "Я работаю вне нидерландской системы страхования. Для помощи по страховке обратитесь к своему семейному врачу."
      }
    ]
  },
  {
    "slug": "psiholog-lissabon",
    "city": "Лиссабон",
    "cityIn": "в Лиссабоне",
    "cityFor": "для Лиссабона",
    "country": "Португалия",
    "countryCode": "PT",
    "currency": "EUR",
    "metaTitle": "Психолог в Лиссабоне онлайн — КПТ | Дмитрий Яцко",
    "metaDescription": "Психолог для жителей Лиссабона. КПТ и схема-терапия на русском. Консультация онлайн — 45 €, 50 минут. Дмитрий Яцко.",
    "h1": "Психолог онлайн в Лиссабоне",
    "subtitle": "Даже если жизнь выглядит благополучно, внутри может быть непросто. Здесь можно говорить об этом без необходимости оправдываться.",
    "relatedArticleSlugs": [
      "kak-izbavitsya-ot-trevogi",
      "kpt-pri-trevoge",
      "kogda-nichego-ne-hochetsya",
      "vsyo-neopredelyonno",
      "vygoranie-simptomy-vosstanovlenie"
    ],
    "countryPageSlug": "psiholog-portugaliya",
    "nearbyCities": [
      "psiholog-porto",
      "psiholog-berlin",
      "psiholog-amsterdam"
    ],
    "faq": [
      {
        "question": "Как оплатить консультацию?",
        "answer": "Оплата в евро банковским переводом, через Wise или Revolut. Детали согласуем перед встречей."
      },
      {
        "question": "Можно ли оплатить через страховку?",
        "answer": "Мои консультации не входят в SNS. Возможность возмещения по частному полису уточните у страховщика."
      }
    ]
  },
  {
    "slug": "psiholog-tbilisi",
    "city": "Тбилиси",
    "cityIn": "в Тбилиси",
    "cityFor": "для Тбилиси",
    "country": "Грузия",
    "countryCode": "GE",
    "currency": "GEL / USD / EUR",
    "metaTitle": "Психолог в Тбилиси онлайн — КПТ | Дмитрий Яцко",
    "metaDescription": "Психолог для жителей Тбилиси. КПТ и схема-терапия на русском. Консультация онлайн — 45 €, 50 минут. Дмитрий Яцко.",
    "h1": "Психолог онлайн в Тбилиси",
    "subtitle": "Если сейчас трудно понять, что вы чувствуете и чего хотите, начнём с этого. Не нужно заранее знать все ответы.",
    "relatedArticleSlugs": [
      "kak-izbavitsya-ot-trevogi",
      "vsyo-neopredelyonno",
      "kpt-pri-trevoge",
      "kogda-nichego-ne-hochetsya",
      "8-prepyatstvij-na-puti-k-peremenam"
    ],
    "countryPageSlug": "psiholog-gruziya",
    "nearbyCities": [
      "psiholog-kishinev"
    ],
    "faq": [
      {
        "question": "Как оплатить консультацию?",
        "answer": "Можно оплатить в евро. Возможность оплаты в лари и детали перевода согласуем перед встречей."
      }
    ]
  },
  {
    "slug": "psiholog-kishinev",
    "city": "Кишинёв",
    "cityIn": "в Кишинёве",
    "cityFor": "для Кишинёва",
    "country": "Молдова",
    "countryCode": "MD",
    "currency": "EUR / MDL",
    "metaTitle": "Психолог в Кишинёве онлайн — КПТ | Дмитрий Яцко",
    "metaDescription": "Психолог для жителей Кишинёва. КПТ и схема-терапия на русском. Консультация онлайн — 45 €, 50 минут. Дмитрий Яцко.",
    "h1": "Психолог онлайн в Кишинёве",
    "subtitle": "Я живу и работаю в Кишинёве. На встречах вместе разберёмся, что вас беспокоит и какая помощь может подойти.",
    "relatedArticleSlugs": [
      "kpt-pri-trevoge",
      "vygoranie-simptomy-vosstanovlenie",
      "kogda-nichego-ne-hochetsya",
      "sindrom-samozvantsa",
      "5-principov-kpt"
    ],
    "countryPageSlug": "psiholog-moldova",
    "nearbyCities": [
      "psiholog-tbilisi"
    ],
    "faq": [
      {
        "question": "Как оплатить консультацию?",
        "answer": "Можно оплатить в евро или молдавских леях по курсу. Детали согласуем перед встречей."
      }
    ]
  },
  {
    "slug": "psiholog-myunhen",
    "city": "Мюнхен",
    "cityIn": "в Мюнхене",
    "cityFor": "для Мюнхена",
    "country": "Германия",
    "countryCode": "DE",
    "currency": "EUR",
    "metaTitle": "Психолог в Мюнхене онлайн — КПТ | Дмитрий Яцко",
    "metaDescription": "Психолог для жителей Мюнхена. КПТ и схема-терапия на русском. Консультация онлайн — 45 €, 50 минут. Дмитрий Яцко.",
    "h1": "Психолог онлайн в Мюнхене",
    "subtitle": "Не нужно ждать, пока станет совсем тяжело. Можно обратиться с тем, что уже мешает жить, отдыхать или быть собой.",
    "relatedArticleSlugs": [
      "vygoranie-simptomy-vosstanovlenie",
      "kpt-pri-trevoge",
      "kak-vybrat-kpt-psihologa",
      "pervaya-sessiya-u-psihologa"
    ],
    "countryPageSlug": "psiholog-germaniya",
    "nearbyCities": [
      "psiholog-berlin",
      "psiholog-gamburg"
    ],
    "faq": [
      {
        "question": "Как оплатить консультацию?",
        "answer": "Оплата в евро банковским переводом, через Wise или Revolut. Детали согласуем перед встречей."
      },
      {
        "question": "Можно ли оплатить через страховку?",
        "answer": "Я работаю вне немецкой системы страхования. Для помощи по страховке нужен специалист, работающий с вашей страховой компанией."
      }
    ]
  },
  {
    "slug": "psiholog-gamburg",
    "city": "Гамбург",
    "cityIn": "в Гамбурге",
    "cityFor": "для Гамбурга",
    "country": "Германия",
    "countryCode": "DE",
    "currency": "EUR",
    "metaTitle": "Психолог в Гамбурге онлайн — КПТ | Дмитрий Яцко",
    "metaDescription": "Психолог для жителей Гамбурга. КПТ и схема-терапия на русском. Консультация онлайн — 45 €, 50 минут. Дмитрий Яцко.",
    "h1": "Психолог онлайн в Гамбурге",
    "subtitle": "Можно прийти с тревогой, усталостью или ощущением, что что-то не так. Вместе попробуем понять, что происходит.",
    "relatedArticleSlugs": [
      "kogda-nichego-ne-hochetsya",
      "kpt-pri-trevoge",
      "vygoranie-simptomy-vosstanovlenie",
      "kak-vybrat-kpt-psihologa"
    ],
    "countryPageSlug": "psiholog-germaniya",
    "nearbyCities": [
      "psiholog-berlin",
      "psiholog-myunhen"
    ],
    "faq": [
      {
        "question": "Как оплатить консультацию?",
        "answer": "Оплата в евро банковским переводом, через Wise или Revolut. Детали согласуем перед встречей."
      },
      {
        "question": "Можно ли оплатить через страховку?",
        "answer": "Я работаю вне немецкой системы страхования. Для помощи по страховке нужен специалист, работающий с вашей страховой компанией."
      }
    ]
  },
  {
    "slug": "psiholog-rotterdam",
    "city": "Роттердам",
    "cityIn": "в Роттердаме",
    "cityFor": "для Роттердама",
    "country": "Нидерланды",
    "countryCode": "NL",
    "currency": "EUR",
    "metaTitle": "Психолог в Роттердаме онлайн — КПТ | Дмитрий Яцко",
    "metaDescription": "Психолог для жителей Роттердама. КПТ и схема-терапия на русском. Консультация онлайн — 45 €, 50 минут. Дмитрий Яцко.",
    "h1": "Психолог онлайн в Роттердаме",
    "subtitle": "Когда сил хватает только на повседневные дела, бывает трудно понять свои потребности. На встречах найдём для них место.",
    "relatedArticleSlugs": [
      "vygoranie-simptomy-vosstanovlenie",
      "kpt-pri-trevoge",
      "kak-vybrat-kpt-psihologa",
      "pervaya-sessiya-u-psihologa"
    ],
    "countryPageSlug": "psiholog-niderlandy",
    "nearbyCities": [
      "psiholog-amsterdam"
    ],
    "faq": [
      {
        "question": "Как оплатить консультацию?",
        "answer": "Оплата в евро банковским переводом, через Wise или Revolut. Детали согласуем перед встречей."
      },
      {
        "question": "Можно ли оплатить через страховку?",
        "answer": "Я работаю вне нидерландской системы страхования. Для помощи по страховке обратитесь к своему семейному врачу."
      }
    ]
  },
  {
    "slug": "psiholog-porto",
    "city": "Порту",
    "cityIn": "в Порту",
    "cityFor": "для Порту",
    "country": "Португалия",
    "countryCode": "PT",
    "currency": "EUR",
    "metaTitle": "Психолог в Порту онлайн — КПТ | Дмитрий Яцко",
    "metaDescription": "Психолог для жителей Порту. КПТ и схема-терапия на русском. Консультация онлайн — 45 €, 50 минут. Дмитрий Яцко.",
    "h1": "Психолог онлайн в Порту",
    "subtitle": "Вам не нужно подбирать «правильные» слова для своего состояния. Начать можно с того, что сейчас чувствуете.",
    "relatedArticleSlugs": [
      "kogda-nichego-ne-hochetsya",
      "vygoranie-simptomy-vosstanovlenie",
      "kpt-pri-trevoge",
      "kak-vybrat-kpt-psihologa"
    ],
    "countryPageSlug": "psiholog-portugaliya",
    "nearbyCities": [
      "psiholog-lissabon"
    ],
    "faq": [
      {
        "question": "Как оплатить консультацию?",
        "answer": "Оплата в евро банковским переводом, через Wise или Revolut. Детали согласуем перед встречей."
      },
      {
        "question": "Можно ли оплатить через страховку?",
        "answer": "Мои консультации не входят в SNS. Возможность возмещения по частному полису уточните у страховщика."
      }
    ]
  },
  {
    "slug": "psiholog-london",
    "city": "Лондон",
    "cityIn": "в Лондоне",
    "cityFor": "для Лондона",
    "country": "Великобритания",
    "countryCode": "GB",
    "currency": "GBP",
    "metaTitle": "Психолог в Лондоне онлайн — КПТ | Дмитрий Яцко",
    "metaDescription": "Психолог для жителей Лондона. КПТ и схема-терапия на русском. Консультация онлайн — 45 €, 50 минут. Дмитрий Яцко.",
    "h1": "Психолог онлайн в Лондоне",
    "subtitle": "Если трудно остановиться и прислушаться к себе, можно сделать это на встрече. Без требования сразу всё изменить.",
    "relatedArticleSlugs": [
      "kpt-pri-trevoge",
      "vygoranie-simptomy-vosstanovlenie",
      "kogda-nichego-ne-hochetsya",
      "kak-vybrat-kpt-psihologa",
      "pervaya-sessiya-u-psihologa"
    ],
    "countryPageSlug": "psiholog-velikobritaniya",
    "nearbyCities": [
      "psiholog-amsterdam",
      "psiholog-berlin",
      "psiholog-lissabon"
    ],
    "faq": [
      {
        "question": "Как оплатить консультацию?",
        "answer": "Можно оплатить в евро или фунтах через Wise или Revolut. Детали согласуем перед встречей."
      },
      {
        "question": "Можно ли оплатить через страховку?",
        "answer": "Я работаю вне NHS. Возможность возмещения по частной страховке уточните у страховщика."
      }
    ]
  },
  {
    "slug": "psiholog-varshava",
    "city": "Варшава",
    "cityIn": "в Варшаве",
    "cityFor": "для Варшавы",
    "country": "Польша",
    "countryCode": "PL",
    "currency": "PLN",
    "metaTitle": "Психолог в Варшаве онлайн — КПТ | Дмитрий Яцко",
    "metaDescription": "Психолог для жителей Варшавы. КПТ и схема-терапия на русском. Консультация онлайн — 45 €, 50 минут. Дмитрий Яцко.",
    "h1": "Психолог онлайн в Варшаве",
    "subtitle": "Когда многое меняется, бывает непросто услышать себя. Вместе разберёмся, что вас беспокоит и на что можно опереться.",
    "relatedArticleSlugs": [
      "kpt-pri-trevoge",
      "vygoranie-simptomy-vosstanovlenie",
      "kogda-nichego-ne-hochetsya",
      "kak-vybrat-kpt-psihologa",
      "pervaya-sessiya-u-psihologa"
    ],
    "countryPageSlug": "psiholog-polsha",
    "nearbyCities": [
      "psiholog-vroclav",
      "psiholog-krakov",
      "psiholog-vilnyus"
    ],
    "faq": [
      {
        "question": "Как оплатить консультацию?",
        "answer": "Можно оплатить в евро или злотых через Wise или Revolut. Детали согласуем перед встречей."
      },
      {
        "question": "Можно ли оплатить через страховку?",
        "answer": "Мои консультации не входят в NFZ, Luxmed или Medicover. Для помощи по полису нужен специалист из вашей страховой сети."
      }
    ]
  },
  {
    "slug": "psiholog-vroclav",
    "city": "Вроцлав",
    "cityIn": "во Вроцлаве",
    "cityFor": "для Вроцлава",
    "country": "Польша",
    "countryCode": "PL",
    "currency": "PLN",
    "metaTitle": "Психолог во Вроцлаве онлайн — КПТ | Дмитрий Яцко",
    "metaDescription": "Психолог для жителей Вроцлава. КПТ и схема-терапия на русском. Консультация онлайн — 45 €, 50 минут. Дмитрий Яцко.",
    "h1": "Психолог онлайн во Вроцлаве",
    "subtitle": "Если привычные способы справляться уже не помогают, можно искать другие. Начнём с вашей ситуации, без готовых советов.",
    "relatedArticleSlugs": [
      "vygoranie-simptomy-vosstanovlenie",
      "kpt-pri-trevoge",
      "kogda-nichego-ne-hochetsya",
      "pervaya-sessiya-u-psihologa"
    ],
    "countryPageSlug": "psiholog-polsha",
    "nearbyCities": [
      "psiholog-varshava",
      "psiholog-krakov",
      "psiholog-berlin"
    ],
    "faq": [
      {
        "question": "Как оплатить консультацию?",
        "answer": "Можно оплатить в евро или злотых через Wise или Revolut. Детали согласуем перед встречей."
      },
      {
        "question": "Можно ли оплатить через страховку?",
        "answer": "Мои консультации не входят в NFZ, Luxmed или Medicover. Для помощи по полису нужен специалист из вашей страховой сети."
      }
    ]
  },
  {
    "slug": "psiholog-krakov",
    "city": "Краков",
    "cityIn": "в Кракове",
    "cityFor": "для Кракова",
    "country": "Польша",
    "countryCode": "PL",
    "currency": "PLN",
    "metaTitle": "Психолог в Кракове онлайн — КПТ | Дмитрий Яцко",
    "metaDescription": "Психолог для жителей Кракова. КПТ и схема-терапия на русском. Консультация онлайн — 45 €, 50 минут. Дмитрий Яцко.",
    "h1": "Психолог онлайн в Кракове",
    "subtitle": "Не обязательно точно формулировать запрос заранее. Можно начать с того, что мешает вам сейчас, и постепенно разобраться.",
    "relatedArticleSlugs": [
      "kpt-pri-trevoge",
      "vygoranie-simptomy-vosstanovlenie",
      "kak-vybrat-kpt-psihologa",
      "pervaya-sessiya-u-psihologa"
    ],
    "countryPageSlug": "psiholog-polsha",
    "nearbyCities": [
      "psiholog-varshava",
      "psiholog-vroclav"
    ],
    "faq": [
      {
        "question": "Как оплатить консультацию?",
        "answer": "Можно оплатить в евро или злотых через Wise или Revolut. Детали согласуем перед встречей."
      },
      {
        "question": "Можно ли оплатить через страховку?",
        "answer": "Мои консультации не входят в NFZ, Luxmed или Medicover. Для помощи по полису нужен специалист из вашей страховой сети."
      }
    ]
  },
  {
    "slug": "psiholog-riga",
    "city": "Рига",
    "cityIn": "в Риге",
    "cityFor": "для Риги",
    "country": "Латвия",
    "countryCode": "LV",
    "currency": "EUR",
    "metaTitle": "Психолог в Риге онлайн — КПТ | Дмитрий Яцко",
    "metaDescription": "Психолог для жителей Риги. КПТ и схема-терапия на русском. Консультация онлайн — 45 €, 50 минут. Дмитрий Яцко.",
    "h1": "Психолог онлайн в Риге",
    "subtitle": "О своих трудностях можно говорить прямо — даже если кажется, что у других всё сложнее. Ваши переживания тоже важны.",
    "relatedArticleSlugs": [
      "kpt-pri-trevoge",
      "vygoranie-simptomy-vosstanovlenie",
      "kogda-nichego-ne-hochetsya",
      "kak-vybrat-kpt-psihologa",
      "pervaya-sessiya-u-psihologa"
    ],
    "countryPageSlug": "psiholog-latviya",
    "nearbyCities": [
      "psiholog-vilnyus",
      "psiholog-varshava"
    ],
    "faq": [
      {
        "question": "Как оплатить консультацию?",
        "answer": "Оплата в евро банковским переводом, через Wise или Revolut. Детали согласуем перед встречей."
      },
      {
        "question": "Можно ли оплатить через страховку?",
        "answer": "Возможность возмещения зависит от вашего полиса. Уточните у страховщика, покрывает ли он консультации специалиста вне своей сети."
      }
    ]
  },
  {
    "slug": "psiholog-vilnyus",
    "city": "Вильнюс",
    "cityIn": "в Вильнюсе",
    "cityFor": "для Вильнюса",
    "country": "Литва",
    "countryCode": "LT",
    "currency": "EUR",
    "metaTitle": "Психолог в Вильнюсе онлайн — КПТ | Дмитрий Яцко",
    "metaDescription": "Психолог для жителей Вильнюса. КПТ и схема-терапия на русском. Консультация онлайн — 45 €, 50 минут. Дмитрий Яцко.",
    "h1": "Психолог онлайн в Вильнюсе",
    "subtitle": "Если вы долго держались и устали справляться сами, можно обратиться за поддержкой. Начнём с того, что сейчас тяжелее всего.",
    "relatedArticleSlugs": [
      "kpt-pri-trevoge",
      "vygoranie-simptomy-vosstanovlenie",
      "kogda-nichego-ne-hochetsya",
      "pervaya-sessiya-u-psihologa"
    ],
    "countryPageSlug": "psiholog-litva",
    "nearbyCities": [
      "psiholog-riga",
      "psiholog-varshava"
    ],
    "faq": [
      {
        "question": "Как оплатить консультацию?",
        "answer": "Оплата в евро банковским переводом, через Wise или Revolut. Детали согласуем перед встречей."
      }
    ]
  },
  {
    "slug": "psiholog-belgrad",
    "city": "Белград",
    "cityIn": "в Белграде",
    "cityFor": "для Белграда",
    "country": "Сербия",
    "countryCode": "RS",
    "currency": "RSD",
    "metaTitle": "Психолог в Белграде онлайн — КПТ | Дмитрий Яцко",
    "metaDescription": "Психолог для жителей Белграда. КПТ и схема-терапия на русском. Консультация онлайн — 45 €, 50 минут. Дмитрий Яцко.",
    "h1": "Психолог онлайн в Белграде",
    "subtitle": "Неопределённость может отнимать много сил. На встречах разберём, что зависит от вас и как обходиться с остальным.",
    "relatedArticleSlugs": [
      "kpt-pri-trevoge",
      "vygoranie-simptomy-vosstanovlenie",
      "kogda-nichego-ne-hochetsya",
      "pervaya-sessiya-u-psihologa"
    ],
    "countryPageSlug": "psiholog-serbiya",
    "nearbyCities": [
      "psiholog-tbilisi",
      "psiholog-varshava"
    ],
    "faq": [
      {
        "question": "Как оплатить консультацию?",
        "answer": "Оплата в евро банковским переводом, через Wise или Revolut. Детали согласуем перед встречей."
      },
      {
        "question": "Можно ли оплатить через страховку?",
        "answer": "Для записи ко мне страховка не нужна. Возможность возмещения уточните у своей страховой компании."
      }
    ]
  }
];

export const getCityBySlug = (slug: string) => cityPages.find((city) => city.slug === slug);
