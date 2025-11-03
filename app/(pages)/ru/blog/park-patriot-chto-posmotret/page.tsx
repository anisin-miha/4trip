import type { Metadata } from "next";
import BlogArticlePage from "@/app/components/ru/blog/BlogArticlePage";
import parkPatriotArticle from "./article.data";

export const metadata: Metadata = parkPatriotArticle.metadata;

export default function ParkPatriotArticlePage() {
  return <BlogArticlePage article={parkPatriotArticle} />;
}
