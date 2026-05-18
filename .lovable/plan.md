## Контекст

SEO-аудит чист (единственная находка — ложноположительная по приватным маршрутам, уже закрыта). База сильная: пререндер мета по 117 маршрутам через `vite-plugin-seo.ts`, JSON-LD Person/Organization/WebSite в `index.html`, BlogPosting + FAQPage в `BlogPost.tsx`, llms.txt с каталогом, robots.txt с правилами для GPTBot/CCBot, sitemap.

Цель этого плана — поднять видимость в **ИИ-выдаче** (ChatGPT, Claude, Perplexity, Google AI Overviews) и догнать оставшиеся точки роста для Google.

## Что делаем

### 1. robots.txt — явные правила для всех значимых ИИ-краулеров

Сейчас перечислены только `GPTBot` и `CCBot` (и то только с `Disallow: /admin`). Добавляем явные блоки `Allow` для:

- `GPTBot` (OpenAI / ChatGPT), `OAI-SearchBot`, `ChatGPT-User`
- `ClaudeBot`, `Claude-Web`, `anthropic-ai` (Anthropic)
- `PerplexityBot`, `Perplexity-User`
- `Google-Extended` (обучение Gemini — без этого нас исключают из AI Overviews)
- `Applebot-Extended` (Apple Intelligence)
- `Amazonbot`, `Meta-ExternalAgent`, `Bytespider` (TikTok/Doubao)
- `Diffbot`, `Cohere-ai`

Запрет на `/admin*` и `/thank-you` сохраняем для всех.

### 2. llms-full.txt — полные тексты статей для LLM

Создаём `scripts/generate-llms-full.ts` (запускается в `predev`/`prebuild`), который:

- Берёт все статьи из `src/data/blogPosts.ts`
- Конвертирует структурированный `content[]` в чистый Markdown
- Склеивает в `public/llms-full.txt` по конвенции llmstxt.org
- Каждая статья с заголовком `# {title}`, датой, тегами, URL и полным текстом

llms.txt оставляем как индекс/карту сайта; llms-full.txt — полный корпус, который ChatGPT/Claude/Perplexity забирают целиком при первом краулинге.

### 3. Дискаверабилити llms.txt из HTML

В `index.html` добавляем:

```html
<link rel="alternate" type="text/markdown" title="llms.txt" href="/llms.txt" />
<link rel="alternate" type="text/markdown" title="llms-full.txt" href="/llms-full.txt" />
```

Это конвенция для LLM-агентов — они проверяют `<link rel="alternate" type="text/markdown">` так же, как браузеры читают RSS.

### 4. BreadcrumbList на всех страницах

Добавляем переиспользуемый компонент `Breadcrumbs` (визуальный + JSON-LD) и встраиваем на:

- Блог-посты (`/blog/:slug`): Главная → Блог → Заголовок
- Tool-страницы (`/tools/*`): Главная → Инструменты → Название
- Гео-страницы (`/psiholog-*`): Главная → География → Город
- Проблемные страницы (`/depression`, `/anxiety`, …)

Хлебные крошки в JSON-LD дают rich snippet в Google и явный иерархический контекст ИИ-краулерам.

### 5. Расширенные schema.org типы

- **HowTo** на инструментах (`/tools/abc-analysis`, `/tools/behavioral-activation`, `/tools/abstract-to-concrete`, `/tools/emotion-wheel`, `/tools/schema-quiz`) — шаги, инструменты, ожидаемый результат
- **MedicalWebPage** + **MedicalCondition** на проблемных страницах (`/depression`, `/anxiety`, `/panic-attacks`, `/burnout`, `/stress`, `/self-esteem`, `/co-dependency`, `/addiction`) с указанием `MedicalAudience`, `lastReviewed`, автора-эксперта
- **Quiz** на `/tools/schema-quiz` и тестах в `/tools/tests/:slug`
- **Speakable** на статьях блога — отмечает абзацы, пригодные для голосовых ассистентов и AI Overviews
- **mentions** и **about** на BlogPosting со ссылками на Person и связанные термины

### 6. dateModified отдельно от datePublished

Сейчас `BlogPost.tsx` использует `datePublished == dateModified == post.date`. Добавляем поле `updatedAt?: string` в схему `blogPosts`, и если оно есть — используем его в `dateModified`. Свежесть — сильный сигнал и для Google, и для ИИ-агентов, которые отдают приоритет недавно обновлённому контенту.

### 7. lastmod в sitemap

Сейчас sitemap статичный. Переводим его на генерацию через `scripts/generate-sitemap.ts` (как уже есть `generate-llms.ts` паттерн), который тянет `date`/`updatedAt` из `blogPosts.ts` и `seo-routes.ts` и пишет `<lastmod>`. Краулеры тогда видят, какие страницы реально менялись.

### 8. Доп. сигналы E-E-A-T

- В Person JSON-LD добавить `hasCredential` (диплом, сертификаты), `memberOf` (профассоциации) — если есть данные
- На странице `/about` отдельный Person с расширенными полями
- На блог-постах `author` уже ссылается на `#person` — оставляем как есть

## Что НЕ делаем (вне scope)

- Полный SSR/миграция на TanStack Start — отдельная история, обсуждали ранее
- Генерация новых OG-изображений под каждый пост
- Перевод контента на EN

## Технические детали

Файлы, которые трогаем:

```
public/robots.txt                          — расширяем AI-блоки
public/llms.txt                            — индекс остаётся, добавим ссылку на llms-full
index.html                                 — link rel=alternate
scripts/generate-llms-full.ts              — новый
scripts/generate-sitemap.ts                — новый (заменит ручной public/sitemap.xml)
package.json                               — predev/prebuild хуки
src/components/Breadcrumbs.tsx             — новый
src/components/SchemaHowTo.tsx             — новый helper для JSON-LD
src/components/SchemaMedicalWebPage.tsx    — новый helper
src/pages/BlogPost.tsx                     — Breadcrumbs + Speakable + dateModified
src/pages/Tools.tsx + tool pages           — Breadcrumbs + HowTo
src/pages/Depression.tsx и др. проблемные  — Breadcrumbs + MedicalWebPage
src/data/blogPosts.ts                      — опц. поле updatedAt
```

## Порядок выполнения

1. robots.txt + link rel=alternate в index.html (5 мин, инфраструктура для ИИ)
2. Breadcrumbs компонент + интеграция на 4 типа страниц
3. HowTo на инструментах
4. MedicalWebPage на проблемных
5. Speakable + dateModified на блоге
6. llms-full.txt генератор
7. sitemap.xml генератор с lastmod

Каждый шаг проверяется отдельно (билд + curl выдачи HTML на проверку JSON-LD).
