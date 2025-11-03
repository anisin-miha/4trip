"use client";

import { useEffect, useRef, useState } from "react";

import SiteHeader from "@/app/components/ru/SiteHeader";
import { Footer } from "@/packages/shared-ui/src/ru";
import contactInfo from "@/app/config/contactInfo";
import BaseImage from "@/components/BaseImage";
import BookingForm from "./BookingForm";
import { availableDates } from "./BookingForm";
import {
  formatExcursionDateFriendly,
  pickNearestExcursionDate,
} from "./date-utils";

import RelatedTours from "./RelatedTours";
import { type FAQItem, type TourData } from "@/app/config/ru/tours/types";
import FAQSection from "@/app/components/ru/FAQSection";

// Yandex Maps loader and interactive map with numbered markers
function useYandexMaps() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const w = window as any;
    if (w.ymaps) {
      setReady(true);
      return;
    }
    if (w.__ymapsLoadingPromise) {
      w.__ymapsLoadingPromise
        .then(() => setReady(true))
        .catch(() => setReady(false));
      return;
    }
    const existing = document.querySelector('script[data-ymaps-loader="true"]');
    if (existing) {
      // Another instance already appended the script; wait for global to appear
      const check = () => {
        if ((window as any).ymaps) setReady(true);
        else setTimeout(check, 50);
      };
      check();
      return;
    }
    const src = "https://api-maps.yandex.ru/2.1/?lang=ru_RU";
    const p: Promise<void> = new Promise<void>((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.defer = true;
      s.setAttribute("data-ymaps-loader", "true");
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("Yandex Maps load failed"));
      document.head.appendChild(s);
    })
      .then(() => {
        setReady(true);
      })
      .catch(() => setReady(false));
    w.__ymapsLoadingPromise = p;
  }, []);
  return typeof window !== "undefined" ? (window as any).ymaps || null : null;
}

function MeetingPointMap({
  lat,
  lng,
  title,
}: {
  lat: number;
  lng: number;
  title: string;
}) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const ymaps = useYandexMaps();

  useEffect(() => {
    if (!ymaps || !mapRef.current) return;

    ymaps.ready(() => {
      const map = new ymaps.Map(mapRef.current, {
        center: [lat, lng],
        zoom: 15,
        controls: ["zoomControl", "fullscreenControl"],
      });

      const marker = new ymaps.Placemark(
        [lat, lng],
        {
          balloonContent: title,
          hintContent: title,
        },
        {
          preset: "islands#blueCircleDotIcon",
          iconColor: "#2563eb",
        },
      );

      map.geoObjects.add(marker);
    });

    return () => {
      // Yandex Maps cleans up with GC when element is detached
    };
  }, [ymaps, lat, lng, title]);

  if (!ymaps) {
    return (
      <div className="w-full h-96 rounded-xl overflow-hidden shadow bg-white flex items-center justify-center">
        <p className="text-gray-600">Загрузка карты...</p>
      </div>
    );
  }

  return (
    <div
      className="w-full h-96 rounded-xl overflow-hidden shadow bg-white"
      ref={mapRef}
    />
  );
}

