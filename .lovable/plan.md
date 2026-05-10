# План: лэндинг /cbtworkbook

Создаём полноценный SEO-лэндинг для бесплатного инструмента **CBT Workbook** — цифровой рабочей тетради по когнитивно-поведенческой терапии (10 модулей: депрессия, ABC-модель, SMART-цели, образ жизни, поведенческая активация, экспозиция страхов, контейнирование тревоги, problem solving, оспаривание мыслей, wellbeing blueprint).

## Маршрут и регистрация

- Удалить редирект `/cbtworkbook → /tools` в `src/App.tsx`.
- Добавить новый lazy-роут `/cbtworkbook → CbtWorkbookPage`.
- Добавить запись в `seo-routes.ts` (title + description с ключами «бесплатный CBT воркбук», «когнитивно-поведенческая терапия онлайн», «упражнения КПТ»).
- Добавить URL в `public/sitemap.xml` (priority 0.8, changefreq monthly).
- Добавить карточку «CBT Workbook» в `src/pages/Tools.tsx` (с пометкой Beta).

## Структура страницы (~1500–1800 слов)

1. **Hero** — заголовок «CBT Workbook — бесплатная цифровая тетрадь по КПТ», подзаголовок про 10 модулей и трекер настроения, две CTA: «Получить ранний доступ» (скролл к waitlist) и «Записаться на консультацию» (`#booking-cta` → `/contact`). Бейдж «Beta · Бесплатно».
2. **Что это такое** (~200 слов) — объяснение метода КПТ, для кого, чем отличается от обычных дневников.
3. **3 шага** — «Отслеживай настроение → Делай упражнения → Видишь динамику». Без анимаций приложения, просто карточки.
4. **10 модулей** — сетка карточек со списком инструментов из CBT Workbook (Depression, ABC, SMART Goals, Lifestyle, Behavioural Activation, Facing Fears, Containing Worry, Problem Solving, Thought Challenging, Wellbeing Blueprint) с краткими описаниями по 1–2 предложения.
5. **На чём основано** (~250 слов) — научная база КПТ, ссылки на NICE/APA, evidence-based подход.
6. **Сравнение** — таблица «Бумажный дневник / Random app / CBT Workbook».
7. **Кому подходит и кому нет** — две колонки.
8. **Связь с терапией** — блок «Воркбук ≠ замена терапии», CTA на консультацию.
9. **Waitlist-форма** (`#waitlist`) — переиспользовать `<BlogSubscribeForm source="cbtworkbook" />`. Заголовок «Получить доступ к бета-версии».
10. **FAQ** (8–10 вопросов) — бесплатно ли, нужна ли регистрация, есть ли мобильное приложение, безопасны ли данные, можно ли без терапевта, и т.п.
11. **Финальная CTA-секция** — две кнопки (waitlist + запись).
12. **Footer** через общий компонент.

## CTA-ссылки (заглушки)

- «Открыть приложение» — пока **не размещаем**, заменим основные CTA на:
  - Primary: `#waitlist` (скролл к форме подписки).
  - Secondary: `/contact` («Записаться на консультацию»).
- Когда появится URL приложения — заменим primary CTA одной правкой.

## SEO

- `<SEOHead>` с title до 60 символов, description до 160.
- JSON-LD: `SoftwareApplication` (applicationCategory=HealthApplication, offers price=0) + `FAQPage` (из FAQ-блока) + `BreadcrumbList`.
- Хлебные крошки: Главная → Инструменты → CBT Workbook.
- Внутренние ссылки: на `/tools/abc-analysis`, `/tools/behavioral-activation`, `/cbt-therapy`, `/depression`, `/anxiety`, `/blog`.

## Технические детали

- Новый файл: `src/pages/CbtWorkbookPage.tsx` (одностраничный компонент в стиле существующих tool-страниц, semantic tokens из `index.css`, framer-motion fade, lucide-react иконки).
- Контент пишется на русском, тон — как на остальном сайте (профессиональный, тёплый, без маркетинговой воды).
- BlogSubscribeForm уже отправляет Telegram-уведомление и пишет в `blog_subscribers` — изменений в БД/edge functions **не требуется**.
- `verify_jwt` и миграции **не нужны**.

## Файлы

- create: `src/pages/CbtWorkbookPage.tsx`
- edit: `src/App.tsx` (роут + удалить старый redirect)
- edit: `seo-routes.ts`
- edit: `public/sitemap.xml`
- edit: `src/pages/Tools.tsx` (карточка)
