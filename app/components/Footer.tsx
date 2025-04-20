"use client";

import Link from "next/link";
import contactInfo from "../config/contactInfo";

export default function Footer() {
  const { phone, email, address, links, social } = contactInfo;
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Контакты</h3>
            <p>
              Телефон:&nbsp;
              <a href={`tel:${phone}`} title="Телефон" className="hover:underline">
                {phone}
              </a>
            </p>
            <p>
              Email:&nbsp;
              <a href={`mailto:${email}`} title="Почта" className="hover:underline">
                {email}
              </a>
            </p>
            <p>Адрес: {address}</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Полезные ссылки</h3>
            <ul className="space-y-2">
              <li>
                <Link href={links.privacyPolicy} title="Политика конфиденциальности" className="hover:underline">
                  Политика конфиденциальности
                </Link>
              </li>
              <li>
                <Link href={links.terms} title="Публичная оферта" className="hover:underline">
                  Публичная оферта
                </Link>
              </li>
              <li>
                <Link href={links.sitemap} title="Карта сайта" className="hover:underline">
                  Карта сайта
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Мы в соцсетях</h3>
            <div className="flex space-x-4">
              <a href={social.vk} title="Вконтакте" className="text-white hover:text-gray-300">
                <i className="fab fa-vk fa-2x"></i>
              </a>
              {/* <a
                href={social.facebook}
                title="Facebook"
                className="text-white hover:text-gray-300"
              >
                <i className="fab fa-facebook fa-2x"></i>
              </a>
              <a
                href={social.instagram}
                title="Instagram"
                className="text-white hover:text-gray-300"
              >
                <i className="fab fa-instagram fa-2x"></i>
              </a> */}
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p>
            &copy;&nbsp;{currentYear} Экскурсии в Парк Патриот. Все права
            защищены.
          </p>
        </div>
      </div>
    </footer>
  );
}
