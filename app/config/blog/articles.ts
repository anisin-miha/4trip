import type {
  BlogArticleData,
  BlogArticleId,
} from "@/app/components/ru/blog/types";
import parkPatriotArticle from "@/app/(pages)/ru/blog/park-patriot-chto-posmotret/article.data";
import bulgakovArticle from "@/app/(pages)/ru/blog/bulgakovskie-mesta-moskvy-polnyj-gid-po-romanu/article.data";

const REGISTERED_ARTICLES: BlogArticleData[] = [
  parkPatriotArticle,
  bulgakovArticle,
];

const ARTICLE_MAP = new Map<BlogArticleId, BlogArticleData>();

for (const article of REGISTERED_ARTICLES) {
  const id = (article.id ?? article.slug) as BlogArticleId;
  if (ARTICLE_MAP.has(id)) {
    console.warn(`[blog] duplicate article id "${id}" detected`);
  }
  ARTICLE_MAP.set(id, article);
}

export type BlogArticleSummaryLite = {
  id: BlogArticleId;
  slug: string;
  title: string;
  excerpt: string;
  description: string;
  coverImage?: BlogArticleData["coverImage"];
};

export function getBlogArticleSummaries(
  ids: BlogArticleId[],
): BlogArticleSummaryLite[] {
  const result: BlogArticleSummaryLite[] = [];

  for (const id of ids) {
    const article = ARTICLE_MAP.get(id);
    if (!article) {
      console.warn(`[blog] article with id "${id}" is not registered`);
      continue;
    }
    result.push({
      id,
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      description: article.description,
      coverImage: article.coverImage,
    });
  }

  return result;
}