// === Helpers: JSON-LD builders ===
function buildTourJsonLd(data: TourData, startDate?: string) {
  const currency = data.currency;
  // Prefer `program` as canonical flat itinerary; fall back to mapPoints titles
  const itinerary = data.program.length
    ? data.program.map((p) => p.title)
    : data.mapPoints.map((m) => m.title);
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: data.title,
    description: data.expectations || data.hero.description,
    image: data.hero.image ? [absoluteUrl(data.hero.image)] : undefined,
    itinerary: itinerary,
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
    startDate: startDate || undefined,
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

function buildArticleJsonLd(data: TourData, publishedDate?: string) {
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
    datePublished: publishedDate || undefined,
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
  const inclusions = data.inclusions?.length
    ? data.inclusions
    : [
        "Работа лицензированного гида",
        "Туристический автобус по маршруту",
        "Аудиосистема и сопровождение на протяжении поездки",
      ];
  const exclusions = data.exclusions?.length ? data.exclusions : undefined;
  const expectations = data.expectations || data.hero.description;

  const primarySlot = data.meetingPoint?.timeSlots?.[0];
  const nearestExcursion = pickNearestExcursionDate({
    availableDates,
    timeSlots: data.meetingPoint?.timeSlots,
  });
  const nearestExcursionIso = nearestExcursion?.date?.toISOString();
  const tourJsonLd = buildTourJsonLd(data, nearestExcursionIso);
  const breadcrumbsJsonLd = buildBreadcrumbsJsonLd(data);
  const faqJsonLd = buildFaqJsonLd(data.faq || []);
  const articleJsonLd = buildArticleJsonLd(data, nearestExcursionIso);
  const friendlyNearestDate = formatExcursionDateFriendly(
    nearestExcursion?.date,
    nearestExcursion?.slot ?? primarySlot,
  );

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
        <section
          id="hero"
          className="relative h-screen flex items-center overflow-hidden scroll-mt-24"
        >
          <div className="absolute inset-0">
            <BaseImage
              src={data.hero.image}
              alt={data.title}
              width={1920}
              fill
              priority
              className="object-cover w-full h-full brightness-50"
              title={data.title}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          </div>

          <div className="relative z-10 w-full">
            <div className="container mx-auto px-4 py-8 md:py-12">
              <div className="max-w-3xl text-white">
                <h1 className="hero-title text-4xl md:text-5xl font-extrabold leading-tight">
                  {data.title}
                </h1>
                {data.subtitle && (
                  <p className="mt-3 text-lg md:text-xl text-gray-100">
                    {data.subtitle}
                  </p>
                )}
                <div className="mt-6 flex flex-wrap gap-2">
                  {data.badges?.map((badge, index) => (
                    <Badge key={index}>{badge}</Badge>
                  ))}
                </div>

                <p className="mt-6 text-base md:text-lg max-w-2xl text-gray-100">
                  {data.hero.description}
                </p>

                <div className="mt-8 flex flex-col md:flex-row md:items-center gap-4">
                  <a
                    href="#booking"
                    className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold shadow hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                  >
                    Забронировать место · {data.price.toLocaleString("ru-RU")}{" "}
                    {data.currency || "₽"}
                  </a>
                  {friendlyNearestDate && (
                    <span className="text-white/90">
                      Ближайшая дата: {friendlyNearestDate}
                    </span>
                  )}
                </div>
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
              Поддержка:{" "}
              <a className="underline" href={`tel:${contactInfo.phone}`}>
                {contactInfo.phone}
              </a>{" "}
              ·{" "}
              <a className="underline" href={`mailto:${contactInfo.email}`}>
                {contactInfo.email}
              </a>
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
                <h2 className="text-3xl font-bold mb-6">
                  {data.longread?.title || "О туре подробно"}
                </h2>
                {expectations || data.longread?.tldr?.length ? (
                  <div className="mb-8 rounded-xl bg-blue-50 p-5 text-blue-900 border border-blue-100">
                    <div className="font-semibold mb-2">Что вас ждёт</div>
                    {expectations ? (
                      <p className="text-[15px] leading-6 text-blue-900">
                        {expectations}
                      </p>
                    ) : (
                      <ul className="list-disc pl-5 space-y-1">
                        {data.longread!.tldr!.map((i, idx) => (
                          <li key={idx}>{i}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : null}
                <div className="text-[17px] leading-7 text-gray-800 space-y-4">
                  {(data.longread?.paragraphs || []).map((p, idx) => {
                    // Highlight stop headings like: "Остановка 1 • ...: ..."
                    const mStop = p.match(
                      /^(Остановка\s+\d+\s•\s[^:]+:)(\s*)(.*)$/,
                    );
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
                    const mLabel = p.match(
                      /^((Старт|К центру|Набережные|К смотровой|Обратно|Формат|Фото|Семьям|Паузы|Что взять|Перекрытия|Продолжение дня|Темп))([:—])\s*(.*)$/,
                    );
                    if (mLabel) {
                      return (
                        <p key={idx}>
                          <strong>
                            {mLabel[1]}
                            {mLabel[3]}{" "}
                          </strong>
                          {mLabel[4]}
                        </p>
                      );
                    }
                    return <p key={idx}>{p}</p>;
                  })}
                </div>

                {/* Перенесено из сайдбара: ожидания, включено/не включено */}
                {/* Expectations moved to the top info box */}

                {/* Программа и маршрут — перенесено в основную колонку */}
                <div id="program" className="mt-10 scroll-mt-24">
                  <h3 className="text-2xl font-semibold mb-3">
                    Программа и маршрут
                  </h3>

                  {/* Compute a canonical flat program: prefer detailed program, otherwise fallback to map points */}
                  {(() => {
                    // Build finalProgram as an array of items with optional time/title/description
                    type FinalProgItem = {
                      time?: string;
                      title: string;
                      description?: string;
                    };

                    const finalProgram: FinalProgItem[] = [];

                    if (data.program && data.program.length) {
                      data.program.forEach((p) =>
                        finalProgram.push({
                          time: p.time,
                          title: p.title || "",
                          description: p.description,
                        }),
                      );
                    } else if (data.mapPoints && data.mapPoints.length) {
                      data.mapPoints.forEach((m) =>
                        finalProgram.push({ title: m.title || "" }),
                      );
                    }

                    if (!finalProgram.length) return null;

                    // Render two parts: compact numbered list (multi-column) and detailed timeline if descriptions/times exist
                    const hasDetails = finalProgram.some(
                      (i) => i.description || i.time,
                    );

                    return (
                      <>
                        {!hasDetails && (
                          <ol className="columns-1 sm:columns-2 md:columns-3 gap-6 list-none program-vertical-list">
                            {finalProgram.map((item, idx) => (
                              <li
                                key={idx}
                                className="break-inside-avoid mb-3 flex gap-3 items-start"
                              >
                                <span className="mt-1 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold">
                                  {idx + 1}
                                </span>
                                <span
                                  className="leading-relaxed"
                                  // If item.title contains HTML entities, render as HTML; otherwise render as text
                                  dangerouslySetInnerHTML={{
                                    __html: item.title,
                                  }}
                                />
                              </li>
                            ))}
                          </ol>
                        )}

                        {hasDetails ? (
                          <div className="mt-6 space-y-4">
                            {finalProgram.map((item, idx) => (
                              <div
                                key={idx}
                                className="p-4 rounded-lg bg-gray-50 border"
                              >
                                <div className="flex items-start gap-4">
                                  <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-bold" style={{minWidth: 32}}>
                                    {idx + 1}
                                  </div>
                                  <div>
                                    <div className="text-sm text-gray-500">
                                      {item.time}
                                    </div>
                                    <div className="font-semibold text-gray-900">
                                      <span
                                        dangerouslySetInnerHTML={{
                                          __html: item.title,
                                        }}
                                      />
                                    </div>
                                    {item.description ? (
                                      <div className="mt-2 text-gray-700">
                                        {item.description}
                                      </div>
                                    ) : null}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </>
                    );
                  })()}
                </div>

                {inclusions?.length ? (
                  <div className="mt-8">
                    <h4 className="text-lg font-semibold mb-2">Что включено</h4>
                    <ul className="space-y-1.5 text-gray-800">
                      {inclusions.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span
                            className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500"
                            aria-hidden
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {exclusions?.length ? (
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold mb-2">
                      Что не включено
                    </h4>
                    <ul className="space-y-1.5 text-gray-800">
                      {exclusions.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span
                            className="mt-1 h-1.5 w-1.5 rounded-full bg-pink-400"
                            aria-hidden
                          />
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
                          { label: "Группа", value: data.groupSize },
                          { label: "Возраст", value: data.ageLimit },
                        ]
                          .filter((item) => item.value)
                          .map((item) => (
                            <div
                              key={item.label}
                              className="flex items-start justify-between gap-4 text-sm"
                            >
                              <dt className="uppercase tracking-wide text-gray-500">
                                {item.label}
                              </dt>
                              <dd className="text-gray-900 font-medium text-right">
                                {item.value}
                              </dd>
                            </div>
                          ))}
                      </dl>
                    </div>

                    <div className="mt-4">
                      <a
                        href="#booking"
                        className="inline-flex items-center justify-center w-full rounded-xl bg-blue-600 px-5 py-3 text-white font-semibold shadow hover:bg-blue-700 transition"
                      >
                        {data.price
                          ? `Забронировать место · ${data.price.toLocaleString("ru-RU")} ₽`
                          : "Забронировать место"}
                      </a>
                    </div>
                  </div>
                </div>
              </aside>
            </div>

            {/* {data.learnMore?.length ? (
              <div className="mt-12">
                <LearnList items={data.learnMore} />
              </div>
            ) : null} */}
          </div>
        </section>

        {/* Highlights / attractions grid (следующий блок после программы) */}
        <section id="highlights" className="py-16 bg-white scroll-mt-24">
          <div className="container mx-auto px-4">
            {/* Attractions heading + grid */}
            {data.attractions?.length ? (
              <>
                <h2 className="text-3xl font-bold text-center mb-8">
                  Что увидим по пути
                </h2>
                <div className="mt-12 grid md:grid-cols-2 gap-8">
                  {data.attractions.map((attr, idx) => (
                    <article
                      key={idx}
                      className="flex flex-col bg-gray-50 rounded-xl shadow overflow-hidden"
                    >
                      <div className="relative w-full aspect-[4/3]">
                        <BaseImage
                          src={attr.image}
                          alt={attr.alt}
                          width={828}
                          fill
                          className="object-cover"
                          title={attr.title}
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2">
                          {attr.title}
                        </h3>
                        {attr.description.map((p, i) => (
                          <p key={i} className="text-gray-700 mb-2">
                            {p}
                          </p>
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
            <h2 className="text-3xl font-bold text-center mb-8">
              Место встречи и окончание
            </h2>
            <div className="grid md:grid-cols-2 gap-8 items-stretch">
              <MeetingPointMap
                lat={data.meetingPoint.lat || 55.7706}
                lng={data.meetingPoint.lng || 37.5961}
                title={data.meetingPoint.address}
              />
              <div className="p-6 bg-white rounded-xl shadow">
                <ul className="space-y-3 text-gray-800">
                  <li>
                    <span className="font-semibold">Адрес:</span>{" "}
                    {data.meetingPoint.address}
                  </li>
                  {data.meetingPoint.timeSlots &&
                    data.meetingPoint.timeSlots.length > 0 && (
                      <li>
                        <span className="font-semibold">
                          Время отправления:
                        </span>{" "}
                        {data.meetingPoint.timeSlots.join(", ")}
                      </li>
                    )}
                  {data.meetingPoint.endAddress && (
                    <li>
                      <span className="font-semibold">Окончание:</span>{" "}
                      {data.meetingPoint.endAddress}
                    </li>
                  )}
                  {data.meetingPoint.note && (
                    <li className="text-gray-600">{data.meetingPoint.note}</li>
                  )}
                </ul>
                <div className="mt-6">
                  <a
                    href="#booking"
                    className="inline-flex items-center rounded-lg bg-blue-600 px-5 py-3 text-white font-semibold shadow hover:bg-blue-700"
                  >
                    Забронировать
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Booking */}
        <section id="booking" className="py-16 bg-white scroll-mt-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <BookingForm
                price={data.price}
                tourName={data.title}
                timeSlots={data.meetingPoint?.timeSlots}
              />
            </div>
          </div>
        </section>

        <FAQSection
          id="faq"
          headingClassName="text-center"
          items={data.faq?.map((item) => ({
            question: item.question,
            answer: item.answer,
          })) ?? []}
        />

        {/* Related tours */}
        <section id="related" className="py-16 bg-white scroll-mt-24">
          <RelatedTours currentSlug={data.slug} />
        </section>

        <Footer
          project="trip"
          contacts={{
            phone: contactInfo.phone,
            email: contactInfo.email,
            social: contactInfo.social,
          }}
        />
      </main>
    </div>
  );
}
