# Blog audit — `src/data/blogPosts.ts`

Карта проблем по всем статьям. Приоритеты соответствуют этапам плана. Только статьи с проблемами; «чистые» статьи в таблицу не включены.

## Сводные проблемы по корпусу

- **Повтор «Разбираем…»** в description: `dehumanizaciya-chto-eto`, `ontologiya-psihoterapii`, `tri-karty-realnosti-v-psihoterapii`, `pochemu-my-boimsya-prosit-o-pomoshchi`, `simptomy-trevozhnogo-rasstrojstva`, `prokrastinaciya`, `perekladyvanie-otvetstvennosti`.
- **Смешение «ты»/«вы»** внутри одной статьи: `pochemu-my-boimsya-prosit-o-pomoshchi` (личное «я», «ты»), большинство остальных — «вы».
- **«Тонкие» статьи** (короткий контент, нет практического блока или CTA): `perekladyvanie-otvetstvennosti`, `kogda-nichego-ne-hochetsya`, `simptomy-trevozhnogo-rasstrojstva`, `prokrastinaciya`, `sindrom-samozvantsa`, `vygoranie-ili-ustalost`, `pervaya-sessiya-u-psihologa`, `kak-vybrat-psihologa` (короткая версия, ср. с расширенной на 2150).
- **Дубликаты slug** в файле: `kak-vybrat-psihologa` (828 и 2150), `panicheskaya-ataka-chto-delat` (1001 и 2222). Не правлю на этом этапе — выходит за рамки задачи редактуры тона. Стоит обсудить отдельно: оставлять расширенную версию или объединить.
- **Слишком энциклопедично** — серия «Куда мы уходим…» (1323–1453): заголовки поэтичные, но description не даёт практической пользы.
- **Слишком клинично** — серия по схема-терапии (756, 1058–1204): хорошие материалы, но единой структуры и живых сцен не хватает.

## Таблица по приоритетам

| Slug | Приоритет | Проблема | title? | desc? | content? |
|---|---|---|---|---|---|
| postoyannaya-trevoga-bez-prichiny | 1 | Длинно, клинично; нет мягкого CTA в финале | — | ✔ | ✔ |
| panicheskaya-ataka-chto-delat | 1 | Хороший каркас, но прямолинейные обещания («8–12 сессий»); CTA жёсткий | — | ✔ | ✔ |
| simptomy-trevozhnogo-rasstrojstva | 1 | «Тонкая», «Разбираем…», нет практики и CTA | — | ✔ | ✔ |
| kak-spravitsya-s-trevozhnostyu | 1 | «Тревога — не враг»: метафора слабая; нет «что сделать сегодня» | — | ✔ | ✔ |
| priznaki-depressii | 2 | Сухо, нет кризисного блока | — | ✔ | ✔ |
| utrom-net-sil-zhit | 2 | Может звучать как давление; нет нестыдящих формулировок | — | ✔ | ✔ |
| kogda-nichego-ne-hochetsya | 2 | Короткая, нет практики | — | ✔ | ✔ |
| planirovanie-dnya-pri-depressii | 2 | Местами «нужно просто» | — | ✔ | ✔ |
| depressiya-ili-vygoranie | 2 | Достаточно живая, нужны мелкие правки | — | возможно | ✔ |
| kak-vybrat-psihologa (короткая, 828) | 3 | Нет чек-листа, нет «красных флагов» | — | ✔ | ✔ |
| pervaya-sessiya-u-psihologa | 3 | Не названы реальные страхи; общие фразы | — | ✔ | ✔ |
| perekladyvanie-otvetstvennosti | 4 | Сильная мысль, но мало структуры/примеров | — | ✔ | ✔ |
| prokrastinaciya | 4 | «Разбираем…», нет блока практики | — | ✔ | ✔ |
| sindrom-samozvantsa | 4 | Короткая, нет блока «что попробовать» | — | ✔ | ✔ |
| vygoranie-ili-ustalost | 4 | Нет различий «как отличить», нет CTA | — | ✔ | ✔ |
| chto-takoe-kpt | 4 | Уже хорошая; косметика | — | — | возможно |
| 8-prepyatstvij-na-puti-k-peremenam | 5 | База серии, нужно зафиксировать каркас | — | возможно | ✔ |
| izbeganie-pobeg-ot-lovushki | 5 | Нет живой сцены, мало примеров | — | ✔ | ✔ |
| kognitivnyj-barjer-vera-v-istinnost | 5 | Длинно, академично | — | возможно | ✔ |
| strategiya-peremen-popytka-sdelat-vsyo-srazu | 5 | Нет «когда нужна терапия» | — | ✔ | ✔ |
| emocionalnaya-vera | 5 | Нет повседневных примеров | — | ✔ | ✔ |
| bessistemnost-i-haos | 5 | Сухо | — | ✔ | ✔ |
| upushchenie-vazhnogo-elementa | 5 | Нет ссылки назад на «8 препятствий» | — | ✔ | ✔ |
| granicy-samopomoshchi | 5 | Хороший материал, нужна унификация структуры | — | — | ✔ |
| vsyo-ne-to-chem-kazhetsya | 6 | Title поэтичный, description без пользы | возможно | ✔ | ✔ |
| my-ne-dotyagivaem | 6 | То же | возможно | ✔ | ✔ |
| my-ishchem-svyaz | 6 | То же | возможно | ✔ | ✔ |
| ocenka-sebya | 6 | То же | возможно | ✔ | ✔ |
| zhizn-horosha | 6 | То же | возможно | ✔ | ✔ |
| my-ryadom-s-drugimi | 6 | То же | возможно | ✔ | ✔ |
| serdce-otkryto | 6 | То же | возможно | ✔ | ✔ |
| nas-obideli | 6 | То же | возможно | ✔ | ✔ |
| vsyo-idyot-ne-po-planu | 6 | То же | возможно | ✔ | ✔ |
| eto-bolshe-nas | 6 | То же | возможно | ✔ | ✔ |
| nam-bolno | 6 | То же | возможно | ✔ | ✔ |
| vsyo-neopredelyonno | 6 | То же | возможно | ✔ | ✔ |
| my-sravnivaem | 6 | То же | возможно | ✔ | ✔ |

## Что не меняем

- Статьи `5-kpt-uprazhnenij`, `kak-vybrat-kpt-psihologa`, `kpt-pri-trevoge`, `kpt-pri-depressii`, `dokazatelnaya-baza-kpt`, `kpt-polnyj-gajd`, `shema-terapiya-polnyj-gajd` уже соответствуют голосу — не трогаем без отдельной задачи.
- Тестовые/инструментальные статьи (`who-5-blagopoluchie`, `okr-priznaki-i-test` и т.п.) — структурно отличаются, отдельный этап при необходимости.
