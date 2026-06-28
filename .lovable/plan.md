# План: усиление гео-страниц (Шаг 1)

Не добавляем новые города. Усиливаем 10 существующих, чтобы они перестали выглядеть как doorway pages и реально помогали пользователю принимать решение.

## Что меняется в данных

**`src/data/cityPages.ts`** — расширяем `CityPageData`:

```ts
type LocalSystem = {
  insurance: string;       // как устроена страховка
  publicRoute: string;     // путь через гос/обязательную систему
  privateRoute: string;    // частный путь
  disclaimer: string;      // мягкий disclaimer
};

type HelpRoute = { title: string; text: string };

interface CityPageData {
  // ... существующие поля
  countryPageSlug?: string;       // ссылка на country hub (будущий шаг)
  localSystem?: LocalSystem;
  helpRoutes?: HelpRoute[];       // 3–4 шага «куда идти»
  relatedArticleSlugs?: string[]; // 3–5 slug из blogPosts
  nearbyCities?: string[];        // для перелинковки
  localKeywords?: string[];       // для SEO footer
  primaryOffer?: "start" | "free-call" | "diagnostic";
}
```

Заполняем уникальным контентом для: **Berlin, Amsterdam, Lisbon, Tbilisi, Kishinev**.

Чистим технический мусор в Berlin: убираем `title_: ""` и `as any`.

## Что меняется на странице

**`src/pages/CityLandingPage.tsx`** — добавляем 5 новых секций (после `practical info`, до `pricing`):

1. **«Почему русскоязычная терапия онлайн может быть удобнее»** — общий блок с лёгкой адаптацией под город (родной язык, культурный контекст, часовой пояс, нет очереди в местной системе).
2. **«Маршрут помощи в [страна]»** — рендер `helpRoutes` + `localSystem` (страховка / публичный путь / частный путь / disclaimer).
3. **«С какими запросами чаще приходят из [город]»** — переиспользуем `painPoints` в более «клиентской» подаче (карточки с глаголами от первого лица).
4. **«Время сессий по вашему часовому поясу»** — мини-таблица: 09:00 / 18:00 у клиента ↔ время в Кишинёве, считается из `utcOffset`.
5. **«Что почитать, если вы живёте в [город]»** — фильтр `blogPosts` по `relatedArticleSlugs` вместо общего `<Blog />`.

## Замена CTA

Везде главный CTA меняем на мягкий оффер:

- **Текст**: «Понять, с чего начать»
- **Подпись**: «Короткий опросник на 3–5 минут. Вы опишете ситуацию, а я отправлю первичный разбор в Telegram.»
- **Ссылка**: `/start`
- **Вторичная кнопка**: «Записаться на диагностику» → `#booking` или `/contact`

Применяем к:
- `CityLandingPage.tsx` (Berlin/Amsterdam/Lisbon/Tbilisi)
- `LandingPageEuropa.tsx`
- `LandingPageAsia.tsx`
- `LandingPageIT.tsx`
- `LandingPageKishinev.tsx`
- гео-страницы через `ProblemPage` (Moscow, USA — проверим, заменим там, где есть «бесплатная встреча» как primary)

Информацию о бесплатной 20-минутной встрече сохраняем — она остаётся как secondary, не удаляется.

## Отдельные правки

- **Москва** (`ProblemPage` через `problemPages.ts`): убрать любые намёки на очный формат, добавить «онлайн, русский язык, +0/+1 час к МСК».
- **США** (`ProblemPage`): добавить disclaimer «не лицензированный терапевт в США, страховка не покрывает», часовые пояса (NY / LA / Chicago / Miami slots).
- **FAQ**: расширить до 8–10 вопросов на каждый город (часовой пояс, оплата, страховка, острое состояние, первая консультация, /start, параллельная терапия, язык).

## Технические проверки

- `seo-routes.ts` — метаданные у всех 10 гео-страниц на месте.
- `public/sitemap.xml` — все URL есть.
- `bun run build` проходит.
- `npm run seo:check` (если есть) проходит.

## Что НЕ делаем на этом шаге

- ❌ Не создаём `/psiholog-germaniya`, `/psiholog-niderlandy` и др. country hubs — это Шаг 3.
- ❌ Не добавляем `/psiholog-munich`, `/psiholog-rotterdam` и др. новые города — это Шаг 4.
- ❌ Не трогаем `/start` (опросник) — у него отдельная работа.

## Технические детали

**Файлы под правку:**
- `src/data/cityPages.ts` — расширение типа + заполнение 5 городов
- `src/pages/CityLandingPage.tsx` — 5 новых секций + замена CTA
- `src/pages/LandingPageEuropa.tsx` — замена CTA
- `src/pages/LandingPageAsia.tsx` — замена CTA
- `src/pages/LandingPageIT.tsx` — замена CTA
- `src/pages/LandingPageKishinev.tsx` — замена CTA
- `src/data/problemPages.ts` — правки Moscow/USA disclaimers + CTA

**Объём:** ~400–600 строк нового контента (в основном текст в data-файлах), ~150 строк нового JSX в `CityLandingPage`.

**Время выполнения:** один большой проход, без перерывов на уточнения. После — отдельным сообщением покажу скриншоты Berlin / Amsterdam / Moscow и попрошу проверить тон, прежде чем переходить к Шагу 2 (country hubs).

Подтвердите — и запускаю.
