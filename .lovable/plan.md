

## SEO-оптимизация под SPA-ограничения

Текущее состояние хорошее: 7 страниц проблем, SEOHead, JSON-LD schema, sitemap. Нужно доработать по рекомендациям из твоего анализа.

---

### 1. SEOHead на все страницы (сейчас только на problem pages)

Добавить `SEOHead` на:
- **Index.tsx** — title: "Психолог онлайн | КПТ терапия — Дмитрий Яцко", schema: `Person` + `ProfessionalService`
- **BlogList.tsx** — title: "Блог психолога | КПТ, тревога, депрессия"
- **BlogPost.tsx** — динамический title/description из данных поста
- **Tools.tsx** — title: "КПТ инструменты | Психолог Дмитрий Яцко"

### 2. Расширить JSON-LD schema

- **Главная**: добавить `ProfessionalService` schema (name, address/areaServed, url, sameAs)
- **Страницы проблем**: добавить `BreadcrumbList` schema
- **Блог-посты**: добавить `Article` schema (headline, author, datePublished)

### 3. Контент на problem pages — убрать скрытый текст

Сейчас FAQ в аккордеонах — Google может их не проиндексировать. Варианты:
- Рендерить FAQ-контент видимым (без аккордеонов), или
- Оставить аккордеоны, но добавить `open` на первый элемент

Рекомендация: оставить аккордеоны (UX), но schema уже покрывает FAQ для Google.

### 4. Добавить `BreadcrumbList` schema на problem pages

```json
{
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "position": 1, "name": "Главная", "item": "https://yatsko-psy.ru/" },
    { "position": 2, "name": "Депрессия", "item": "https://yatsko-psy.ru/depression" }
  ]
}
```

### 5. Sitemap — добавить blog posts

Сейчас в sitemap нет отдельных статей блога. Добавить все `/blog/{slug}` URLs.

### 6. robots.txt — проверить/обновить

Убедиться что robots.txt указывает на sitemap и не блокирует JS.

### 7. noindex на служебные страницы

Добавить noindex на NotFound (404) страницу.

---

### Технические детали

**Файлы для изменения:**
- `src/pages/Index.tsx` — добавить SEOHead + ProfessionalService schema
- `src/pages/BlogList.tsx` — добавить SEOHead
- `src/pages/BlogPost.tsx` — добавить SEOHead + Article schema
- `src/pages/Tools.tsx` — добавить SEOHead
- `src/pages/NotFound.tsx` — добавить noindex meta
- `src/components/ProblemPage.tsx` — добавить BreadcrumbList schema
- `public/sitemap.xml` — добавить blog post URLs
- `public/robots.txt` — обновить с указанием sitemap

**Без новых зависимостей** — всё на уже установленном `react-helmet-async`.

