import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import contactInfo from "@/app/config/contactInfo";

export default function ContactsPage() {
  const { phone, email, social } = contactInfo;

  return (
    <div className="font-sans bg-white text-gray-900 scroll-smooth min-h-screen flex flex-col">
      <Header
        title="Контакты"
        main
        links={[
          { href: "/", label: "Главная" },
          { href: "/blog", label: "Блог" },
          { href: "/contacts", label: "Контакты" },
        ]}
      />


      <main className="flex-grow container mx-auto px-4 py-16 mt-16">
        <h1 className="text-4xl font-bold text-center mb-12">Свяжитесь с нами</h1>

        <div className="max-w-xl mx-auto space-y-6 text-lg text-gray-800">
          <p>
            Мы всегда рады ответить на ваши вопросы и помочь с выбором экскурсии.
          </p>
          <p>
            <strong>Телефон:</strong> <a href={`tel:${phone}`} className="text-blue-600 hover:underline">{phone}</a>
          </p>
          <p>
            <strong>Email:</strong> <a href={`mailto:${email}`} className="text-blue-600 hover:underline">{email}</a>
          </p>
          <p>
            <strong>Telegram:</strong> <a href={social.telegram} target="_blank" className="text-blue-600 hover:underline">написать в Telegram</a>
          </p>
          <p>
            <strong>ВКонтакте:</strong> <a href={social.vk} target="_blank" className="text-blue-600 hover:underline">наша страница</a>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
