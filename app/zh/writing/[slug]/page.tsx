import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePage } from "@/components/article-page";
import { essays, getEssay } from "@/lib/content";

type PageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return essays.filter((essay) => essay.lang === "zh").map((essay) => ({ slug: essay.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const essay = getEssay(slug, "zh");
  if (!essay) return {};
  const canonical = `/zh/writing/${essay.slug}/`;
  return {
    title: essay.title,
    description: essay.description,
    alternates: {
      canonical,
      languages: { en: `/writing/${essay.slug}/`, "zh-Hans": canonical, "x-default": `/writing/${essay.slug}/` },
    },
    openGraph: {
      type: "article",
      siteName: "Yunzhong Shawn Xiao",
      title: essay.title,
      description: essay.description,
      url: canonical,
      publishedTime: essay.dateISO,
      modifiedTime: essay.revisedISO,
      locale: "zh_CN",
      images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: essay.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: essay.title,
      description: essay.description,
      images: ["/og-image.jpg"],
    },
  };
}

export default async function ChineseEssayPage({ params }: PageProps) {
  const { slug } = await params;
  const essay = getEssay(slug, "zh");
  if (!essay) notFound();
  return <ArticlePage essay={essay} />;
}
