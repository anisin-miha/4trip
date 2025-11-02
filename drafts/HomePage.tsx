import Image from "next/image";
import TourCard from "@/app/components/ru/TourCard";
import FiltersClient from "@/app/components/ru/FiltersClient";
import { excursions } from "@/app/config/ru/tours";
import { TourCity, TourSeason } from "@/app/config/ru/tours/types";
import type { ExcursionCard } from "@/app/config/ru/tours/types";

type Card = ExcursionCard & {
  locations: string[];
  tags: string[];
  season: TourSeason[];
  priceSort: number;
};

function currentSeason(): TourSeason {
  const m = new Date().getMonth();
  if (m >= 2 && m <= 4) return TourSeason.Spring;
  if (m >= 5 && m <= 7) return TourSeason.Summer;
  if (m >= 8 && m <= 10) return TourSeason.Autumn;
  return TourSeason.Winter;
}

function normalizeCards(): Card[] {
  return excursions
    .filter((tour) => tour.visibility)
    .map((tour) => {
      const locs = new Set<string>();
      locs.add(tour.city);
      if (tour.city !== TourCity.Moscow) locs.add("Подмосковье");
      else locs.add(TourCity.Moscow);

      const tags = tour.badges ?? [];

      return {
        slug: tour.slug,
        href: `/excursions/${tour.slug}`,
        imageSrc: tour.hero.image,
        imageAlt: tour.title,
        title: tour.title,
        description: tour.hero.description,
        price: tour.price,
        duration: tour.duration,
        languages: tour.languages,
        city: tour.city,
        meetingPoint: tour.meetingPoint.address,
        rating: tour.rating,
        badges: tour.badges,
        timeSlots: tour.meetingPoint.timeSlots,
        locations: Array.from(locs),
        tags,
        season: tour.season,
        priceSort: tour.price,
      };
    });
}

function SectionTitle({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="text-3xl font-bold text-center mb-6 scroll-mt-24">
      {children}
    </h2>
  );
}

