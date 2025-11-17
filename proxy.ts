import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const DEFAULT_LOCALE = "ru";
const LOCALE_PREFIXES = ["ru", "en"];
const PUBLIC_FILE = /\.(.*)$/;

function hasLocalePrefix(pathname: string) {
  return LOCALE_PREFIXES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
}

export default function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  if (hasLocalePrefix(pathname)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  const normalizedPath = pathname === "/" ? "" : pathname;
  url.pathname = `/${DEFAULT_LOCALE}${normalizedPath}`;
  url.search = search;

  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ["/((?!api|_next|favicon|.*\\..*).*)"],
};
