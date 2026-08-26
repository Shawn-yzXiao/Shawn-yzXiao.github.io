import type { Metadata, Viewport } from "next";
import "@fontsource-variable/newsreader";
import "@fontsource-variable/ibm-plex-sans";
import "@fontsource/ibm-plex-mono/400.css";
import "./globals.css";

const siteUrl = "https://shawn-yzxiao.github.io";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Yunzhong “Shawn” Xiao — Machine Learning Researcher",
    template: "%s — Shawn Xiao",
  },
  description:
    "Machine learning researcher working on foundation model pre-training, SFT, reinforcement learning, multimodal agents, and human–AI interaction.",
  applicationName: "Yunzhong Shawn Xiao",
  authors: [{ name: "Yunzhong Shawn Xiao", url: siteUrl }],
  creator: "Yunzhong Shawn Xiao",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Yunzhong Shawn Xiao",
    title: "Yunzhong “Shawn” Xiao — Machine Learning Researcher",
    description: "From fluent predictors to reliable collaborators.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Yunzhong Shawn Xiao" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yunzhong “Shawn” Xiao — Machine Learning Researcher",
    description: "From fluent predictors to reliable collaborators.",
    images: ["/og-image.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
  themeColor: "#f4f1ea",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