export default function HomePage() {
  const cards = normalizeCards();
  const season = currentSeason();
  const seasonal = cards.filter((c) => c.season.includes(season)).slice(0, 6);

  const allLocations = Array.from(
    cards.reduce((s, c) => (c.locations.forEach((l) => s.add(l)), s), new Set<string>())
  );
  const allCategories = Array.from(
    cards.reduce((s, c) => (c.tags.forEach((t) => s.add(t)), s), new Set<string>())
  );

  const prices = cards.map((c) => c.priceSort).filter((n) => Number.isFinite(n));
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 10000;

  return (
    <main className="py-16">
      {/* ── Above the Fold ───────────────────────────────────────────── */}
      <section className="container mx-auto px-4 mb-12 mt-24 grid gap-10 md:grid-cols-2 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Экскурсии по Москве и Подмосковью — комфортно, ясно, по-честному
          </h1>
          <p className="mt-4 text-lg text-gray-700">
            Комфортные автобусы, проверенные маршруты и прозрачная цена. Бронь — за пару кликов, поддержка — на каждом этапе.
          </p>
          <ul className="mt-6 grid gap-3">
            <li>• Комфортные автобусы и продуманные остановки</li>
            <li>• Проверенные маршруты без «лишнего хронометража»</li>
            <li>• Прозрачная цена — без скрытых платежей</li>
            <li>• Простая бронь и быстрая оплата</li>
          </ul>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#catalog" className="inline-flex items-center px-5 py-3 rounded-xl bg-gray-900 text-white hover:opacity-90">
              Выбрать экскурсию
            </a>
            <a href="/ru/bus" className="inline-flex items-center px-5 py-3 rounded-xl border border-gray-300 hover:bg-gray-50">
              Заказать автобус
            </a>
            <div className="ml-0 md:ml-4 flex items-center gap-4 text-sm text-gray-600">
              <div>★ 4.8/5 — 120+ отзывов</div>
              <div>10 000+ путешественников</div>
            </div>
          </div>
        </div>

        <div className="relative h-[260px] md:h-[360px] rounded-3xl overflow-hidden shadow-sm">
          <Image
            src="/images/hero/moscow-city.jpg"
            alt="Экскурсии 4-trip.ru"
            fill
            sizes="(min-width: 1024px) 560px, 100vw"
            className="object-cover"
            priority
          />
        </div>

        {/* текст-вводка под героем */}
        <div className="md:col-span-2">
          <p className="text-gray-700 leading-relaxed max-w-4xl">
            С 4-trip.ru вы начинаете поездку без суеты: мы собрали самые востребованные маршруты по Москве и Подмосковью и отточили их по деталям. На обзорной экскурсии вы увидите главные символы столицы и поймёте, как связаны эпохи и районы; в Парке «Патриот» прикоснётесь к важным страницам истории; в Сергиевом Посаде и Коломне почувствуете спокойный ритм древних городов. Мы используем современные автобусы, работаем с проверенными гидами и держим прозрачные цены. Бронируйте онлайн — и отправляйтесь в дорогу уже в ближайшие выходные.
          </p>
        </div>
      </section>

      {/* ── Каталог + фильтры ────────────────────────────────────────── */}
      <section id="catalog" className="container mx-auto px-4 py-10">
        <SectionTitle>Популярные экскурсии</SectionTitle>

        <FiltersClient
          targetGridId="catalogGrid"
          locations={allLocations}
          categories={allCategories}
          minPrice={minPrice}
          maxPrice={maxPrice}
        />

        <div id="catalogGrid" className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <div
              key={card.href}
              data-price={card.priceSort}
              data-locs={card.locations.join("||")}
              data-tags={card.tags.join("||")}
            >
              <TourCard
                href={card.href}
                imageSrc={card.imageSrc}
                imageAlt={card.imageAlt}
                title={card.title}
                description={card.description}
                price={card.price}
                duration={card.duration}
                languages={card.languages}
                city={card.city}
                meetingPoint={card.meetingPoint}
                rating={card.rating ?? undefined}
                badges={card.badges}
                timeSlots={card.timeSlots}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── Почему мы ────────────────────────────────────────────────── */}
      <section id="why" className="bg-gray-50 py-14">
        <div className="container mx-auto px-4">
          <SectionTitle>Почему выбирают 4-trip.ru</SectionTitle>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Комфорт без компромиссов", text: "Современные автобусы, удобные посадки, продуманные остановки." },
              { title: "Проверенные маршруты", text: "Только актуальные и логичные программы без пустых пауз." },
              { title: "Прозрачная цена", text: "Никаких скрытых платежей — всё расписано заранее." },
              { title: "Простая бронь", text: "2–3 клика до подтверждения. Поддержка на каждом шаге." },
              { title: "Опытные гиды", text: "Понятный и живой рассказ — без перегруза датами." },
              { title: "Отзывчивая поддержка", text: "Быстро решаем вопросы до, во время и после поездки." },
            ].map((b) => (
              <div key={b.title} className="rounded-2xl bg-white border border-gray-200 p-6">
                <h3 className="font-semibold mb-2">{b.title}</h3>
                <p className="text-gray-700">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Как это работает ─────────────────────────────────────────── */}
      <section id="how" className="container mx-auto px-4 py-14">
        <SectionTitle>Как это работает</SectionTitle>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { step: "1", title: "Выбор", text: "Найдите подходящую экскурсию и дату в каталоге." },
            { step: "2", title: "Бронирование", text: "Оформите бронь онлайн, получите подтверждение на почту." },
            { step: "3", title: "Поездка", text: "Встречаемся в точке сборки и едем — всё по плану." },
          ].map((s) => (
            <div key={s.step} className="rounded-2xl border border-gray-200 p-6">
              <div className="text-3xl font-bold">{s.step}</div>
              <h3 className="mt-2 font-semibold">{s.title}</h3>
              <p className="text-gray-700 mt-1">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Популярно сейчас (сезонность) ────────────────────────────── */}
      <section id="season" className="bg-gray-50 py-14">
        <div className="container mx-auto px-4">
          <SectionTitle>Популярно сейчас — {season}</SectionTitle>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {seasonal.map((card) => (
              <TourCard
                key={card.href}
                href={card.href}
                imageSrc={card.imageSrc}
                imageAlt={card.imageAlt}
                title={card.title}
                description={card.description}
                price={card.price}
                duration={card.duration}
                languages={card.languages}
                city={card.city}
                meetingPoint={card.meetingPoint}
                rating={card.rating ?? undefined}
                badges={card.badges}
                timeSlots={card.timeSlots}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Отзывы (MVP) ─────────────────────────────────────────────── */}
      <section id="reviews" className="container mx-auto px-4 py-14">
        <SectionTitle>Отзывы путешественников</SectionTitle>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { name: "Анна", text: "Ездили в Сергиев Посад — организация отличная, без задержек. Гид рассказывает живо, дорога комфортная.", rating: 5 },
            { name: "Игорь", text: "Обзорная по Москве понравилась: за 4 часа увидели всё ключевое, без беготни. Цена честная.", rating: 5 },
            { name: "Марина", text: "Парк «Патриот» произвёл сильное впечатление. Спасибо за чёткий тайминг и помощь с посадкой.", rating: 5 },
          ].map((r, i) => (
            <div key={i} className="rounded-2xl border border-gray-200 p-6 bg-white">
              <div className="flex items-center gap-2">
                <div className="font-semibold">{r.name}</div>
                <div aria-label={`${r.rating} из 5`}>{"★".repeat(r.rating)}</div>
              </div>
              <p className="mt-2 text-gray-700">{r.text}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-6">
          <a href="/ru/reviews" className="inline-flex px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">
            Смотреть все отзывы
          </a>
        </div>
      </section>

      {/* ── География ────────────────────────────────────────────────── */}
      <section id="geo" className="bg-gray-50 py-14">
        <div className="container mx-auto px-4">
          <SectionTitle>География поездок</SectionTitle>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { label: "Москва", href: "/ru/excursions?loc=Москва" },
              { label: "Санкт-Петербург", href: "/ru/excursions?loc=СПб" },
              { label: "Казань", href: "/ru/excursions?loc=Казань" },
              { label: "Нижний Новгород", href: "/ru/excursions?loc=НН" },
              { label: "Сергиев Посад", href: "/excursions/sergiev-posad" },
              { label: "Коломна", href: "/excursions/kolomna" },
              { label: "Парк «Патриот»", href: "/excursions/patriot" },
            ].map((g) => (
              <a key={g.label} href={g.href} className="px-4 py-2 rounded-full border border-gray-300 bg-white hover:bg-gray-50">
                {g.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Мини-FAQ ─────────────────────────────────────────────────── */}
      <section id="faq" className="container mx-auto px-4 py-14">
        <SectionTitle>Частые вопросы</SectionTitle>
        <div className="mx-auto max-w-3xl divide-y divide-gray-200 rounded-2xl border border-gray-200">
          {[
            { q: "Что включено в цену?", a: "Проезд на комфортабельном автобусе, сопровождение гида и программа по описанию тура. Доп. расходы (музеи, питание) указаны в карточке тура, если они есть." },
            { q: "Как оплатить и получить билет?", a: "Оплата онлайн банковской картой. После оплаты на e-mail приходит подтверждение и инструкция по встрече." },
            { q: "Можно ли с детьми?", a: "Да. В карточке тура указаны рекомендации по возрасту. Для самых маленьких лучше выбирать программы до 6–8 часов." },
            { q: "Что с погодой?", a: "Экскурсии проходят при любой погоде. Возьмите удобную обувь и одежду по сезону; при неблагоприятных условиях возможна перестановка точек." },
            { q: "Можно вернуть бронь?", a: "Да, действуют прозрачные условия возврата — смотрите правила на странице конкретной экскурсии." },
          ].map((item, i) => (
            <details key={i} className="p-5">
              <summary className="cursor-pointer font-medium">{item.q}</summary>
              <p className="mt-2 text-gray-700">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── Промо/оффер ──────────────────────────────────────────────── */}
      <section id="promo" className="bg-gray-900 text-white py-10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-6">
          <div className="text-xl font-semibold">Раннее бронирование — скидка 10% до конца месяца</div>
          <a href="#catalog" className="ml-auto inline-flex px-5 py-3 rounded-xl bg-white text-gray-900 hover:opacity-90">
            Выбрать экскурсию
          </a>
        </div>
      </section>

      {/* ── Блог ─────────────────────────────────────────────────────── */}
      <section id="blog" className="container mx-auto px-4 py-14">
        <SectionTitle>Из блога</SectionTitle>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { title: "Что посмотреть в Москве за один день", href: "/ru/blog/moscow-in-one-day", img: "/images/blog/placeholders/moscow1.jpg" },
            { title: "Сергиев Посад: короткий гид", href: "/ru/blog/sergiev-posad-guide", img: "/images/blog/placeholders/sergiev.jpg" },
            { title: "Коломна: пастила, кремль и маршруты", href: "/ru/blog/kolomna-weekend", img: "/images/blog/placeholders/kolomna.jpg" },
          ].map((p) => (
            <a key={p.href} href={p.href} className="rounded-2xl border border-gray-200 overflow-hidden hover:shadow-sm">
              <div className="relative h-44">
                <Image src={p.img} alt={p.title} fill className="object-cover" sizes="(min-width: 1024px) 400px, 100vw" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{p.title}</h3>
                <span className="text-sm text-gray-600">Читать →</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ── Короткие контакты для доверия/ключевых слов ─────────────── */}
      <section id="contacts" className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-2">Контакты</h2>
          <p className="text-gray-700">Телефон: +7&nbsp;{/** подставится на странице */} … · Email: …</p>
        </div>
      </section>
    </main>
  );
}
