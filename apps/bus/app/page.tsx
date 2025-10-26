import { Header, BusCalculator, Logo4Trip } from "@/packages/shared-ui/src/ru";
import NextLink from "next/link";
import Script from "next/script";

const headerLinks = [
  { href: "/", label: "Главная" },
  { href: "/avtopark", label: "Автопарк" },
  { href: "/tarify", label: "Тарифы и цены" },
  { href: "/usloviya-arendy", label: "Условия аренды" },
  { href: "/oplata", label: "Оплата" },
  { href: "/faq", label: "FAQ" },
  { href: "/otzyvy", label: "Отзывы" },
  { href: "/contacts", label: "Контакты" },
] as const;

export default function Page() {
  return (
    <div className="font-sans bg-white text-gray-900 min-h-screen flex flex-col">
      <Header
        title="Заказ автобуса"
        main
        Logo={Logo4Trip}
        project="bus"
        links={headerLinks as any}
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
                  <NextLink
                    href="https://t.me/excursion_patriot_bot?start=bus_order&utm_source=site&utm_medium=cta&utm_campaign=bus"
                    className="inline-block bg-black text-white px-5 py-3 rounded-md hover:bg-gray-800 transition"
                  >
                    Оставить заявку в Telegram
                  </NextLink>
                  <NextLink
                    href="tel:+7XXXXXXXXXX"
                    className="inline-block border border-gray-300 px-5 py-3 rounded-md hover:bg-gray-100 transition"
                  >
                    Позвонить
                  </NextLink>
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
              {[
                "Работаем с лицензированными перевозчиками",
                "Чек самозанятого за организацию",
                "Подбор автобуса: 18–20 / 30–35 / 45–50 мест",
                "Прозрачная почасовая тарификация",
                "Договор и понятные условия",
              ].map((b, i) => (
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
              4‑bus выступает организатором (агентом).
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
              <NextLink
                href="https://t.me/excursion_patriot_bot?start=bus_order&utm_source=site&utm_medium=cta&utm_campaign=bus"
                className="inline-block bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition"
              >
                Обсудить маршрут в Telegram
              </NextLink>
            </div>
          </div>
        </section>
      </main>

      <Script
        id="ld-bus"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Заказ автобуса",
            provider: { "@type": "Organization", name: "4-bus" },
            areaServed: "Москва и Московская область",
            offers: {
              "@type": "Offer",
              priceSpecification: {
                "@type": "UnitPriceSpecification",
                price: "2200",
                priceCurrency: "RUB",
                unitCode: "HUR",
              },
              url: "https://4-bus.ru/zakaz-avtobusa",
            },
          }),
        }}
      />
    </div>
  );
}
