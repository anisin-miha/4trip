"use client";
import NextLink from "next/link";
import { useMemo } from "react";
import {
  Home,
  Newspaper,
  Phone as PhoneIcon,
  Mail as MailIcon,
  Bus as BusIcon,
  Car as CarIcon,
  Landmark,
  Building2,
  MapPin,
  ArrowRight,
  Send,
  Link as LinkIcon,
  FileText,
} from "lucide-react";
import { SHOW_BUS_LINKS } from "./config";

type Contacts = {
  phone?: string;
  email?: string;
  social?: { telegram?: string; vk?: string };
  address?: string;
};

export default function Footer({
  project,
  contacts,
  LinkComponent,
}: {
  project?: "bus" | "trip";
  contacts?: Contacts;
  LinkComponent?: React.ComponentType<{
    href: string;
    className?: string;
    children?: React.ReactNode;
  }>;
}) {
  const currentYear = new Date().getFullYear();
  const { tripUrl, busUrl } = useMemo(() => {
    const isProd = process.env.NODE_ENV === "production";
    return {
      tripUrl: isProd ? "https://4-trip.ru/ru" : "http://localhost:3000/ru",
      busUrl: isProd ? "https://4-bus.ru/" : "http://localhost:3001/",
    };
  }, []);
  const LinkTag: any = LinkComponent || NextLink;
  // Если используем intl‑Link, он сам добавит локаль → префикс не нужен
  const prefix = LinkComponent ? "" : project === "trip" ? "/ru" : "";
  const IconWrap = ({ children }: { children: React.ReactNode }) => (
    <span className="text-gray-400" aria-hidden>
      {children}
    </span>
  );
  return (
    <footer id="footer" className="bg-black text-white pt-16 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-lg font-semibold mb-4">Компания</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <LinkTag href={`${prefix}/`} className="hover:text-white transition inline-flex items-center gap-2">
                  <IconWrap><Home size={16} /></IconWrap>
                  <span>Главная</span>
                </LinkTag>
              </li>
              {project === "trip" && (
                <li>
                  <LinkTag href={`${prefix}/blog`} className="hover:text-white transition inline-flex items-center gap-2">
                    <IconWrap><Newspaper size={16} /></IconWrap>
                    <span>Блог</span>
                  </LinkTag>
                </li>
              )}
              <li>
                <LinkTag href={`${prefix}/contacts`} className="hover:text-white transition inline-flex items-center gap-2">
                  <IconWrap><PhoneIcon size={16} /></IconWrap>
                  <span>Контакты</span>
                </LinkTag>
              </li>
            </ul>
          </div>

          {project === "bus" ? (
            <div>
              <h3 className="text-lg font-semibold mb-4">Услуги</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <LinkTag href="/zakaz-avtobusa" className="hover:text-white transition inline-flex items-center gap-2">
                    <IconWrap><BusIcon size={16} /></IconWrap>
                    <span>Заказ автобуса</span>
                  </LinkTag>
                </li>
                <li>
                  <LinkTag href="/arenda-mikroavtobusa" className="hover:text-white transition inline-flex items-center gap-2">
                    <IconWrap><CarIcon size={16} /></IconWrap>
                    <span>Аренда микроавтобуса</span>
                  </LinkTag>
                </li>
              </ul>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold mb-4">Экскурсии</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <LinkTag href={`${prefix}/patriot`} className="hover:text-white transition inline-flex items-center gap-2">
                    <IconWrap><Landmark size={16} /></IconWrap>
                    <span>Парк «Патриот»</span>
                  </LinkTag>
                </li>
                <li>
                  <LinkTag href={`${prefix}/sergiev-posad`} className="hover:text-white transition inline-flex items-center gap-2">
                    <IconWrap><Building2 size={16} /></IconWrap>
                    <span>Сергиев Посад</span>
                  </LinkTag>
                </li>
                <li>
                  <LinkTag href={`${prefix}/kolomna`} className="hover:text-white transition inline-flex items-center gap-2">
                    <IconWrap><MapPin size={16} /></IconWrap>
                    <span>Коломна</span>
                  </LinkTag>
                </li>
              </ul>
            </div>
          )}

          {/* Клиентам / Политики */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Клиентам</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <LinkTag href={`${prefix}/privacy-policy`} className="hover:text-white transition inline-flex items-center gap-2">
                  <IconWrap><FileText size={16} /></IconWrap>
                  <span>Политика конфиденциальности</span>
                </LinkTag>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Контакты</h3>
            <ul className="space-y-2 text-gray-300">
              {contacts?.phone && (
                <li>
                  <a href={`tel:${contacts.phone.replace(/\s|\(|\)|-/g, "")}`} className="hover:text-white transition inline-flex items-center gap-2">
                    <IconWrap><PhoneIcon size={16} /></IconWrap>
                    <span>{contacts.phone}</span>
                  </a>
                </li>
              )}
              {contacts?.email && (
                <li>
                  <a href={`mailto:${contacts.email}`} className="hover:text-white transition inline-flex items-center gap-2">
                    <IconWrap><MailIcon size={16} /></IconWrap>
                    <span>{contacts.email}</span>
                  </a>
                </li>
              )}
              {contacts?.social?.telegram && (
                <li>
                  <a href={contacts.social.telegram} target="_blank" rel="noopener noreferrer" className="hover:text-white transition inline-flex items-center gap-2">
                    <IconWrap><Send size={16} /></IconWrap>
                    <span>Telegram</span>
                  </a>
                </li>
              )}
              {contacts?.social?.vk && (
                <li>
                  <a href={contacts.social.vk} target="_blank" rel="noopener noreferrer" className="hover:text-white transition inline-flex items-center gap-2">
                    <IconWrap><LinkIcon size={16} /></IconWrap>
                    <span>VK</span>
                  </a>
                </li>
              )}
              {(contacts?.address || (!contacts?.phone && !contacts?.email)) && (
                <li className="flex items-center gap-2">
                  <IconWrap><MapPin size={16} /></IconWrap>
                  <span className="text-gray-300">{contacts?.address || "Москва, Россия"}</span>
                </li>
              )}
            </ul>
            {project && SHOW_BUS_LINKS && (
              <div className="mt-4 text-gray-300">
                Перейти на {project === "bus" ? (
                  <a href={tripUrl} className="underline hover:text-white inline-flex items-center gap-1">
                    <ArrowRight size={16} /> 4‑trip
                  </a>
                ) : (
                  <a href={busUrl} className="underline hover:text-white inline-flex items-center gap-1">
                    <ArrowRight size={16} /> 4‑bus
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 text-sm text-gray-400">
          <p>&copy; {currentYear} {project === "trip" ? "4-trip" : "4-bus"}. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}
