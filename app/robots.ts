import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://shawn-yzxiao.github.io/sitemap.xml",
    host: "https://shawn-yzxiao.github.io",
  };
}
