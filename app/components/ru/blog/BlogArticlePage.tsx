import path from "path";
import { readdir } from "fs/promises";
import SiteHeader from "@/app/components/ru/SiteHeader";
import SiteFooter from "@/app/components/ru/SiteFooter";
import contactInfo from "@/app/config/contactInfo";
import SocialShare from "@/app/components/ru/SocialShare";
import { TelegramComments } from "@/app/components/ru/TelegramComments";
import FAQSection from "@/app/components/ru/FAQSection";
import RelatedArticles from "@/app/components/ru/blog/RelatedArticles";
import type {
  BlogArticleData,
  BlogArticleLocale,
  BlogArticleSummary,
  BlogArticleTocItem,
} from "./types";

type BlogArticlePageProps = {
  article: BlogArticleData;
};

function renderToc(items: BlogArticleTocItem[], isNested = false) {
  const listClass = isNested
    ? "list-disc pl-5 mt-2"
    : "space-y-2 marker:text-gray-400 list-disc pl-5";

  return (
    <ul className={listClass}>
      {items.map((item) => (
        <li key={item.id}>
          <a href={`#${item.id}`} className="hover:underline">
            {item.label}
          </a>
          {item.children?.length ? renderToc(item.children, true) : null}
        </li>
      ))}
    </ul>
  );
}

async function loadRuArticles(): Promise<BlogArticleData[]> {
  const blogDir = path.join(process.cwd(), "app/(pages)/ru/blog");
  const entries = await readdir(blogDir, { withFileTypes: true });

  const slugs = entries
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("("))
    .map((entry) => entry.name);

  const articles = await Promise.all(
    slugs.map(async (slug) => {
      try {
        const mod = (await import(`@/app/(pages)/ru/blog/${slug}/article.data`)) as {
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
    .filter((article): article is BlogArticleData => article !== null)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
}

async function resolveRelatedArticles(
  currentSlug: string,
  currentLocale: BlogArticleLocale,
  config: BlogArticleData["relatedArticles"],
): Promise<BlogArticleSummary[]> {
  if (config?.limit === 0) return [];
  const limit = config?.limit ?? 3;
  let candidates: BlogArticleData[] = [];

  if (config?.slugs && config.slugs.length) {
    const items = await Promise.all(
      config.slugs.map(async (slug) => {
        if (slug === currentSlug) return null;
        try {
          const mod = (await import(`@/app/(pages)/ru/blog/${slug}/article.data`)) as {
            default: BlogArticleData;
          };
          return mod.default;
        } catch (error) {
          console.warn(`[blog] failed to load related article ${slug}`, error);
          return null;
        }
      }),
    );
    candidates = items.filter((article): article is BlogArticleData => article !== null);
  } else {
    const all = await loadRuArticles();
    candidates = all.filter((article) => article.locale === currentLocale);
  }

  const seen = new Set<string>();

  return candidates
    .filter((article) => {
      if (seen.has(article.slug)) return false;
      seen.add(article.slug);
      return true;
    })
    .filter((article) => article.slug !== currentSlug)
    .slice(0, limit)
    .map((article) => ({
      slug: article.slug,
      title: article.title,
      url: article.url,
      description: article.description,
      excerpt: article.excerpt,
      locale: article.locale,
      publishedAt: article.publishedAt,
      updatedAt: article.updatedAt,
      tags: article.tags,
      coverImage: article.coverImage,
      badge: article.badge,
    }));
}

export default async function BlogArticlePage({ article }: BlogArticlePageProps) {
  const shareImage = article.coverImage?.url;
  const relatedArticles = await resolveRelatedArticles(
    article.slug,
    article.locale,
    article.relatedArticles,
  );

  return (
    <div className="font-sans bg-white text-gray-900 scroll-smooth min-h-screen flex flex-col">
      <SiteHeader
        title="Блог"
        main
        project="trip"
        links={[
          { href: "/ru", label: "Главная" },
          { href: "/ru/blog", label: "Блог" },
          { href: "/ru/contacts", label: "Контакты" },
        ]}
      />

      <main className="flex-grow container mx-auto px-4 py-16 mt-16">
        {article.structuredData.map((entry, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(entry) }}
          />
        ))}

        <article className="prose prose-lg max-w-3xl prose-h2:mt-12 prose-h3:mt-8 prose-ul:list-disc">
          <h1 className="text-4xl font-bold mb-2">{article.title}</h1>

          {article.badge ? (
            <div className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm font-medium px-3 py-1 rounded-full bg-yellow-50 text-yellow-800 border border-yellow-200 mb-4 max-w-full break-words">
              <span>{article.badge.prefix}</span>
              <span>{article.badge.text}</span>
            </div>
          ) : null}

          {article.tags.length ? (
            <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-6">
              {article.tags.map((tag) => (
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

          {article.preface}

          {article.toc?.length ? (
            <nav aria-label="Содержание" className="mt-8 mb-10">
              <h2 className="text-2xl font-semibold mb-4">Содержание</h2>
              {renderToc(article.toc)}
            </nav>
          ) : null}

          {article.content}
        </article>

        {article.afterContent}

        <SocialShare
          url={article.url}
          title={article.title}
          description={article.description}
          image={shareImage}
          networks={["telegram", "vk", "whatsapp", "ok", "viber"]}
          via="4_trip_ru"
          hashtags={article.tags.slice(0, 3).map((tag) => tag.slug)}
          utm={{
            utm_source: "share",
            utm_medium: "social",
            utm_campaign: `blog-${article.slug}`,
          }}
          className="mt-6 mb-10"
        />

        {article.discussionId ? (
          <TelegramComments discussion={article.discussionId} />
        ) : null}

        {relatedArticles.length ? (
          <RelatedArticles
            currentSlug={article.slug}
            articles={relatedArticles}
          />
        ) : null}

        {article.faq?.length ? (
          <FAQSection
            id="faq"
            title="FAQ"
            headingClassName="text-left"
            className="mt-16 py-0 bg-transparent not-prose"
            containerClassName={null}
            listClassName="mt-6 space-y-4"
            itemClassName="group rounded border p-4"
            summaryClassName="cursor-pointer select-none text-lg font-semibold flex items-center justify-between"
            answerClassName="mt-2 text-gray-700"
            items={article.faq}
          />
        ) : null}
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
