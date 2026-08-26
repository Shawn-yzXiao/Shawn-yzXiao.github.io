import type { MetadataRoute } from "next";
import { essays } from "@/lib/content";

const siteUrl = "https://shawn-yzxiao.github.io";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const articlePages = essays.map((essay) => ({
    url: `${siteUrl}${essay.lang === "en" ? "" : "/zh"}/writing/${essay.slug}/`,
    lastModified: new Date(essay.revisedISO),
    changeFrequency: "monthly" as const,
    priority: essay.lang === "en" ? 0.8 : 0.6,
    alternates: {
      languages: {
        en: `${siteUrl}/writing/${essay.slug}/`,
        "zh-Hans": `${siteUrl}/zh/writing/${essay.slug}/`,
      },
    },
  }));

  return [
    { url: `${siteUrl}/`, lastModified: new Date("2026-08-25"), changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/writing/`, lastModified: new Date("2026-08-25"), changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/zh/writing/`, lastModified: new Date("2026-08-25"), changeFrequency: "weekly", priority: 0.7 },
    ...articlePages,
  ];
}
