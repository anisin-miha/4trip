import { Metadata } from "next";
import SiteHeader from "@/app/components/ru/SiteHeader";
import SiteFooter from "@/app/components/ru/SiteFooter";
import contactInfo from "@/app/config/contactInfo";

export const metadata: Metadata = {
  title: "Правила возврата — 4-trip.ru",
  description: "Правила возврата и отмены бронирований.",
  openGraph: {
    title: "Правила возврата — 4-trip.ru",
    description: "Правила возврата и отмены бронирований.",
    url: "https://4-trip.ru/ru/refunds",
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
    canonical: "https://4-trip.ru/ru/refunds",
  },
};

const PERFORMER = {
  fullName: contactInfo.performer.fullName,
  inn: contactInfo.performer.inn,
  supportEmail: contactInfo.email,
  supportPhone: contactInfo.phone,
};

const SETTINGS = {
  siteUrl: contactInfo.site.url,
  brand: contactInfo.site.brand,
  refundProcessingDays: contactInfo.policy.refundProcessingDays,
  freeCancelHours: contactInfo.policy.freeCancelHours,
  lateCancelRetentionPercent: contactInfo.policy.lateCancelRetentionPercent,
  privacyPath: contactInfo.site.privacyPath,
};

export default function RefundsPage() {
  return (
    <div className="font-sans bg-white text-gray-900 scroll-smooth min-h-screen flex flex-col">
      <SiteHeader
        title="Правила возврата"
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
            Правила возврата и отмены платежа
          </h1>

          <div className="space-y-16 text-lg text-gray-800 leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold mb-6">
                1. Общие положения
              </h2>
              <div className="space-y-4">
                <p>
                  Настоящие правила регулируют порядок возврата денежных средств
                  и отмены платежей за услуги, приобретаемые на сайте{" "}
                  <a
                    href={SETTINGS.siteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    {SETTINGS.siteUrl}
                  </a>
                  . Исполнитель — {PERFORMER.fullName}, ИНН {PERFORMER.inn}{" "}
                  (самозанятый, НПД).
                </p>
              </div>
            </section>

            <section id="cancel">
              <h2 className="text-2xl font-semibold mb-6">
                2. Отмена заказа до начала оказания услуг
              </h2>
              <div className="space-y-4">
                <p>
                  2.1. Бесплатная отмена возможна не позднее чем за{" "}
                  {SETTINGS.freeCancelHours} часов до начала оказания услуг —
                  возврат 100% стоимости (за вычетом подтверждённых фактических
                  расходов Исполнителя, если такие имели место).
                </p>
                <p>
                  2.2. Для отмены направьте письмо на {PERFORMER.supportEmail}{" "}
                  или свяжитесь по телефону {PERFORMER.supportPhone}.
                </p>
              </div>
            </section>

            <section id="late-cancel">
              <h2 className="text-2xl font-semibold mb-6">
                3. Поздняя отмена и частичное оказание
              </h2>
              <div className="space-y-4">
                <p>
                  3.1. При отмене позднее установленного срока и/или после
                  начала оказания услуг возврат производится пропорционально
                  неоказанной части. Исполнитель вправе удержать подтверждённые
                  расходы.
                </p>
                <p>
                  3.2. Если условия конкретного продукта на Сайте
                  предусматривают удержание до{" "}
                  {SETTINGS.lateCancelRetentionPercent} стоимости при поздней
                  отмене — применяется указанное удержание.
                </p>
              </div>
            </section>

            <section id="mistake">
              <h2 className="text-2xl font-semibold mb-6">
                4. Ошибочный платёж
              </h2>
              <div className="space-y-4">
                <p>
                  При ошибочной оплате незамедлительно свяжитесь с нами по
                  адресу {PERFORMER.supportEmail}. Если заказ не принят в
                  работу, платёж аннулируется и средства возвращаются в полном
                  объёме. Если заказ принят/оказан частично — применяется раздел
                  3.
                </p>
              </div>
            </section>

            <section id="how-to">
              <h2 className="text-2xl font-semibold mb-6">
                5. Порядок оформления возврата
              </h2>
              <div className="space-y-4">
                <p>
                  5.1. Направьте заявление на {PERFORMER.supportEmail} с
                  данными:
                </p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>ФИО, контактный телефон и e-mail;</li>
                  <li>дата и сумма платежа, способ оплаты;</li>
                  <li>
                    основание для возврата (описание ситуации, материалы при
                    наличии);
                  </li>
                  <li>удобный способ связи.</li>
                </ul>
                <p>
                  5.2. Возврат осуществляется тем же способом, которым
                  производилась оплата, в срок до{" "}
                  {SETTINGS.refundProcessingDays} рабочих дней после одобрения
                  возврата. Фактический срок зачисления зависит от банка.
                </p>
                <p>
                  5.3. Комиссии платёжных систем и подтверждённые фактические
                  расходы Исполнителя могут быть удержаны.
                </p>
              </div>
            </section>

            <section id="receipt">
              <h2 className="text-2xl font-semibold mb-6">6. Чек НПД</h2>
              <div className="space-y-4">
                <p>
                  Исполнитель применяет режим НПД (самозанятый) и не использует
                  ККТ. Чек формируется в «Мой налог»/через партнёра и
                  направляется на телефон и/или e-mail, указанные при оплате.
                </p>
              </div>
            </section>

            <section id="pdn">
              <h2 className="text-2xl font-semibold mb-6">
                7. Персональные данные
              </h2>
              <div className="space-y-4">
                <p>
                  Обработка персональных данных осуществляется в целях
                  исполнения договора и в соответствии с Политикой
                  конфиденциальности:
                  <a
                    href={`${SETTINGS.siteUrl}${SETTINGS.privacyPath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1 text-blue-600 underline hover:text-blue-800"
                  >
                    {SETTINGS.siteUrl}
                    {SETTINGS.privacyPath}
                  </a>
                  .
                </p>
              </div>
            </section>

            <section id="contacts">
              <h2 className="text-2xl font-semibold mb-6">
                8. Контакты для обращений по возвратам
              </h2>
              <div className="space-y-2">
                <p>Исполнитель: {PERFORMER.fullName}</p>
                <p>ИНН: {PERFORMER.inn} (самозанятый, НПД)</p>
                <p>E-mail: {PERFORMER.supportEmail}</p>
                <p>Телефон: {PERFORMER.supportPhone}</p>
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
