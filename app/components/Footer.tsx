// src/components/Footer.tsx

'use client';

import Link from 'next/link';
import contactInfo from '../config/contactInfo';

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
              <a href={`tel:${phone}`} className="hover:underline">
                {phone}
              </a>
            </p>
            <p>
              Email:&nbsp;
              <a href={`mailto:${email}`} className="hover:underline">
                {email}
              </a>
            </p>
            <p>Адрес: {address}</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Полезные ссылки</h3>
            <ul className="space-y-2">
              <li>
                <Link href={links.privacyPolicy} className="hover:underline">
                  Политика конфиденциальности
                </Link>
              </li>
              <li>
                <Link href={links.terms} className="hover:underline">
                  Публичная оферта
                </Link>
              </li>
              <li>
                <Link href={links.sitemap} className="hover:underline">
                  Карта сайта
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Мы в соцсетях</h3>
            <div className="flex space-x-4">
              <a href={social.vk} className="text-white hover:text-gray-300">
                <i className="fab fa-vk fa-2x"></i>
              </a>
              <a href={social.facebook} className="text-white hover:text-gray-300">
                <i className="fab fa-facebook fa-2x"></i>
              </a>
              <a href={social.instagram} className="text-white hover:text-gray-300">
                <i className="fab fa-instagram fa-2x"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p>
            &copy;&nbsp;{currentYear} Экскурсии в Парк Патриот. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
}
