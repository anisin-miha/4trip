import { Metadata } from "next";
import path from "path";
import { readdir } from "fs/promises";
import SiteHeader from "@/app/components/ru/SiteHeader";
import SiteFooter from "@/app/components/ru/SiteFooter";
import contactInfo from "@/app/config/contactInfo";
import { Link } from "@/i18n/navigation";
import type { BlogArticleData } from "@/app/components/ru/blog/types";

export const metadata: Metadata = {
  title: "Блог о путешествиях и экскурсиях – советы и идеи от 4-trip.ru",
  description:
    "Статьи о лучших экскурсиях по Москве и Подмосковью, советы путешественникам и идеи для туров выходного дня. Читайте блог 4-trip.ru и планируйте путешествия!",
  openGraph: {
    title: "Блог о путешествиях и экскурсиях – советы и идеи от 4-trip.ru",
    description:
      "Статьи о лучших экскурсиях по Москве и Подмосковью, советы путешественникам и идеи для туров выходного дня. Читайте блог 4-trip.ru и планируйте путешествия!",
    url: "https://4-trip.ru/ru/blog",
    type: "website",
    images: [
      {
        url: "https://4-trip.ru/images/tours/patriot/cathedral-hero.png",
        width: 1200,
        height: 630,
        alt: "4-trip.ru",
      },
    ],
  },
  alternates: {
    canonical: "https://4-trip.ru/ru/blog",
  },
};

async function loadRuArticles(): Promise<BlogArticleData[]> {
  const blogDir = path.join(process.cwd(), "app/(pages)/ru/blog");
  const entries = await readdir(blogDir, { withFileTypes: true });

  const slugs = entries
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("("))
    .map((entry) => entry.name);

  const articles = await Promise.all(
    slugs.map(async (slug) => {
      try {
        const mod = (await import(`./${slug}/article.data`)) as {
          default: BlogArticleData;
        };
        return mod.default;
      } catch (error) {
        console.warn(`[blog] failed to load article data for ${slug}`, error);
        return null;
      }
    }),
  );

  return articles
    .filter((article): article is BlogArticleData => {
      if (!article) return false;
      return article.locale === "ru";
    })
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
}

export default async function BlogPage() {
  const articles = await loadRuArticles();
  const visibleArticles = articles.filter((article) => article.visibility);

  return (
    <div className="font-sans bg-white text-gray-900 scroll-smooth min-h-screen flex flex-col">
      <SiteHeader
        title="Блог"
        main
        project="trip"
        links={[
          { href: "/ru", label: "Главная" },
          // { href: "/ru/excursions", label: "Экскурсии" },
          { href: "/ru/blog", label: "Блог" },
          { href: "/ru/contacts", label: "Контакты" },
        ]}
      />

      <main className="flex-grow container mx-auto px-4 py-16 mt-16">
        <h1 className="text-4xl font-bold text-center mb-12">
          Блог об экскурсиях и путешествиях
        </h1>
        {visibleArticles.length ? (
          <div className="grid md:grid-cols-2 gap-10">
            {visibleArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                aria-label={article.title}
                className="group block border p-6 rounded-lg shadow hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <h2 className="text-2xl font-semibold mb-3 group-hover:underline">
                  {article.title}
                </h2>
                {article.badge ? (
                  <div className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm font-medium px-3 py-1 rounded-full bg-yellow-50 text-yellow-800 border border-yellow-200 mb-4 max-w-full break-words">
                    <span>{article.badge.prefix}</span>
                    <span>{article.badge.text}</span>
                  </div>
                ) : null}
                {article.tags.length ? (
                  <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-3">
                    {article.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag.slug}
                        className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 border border-gray-200"
                        title={`${tag.category.label}: ${tag.description}`}
                      >
                        #{tag.label}
                      </span>
                    ))}
                  </div>
                ) : null}
                <p className="text-gray-600 mb-4">{article.excerpt}</p>
                <span className="text-blue-600 hover:underline">
                  Читать далее →
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">
            Пока здесь нет опубликованных статей — загляните позже.
          </p>
        )}
      </main>

      <SiteFooter
        project="trip"
        contacts={{
          phone: contactInfo.phone,
          email: contactInfo.email,
          social: contactInfo.social,
        }}
      />
    </div>
  );
}
