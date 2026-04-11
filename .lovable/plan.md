

# Добавить поле «Telegram / WhatsApp» в формы заявок

## Что сделаем

Заменим поле «Телефон» на поле «Telegram или WhatsApp» — чтобы клиенты сразу указывали удобный мессенджер для связи.

## Изменения

### 1. Миграция базы данных
- Переименовать колонку `phone` → `messenger` в таблице `contact_submissions` (или добавить новую и убрать старую — данных пока мало)
- Тип остаётся `text`, nullable

### 2. Обновить формы (2 файла)
- **`src/components/BookingForm.tsx`** — заменить поле «Телефон» на «Telegram / WhatsApp» с placeholder `@username или номер`, убрать `type="tel"`, обновить ключ `phone` → `messenger`
- **`src/pages/ContactPage.tsx`** — аналогичная замена

### 3. Обновить админ-панель
- **`src/pages/AdminDashboard.tsx`** — обновить отображение колонки: вместо «Телефон» показывать «Мессенджер»

## Файлы
| Файл | Действие |
|------|----------|
| Миграция SQL | `ALTER TABLE contact_submissions RENAME COLUMN phone TO messenger` |
| `src/components/BookingForm.tsx` | Обновить поле и ключ формы |
| `src/pages/ContactPage.tsx` | Обновить поле и ключ формы |
| `src/pages/AdminDashboard.tsx` | Обновить название колонки |

