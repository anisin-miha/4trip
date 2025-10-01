import { Metadata } from "next";
import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";
import contactInfo from "@/app/config/contactInfo";

export const metadata: Metadata = {
  title: "Договор оферты — 4-trip.ru",
  description: "Публичная оферта на оказание услуг.",
  openGraph: {
    title: "Договор оферты — 4-trip.ru",
    description: "Публичная оферта на оказание услуг.",
    url: "https://4-trip.ru/offer",
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
    canonical: "https://4-trip.ru/offer",
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
  publishedAt: contactInfo.policy.offerPublishedAt,
  privacyPath: contactInfo.site.privacyPath,
};

export default function OfferPage() {
  return (
    <div className="font-sans bg-white text-gray-900 scroll-smooth min-h-screen flex flex-col">
      <SiteHeader
        title="Договор оферты"
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
            Договор публичной оферты на оказание услуг
          </h1>

          <div className="space-y-16 text-lg text-gray-800 leading-relaxed">
            <section>
              <div className="space-y-4">
                <p>
                  {PERFORMER.fullName}, ИНН {PERFORMER.inn}, применяющий специальный налоговый режим
                  «Налог на профессиональный доход» (самозанятый), далее — «Исполнитель», публикует
                  настоящую публичную оферту (далее — «Оферта») о заключении договора на условиях,
                  изложенных ниже.
                </p>
                <p>
                  Настоящая Оферта адресована неограниченному кругу лиц и является официальным предложением
                  заключить договор на условиях, предусмотренных Офертой. Оплата услуг на сайте{" "}
                  <a
                    href={SETTINGS.siteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    {SETTINGS.siteUrl}
                  </a>{" "}
                  означает полное и безоговорочное принятие (акцепт) Оферты.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-6">1. Термины и определения</h2>
              <div className="space-y-4">
                <p>
                  1.1. «Сайт» — интернет-ресурс {SETTINGS.brand} по адресу{" "}
                  <a
                    href={SETTINGS.siteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    {SETTINGS.siteUrl}
                  </a>
                  .
                </p>
                <p>1.2. «Заказчик» — дееспособное лицо, оформившее заказ и/или оплатившее услуги на Сайте.</p>
                <p>1.3. «Услуги» — услуги по организации и/или проведению поездок, экскурсий, туров и сопутствующие услуги, информация о которых изложена на Сайте.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-6">2. Предмет договора</h2>
              <div className="space-y-4">
                <p>
                  2.1. Исполнитель обязуется оказать Заказчику Услуги в соответствии с описанием на Сайте
                  и/или индивидуальным подтверждением заказа, а Заказчик обязуется оплатить Услуги на условиях Оферты.
                </p>
                <p>
                  2.2. Конкретный перечень, стоимость, сроки и условия оказания Услуг определяются описанием на Сайте
                  и/или подтверждением заказа, направляемым Заказчику.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-6">3. Порядок заключения договора (акцепт)</h2>
              <div className="space-y-4">
                <p>
                  3.1. Текст Оферты является публичной офертой в соответствии с Гражданским кодексом РФ.
                </p>
                <p>
                  3.2. Акцептом Оферты является оплата Заказчиком стоимости Услуг на Сайте с использованием доступных способов оплаты.
                </p>
                <p>3.3. Договор считается заключённым с момента поступления оплаты.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-6">4. Оформление заказа</h2>
              <div className="space-y-4">
                <p>
                  4.1. Заказ оформляется на Сайте путём заполнения соответствующей формы и/или взаимодействия с оператором.
                </p>
                <p>
                  4.2. Подтверждение заказа направляется на указанные Заказчиком контакты (e-mail/мессенджер/телефон).
                </p>
                <p>
                  4.3. Заказчик обязан предоставить достоверные данные, необходимые для оказания Услуг.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-6">5. Цена и порядок оплаты</h2>
              <div className="space-y-4">
                <p>5.1. Цена Услуг указывается на Сайте в рублях РФ и может изменяться до момента оплаты.</p>
                <p>
                  5.2. Оплата производится банковской картой через платёжного партнёра/эквайринг, указанный на Сайте.
                </p>
                <p>
                  5.3. Исполнитель применяет специальный налоговый режим НПД (самозанятый), освобождён от применения ККТ.
                  Чек НПД формируется в приложении «Мой налог»/через партнёра и направляется Заказчику на телефон и/или e-mail,
                  указанные при оформлении заказа.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-6">6. Сроки и порядок оказания услуг</h2>
              <div className="space-y-4">
                <p>
                  6.1. Сроки оказания Услуг указываются в описании на Сайте и/или в подтверждении заказа.
                </p>
                <p>
                  6.2. Услуги считаются оказанными надлежащим образом с момента их фактического оказания и/или направления результата Заказчику
                  (e-mail/личный кабинет/мессенджер/на месте проведения).
                </p>
              </div>
            </section>

            <section id="refunds">
              <h2 className="text-2xl font-semibold mb-6">7. Отмена заказа и возврат денежных средств</h2>
              <div className="space-y-4">
                <p>
                  7.1. Заказчик вправе отказаться от Услуг до начала их оказания. При отказе не позднее чем за{" "}
                  {SETTINGS.freeCancelHours} часов до начала оказания Услуг — возврат 100% уплаченной суммы
                  (за исключением подтверждённых фактических расходов Исполнителя, если они имели место).
                </p>
                <p>
                  7.2. При отказе позднее указанного срока и/или после начала оказания Услуг — возврат производится
                  пропорционально неоказанной части, с удержанием документально подтверждённых расходов Исполнителя.
                </p>
                <p>
                  7.3. Для оформления возврата необходимо направить заявление на e-mail: {PERFORMER.supportEmail} с указанием
                  ФИО, контактов, даты и суммы оплаты, причины возврата и подтверждающих материалов (при наличии).
                </p>
                <p>
                  7.4. Возврат средств осуществляется тем же способом, которым производилась оплата, в срок до{" "}
                  {SETTINGS.refundProcessingDays} рабочих дней с даты одобрения возврата. Срок зачисления зависит от банка Заказчика.
                </p>
                <p>7.5. Комиссии платёжных систем и подтверждённые фактические расходы Исполнителя могут быть удержаны.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-6">8. Ошибочный платёж</h2>
              <div className="space-y-4">
                <p>
                  При ошибочной оплате Заказчик обязан незамедлительно связаться с Исполнителем по адресу {PERFORMER.supportEmail} или телефону{" "}
                  {PERFORMER.supportPhone}. Если заказ не принят в работу — платёж аннулируется и средства возвращаются в полном объёме.
                  Если заказ принят/оказан частично — применяется раздел 7 Оферты.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-6">9. Ответственность сторон</h2>
              <div className="space-y-4">
                <p>Стороны несут ответственность в соответствии с законодательством РФ.</p>
                <p>
                  Исполнитель не отвечает за невозможность оказания Услуг по причинам, зависящим от Заказчика,
                  включая предоставление недостоверных данных и отсутствие на связи.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-6">10. Форс-мажор</h2>
              <div className="space-y-4">
                <p>
                  Стороны освобождаются от ответственности за частичное или полное неисполнение обязательств по договору,
                  если оно явилось следствием обстоятельств непреодолимой силы, подтверждённых компетентными органами.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-6">11. Персональные данные</h2>
              <div className="space-y-4">
                <p>
                  Персональные данные Заказчика обрабатываются Исполнителем исключительно для целей заключения и исполнения договора.
                  Политика конфиденциальности опубликована по адресу:{" "}
                  <a
                    href={`${SETTINGS.siteUrl}${SETTINGS.privacyPath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    {SETTINGS.siteUrl}
                    {SETTINGS.privacyPath}
                  </a>.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-6">12. Прочие условия</h2>
              <div className="space-y-4">
                <p>
                  12.1. Исполнитель вправе вносить изменения в Оферту в одностороннем порядке. Новая редакция вступает в силу с момента публикации на Сайте и применяется к новым заказам.
                </p>
                <p>
                  12.2. Претензии направляются на {PERFORMER.supportEmail}. Срок рассмотрения претензий — до 10 рабочих дней.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-6">13. Реквизиты Исполнителя</h2>
              <div className="space-y-2">
                <p>ФИО: {PERFORMER.fullName}</p>
                <p>ИНН: {PERFORMER.inn} (самозанятый, НПД)</p>
                <p>E-mail: {PERFORMER.supportEmail}</p>
                <p>Телефон: {PERFORMER.supportPhone}</p>
              </div>
              <p className="mt-6 text-gray-600">Дата публикации оферты: {SETTINGS.publishedAt}</p>
            </section>
          </div>
        </div>
      </main>

      <SiteFooter project="trip" contacts={{ phone: contactInfo.phone, email: contactInfo.email, social: contactInfo.social }} />
    </div>
  );
}
