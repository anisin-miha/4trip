import { Metadata } from "next";
import SiteHeader from "@/app/components/ru/SiteHeader";
import SiteFooter from "@/app/components/ru/SiteFooter";
import { Link as IntlLink } from "@/i18n/navigation";
import contactInfo from "@/app/config/contactInfo";

export const metadata: Metadata = {
  title: "Политика конфиденциальности – 4-trip",
  description:
    "Политика обработки и защиты персональных данных пользователей сайта 4-trip.ru.",
  openGraph: {
    title: "Политика конфиденциальности – 4-trip",
    description:
      "Политика обработки и защиты персональных данных пользователей сайта 4-trip.ru.",
    url: "https://4-trip.ru/ru/privacy-policy",
    type: "website",
    images: [
      {
        url: "https://4-trip.ru/images/tours/patriot/cathedral-hero.png",
        width: 1200,
        height: 630,
        alt: "4-trip.ru",
      },
    ],
  },
  alternates: {
    canonical: "https://4-trip.ru/ru/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="font-sans bg-white text-gray-900 scroll-smooth min-h-screen flex flex-col">
      <SiteHeader
        title="Политика конфиденциальности"
        main
        project="trip"
        links={[
          { href: "/ru", label: "Главная" },
          // { href: "/ru/excursions", label: "Экскурсии" },
          { href: "/ru/blog", label: "Блог" },
          { href: "/ru/contacts", label: "Контакты" },
        ]}
      />

      <main className="flex-grow container px-4 py-16 mt-16">
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-16 break-words max-w-full">
            Политика конфиденциальности и&nbsp;защита персональных данных
          </h1>

          <div className="space-y-16 text-lg text-gray-800 leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold mb-6">
                1. Общие положения
              </h2>
              <div className="space-y-4">
                <p>
                  1.1 Настоящая политика обработки персональных данных
                  составлена в&nbsp;соответствии с&nbsp;требованиями
                  Федерального закона от&nbsp;27.07.2006 &#8470;&nbsp;152-ФЗ
                  &laquo;О&nbsp;персональных данных&raquo; и&nbsp;определяет
                  порядок обработки персональных данных и&nbsp;меры
                  по&nbsp;обеспечению их&nbsp;безопасности. Предпринимает
                  их&nbsp;Самозанятый Сенчуров Сергей Сергеевич
                  (далее&nbsp;&mdash; Оператор).
                </p>
                <p>
                  1.2 Оператор ставит своей важнейшей целью соблюдение прав
                  и&nbsp;свобод человека и&nbsp;гражданина при обработке его
                  персональных данных, в&nbsp;том числе защиту прав
                  на&nbsp;неприкосновенность частной жизни, личную
                  и&nbsp;семейную тайну.
                </p>
                <p>
                  1.3 Настоящая политика применяется ко&nbsp;всей информации,
                  которую Оператор может получить о&nbsp;посетителях сайта{" "}
                  <a
                    href="https://4-trip.ru/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    https://4-trip.ru/
                  </a>
                  .
                </p>
                <p>
                  1.4 Использование сайта означает безоговорочное согласие
                  пользователя с&nbsp;настоящей Политикой и&nbsp;указанными
                  в&nbsp;ней условиями. В&nbsp;случае несогласия пользователь
                  должен воздержаться от&nbsp;использования сервисов сайта.
                </p>
                <p>1.5 Основные положения Политики конфиденциальности:</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>
                    Оператор обязуется не&nbsp;передавать Вашу персональную
                    информацию третьим лицам.
                  </li>
                  <li>
                    Оператор обязуется сохранять конфиденциальность Вашей
                    контактной информации и&nbsp;не&nbsp;оглашать её&nbsp;без
                    Вашего согласия.
                  </li>
                  <li>
                    Только Вы&nbsp;решаете, в&nbsp;каком объёме хотите раскрыть
                    свою персональную информацию.
                  </li>
                </ul>
                <p>
                  1.6 Оператор не&nbsp;проверяет достоверность персональных
                  данных, предоставляемых пользователем.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-6">
                2. Персональная информация пользователей
              </h2>
              <div className="space-y-4">
                <p>
                  2.1 При простом посещении сайта никакая персональная
                  информация о&nbsp;Вас не&nbsp;собирается, кроме обезличенных
                  данных для счётчика посещаемости.
                </p>
                <p>
                  2.2 Оператор получает и&nbsp;обрабатывает только
                  ту&nbsp;информацию, которую пользователь предоставляет
                  добровольно при заполнении форм обратной связи.
                </p>
                <p>
                  2.3 Сайт использует сервис{" "}
                  <a
                    href="https://metrika.yandex.ru/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    Yandex.Metrika
                  </a>
                  , который собирает следующие обезличенные данные:
                </p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>
                    Количество посетителей сайта (повторные и&nbsp;новые),
                    количество просмотренных страниц без предоставления
                    персональных данных.
                  </li>
                  <li>Источники переходов и&nbsp;порядок просмотра страниц.</li>
                  <li>
                    Страна посетителя, операционная система, браузер, время
                    и&nbsp;продолжительность визита.
                  </li>
                  <li>
                    Запись действий пользователя (движения мышью, скроллинг,
                    клики) через вебвизор с&nbsp;анонимизацией данных
                    в&nbsp;конфиденциальных полях.
                  </li>
                </ul>
                <p>
                  Вы&nbsp;можете запретить сохранение cookies в&nbsp;настройках
                  своего браузера или использовать режим
                  &laquo;Инкогнито&raquo;.
                </p>
                <p>
                  Все собранные данные используются только для анализа
                  посещаемости и&nbsp;повышения качества сайта. Персональная
                  информация и&nbsp;пароли не&nbsp;сохраняются
                  и&nbsp;не&nbsp;передаются оператору.
                </p>
                <p>
                  2.4 При обработке данных Yandex руководствуется Федеральным
                  законом РФ&nbsp;&laquo;О&nbsp;персональных данных&raquo;.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-6">
                3. Цели сбора и&nbsp;обработки данных
              </h2>
              <div className="space-y-4">
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>
                    Обеспечение обратной связи с&nbsp;пользователем
                    и&nbsp;предоставление услуг.
                  </li>
                  <li>
                    Оповещение пользователя о&nbsp;новых услугах
                    и&nbsp;обработка запросов и&nbsp;заявок.
                  </li>
                  <li>
                    Повышение качества услуг и&nbsp;удобства пользования сайтом.
                  </li>
                  <li>
                    Проведение статистических и&nbsp;иных исследований
                    на&nbsp;основе обезличенных данных.
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-6">
                4. Защита персональных данных
              </h2>
              <div className="space-y-4">
                <p>
                  4.1 Оператор использует современные методы защиты информации,
                  включая программные средства сетевой безопасности, процедуры
                  проверки доступа и&nbsp;внутренние правила конфиденциальности.
                </p>
                <p>
                  4.2 Сайт принимает все необходимые организационные
                  и&nbsp;технические меры для предотвращения неправомерного
                  доступа, уничтожения, изменения, копирования или
                  распространения персональных данных.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-6">
                5. Заключительные положения
              </h2>
              <div className="space-y-4">
                <p>
                  5.1 Настоящая Политика конфиденциальности не&nbsp;является
                  договором между Оператором сайта и&nbsp;пользователем.
                </p>
                <p>
                  5.2 Сайт вправе вносить изменения в&nbsp;Политику
                  конфиденциальности. Дата последнего обновления указывается
                  в&nbsp;новой редакции.
                </p>
                <p>
                  5.3 Новая редакция вступает в&nbsp;силу с&nbsp;момента
                  её&nbsp;размещения на&nbsp;сайте, если иное
                  не&nbsp;предусмотрено.
                </p>
                <p>
                  5.4&nbsp;К отношениям между пользователем и&nbsp;сайтом
                  применяется право Российской Федерации.
                </p>
                <p>
                  5.5 Ссылка на&nbsp;актуальную Политику конфиденциальности
                  размещена на&nbsp;странице&nbsp;
                  <a
                    href="https://4-trip.ru/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    https://4-trip.ru/
                  </a>
                  .
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <SiteFooter
        project="trip"
        contacts={{
          phone: contactInfo.phone,
          email: contactInfo.email,
          social: contactInfo.social,
        }}
      />
    </div>
  );
}
