// import { getRequestConfig } from "next-intl/server";
// import { hasLocale } from "next-intl";
// import { routing } from "./routing";

// export default getRequestConfig(async ({ requestLocale }) => {
//   // Typically corresponds to the `[locale]` segment
//   const requested = await requestLocale;
//   const locale = hasLocale(routing.locales, requested)
//     ? requested
//     : routing.defaultLocale;

//   return {
//     locale,
//     messages: (await import(`../i18n/locales/ru.json`)).default
//   };
// });

// i18n/request.ts — безопасный заглушечный конфиг без headers()
import { getRequestConfig } from "next-intl/server";

// Никаких requestLocale/headers — иначе маршрут станет динамическим
export default getRequestConfig(async () => {
  return {
    // Возврати что-то дефолтное, если вдруг где-то дернут server-API.
    // На статических RU-страницах лучше вообще не полагаться на это.
    locale: "ru",
    messages: {},
  };
});
