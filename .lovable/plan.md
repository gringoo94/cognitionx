

## Полная SEO-диагностика сайта cognitionx.cloud

### Критические проблемы (High Priority)

| # | Проблема | Где | Влияние |
|---|---------|-----|---------|
| 1 | **Canonical в index.html указывает на старый домен** `yatsko-psy.ru` | `index.html:10` | Google может считать основным другой домен. Каноникал должен быть `https://cognitionx.cloud/` |
| 2 | **Дублирование meta в index.html и SEOHead** | `index.html` + `src/pages/Index.tsx` | Два title, два description, два canonical на главной. React Helmet перезаписывает, но при SSR/прекраткинге могут быть конфликты |
| 3 | **JSON-LD в index.html устарел** — цена 2500 RUB, areaServed "Россия" | `index.html:19-46` | Конфликт с актуальными данными (25 €, Кишинёв/Молдова/Онлайн) из SEOHead на главной |
| 4 | **Sitemap без `<lastmod>`** | `public/sitemap.xml` | Google рекомендует lastmod для приоритезации краулинга |

### Средние проблемы (Medium Priority)

| # | Проблема | Где | Влияние |
|---|---------|-----|---------|
| 5 | **og:type="website" для блог-постов** | `SEOHead.tsx` всегда ставит `website` | Для статей должен быть `og:type="article"` |
| 6 | **Hero-фото без `loading="eager"`** | `Hero.tsx:84` | LCP-элемент не должен быть lazy; сейчас нет атрибута, но стоит явно указать `eager` |
| 7 | **BlogPost hero image с `loading="lazy"`** | `BlogPost.tsx:81` | Главное изображение статьи — LCP, не должно быть lazy |
| 8 | **Нет `<meta name="robots">` по умолчанию** | `SEOHead.tsx` | Без noindex не ставится `index, follow` — не критично, но явный сигнал лучше |
| 9 | **Telegram CTA ссылка без `rel="noopener noreferrer"`** | Несколько компонентов | Безопасность внешних ссылок; некоторые уже имеют, некоторые нет |
| 10 | **`meta keywords` в index.html** | `index.html:9` | Google игнорирует keywords с 2009, лишний код |

### Низкие проблемы (Low Priority)

| # | Проблема | Где | Влияние |
|---|---------|-----|---------|
| 11 | **Нет `twitter:image`** | `SEOHead.tsx` | Twitter/X не покажет preview-картинку |
| 12 | **Breadcrumbs дублируются** — ProblemPage сам создаёт breadcrumbSchema + SEOHead может добавить второй через `breadcrumbs` prop | `ProblemPage.tsx:53-60` | Два BreadcrumbList в JSON-LD |
| 13 | **Нет `dateModified` в Article schema** | `BlogPost.tsx:27-39` | Google предпочитает видеть dateModified |
| 14 | **SPA без SSR** | Архитектура | Поисковики рендерят JS, но SSR/prerendering ускоряет индексацию |
| 15 | **Нет `x-default` hreflang** | `SEOHead.tsx:47` | Есть только `ru`, нет fallback |

### Что уже хорошо

- Уникальные title и description на каждой странице
- FAQPage schema на всех problem pages и главной
- BreadcrumbList schema
- LocalBusiness / ProfessionalService для гео-лендингов
- Canonical URLs через SEOHead
- og:image fallback
- robots.txt + sitemap.xml
- 404 с noindex
- Хорошая внутренняя перелинковка (relatedPages, relatedArticles)
- Lazy loading для неосновных изображений
- Semantic HTML (h1/h2/h3, main, nav, footer, article)

---

### План исправлений

**1. `index.html`** — убрать дублирующие meta (title, description, canonical, keywords) и устаревший JSON-LD. Оставить только базовый HTML-каркас, шрифты и favicon. React Helmet управляет всеми мета-тегами.

**2. `src/components/SEOHead.tsx`**:
- Добавить prop `ogType` (default `"website"`, для статей `"article"`)
- Добавить `<meta name="twitter:image">`
- Добавить `<link rel="alternate" hrefLang="x-default">`

**3. `src/pages/BlogPost.tsx`**:
- Передавать `ogType="article"` в SEOHead
- Добавить `dateModified` в Article schema
- Убрать `loading="lazy"` с hero-изображения

**4. `src/components/Hero.tsx`** — добавить `loading="eager"` и `fetchPriority="high"` на hero-фото

**5. `src/components/ProblemPage.tsx`** — убрать дублирование breadcrumbSchema (оно уже создаётся вручную в schemas, не нужно передавать `breadcrumbs` prop)

**6. `public/sitemap.xml`** — добавить `<lastmod>` ко всем URL

**7. Внешние ссылки** — пройтись по Telegram/WhatsApp/Instagram ссылкам и добавить `rel="noopener noreferrer"` где отсутствует

### Файлы для изменения

| Файл | Что делаем |
|------|-----------|
| `index.html` | Убрать дублирующие мета и устаревший JSON-LD |
| `src/components/SEOHead.tsx` | ogType prop, twitter:image, x-default hreflang |
| `src/pages/BlogPost.tsx` | ogType="article", dateModified, eager loading |
| `src/components/Hero.tsx` | loading="eager", fetchPriority="high" |
| `src/components/ProblemPage.tsx` | Убрать дубль breadcrumbs |
| `public/sitemap.xml` | Добавить lastmod |

