import Link from "next/link";

export default function Footer() {
  return (
    <footer id="footer" className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Контакты</h3>
            <p>Телефон: +7 (495) 123-45-67</p>
            <p>Email: info@patriot-tour.ru</p>
            <p>Адрес: г. Москва, ул. Примерная, д.&nbsp;1</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Полезные ссылки</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy-policy" className="hover:underline">
                  Политика конфиденциальности
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:underline">
                  Публичная оферта
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Карта сайта
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Мы&nbsp;в&nbsp;соцсетях</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-gray-300">
                <i className="fab fa-vk fa-2x"></i>
              </a>
              <a href="#" className="text-white hover:text-gray-300">
                <i className="fab fa-facebook fa-2x"></i>
              </a>
              <a href="#" className="text-white hover:text-gray-300">
                <i className="fab fa-instagram fa-2x"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p>
            &copy;&nbsp;2025 Экскурсии в&nbsp;Парк Патриот. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
}
