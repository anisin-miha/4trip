import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: Request & { nextUrl: URL }) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const site = (process.env.SITE || process.env.NEXT_PUBLIC_SITE || "trip").toLowerCase();

  // If running the 4trip variant, hard-404 the 4-bus subtree
  if (site === "trip") {
    if (pathname === "/ru-bus" || pathname.startsWith("/ru-bus/")) {
      const notFoundUrl = new URL("/404", request.url);
      return NextResponse.rewrite(notFoundUrl);
    }
  }

  // For bus variant: disable locale routing entirely and 404 any /ru* paths
  if (site === "bus") {
    if (pathname === "/ru" || pathname.startsWith("/ru/")) {
      const notFoundUrl = new URL("/404", request.url);
      return NextResponse.rewrite(notFoundUrl);
    }
    // Skip next-intl – no i18n for buses
    return NextResponse.next();
  }

  return intlMiddleware(request as any);
}

export const config = {
  matcher: ["/((?!_next|.*\\..*|api).*)"],
};
