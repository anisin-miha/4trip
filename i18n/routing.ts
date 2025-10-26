import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ru", "en"] as const,
  defaultLocale: "ru",

  domains: [
    { domain: "4-trip.ru", defaultLocale: "ru", locales: ["ru"] },
    // { domain: "4-trip.in", defaultLocale: "en", locales: ["en"] },
  ],
});
