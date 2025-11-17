import type { Metadata } from "next";
import BlogArticlePage from "@/app/components/ru/blog/BlogArticlePage";
import article from "./article.data";

export const metadata: Metadata = article.metadata;

export default function articlePage() {
  return <BlogArticlePage article={article} />;
}
