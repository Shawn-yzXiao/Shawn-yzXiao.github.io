import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePage } from "@/components/article-page";
import { essays, getEssay } from "@/lib/content";

type PageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return essays.filter((essay) => essay.lang === "en").map((essay) => ({ slug: essay.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const essay = getEssay(slug, "en");
  if (!essay) return {};
  const canonical = `/writing/${essay.slug}/`;
  return {
    title: essay.title,
    description: essay.description,
    alternates: {
      canonical,
      languages: { en: canonical, "zh-Hans": `/zh/writing/${essay.slug}/`, "x-default": canonical },
    },
    openGraph: { type: "article", title: essay.title, description: essay.description, url: canonical, publishedTime: essay.dateISO, modifiedTime: essay.revisedISO },
  };
}

export default async function EssayPage({ params }: PageProps) {
  const { slug } = await params;
  const essay = getEssay(slug, "en");
  if (!essay) notFound();
  return <ArticlePage essay={essay} />;
}
