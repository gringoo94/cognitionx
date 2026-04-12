

## SEO-исправления: render-blocking шрифты, дубль canonical, 404, Google Analytics

### 1. Render-blocking шрифты

**Проблема**: Два источника render-blocking шрифтов:
- `index.html` — Google Fonts (DM Serif Display, Inter) загружаются синхронно
- `src/index.css` — `@import url(...)` для Space Grotesk и JetBrains Mono — тоже блокирует рендер

**Решение**:
- В `index.html`: заменить синхронный `<link rel="stylesheet">` на **print-media hack** (`media="print" onload="this.media='all'"`) + `<noscript>` fallback
- В `index.html`: добавить `<link rel="preload" as="style">` для обоих шрифтовых URL
- В `src/index.css`: убрать `@import url(...)` и перенести загрузку Space Grotesk / JetBrains Mono в `index.html` тем же способом (print-media hack)
- Добавить `&display=swap` к URL шрифтов (уже есть у некоторых)

### 2. Дубль canonical

**Проблема**: `index.html` может содержать остаточный canonical, а React Helmet добавляет свой через SEOHead.

**Решение**: Убедиться что в `index.html` нет `<link rel="canonical">` — всё управляется через SEOHead.

### 3. 404 страница

**Проблема**: Текущая 404 — минимальная. Для SEO и UX нужна навигация (Navbar/Footer), ссылки на популярные разделы, и правильные мета-теги.

**Решение**: Обновить `NotFound.tsx` — добавить Navbar, Footer, полезные ссылки на разделы сайта, и SEOHead с noindex.

### 4. Google Analytics placeholder

**Решение**: Создать компонент `src/components/GoogleAnalytics.tsx` который:
- Принимает GA ID из переменной окружения `VITE_GA_ID`
- Если ID задан — вставляет gtag.js скрипт через Helmet
- Если не задан — ничего не рендерит
- Подключить в `App.tsx`

### Файлы для изменения

| Файл | Действие |
|------|----------|
| `index.html` | Async-загрузка всех шрифтов (print hack), убрать canonical если есть |
| `src/index.css` | Убрать `@import url(...)` на строке 1 |
| `src/pages/NotFound.tsx` | Полноценная 404 с навигацией и ссылками |
| `src/components/GoogleAnalytics.tsx` | Новый компонент — GA placeholder |
| `src/App.tsx` | Подключить GoogleAnalytics |

