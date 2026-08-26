import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Yunzhong Shawn Xiao — Machine Learning Researcher",
    short_name: "Shawn Xiao",
    description: "Research on foundation models, post-training, agents, and human–AI interaction.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f1ea",
    theme_color: "#f4f1ea",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
