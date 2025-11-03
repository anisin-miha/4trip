import { Link } from "@/i18n/navigation";
import type { BlogArticleSummary } from "./types";

type RelatedArticlesProps = {
  currentSlug: string;
  articles: readonly BlogArticleSummary[];
};

export default function RelatedArticles({
  currentSlug,
  articles,
}: RelatedArticlesProps) {
  const related = articles.filter((article) => article.slug !== currentSlug);

  if (!related.length) return null;

  const columnsClass =
    related.length >= 3
      ? "md:grid-cols-3"
      : related.length === 2
        ? "md:grid-cols-2"
        : "md:grid-cols-1";

  return (
    <section className="py-16 bg-white scroll-mt-24" aria-labelledby="related-articles-heading">
      <div className="container mx-auto px-4">
        <h2
          id="related-articles-heading"
          className="text-3xl font-bold text-center mb-10"
        >
          Читайте дальше
        </h2>
        <div className={`grid gap-8 ${columnsClass}`}>
          {related.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="group block border rounded-xl shadow-sm hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3 group-hover:underline">
                  {article.title}
                </h3>
                {article.badge ? (
                  <div className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium px-3 py-1 rounded-full bg-yellow-50 text-yellow-800 border border-yellow-200 mb-3 max-w-full break-words">
                    <span>{article.badge.prefix}</span>
                    <span>{article.badge.text}</span>
                  </div>
                ) : null}
                <p className="text-gray-600 text-sm mb-4">
                  {article.excerpt}
                </p>
                <span className="text-blue-600 text-sm font-medium">
                  Читать далее →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
