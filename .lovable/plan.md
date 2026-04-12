

## SEO-аудит и план улучшений

### Что уже хорошо
- SEOHead компонент с title, description, canonical, OG, Twitter, JSON-LD на всех страницах
- Structured data: Person, ProfessionalService, FAQPage, Article
- sitemap.xml и robots.txt на месте
- `noindex` на 404-странице

### Что нужно улучшить

#### 1. Изображения: alt-текст и lazy loading
Изображения в блоге и на страницах не имеют атрибута `loading="lazy"`, а alt-тексты часто просто дублируют заголовок. Нужно добавить `loading="lazy"` и улучшить описательность alt.

#### 2. Семантическая разметка `<img>` на главной
Фото в Hero не имеет описательного alt-текста.

#### 3. Внутренняя перелинковка в BreadcrumbList schema
Добавить BreadcrumbList JSON-LD на все вложенные страницы (блог-посты, problem pages, about, contact, tools). Это улучшает отображение в поиске.

#### 4. `hreflang` для указания языка
Добавить `<link rel="alternate" hreflang="ru" href="...">` в SEOHead — подтверждает Google, что контент на русском.

#### 5. Дублирование мета-тегов в `index.html`
`index.html` содержит жёстко зашитые OG/Twitter теги, которые конфликтуют с динамическими из react-helmet. Нужно убрать дубли из HTML, оставив только базовые (charset, viewport, favicon, шрифты).

#### 6. `og:locale` только в index.html
`og:locale` и `og:site_name` не передаются через SEOHead — они только в `index.html`. Нужно перенести в SEOHead, чтобы были на всех страницах.

#### 7. 404-страница на английском
Текст «Oops! Page not found» и «Return to Home» — на английском. Нужно перевести на русский для консистентности.

#### 8. Отсутствует `<meta name="robots">` на служебных страницах
Страницы `/admin`, `/admin/login`, `/tools` — стоит добавить `noindex` на admin-страницы.

---

### Технический план

| # | Файл | Изменение |
|---|------|-----------|
| 1 | `src/components/SEOHead.tsx` | Добавить `og:locale`, `og:site_name`, `hreflang`, опциональный `noindex`, опциональный BreadcrumbList |
| 2 | `index.html` | Удалить дублирующие OG/Twitter мета-теги (title, description, image), оставить только charset, viewport, favicon, fonts, JSON-LD |
| 3 | `src/pages/BlogPost.tsx` | Добавить BreadcrumbList schema, `loading="lazy"` на изображение |
| 4 | `src/components/ProblemPage.tsx` | Добавить BreadcrumbList schema |
| 5 | `src/pages/AboutPage.tsx` | Добавить BreadcrumbList |
| 6 | `src/pages/ContactPage.tsx` | Добавить BreadcrumbList |
| 7 | `src/pages/BlogList.tsx` | Добавить BreadcrumbList |
| 8 | `src/pages/Tools.tsx` | Добавить BreadcrumbList |
| 9 | `src/pages/NotFound.tsx` | Перевести текст на русский |
| 10 | `src/pages/AdminLogin.tsx` / `AdminDashboard.tsx` | Добавить `noindex` |
| 11 | `src/components/Hero.tsx` | Улучшить alt-текст фото |
| 12 | Все img-элементы в блоге | Добавить `loading="lazy"` |

