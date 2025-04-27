import Link from "next/link";
import Header from "./Header";
import BaseImage from "@/components/BaseImage";
import BookingForm from "./BookingForm";
import Footer from "./Footer";
import GallerySection from "./GallerySection";
import { patriotTour } from "../config/tours/patriot";

type TourData = typeof patriotTour;

export default function TourPage({ data }: { data: TourData }) {
  return (
    <div className="font-sans bg-gray-100 scroll-smooth">
      <Header title={data.title} />

      <main>
        {/* Hero Section */}
        <section
          id="hero"
          className="relative h-screen flex items-center overflow-hidden scroll-mt-16"
        >
          {/* Картинка как фон */}
          <div className="absolute inset-0">
            <BaseImage
              src={data.hero.image}
              alt={data.title}
              fill
              priority
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/20" />
          </div>

          {/* Контент поверх */}
          <div className="relative z-10 w-full">
            <div className="container mx-auto px-4">
              <div className="max-w-md text-white text-left">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  {data.title}
                </h1>
                <p className="text-xl md:text-2xl mb-4 text-gray-100">
                  {data.hero.description}
                </p>

                {/* Добавляем цену */}
                <p className="text-lg md:text-xl font-semibold mb-8">
                  Стоимость: {data.price.toLocaleString("ru-RU")} ₽
                </p>

                <Link
                  href="#booking"
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition duration-300 text-lg font-semibold inline-block"
                >
                  Забронировать место
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Attractions Section */}
        <section id="attractions" className="py-16 bg-gray-100 scroll-mt-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Вы посетите:
            </h2>
            <div className="grid md:grid-cols-2 gap-12 mb-12">
              {data.attractions.map((attr, idx) => (
                <div
                  key={idx}
                  className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden h-full"
                >
                  <div className="relative h-64 w-full">
                    <BaseImage
                      src={attr.image}
                      alt={attr.alt}
                      // width={600}
                      // height={400}
                      // layout="fill"
                      fill
                      // objectFit="cover"
                      className="object-cover"
                    // className="rounded-t-lg"
                    />
                  </div>
                  <div className="flex flex-col flex-grow p-6">
                    <h3 className="text-xl font-semibold mb-4">{attr.title}</h3>
                    {attr.description.map((p, i) => (
                      <p key={i} className="mb-4 text-gray-700">
                        {p}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Learn More Section */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-12">
              <h3 className="text-2xl font-semibold mb-6 text-center">
                Вы узнаете:
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="list-disc pl-6 space-y-2">
                  {data.learnMore
                    .slice(0, Math.ceil(data.learnMore.length / 2))
                    .map((item, idx) => (
                      <li
                        key={idx}
                        dangerouslySetInnerHTML={{ __html: item }}
                      />
                    ))}
                </ul>
                <ul className="list-disc pl-6 space-y-2">
                  {data.learnMore
                    .slice(Math.ceil(data.learnMore.length / 2))
                    .map((item, idx) => (
                      <li
                        key={idx}
                        dangerouslySetInnerHTML={{ __html: item }}
                      />
                    ))}
                </ul>
              </div>
            </div>

            {/* Important Details Section */}
            <div className="bg-blue-50 rounded-lg shadow-md p-8 mb-12">
              <h3 className="text-2xl font-semibold mb-6 text-center">
                Важные детали:
              </h3>
              <ul className="list-disc pl-6 space-y-3">
                {data.details.map((detail, idx) => (
                  <li key={idx}>{detail}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Meeting Point Section */}
        <section id="meeting" className="py-16 bg-gray-100 scroll-mt-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">
              Место встречи и маршрут
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="w-full h-96 rounded-lg overflow-hidden shadow-md">
                <iframe
                  src={data.meetingPoint.mapSrc}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allowFullScreen
                  loading="lazy"
                  title="Место встречи"
                />
              </div>
              <div className="p-6 rounded-lg">
                <ul className="space-y-4 text-gray-800">
                  {data.meetingPoint.info.map((info, idx) => (
                    <li key={idx}>
                      <span className="font-semibold">{info.label}:</span>{" "}
                      {info.value}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Booking Section */}
        <section id="booking">
          <BookingForm price={data.price} tourName={data.title} />
        </section>

        {/* Gallery Section */}
        <GallerySection title="Фотогалерея" images={data.gallery} />

        {/* FAQ Section */}
        <section id="faq" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Часто задаваемые вопросы
            </h2>
            <div className="space-y-6 max-w-2xl mx-auto">
              {data.faq.map((faq, idx) => (
                <div key={idx}>
                  <h3 className="text-xl font-bold mb-2">{faq.question}</h3>
                  <p>{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}
