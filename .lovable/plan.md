## Цель

Добавить возможность писать статьи блога одним `.md` файлом, не меняя существующие статьи (они продолжат жить в `blogPosts.ts` как блоки). URL, SEO, JSON-LD (BlogPosting/FAQPage), автор, стили и CTA остаются как есть — Markdown лишь заменяет источник тела статьи.

## Как это будет работать

1. **Хранение**: новые статьи — файлы `src/content/blog/<slug>.md` с YAML frontmatter (title, description, date, updatedAt, tags, image, faq?).
2. **Регистрация**: Vite через `import.meta.glob('/src/content/blog/*.md', { eager: true, as: 'raw' })` собирает все `.md` в массив `mdPosts: BlogPost[]` в момент сборки. Frontmatter парсится (простой парсер — без внешней зависимости), тело Markdown кладётся в один блок нового типа `markdown` (без ре-парсинга в блоки).
3. **Слияние источников**: `blogPosts.ts` экспортирует объединённый массив `[...mdPosts, ...legacyBlockPosts]`, сортированный по `date desc`. Дубли по `slug` — приоритет у `.md` (миграционный путь).
4. **Рендеринг**: в `ContentBlock.type` добавляем `"markdown"`. В `BlogPost.tsx` в цикле `post.content.map` — новая ветка: `if (block.type === "markdown")` → `<ReactMarkdown remarkPlugins={[remarkGfm]} components={{...}} />` в тот же самый обёрточный `div` со всеми существующими Tailwind-стилями (списки, таблицы, ссылки, `strong`, `em`). Ничего в шапке статьи (дата, автор, TL;DR, обложка, subscribe, JSON-LD, FAQPage, related, CTA-мост) не меняется.
5. **Кастомные вставки**: в Markdown поддерживаем «магические» строки-плейсхолдеры на отдельной строке, которые Markdown-рендер перехватывает и заменяет на существующие React-компоненты — так же как сейчас работают `component` блоки:
   ```
   ::component{id=emotion-wheel}
   ::component{id=behavioral-activation-diary}
   ::component{id=rfcbt-modes}
   ::component{id=decision-matrix-cta}
   ```
   Реализуется через `remark-directive` + маленький ремарк-визитор (или простой pre-парсинг строк перед `ReactMarkdown`).
6. **FAQ**: FAQ по-прежнему живёт в `faqBySlug` в `BlogPost.tsx` — миграция статьи не затрагивает FAQPage JSON-LD и Accordion. Дополнительно frontmatter поле `faq: [{q,a}]` можно добавить позже — но в этой задаче не трогаем, чтобы не задеть существующий JSON-LD.
7. **SEO / sitemap / llms.txt**: `seo-routes.ts`, `sitemap.xml`, `public/llms-full.txt`, MCP `list_blog_posts` уже читают массив `blogPosts` — поскольку `.md`-посты вливаются в тот же массив с теми же полями, ничего в этих файлах менять не нужно. `updatedAt` для sitemap берётся из frontmatter.

## Миграция одной статьи

Уточните, какую статью мигрировать первой (кандидаты — последняя отредактированная):
- `rfcbt-dva-stilya-myshleniya` («Два режима мышления при руминации»)
- `shema-terapiya-polnyj-gajd` (сейчас открыта в превью)
- иная — назовите slug.

По умолчанию беру `rfcbt-dva-stilya-myshleniya` (последняя из редактированных, компактнее для проверки миграционного пайплайна). URL `/blog/rfcbt-dva-stilya-myshleniya` сохраняется, `title`/`description`/`date`/`updatedAt`/`tags`/`image` переносятся в frontmatter, тело — в Markdown, вставка `RfcbtModesDiagram` — через `::component{id=rfcbt-modes}`. Запись в `blogPosts.ts` удаляется; при следующей сборке статья приходит из `.md`.

## Технические детали

- Зависимости: `react-markdown`, `remark-gfm`, `remark-directive` (для `::component`). Всё легковесное, tree-shakeable.
- Frontmatter парсер: минимальный собственный (~40 строк) — без `gray-matter`, чтобы не тащить Buffer-полифиллы в браузер. Парсинг происходит в build-time через Vite raw import.
- `parseContent` в `blogPosts.ts` не трогаем — он обслуживает только legacy JSON строки в БД/`mcp/index.ts`.
- Тип `ContentBlock["type"]` расширяется значением `"markdown"`.
- В `BlogPost.tsx` `wordCount` продолжит работать: `.replace(/<[^>]+>/g,'')` заменим на общую очистку от markdown/HTML (regex достаточно), чтобы JSON-LD `wordCount` остался разумным.
- Стили: обёртка `div` вокруг `ReactMarkdown` наследует те же `[&_ul]`, `[&_ol]`, `[&_a]`, `[&_table]`, `[&_strong]` классы, что и текущий text-блок → визуально Markdown-статья неотличима от блочной.
- Supabase `blog_posts` таблица и `useBlogPosts` (БД-first, статик-fallback) не меняются: если статья есть в БД — она грузится оттуда как раньше; `.md` источник задействуется только когда БД пуста или статьи в ней нет.

## Файлы, которые изменятся

- `package.json` — `react-markdown`, `remark-gfm`, `remark-directive` (+ типы).
- `src/data/blogPosts.ts` — новый тип `markdown`, glob-импорт `.md`, слияние массивов, удаление записи мигрированной статьи.
- `src/content/blog/<slug>.md` — новый файл с одной статьёй.
- `src/pages/BlogPost.tsx` — рендер `type: "markdown"` блока через `ReactMarkdown` + обработка `::component{...}`.
- (при необходимости) `src/lib/parseFrontmatter.ts` — минимальный YAML-парсер.

Не меняются: `seo-routes.ts`, `public/sitemap.xml` (перегенерируется автоматически), `public/llms-full.txt` (то же), `supabase/functions/mcp/index.ts` (читает slug из БД), FAQ схема, компонент автора, CTA-мост, обложки.

## После внедрения

Добавление новой статьи = положить один файл `src/content/blog/moya-statya.md`. Никаких правок TS, JSON-LD, sitemap или SEO-роутов — всё подтянется автоматически при сборке.

## Уточнение

Подтвердите slug статьи для миграции (или согласитесь на `rfcbt-dva-stilya-myshleniya` по умолчанию) — начну реализацию.