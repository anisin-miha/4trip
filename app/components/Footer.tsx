"use client";

import Link from "next/link";
import contactInfo from "../config/contactInfo";
import TgIcon from "../../public/images/telegram-svgrepo-com.svg";

export default function Footer() {
  const { phone, email, links, social } = contactInfo;
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="bg-white text-black py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Контакты</h3>
            <p>
              Телефон:&nbsp;
              <a
                href={`tel:${phone}`}
                title="Телефон"
                className="hover:underline text-gray-800"
              >
                {phone}
              </a>
            </p>
            {/* <p>
              Email:&nbsp;
              <a
                href={`mailto:${email}`}
                title="Почта"
                className="hover:underline text-gray-800"
              >
                {email}
              </a>
            </p> */}
          </div>

          {/* <div>
            <h3 className="text-xl font-bold mb-4">Полезные ссылки</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={links.privacyPolicy}
                  title="Политика конфиденциальности"
                  className="hover:underline text-gray-800"
                >
                  Политика конфиденциальности
                </Link>
              </li>
              <li>
                <Link
                  href={links.terms}
                  title="Публичная оферта"
                  className="hover:underline text-gray-800"
                >
                  Публичная оферта
                </Link>
              </li>
              <li>
                <Link
                  href={links.sitemap}
                  title="Карта сайта"
                  className="hover:underline text-gray-800"
                >
                  Карта сайта
                </Link>
              </li>
            </ul>
          </div> */}

          <div>
            <h3 className="text-xl font-bold mb-4">Мы в соцсетях</h3>
            <div className="flex space-x-4 items-center">
              <a
                href={social.telegram}
                title="Telegram"
                className="hover:opacity-80 transition"
                target="_blank"
                rel="noopener"
              >
                <TgIcon width={24} height={24} />
              </a>
              <a
                href={social.vk}
                title="Вконтакте"
                className="text-black hover:text-gray-600 transition"
                target="_blank"
                rel="noopener"
              >
                <i className="fab fa-vk fa-2x"></i>
              </a>
            </div>
          </div>
        </div>

        {/* <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            &copy;&nbsp;{currentYear} 4trip. Все права
            защищены.
          </p>
        </div> */}
      </div>
    </footer>
  );
}
