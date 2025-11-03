const path = require("path");
const fs = require("fs");

require("tsx/cjs");

function getHiddenTourPaths() {
  const { excursions } = require("./app/config/ru/tours");
  return excursions
    .filter((tour) => !tour.visibility)
    .map((tour) => `/ru/excursions/${tour.slug}`);
}

function getHiddenArticlePaths() {
  const blogDir = path.join(__dirname, "app/(pages)/ru/blog");
  if (!fs.existsSync(blogDir)) return [];

  const entries = fs
    .readdirSync(blogDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("("));

  const hidden = [];

  for (const entry of entries) {
    try {
      const data = require(
        path.join(blogDir, entry.name, "article.data.tsx"),
      ).default;
      if (!data?.visibility) {
        hidden.push(`/ru/blog/${data?.slug ?? entry.name}`);
      }
    } catch (error) {
      console.warn(
        `[sitemap] unable to read article data for ${entry.name}`,
        error,
      );
    }
  }

  return hidden;
}

const HIDDEN_PATHS = [...getHiddenTourPaths(), ...getHiddenArticlePaths()];

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://4-trip.ru",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: "daily",
  priority: 0.7,
  exclude: ["/ru", "/ru/excursions", "/ru/bus", ...HIDDEN_PATHS],
};
