"use client";

import { useMemo, useState } from "react";
import { Link as IntlLink } from "@/i18n/navigation";
import SiteHeader from "@/app/components/SiteHeader";
import { Footer } from "@4trip/shared-ui";
import contactInfo from "@/app/config/contactInfo";
import BaseImage from "@/components/BaseImage";
import BookingForm from "./BookingForm";
import { availableDates } from "./BookingForm";
import LearnList from "./LearnList";
import RelatedTours from "./RelatedTours";

// === Types ===
export type Attraction = {
  image: string;
  alt: string;
  title: string;
  description: string[];
};

export type Guide = {
  name: string;
  role?: string;
  image: string;
  bio?: string;
  url?: string;
};

export type RouteVariant = {
  id: string; // slug-like id, e.g. "classic"
  title: string; // e.g. "Классический маршрут"
  summary?: string;
  points: string[]; // list of POIs in order
  description?: string[]; // free-form paragraphs
};

export type MeetingPoint = {
  mapSrc: string; // embeddable map src
  address: string;
  startTime?: string; // e.g. "10:00"
  endAddress?: string; // where tour ends
  note?: string;
  type?: string;
  duration?: string;
  groupSize?: string;
  forWhom?: string;
  language?: string;
  price?: string;
  lat?: number;
  lng?: number;
};

export type Rating = {
  value: number; // 4.9
  count: number; // 1526
};

export type FAQItem = { question: string; answer: string };

export type TourData = {
  slug: string;
  title: string;
  subtitle?: string;
  hero: { image: string; description: string; badges?: string[] };
  price: number;
  currency?: string; // default RUB
  duration?: string; // e.g. "4 часа"
  languages?: string[];
  schedule?: string; // e.g. "каждую субботу"
  nextDates?: string[]; // ISO strings for JSON-LD/Event (take soonest)
  groupSize?: string; // e.g. "до 40 человек"
  ageLimit?: string; // e.g. "6+"
  expectations?: string;
  rating?: Rating;
  inclusions?: string[];
  exclusions?: string[];
  details?: string[];
  meetingPoint: MeetingPoint;
  attractions?: Attraction[];
  routeVariants?: RouteVariant[];
  learnMore?: { title: string; text: string }[];
  longread?: { title: string; tldr?: string[]; paragraphs: string[] };
  gallery?: { src: string; alt: string }[];
  faq?: FAQItem[];
};

// === Helpers: JSON-LD builders ===
function buildTourJsonLd(data: TourData) {
  const firstDate = data.nextDates?.[0];
  const currency = data.currency || "RUB";
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: data.title,
    description: data.hero?.description,
    image: data.hero?.image ? [absoluteUrl(data.hero.image)] : undefined,
    itinerary: data.routeVariants?.[0]?.points,
    offers: {
      "@type": "Offer",
      price: data.price,
      priceCurrency: currency,
      availability: "https://schema.org/InStock",
      url: typeof window !== "undefined" ? window.location.href : undefined,
    },
    provider: {
      "@type": "Organization",
      name: "4-trip",
      url: originUrl(),
      contactPoint: {
        "@type": "ContactPoint",
        telephone: contactInfo.phone,
        email: contactInfo.email,
        contactType: "customer support",
        areaServed: "RU",
        availableLanguage: ["ru"],
      },
    },
    aggregateRating: data.rating
      ? {
          "@type": "AggregateRating",
          ratingValue: data.rating.value,
          reviewCount: data.rating.count,
        }
      : undefined,
    startDate: firstDate,
  } as const;
}

function buildBreadcrumbsJsonLd(data: TourData) {
  const base = originUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Главная",
        item: `${base}/ru`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Экскурсии",
        item: `${base}/ru/excursions`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: data.title,
        item: `${base}/ru/excursions/${data.slug}`,
      },
    ],
  } as const;
}

function buildFaqJsonLd(faq: FAQItem[] | undefined) {
  if (!faq || faq.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  } as const;
}

function buildArticleJsonLd(data: TourData) {
  if (!data.longread || !data.longread.paragraphs?.length) return null;
  const body = data.longread.paragraphs.join("\n\n");
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: data.longread.title || data.title,
    articleBody: body,
    author: { "@type": "Organization", name: "4-trip" },
    publisher: { "@type": "Organization", name: "4-trip" },
    mainEntityOfPage: `${originUrl()}/ru/excursions/${data.slug}`,
    datePublished: data.nextDates?.[0],
  } as const;
}

function absoluteUrl(path: string) {
  if (!path) return path;
  if (path.startsWith("http")) return path;
  if (typeof window === "undefined") return path; // SSR-safe fallback
  const url = new URL(path, window.location.origin);
  return url.href;
}

function originUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  // SSR fallback; replace with your prod domain if desired
  return "https://4-trip.ru";
}

// === UI Subcomponents ===
function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-sm font-medium text-gray-800 shadow">
      {children}
    </span>
  );
}

// === Main Page ===
export default function TourPageSEO({ data }: { data: TourData }) {
  const [activeVariantId, setActiveVariantId] = useState(
    data.routeVariants?.[0]?.id || "default",
  );

  const activeVariant = useMemo(
    () => data.routeVariants?.find((v) => v.id === activeVariantId) || data.routeVariants?.[0],
    [activeVariantId, data.routeVariants],
  );

  const inclusions = data.inclusions?.length
    ? data.inclusions
    : [
        "Работа лицензированного гида",
        "Туристический автобус по маршруту",
        "Аудиосистема и сопровождение на протяжении поездки",
      ];
  const exclusions = data.exclusions?.length ? data.exclusions : undefined;
  const expectations = data.expectations || data.hero.description;

  const tourJsonLd = useMemo(() => buildTourJsonLd(data), [data]);
  const breadcrumbsJsonLd = useMemo(() => buildBreadcrumbsJsonLd(data), [data]);
  const faqJsonLd = useMemo(() => buildFaqJsonLd(data.faq || []), [data.faq]);
  const articleJsonLd = useMemo(() => buildArticleJsonLd(data), [data]);

  return (
    <div className="font-sans bg-gray-50 text-gray-900 scroll-smooth">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tourJsonLd) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
      {articleJsonLd && (
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
      )}

      <SiteHeader
        title={data.title}
        project="trip"
        links={[
          { href: "#hero", label: "Главная" },
          { href: "#about", label: "О туре" },
          { href: "#program", label: "Программа" },
          { href: "#meeting", label: "Место встречи" },
          { href: "#booking", label: "Бронирование" },
          { href: "#faq", label: "FAQ" },
        ]}
      />

      <main>
        {/* Hero */}
        <section id="hero" className="relative h-screen flex items-center overflow-hidden scroll-mt-24">
          <div className="absolute inset-0">
            <BaseImage
              src={data.hero.image}
              alt={data.title}
              width={1920}
              fill
              priority
              className="object-cover w-full h-full brightness-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          </div>

          <div className="relative z-10 w-full">
            <div className="container mx-auto px-4 py-8 md:py-12">
              <div className="max-w-3xl text-white">
                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                  {data.title}
                </h1>
                {data.subtitle && (
                  <p className="mt-3 text-lg md:text-xl text-gray-100">{data.subtitle}</p>
                )}
                <div className="mt-6 flex flex-wrap gap-2">
                  <Badge>{data.duration || "3–4 часа"}</Badge>
                  {data.schedule && <Badge>{data.schedule}</Badge>}
                  {data.ageLimit && <Badge>{data.ageLimit}</Badge>}
                  {data.groupSize && <Badge>{data.groupSize}</Badge>}
                </div>

                <p className="mt-6 text-base md:text-lg max-w-2xl text-gray-100">
                  {data.hero.description}
                </p>

                <div className="mt-8 flex flex-col md:flex-row md:items-center gap-4">
                  <IntlLink
                    href="#booking"
                    className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold shadow hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                  >
                    Забронировать место · {data.price.toLocaleString("ru-RU")} {data.currency || "₽"}
                  </IntlLink>
                  {(() => {
                    const nearest = (() => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const fromAvailable = availableDates.find((d) => {
                        const dd = new Date(d.getFullYear(), d.getMonth(), d.getDate());
                        return dd >= today;
                      });
                      if (fromAvailable) return fromAvailable;
                      const fromData = (data.nextDates || [])
                        .map((s) => new Date(s))
                        .filter((d) => !isNaN(d.getTime()))
                        .sort((a, b) => a.getTime() - b.getTime());
                      const f = fromData.find((d) => {
                        const dd = new Date(d.getFullYear(), d.getMonth(), d.getDate());
                        return dd >= today;
                      });
                      return f || fromData[0];
                    })();
                    return nearest ? (
                      <span className="text-white/90">
                        Ближайшая дата: {nearest.toLocaleDateString("ru-RU", { day: "numeric", month: "long" })}
                      </span>
                    ) : null;
                  })()}
                </div>

                {data.rating && (
                  <div className="mt-4 text-sm text-gray-200">
                    Рейтинг {data.rating.value}★ · {data.rating.count.toLocaleString("ru-RU")} отзывов
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Trust bar / payments */}
        <section className="bg-white border-y">
          <div className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-3 text-gray-700">
              <span className="font-semibold">Принимаем оплату:</span>
              <span className="tracking-wide">VISA</span>
              <span className="tracking-wide">Mastercard</span>
              <span className="tracking-wide">МИР</span>
              <span className="tracking-wide">СБП</span>
            </div>
            <div className="text-gray-600">
              Поддержка: <a className="underline" href={`tel:${contactInfo.phone}`}>{contactInfo.phone}</a> · <a className="underline" href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
            </div>
          </div>
        </section>

        {/* <nav aria-label="Хлебные крошки" className="bg-white/90 py-2 mt-6">
          <div className="container mx-auto px-4 text-sm text-gray-600">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <IntlLink href="/" className="hover:text-gray-900">
                  Главная
                </IntlLink>
              </li>
              <li aria-hidden>›</li>
              <li>
                <IntlLink href="/excursions" className="hover:text-gray-900">
                  Экскурсии
                </IntlLink>
              </li>
              <li aria-hidden>›</li>
              <li className="text-gray-900" aria-current="page">
                {data.title}
              </li>
            </ol>
          </div>
        </nav> */}

        {/* Longread with sticky sidebar */}
        <section id="about" className="py-16 bg-white scroll-mt-24">
          <div className="container mx-auto px-4">
            <div className="lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)] lg:gap-12">
              <article className="max-w-3xl mx-auto lg:mx-0 lg:max-w-none">
                <h2 className="text-3xl font-bold mb-6">{data.longread?.title || "О туре подробно"}</h2>
                {data.longread?.tldr?.length ? (
                  <div className="mb-8 rounded-xl bg-blue-50 p-5 text-blue-900 border border-blue-100">
                    <div className="font-semibold mb-2">В двух словах</div>
                    <ul className="list-disc pl-5 space-y-1">
                      {data.longread.tldr.map((i, idx) => (
                        <li key={idx}>{i}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                <div className="text-[17px] leading-7 text-gray-800 space-y-4">
                  {(data.longread?.paragraphs || []).map((p, idx) => {
                    // Highlight stop headings like: "Остановка 1 • ...: ..."
                    const mStop = p.match(/^(Остановка\s+\d+\s•\s[^:]+:)(\s*)(.*)$/);
                    if (mStop) {
                      return (
                        <p key={idx}>
                          <strong>{mStop[1]}</strong>
                          {mStop[2]}
                          {mStop[3]}
                        </p>
                      );
                    }
                    // Highlight labeled segments like: "Старт — ...", "К центру: ...", etc.
                    const mLabel = p.match(/^((Старт|К центру|Набережные|К смотровой|Обратно|Формат|Фото|Семьям|Паузы|Что взять|Перекрытия|Продолжение дня|Темп))([:—])\s*(.*)$/);
                    if (mLabel) {
                      return (
                        <p key={idx}>
                          <strong>{mLabel[1]}{mLabel[3]} </strong>
                          {mLabel[4]}
                        </p>
                      );
                    }
                    return <p key={idx}>{p}</p>;
                  })}
                </div>

                {/* Перенесено из сайдбара: ожидания, включено/не включено */}
                {expectations && (
                  <div className="mt-10">
                    <p className="text-lg font-semibold text-gray-900 mb-2">Что вас ждёт</p>
                    <p className="text-gray-700 leading-relaxed">{expectations}</p>
                  </div>
                )}

                {/* Программа и маршрут — перенесено в основную колонку */}
                {data.routeVariants?.[0] && (
                  <div id="program" className="mt-10 scroll-mt-24">
                    <h3 className="text-2xl font-semibold mb-3">Программа и маршрут</h3>
                    <ol className="space-y-3">
                      {data.routeVariants[0].points.map((p, idx) => (
                        <li key={idx} className="flex gap-3">
                          <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed">{p}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {inclusions?.length ? (
                  <div className="mt-8">
                    <h4 className="text-lg font-semibold mb-2">Что включено</h4>
                    <ul className="space-y-1.5 text-gray-800">
                      {inclusions.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500" aria-hidden />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {exclusions?.length ? (
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold mb-2">Что не включено</h4>
                    <ul className="space-y-1.5 text-gray-800">
                      {exclusions.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-pink-400" aria-hidden />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

              </article>

              <aside className="mt-10 lg:mt-0">
                <div className="lg:sticky lg:top-24 space-y-6">
                  <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-lg shadow-blue-100/40">

                    <div className="border-t border-gray-100 pt-4">
                      <dl className="space-y-3">
                        {[
                          { label: "Длительность", value: data.duration },
                          { label: "Расписание", value: data.schedule },
                          { label: "Группа", value: data.groupSize },
                          { label: "Возраст", value: data.ageLimit },
                        ]
                          .filter((item) => item.value)
                          .map((item) => (
                            <div key={item.label} className="flex items-start justify-between gap-4 text-sm">
                              <dt className="uppercase tracking-wide text-gray-500">{item.label}</dt>
                              <dd className="text-gray-900 font-medium text-right">{item.value}</dd>
                            </div>
                          ))}
                      </dl>
                    </div>

                    <div className="mt-4">
                      <IntlLink
                        href="#booking"
                        className="inline-flex items-center justify-center w-full rounded-xl bg-blue-600 px-5 py-3 text-white font-semibold shadow hover:bg-blue-700 transition"
                      >
                        {`Забронировать место · ${data.meetingPoint?.price || `${data.price.toLocaleString("ru-RU")} ${data.currency || "₽"}`}`}
                      </IntlLink>
                    </div>
                  </div>
                </div>
              </aside>
            </div>

            {data.learnMore?.length ? (
              <div className="mt-12">
                <LearnList items={data.learnMore} />
              </div>
            ) : null}
          </div>
        </section>

        {/* Highlights / attractions grid (следующий блок после программы) */}
        <section id="highlights" className="py-16 bg-white scroll-mt-24">
          <div className="container mx-auto px-4">
            {/* Attractions heading + grid */}
            {data.attractions?.length ? (
              <>
                <h2 className="text-3xl font-bold text-center mb-8">Что увидим по пути</h2>
                <div className="mt-12 grid md:grid-cols-2 gap-8">
                  {data.attractions.map((attr, idx) => (
                    <article key={idx} className="flex flex-col bg-gray-50 rounded-xl shadow overflow-hidden">
                      <div className="relative w-full aspect-[4/3]">
                        <BaseImage src={attr.image} alt={attr.alt} width={828} fill className="object-cover" />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2">{attr.title}</h3>
                        {attr.description.map((p, i) => (
                          <p key={i} className="text-gray-700 mb-2">{p}</p>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </>
            ) : null}

          </div>
        </section>

        {/* Meeting & map */}
        <section id="meeting" className="py-16 bg-gray-50 scroll-mt-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Место встречи и окончание</h2>
            <div className="grid md:grid-cols-2 gap-8 items-stretch">
              <div className="w-full h-96 rounded-xl overflow-hidden shadow bg-white">
                <iframe
                  src={data.meetingPoint.mapSrc}
                  width="100%"
                  height="100%"
                  frameBorder={0}
                  allowFullScreen
                  loading="lazy"
                  title="Место встречи"
                />
              </div>
              <div className="p-6 bg-white rounded-xl shadow">
                <ul className="space-y-3 text-gray-800">
                  <li><span className="font-semibold">Адрес:</span> {data.meetingPoint.address}</li>
                  {data.meetingPoint.startTime && (
                    <li><span className="font-semibold">Время отправления:</span> {data.meetingPoint.startTime}</li>
                  )}
                  {data.meetingPoint.endAddress && (
                    <li><span className="font-semibold">Окончание:</span> {data.meetingPoint.endAddress}</li>
                  )}
                  {data.meetingPoint.note && (
                    <li className="text-gray-600">{data.meetingPoint.note}</li>
                  )}
                </ul>
                <div className="mt-6">
                  <IntlLink href="#booking" className="inline-flex items-center rounded-lg bg-blue-600 px-5 py-3 text-white font-semibold shadow hover:bg-blue-700">Забронировать</IntlLink>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Booking */}
        <section id="booking" className="py-16 bg-white scroll-mt-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <BookingForm price={data.price} tourName={data.title} />
            </div>
          </div>
        </section>

        

        {/* FAQ */}
        {data.faq?.length ? (
          <section id="faq" className="py-16 bg-white scroll-mt-24">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">Часто задаваемые вопросы</h2>
              <div className="space-y-6 max-w-3xl mx-auto">
                {data.faq.map((faq, idx) => (
                  <details key={idx} className="group rounded-xl border p-4 open:shadow">
                    <summary className="cursor-pointer select-none text-lg font-semibold flex items-center justify-between">
                      {faq.question}
                      <span className="ml-3 text-gray-400 group-open:rotate-180 transition">▾</span>
                    </summary>
                    <div className="mt-3 text-gray-700">{faq.answer}</div>
                  </details>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {/* Related tours */}
        <section id="related" className="py-16 bg-white scroll-mt-24">
          <RelatedTours currentSlug={data.slug} />
        </section>

        <Footer
          project="trip"
          contacts={{ phone: contactInfo.phone, email: contactInfo.email, social: contactInfo.social }}
        />
      </main>
    </div>
  );
}
