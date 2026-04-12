

## Обновить домен на cognitionx.cloud

Глобальная замена `yatsko-psy.ru` → `cognitionx.cloud` во всех файлах проекта.

### Затронутые файлы (11 файлов)

| Файл | Что меняется |
|---|---|
| `src/components/SEOHead.tsx` | `SITE_URL` константа |
| `src/pages/Index.tsx` | URL в schema Person и ProfessionalService |
| `src/pages/AboutPage.tsx` | URL в schema и breadcrumbs |
| `src/pages/ContactPage.tsx` | URL в schema и breadcrumbs |
| `src/pages/BlogPost.tsx` | URL автора и breadcrumbs |
| `src/pages/BlogList.tsx` | breadcrumbs |
| `src/pages/Tools.tsx` | breadcrumbs |
| `src/components/ProblemPage.tsx` | URL в schema и breadcrumbs |
| `public/sitemap.xml` | Все URL (30+ записей) |
| `public/robots.txt` | Sitemap URL |

### Техническая деталь

Все замены — простая текстовая подстановка `yatsko-psy.ru` → `cognitionx.cloud`. Логика и структура кода не меняются.

