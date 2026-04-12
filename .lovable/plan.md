

## Гео-лендинги: Москва и Европа

### Что создадим

Два новых гео-лендинга для привлечения русскоязычных клиентов из других регионов:

1. **`/psiholog-moskva`** — «Психолог онлайн для Москвы и России»
2. **`/psiholog-europa`** — «Русскоязычный психолог для экспатов в Европе»

Оба — про онлайн-формат, с уникальным контентом под каждую аудиторию.

### Контент-стратегия (избегаем doorway pages)

| Страница | Уникальный акцент |
|---|---|
| **Москва** | Часовой пояс, удобство онлайн vs пробки, специфика запросов (темп жизни, выгорание), расписание по МСК |
| **Европа** | Языковой барьер с местными психологами, адаптация, одиночество в эмиграции, гибкие часовые пояса CET/EET |

### Технические изменения

**1. `src/data/problemPages.ts`** — добавляем 2 записи:
- `psiholog-moskva` с LocalBusiness schema (виртуальный офис), уникальными симптомами, FAQ, psychoeducation
- `psiholog-europa` с аналогичной структурой, но другим контентом про экспатов

**2. `src/App.tsx`** — 2 новых маршрута

**3. `src/components/ProblemPage.tsx`** — добавляем LocalBusiness schema для обоих гео-лендингов (как уже сделано для in-person-therapy)

**4. `src/components/Specializations.tsx`** — не добавляем в основную навигацию (это SEO-лендинги, не основные услуги)

**5. `src/components/Footer.tsx`** — добавляем колонку «География» с двумя ссылками

**6. `public/sitemap.xml`** — добавляем оба URL с priority 0.8

**7. Перелинковка** — гео-лендинги ссылаются на online-therapy, depression, anxiety, burnout; а online-therapy получает ссылки обратно

### SEO-разметка каждого лендинга

- `LocalBusiness` schema с `areaServed` (Россия / Европа)
- `ServiceType`: Онлайн-психотерапия
- Уникальные `title`, `description`, `h1`
- `hreflang="ru"` 
- Breadcrumbs schema

### Файлы

| Файл | Действие |
|---|---|
| `src/data/problemPages.ts` | +2 записи с уникальным контентом |
| `src/App.tsx` | +2 маршрута |
| `src/components/ProblemPage.tsx` | Расширить LocalBusiness логику |
| `src/components/Footer.tsx` | Колонка «География» |
| `public/sitemap.xml` | +2 URL |

