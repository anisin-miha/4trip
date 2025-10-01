/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://4-trip.ru",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: "daily",
  priority: 0.7,
  // Не индексируем страницу обзорной экскурсии (временная мера)
  exclude: [
    "/ru/excursions/avtobusnaya-obzornaya-ekskursiya-po-moskve",
  ],
};
