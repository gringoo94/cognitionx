# План исправления блога CognitionX

## Диагноз (по аудиту 2026-07-20)

- 15 «client-only» статей (uvolnyatsya-ili-ostatsya, tsena-bezdejstviya и т.д.) отсутствуют в `seo-routes.ts`, в prerender-пайплайне (`vite-plugin-seo.ts`) и в `public/sitemap.xml`, потому что они созданы через админку и лежат только в таблице Supabase `blog_posts`. Пайплайн prerender сейчас знает только про markdown/JSON-посты из `src/data/blogPosts.ts`.
- Все 10 «старых URL» уже перенаправлены через `<Navigate>` в `src/App.tsx`, но клиентский redirect отдаёт исходно HTTP 200 и не является 301. Лавблл-хостинг статический (SPA-fallback), настоящий origin-редирект недоступен — можно приблизиться через отдельный prerender редирект-страницы с `meta refresh` + `rel=canonical`.
- Метаданные (title/description/JSON-LD/dateModified) расходятся, потому что `seo-routes.ts` ведётся вручную, а тела статей живут отдельно (md-frontmatter или DB). Нужен общий сборщик.
- 22 внутренние ссылки указывают на устаревшие slugs — их надо заменить в исходниках статей.

## Ограничение платформы (важно проговорить)

Lovable-хостинг не умеет отдавать настоящий `HTTP 301`/`410` из origin. Максимум, что мы можем без миграции хостинга — на этапе prerender записать вместо SPA-shell отдельный HTML со статусом 200, но с `<meta http-equiv="refresh">`, `<link rel="canonical" href="target">`, `noindex` и клиентским `Navigate`. Для поисковиков это трактуется как soft-redirect. Если нужен именно 301 на уровне ответа сервера — потребуется вынести хостинг за пределы Lovable; в плане ниже реализуем soft-redirect и явно это отмечаем.

## Этапы

### 1. Единый реестр публикаций (`publishedPosts`)
- Новый модуль `src/lib/publishedPosts.ts` объединяет три источника: md (`loadMdBlogPosts`), legacy JSON (`src/data/blogPosts.ts`), DB (`blog_posts` через service-role в build-скрипте).
- Для build-time добавить `scripts/fetch-db-posts.mjs`, который через Supabase REST забирает `select=* where published=true` и пишет `src/data/dbBlogPosts.generated.ts`. Скрипт вызывается из `predev`/`prebuild` рядом с `gen-blog-manifest`.
- Единый объект статьи → источник для: клиентского роутинга, `<title>`/description/OG/canonical/JSON-LD в `vite-plugin-seo.ts`, `sitemap.xml`, `public/llms.txt`, MCP-каталога, «Related posts».

### 2. Prerender для 15 DB-only статей (P1)
- `vite-plugin-seo.ts`: итерироваться не по `seoRoutes`, а по объединённому реестру. Для каждой статьи писать `dist/blog/<slug>/index.html` с реальным `<title>`, description, canonical=self, OG, `BlogPosting` JSON-LD и телом статьи внутри `#root` (через `marked` для md и через существующий рендерер для JSON-блоков).
- `seo-routes.ts` перестаёт быть источником для блога — его роль сводится к статическим страницам (главная, /tools, /about и т.п.). Блоговые записи удаляются оттуда, генерируются из реестра.
- Обновить `scripts/verify-prerender-seo.mjs`: сравнение expected/actual берётся из реестра, а не из `seo-routes.ts`.

### 3. Sitemap и llms.txt из реестра
- Заменить статический `public/sitemap.xml` на генерируемый (`scripts/gen-sitemap.mjs`): статические маршруты + все `publishedPosts`. Скрипт запускается в `prebuild`.
- Аналогично перегенерировать `public/llms.txt` из реестра, чтобы новые публикации не забывать добавлять.

### 4. Soft-redirect и 410 через prerender (P1)
- Новый файл `src/lib/redirects.ts` — единый список `{from, to, type: '301'|'410'}` (перенести туда 10 существующих `<Navigate>` и `Gone`).
- `vite-plugin-seo.ts` для каждой записи пишет отдельный `dist/blog/<slug>/index.html` с:
  - `<meta http-equiv="refresh" content="0; url=<target>">`
  - `<link rel="canonical" href="<target>">`
  - `<meta name="robots" content="noindex, follow">` для 301, `noindex, nofollow` + видимый текст «Gone» для 410
  - клиентский `Navigate` остаётся для UX уже загруженного SPA.
