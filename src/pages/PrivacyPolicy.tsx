import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const PrivacyPolicy = () => (
  <>
    <SEOHead
      title="Политика конфиденциальности — CognitionX"
      description="Политика конфиденциальности сайта CognitionX. Как мы собираем, используем и защищаем ваши данные."
      path="/privacy"
      noindex
    />
    <Navbar />
    <main className="max-w-3xl mx-auto px-6 py-20 md:py-28">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8">Политика конфиденциальности</h1>

      <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
        <p>Дата последнего обновления: 13 апреля 2026 г.</p>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">1. Общие положения</h2>
          <p>
            Настоящая Политика конфиденциальности определяет порядок сбора, использования, хранения и защиты
            персональных данных пользователей сайта cognitionx.cloud (далее — «Сайт»), принадлежащего
            Дмитрию Яцко (далее — «Оператор»).
          </p>
          <p className="mt-2">
            Используя Сайт, вы соглашаетесь с условиями данной Политики. Если вы не согласны с условиями,
            пожалуйста, прекратите использование Сайта.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">2. Какие данные мы собираем</h2>
          <p>Мы можем собирать следующие данные:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Контактные данные:</strong> имя, адрес электронной почты, мессенджер — при заполнении форм на Сайте.</li>
            <li><strong>Текст сообщений:</strong> содержание обращений через контактные формы.</li>
            <li><strong>Технические данные:</strong> IP-адрес, тип браузера, страницы посещений, источник перехода — собираются автоматически.</li>
            <li><strong>Данные аналитики:</strong> информация о взаимодействии с Сайтом через Google Analytics, Яндекс.Метрику и Meta Pixel.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">3. Цели обработки данных</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Обработка заявок и обратная связь.</li>
            <li>Улучшение качества Сайта и его содержания.</li>
            <li>Анализ посещаемости и эффективности рекламных кампаний.</li>
            <li>Выполнение обязательств перед пользователями.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">4. Использование файлов cookie</h2>
          <p>
            Сайт использует файлы cookie и аналогичные технологии для аналитики и улучшения пользовательского опыта.
            Вы можете отключить cookie в настройках вашего браузера, однако это может повлиять на функциональность Сайта.
          </p>
          <p className="mt-2">На сайте используются следующие сервисы аналитики:</p>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>Google Analytics (Google LLC)</li>
            <li>Яндекс.Метрика (ООО «Яндекс»)</li>
            <li>Meta Pixel (Meta Platforms, Inc.)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">5. Передача данных третьим лицам</h2>
          <p>
            Мы не продаём и не передаём ваши персональные данные третьим лицам, за исключением случаев,
            предусмотренных законодательством, а также использования сторонних сервисов аналитики,
            указанных в разделе 4.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">6. Защита данных</h2>
          <p>
            Мы принимаем разумные меры для защиты ваших персональных данных от несанкционированного доступа,
            изменения, раскрытия или уничтожения. Данные хранятся на защищённых серверах с использованием
            шифрования.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">7. Ваши права</h2>
          <p>Вы имеете право:</p>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>Запросить информацию о хранимых данных.</li>
            <li>Потребовать исправления или удаления ваших данных.</li>
            <li>Отозвать согласие на обработку данных.</li>
          </ul>
          <p className="mt-2">
            Для реализации своих прав свяжитесь с нами по адресу:{" "}
            <a href="mailto:digitalgringoo@gmail.com" className="text-primary hover:underline">
              digitalgringoo@gmail.com
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">8. Изменения в политике</h2>
          <p>
            Оператор оставляет за собой право вносить изменения в настоящую Политику. Актуальная версия
            всегда доступна на данной странице.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">9. Контакты</h2>
          <p>
            По всем вопросам, связанным с обработкой персональных данных, вы можете обратиться по адресу:{" "}
            <a href="mailto:digitalgringoo@gmail.com" className="text-primary hover:underline">
              digitalgringoo@gmail.com
            </a>
          </p>
        </section>
      </div>
    </main>
    <Footer />
  </>
);

export default PrivacyPolicy;
