// app/zakaz-avtobusa/page.tsx
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import Script from "next/script";
import SiteHeader from "@/app/components/ru/SiteHeader";
import SiteFooter from "@/app/components/ru/SiteFooter";
import contactInfo from "@/app/config/contactInfo";
import BusCalculator from "@/app/components/ru/BusCalculator";

export const metadata: Metadata = {
  title: "Заказ автобуса по Москве и Подмосковью — 4-trip",
  description:
    "Аренда автобуса и микроавтобуса для экскурсий, корпоративов и трансферов. Легально: работаем с лицензированными перевозчиками. Чек самозанятого. От 2 200 ₽/час. Минимум к оплате — 6 часов (4 ч работа + 2 ч подача).",
  openGraph: {
    title: "Заказ автобуса — 4-trip",
    description:
      "Аренда автобуса и микроавтобуса. Легально, прозрачно. От 2 200 ₽/час. Минимум — 6 часов (4 ч работа + 2 ч подача). За каждые 20 км вне МКАД — +1 час.",
    type: "website",
    url: "https://4-trip.ru/zakaz-avtobusa",
  },
  alternates: { canonical: "/zakaz-avtobуса" }, // проверь маршрут
};

export default function Page() {
  const tgHref =
    "https://t.me/excursion_patriot_bot?start=bus_order&utm_source=site&utm_medium=cta&utm_campaign=bus";
  const phoneHref = "tel:+7XXXXXXXXXX"; // при необходимости подставь номер

  const benefits = [
    "Работаем с лицензированными перевозчиками",
    "Чек самозанятого за организацию",
    "Подбор автобуса: 18–20 / 30–35 / 45–50 мест",
    "Прозрачная почасовая тарификация",
    "Договор и понятные условия",
  ];

  return (
    <div className="font-sans bg-white text-gray-900 scroll-smooth min-h-screen flex flex-col">
      <SiteHeader
        title="Заказ автобуса"
        main
        project="trip"
        links={[
          { href: "/ru", label: "Главная" },
          // { href: "/ru/excursions", label: "Экскурсии" },
          { href: "/ru/blog", label: "Блог" },
          { href: "/ru/contacts", label: "Контакты" },
        ]}
      />

      <main>
        {/* HERO */}
        <section className="bg-gray-50 border-b">
          <div className="container mx-auto px-4 py-12 md:py-16">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                  Заказ автобуса по&nbsp;Москве и&nbsp;МО
                </h1>
                <p className="text-lg text-gray-600 mb-6">
                  Экскурсии, корпоративы, свадьбы, трансферы. Легально и
                  прозрачно, от{" "}
                  <span className="font-semibold text-gray-900">
                    2 200 ₽/час
                  </span>
                  .
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={tgHref}
                    className="inline-block bg-black text-white px-5 py-3 rounded-md hover:bg-gray-800 transition"
                  >
                    Оставить заявку в Telegram
                  </Link>
                  <Link
                    href={phoneHref}
                    className="inline-block border border-gray-300 px-5 py-3 rounded-md hover:bg-gray-100 transition"
                  >
                    Позвонить
                  </Link>
                </div>
                <p className="text-sm text-gray-500 mt-3">
                  * Минимум к оплате — <b>6 часов</b>: 4 ч работы + 2 ч подачи.
                  При выезде за МКАД каждые 20 км считаются как +1 час.
                </p>
              </div>

              <div className="rounded-xl bg-white shadow-sm border p-6">
                <h3 className="text-xl font-semibold mb-3">
                  Быстрый расчёт стоимости
                </h3>
                <BusCalculator />
                <p className="text-xs text-gray-500 mt-3">
                  Расчёт ориентировочный. Финальная цена зависит от
                  согласованной схемы маршрута, простоев и километров за МКАД.
                  Перед подтверждением пришлём прозрачную смету.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BENEFITS */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-10">
              Почему это удобно
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {benefits.map((b, i) => (
                <div
                  key={i}
                  className="bg-gray-50 border rounded-xl p-6 text-gray-800"
                >
                  <div className="text-xl font-semibold mb-2">#{i + 1}</div>
                  <p>{b}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-12 md:py-16 bg-gray-50 border-y">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-10">
              Как это работает
            </h2>
            <ol className="grid md:grid-cols-4 gap-6 list-decimal list-inside">
              <li className="bg-white border rounded-xl p-6">
                Оставляете маршрут и время
              </li>
              <li className="bg-white border rounded-xl p-6">
                Подбираем автобус и считаем стоимость
              </li>
              <li className="bg-white border rounded-xl p-6">
                Договор/подтверждение + предоплата
              </li>
              <li className="bg-white border rounded-xl p-6">
                Поездка и закрывающие (чек самозанятого)
              </li>
            </ol>
            <p className="text-sm text-gray-600 mt-6">
              Перевозку выполняет партнёр с необходимыми лицензиями/допусками.
              4-trip выступает организатором (агентом).
            </p>
          </div>
        </section>

        {/* USE CASES */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-10">
              На какие задачи
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                "Экскурсии и выездные мероприятия",
                "Корпоративы и тимбилдинги",
                "Свадьбы и семейные торжества",
                "Трансферы: вокзалы/аэропорты/форумы",
              ].map((t) => (
                <div key={t} className="border rounded-xl p-6 bg-white">
                  {t}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 md:py-16 bg-gray-50 border-t">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">FAQ</h2>
            <div className="space-y-4">
              <details className="border rounded-lg bg-white p-4">
                <summary className="font-medium">
                  Это легально? Кто фактически перевозит?
                </summary>
                <p className="mt-2 text-gray-700">
                  Да. Перевозку выполняет лицензированная транспортная компания.
                  Мы занимаемся организацией (агентская услуга) и выдаём чек
                  самозанятого за организацию.
                </p>
              </details>

              <details className="border rounded-lg bg-white p-4">
                <summary className="font-medium">
                  Почему минимум 6 часов?
                </summary>
                <p className="mt-2 text-gray-700">
                  Это рыночный стандарт: минимум 4 часа работы на маршруте + 2
                  часа подачи транспорта. Даже если подача по факту займёт
                  меньше времени, к оплате берётся 2 часа.
                </p>
              </details>

              <details className="border rounded-lg bg-white p-4">
                <summary className="font-medium">
                  Как считается выезд за МКАД?
                </summary>
                <p className="mt-2 text-gray-700">
                  За каждые 20 км вне МКАД добавляется +1 час к оплате. В
                  калькуляторе можно указать километраж за МКАД, а при
                  оформлении заявки мы посчитаем автоматически по маршруту.
                </p>
              </details>

              <details className="border rounded-lg bg-white p-4">
                <summary className="font-medium">
                  Можно безнал и закрывающие?
                </summary>
                <p className="mt-2 text-gray-700">
                  Да. Предоставляем чек самозанятого за организацию. По запросу
                  оформим договор.
                </p>
              </details>
            </div>

            <div className="text-center mt-10">
              <Link
                href={tgHref}
                className="inline-block bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition"
              >
                Обсудить маршрут в Telegram
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter
        project="trip"
        contacts={{
          phone: contactInfo.phone,
          email: contactInfo.email,
          social: contactInfo.social,
        }}
      />

      {/* JSON-LD */}
      <Script
        id="ld-bus"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Заказ автобуса",
            provider: { "@type": "Organization", name: "4-trip" },
            areaServed: "Москва и Московская область",
            offers: {
              "@type": "Offer",
              priceSpecification: {
                "@type": "UnitPriceSpecification",
                price: "2200", // минимальная текущая ставка (уточните при изменении)
                priceCurrency: "RUB",
                unitCode: "HUR",
              },
              url: "https://4-trip.ru/zakaz-avtobusa",
            },
          }),
        }}
      />
    </div>
  );
}