- `src/App.tsx` продолжает читать `redirects.ts`, чтобы не расходиться.
- В плане/README зафиксировать: настоящий HTTP 301/410 требует смены хостинга.

### 5. Пересборка метаданных для 101 статьи (P2)
- После этапа 1 title/description/JSON-LD собираются из тела статьи автоматически — расхождения (73 headline, 77 description, 17 dateModified) закрываются одним пересборкой.
- Правило `dateModified`: берётся из frontmatter `updatedAt` (md) или колонки `updated_at` (DB); отсутствие поля → `datePublished`. Не завязываемся на дату билда.

### 6. Замена 22 устаревших внутренних ссылок (P2)
- Скрипт `scripts/rewrite-legacy-links.mjs` с картой из аудита прогоняется по `src/content/blog/*.md`, `src/data/blogPosts.ts` и DB (через SQL update). Изменения ревьюим по diff перед коммитом.
- В `scripts/verify-prerender-seo.mjs` добавить проверку: все `/blog/*` href внутри prerender HTML указывают на существующий slug реестра, иначе fail.

### 7. Расширение автопроверок (`npm run seo:check`)
Для каждой публикации в реестре:
- prerender-файл существует, HTTP 200, ровно один `<h1>`, `<article>` в `#root`, canonical=self, есть `BlogPosting` JSON-LD, headline/description совпадают с реестром, `dateModified` заполнен.
- URL присутствует в сгенерированном `sitemap.xml`.

Для каждой записи в `redirects.ts`:
- prerender-файл содержит `meta refresh` и `rel=canonical` на целевой slug, `noindex`, целевой slug присутствует в реестре, старый URL отсутствует в `sitemap.xml`.

Для неизвестных `/blog/<slug>` — prerender не создаётся, SPA-fallback показывает `NotFound` (HTTP 200 из-за платформы; в отчёте пометить как known limitation).

### 8. Редакционные задачи (только после ревью, вручную)
Не выполняются автоматически: расширение `shkala-trevogi-beka-bai`, добавление источников в `8-prepyatstvij…` и `ontologiya-psihoterapii`, усиление перелинковки в `vygoranie-ot-domashek-v-terapii`, `upushchenie-vazhnogo-elementa`, `bessistemnost-i-haos`, `60-sekund-dofamin-tyaga`.

## Технические детали

```text
build pipeline
──────────────
predev/prebuild
  ├─ scripts/fetch-db-posts.mjs      → src/data/dbBlogPosts.generated.ts
  ├─ scripts/gen-blog-manifest.mjs   → src/content/blog/_manifest.generated.ts
  ├─ scripts/gen-mcp-posts.mjs       → src/lib/mcp/posts.generated.ts
  └─ scripts/gen-sitemap.mjs         → public/sitemap.xml + public/llms.txt

vite build
  └─ vite-plugin-seo (closeBundle)
       ├─ статические маршруты из seo-routes.ts
       ├─ статьи из publishedPosts (md + JSON + DB)
       └─ редиректы из src/lib/redirects.ts (soft-redirect HTML)

postbuild
  └─ scripts/verify-prerender-seo.mjs (fail-fast по чек-листу этапа 7)
```

Секрет для fetch-db-posts: используем существующий `SUPABASE_URL` + `SUPABASE_PUBLISHABLE_KEY` (RLS уже позволяет читать `published=true`); service-role не требуется.

## Что НЕ меняем
- Тексты статей и интерактивные компоненты (диаграммы, тесты, CTA).
- Существующие канонические slugs.
- Дизайн `BlogPost.tsx` и связанных компонентов.

## Критерии готовности
- `publishedPosts` содержит 101 запись, столько же в `sitemap.xml` и prerender-выдаче.
- Все 15 DB-only статей имеют `dist/blog/<slug>/index.html` с self-canonical, `<article>` и JSON-LD.
- 10 редиректов и 1 `410` отдаются prerender-страницами с `meta refresh` + `rel=canonical` + `noindex`; UX-редирект в SPA сохранён.
- `npm run seo:check` проходит без ошибок и падает при пустом теле / рассинхроне метаданных / битых внутренних ссылках.
- В репозитории нет ссылок на 18 устаревших slugs из аудита.
- Редакционные задачи выведены отдельным списком и не тронуты без явного запроса.
