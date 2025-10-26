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
  QrCode, // для СБП (монохромный fallback)
  ShieldCheck,
} from "lucide-react";
import { SiVisa, SiMastercard } from "react-icons/si";
import { SHOW_BUS_LINKS } from "./config";

type Contacts = {
  phone?: string;
  email?: string;
  social?: { telegram?: string; vk?: string };
  address?: string;
};

// Бренды, которые показываем в нижнем уровне футера (монохром)
const PAYMENT_BRAND_MAP: Record<
  string,
  { label: string; Icon: React.ComponentType<{ size?: number; className?: string }> }
> = {
  visa: { label: "Visa", Icon: SiVisa },
  mastercard: { label: "Mastercard", Icon: SiMastercard },
  // mir: { label: "Мир", Icon: SiMir },
  sbp: { label: "СБП", Icon: QrCode }, // у simple-icons нет СБП → используем QR как понятный маркер
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
  // Если используем intl-Link, он сам добавит локаль → префикс не нужен
  const prefix = LinkComponent ? "" : project === "trip" ? "/ru" : "";
  const IconWrap = ({ children }: { children: React.ReactNode }) => (
    <span className="text-gray-400" aria-hidden>
      {children}
    </span>
  );

  // какие бренды показывать (через ENV или дефолт)
  const visiblePaymentKeys = (process.env.NEXT_PUBLIC_PAYMENT_BRANDS ||
    "visa,mastercard,mir,sbp"
  )
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  const paymentBrands = visiblePaymentKeys
    .map((k) => PAYMENT_BRAND_MAP[k])
    .filter(Boolean);

  return (
    <footer id="footer" className="bg-black text-white pt-16 pb-10">
      <div className="container mx-auto px-4">
        {/* Верхний уровень с колонками */}
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
                {/* <li>
                  <LinkTag
                    href={`${prefix}/excursions`}
                    className="hover:text-white transition inline-flex items-center gap-2"
                  >
                    <IconWrap><LinkIcon size={16} /></IconWrap>
                    <span>Все экскурсии</span>
                  </LinkTag>
                </li> */}
                <li>
                  <LinkTag href={`${prefix}/excursions/patriot`} className="hover:text-white transition inline-flex items-center gap-2">
                    <IconWrap><Landmark size={16} /></IconWrap>
                    <span>Парк «Патриот»</span>
                  </LinkTag>
                </li>
                <li>
                  <LinkTag href={`${prefix}/excursions/sergiev-posad`} className="hover:text-white transition inline-flex items-center gap-2">
                    <IconWrap><Building2 size={16} /></IconWrap>
                    <span>Сергиев Посад</span>
                  </LinkTag>
                </li>
                <li>
                  <LinkTag href={`${prefix}/excursions/kolomna`} className="hover:text-white transition inline-flex items-center gap-2">
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
              <li>
                <LinkTag href={`${prefix}/offer`} className="hover:text-white transition inline-flex items-center gap-2">
                  <IconWrap><FileText size={16} /></IconWrap>
                  <span>Договор оферты</span>
                </LinkTag>
              </li>
              <li>
                <LinkTag href={`${prefix}/refunds`} className="hover:text-white transition inline-flex items-center gap-2">
                  <IconWrap><FileText size={16} /></IconWrap>
                  <span>Правила возврата</span>
                </LinkTag>
              </li>
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Контакты</h3>
            <ul className="space-y-2 text-gray-300">
              {contacts?.phone && (
                <li>
                  <a
                    href={`tel:${contacts.phone.replace(/\s|\(|\)|-/g, "")}`}
                    className="hover:text-white transition inline-flex items-center gap-2"
                  >
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
                  <a
                    href={contacts.social.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition inline-flex items-center gap-2"
                  >
                    <IconWrap><Send size={16} /></IconWrap>
                    <span>Telegram</span>
                  </a>
                </li>
              )}
              {contacts?.social?.vk && (
                <li>
                  <a
                    href={contacts.social.vk}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition inline-flex items-center gap-2"
                  >
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
                Перейти на{" "}
                {project === "bus" ? (
                  <a href={tripUrl} className="underline hover:text-white inline-flex items-center gap-1">
                    <ArrowRight size={16} /> 4-trip
                  </a>
                ) : (
                  <a href={busUrl} className="underline hover:text-white inline-flex items-center gap-1">
                    <ArrowRight size={16} /> 4-bus
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* НИЖНИЙ УРОВЕНЬ: Способы оплаты (монохром, через react-icons/si) */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-semibold">Способы оплаты</h3>
              <p className="text-gray-400 text-sm mt-1">
                Оплата банковскими картами и по СБП. Платёж обрабатывается безопасно, чек НПД направляется на e-mail/SMS.
              </p>
            </div>

            {/* <ul className="flex flex-wrap items-center gap-6 md:gap-8">
              {paymentBrands.map(({ label, Icon }) => (
                <li key={label} className="shrink-0 inline-flex items-center gap-3">
                  <span className="rounded-lg bg-white/5 px-4 py-3">
                    <Icon className="text-white/90" size={36} />
                  </span>
                  <span className="text-gray-300 text-sm">{label}</span>
                </li>
              ))} */}
              {/* Маркер доверия */}
              {/* <li className="shrink-0 inline-flex items-center gap-3">
                <span className="rounded-lg bg-white/5 px-4 py-3">
                  <ShieldCheck className="text-white/90" size={36} />
                </span>
                <span className="text-gray-300 text-sm">Безопасный платёж</span>
              </li>
            </ul> */}
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 text-sm text-gray-400">
          <p>&copy; {currentYear} {project === "trip" ? "4-trip" : "4-bus"}. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}
