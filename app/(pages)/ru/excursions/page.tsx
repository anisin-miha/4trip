import { Metadata } from "next";
import { Suspense } from "react";
import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";
import contactInfo from "@/app/config/contactInfo";
import { tours as baseTours, moscowSightseeingCard, type Tour as BaseTour } from "@/app/config/tours";
import ExcursionsClient from "./ExcursionsClient";

type MeetingPoint = {
  mapSrc: string;
  address: string;
  timeSlots?: string[];
  duration?: string;
  endAddress?: string;
  type?: string;
  groupSize?: string;
  forWhom?: string;
  language?: string;
  price?: string;
  info?: Array<{ label: string; value: string }>;
};

type Tour = BaseTour;

export const metadata: Metadata = {
  title: "Экскурсии по Подмосковью — групповые туры от 4-trip.ru",
  description:
    "Групповые и индивидуальные экскурсии по Москве и Подмосковью: Парк «Патриот», Сергиев Посад, Коломна и обзорные туры. Удобное расписание, опытные гиды, комфортные автобусы.",
  openGraph: {
    title: "Экскурсии по Подмосковью — групповые туры от 4-trip.ru",
    description:
      "Выбирайте экскурсии из Москвы: Парк «Патриот», Сергиев Посад, Коломна, обзорная по столице. Фильтры по цене, длительности, языку и времени старта.",
    images: ["/images/og/excursions.png"],
  },
};

function getAllTours(): Tour[] {
  const arr: Tour[] = baseTours.map((t) => ({
    ...t,
    image: t.hero?.image || "",
    href: `/ru/excursions/${t.slug}`,
    meetingPoint: t.meetingPoint as MeetingPoint | undefined,
  } as Tour));
  if (moscowSightseeingCard) arr.push(moscowSightseeingCard as unknown as Tour);
  return arr;
}

export default function ExcursionsPage() {
  const all = getAllTours();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SiteHeader
        title="Экскурсии"
        project="trip"
        main
        links={[
          { href: "/ru", label: "Главная" },
          // { href: "/ru/excursions", label: "Экскурсии" },
          { href: "/ru/blog", label: "Блог" },
          { href: "/ru/contacts", label: "Контакты" },
        ]}
      />

      <main className="py-10">
        <section className="mx-auto max-w-7xl px-4">
          <Suspense
            fallback={
              <div className="grid grid-cols-12 gap-8">
                <div className="col-span-12 lg:col-span-4 xl:col-span-3">
                  <div className="h-64 rounded-xl bg-gray-50 border border-gray-200" />
                </div>
                <div className="col-span-12 lg:col-span-8 xl:col-span-9">
                  <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="rounded-lg border border-gray-200 h-80 bg-gray-50"
                      />
                    ))}
                  </div>
                </div>
              </div>
            }
          >
            <ExcursionsClient allTours={all} />
          </Suspense>
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
    </div>
  );
}
