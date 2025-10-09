"use client";

import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { useParams } from "next/navigation";
import { PropsWithChildren, useMemo } from "react";

const LOCALES = ["ru", "en"] as const;
type Locale = (typeof LOCALES)[number];

type LinkProps = Omit<NextLinkProps, "href"> & {
  href: NextLinkProps["href"];
  /** Отключить префикс локали для этой ссылки (внешняя/особая) */
  noLocale?: boolean;
  target?: string;
  rel?: string;
  className?: string;
  // allow other anchor props
  [key: string]: any;
};

/** Внутренний помощник: не трогаем внешние, якорные и служебные href */
function isSkippable(href: string) {
  return (
    href.startsWith("http") ||
    href.startsWith("//") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("#") ||
    href.startsWith("/_next") ||
    href.startsWith("/api")
  );
}

/** Уже префиксовано одной из локалей? */
function isAlreadyPrefixed(pathname: string) {
  return LOCALES.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );
}

/** Префикс локали для string */
function withLocaleStr(path: string, locale: string) {
  if (!path.startsWith("/")) return path; // относительные вроде "../" — не трогаем
  if (isSkippable(path) || isAlreadyPrefixed(path)) return path;
  if (path === "/") return `/${locale}`;
  return `/${locale}${path}`;
}

/** Префикс локали для объектного href */
function withLocaleObj(
  href: Exclude<NextLinkProps["href"], string>,
  locale: string,
) {
  const pathname = href.pathname ?? "/";
  const prefixed =
    typeof pathname === "string" ? withLocaleStr(pathname, locale) : pathname;
  return { ...href, pathname: prefixed };
}

export default function I18nLink({
  href,
  children,
  noLocale,
  ...rest
}: PropsWithChildren<LinkProps>) {
  const params = useParams<{ locale?: string }>();
  const locale = (params?.locale as Locale) ?? "ru";

  const finalHref = useMemo(() => {
    if (noLocale) return href;
    if (typeof href === "string") return withLocaleStr(href, locale);
    return withLocaleObj(href, locale);
  }, [href, locale, noLocale]);

  return (
    <NextLink {...rest} href={finalHref}>
      {children}
    </NextLink>
  );
}
