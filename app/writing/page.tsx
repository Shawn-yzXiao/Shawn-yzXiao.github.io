import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { essays } from "@/lib/content";

export const metadata: Metadata = {
  title: "Research Notes",
  description: "Essays by Yunzhong Shawn Xiao on foundation model behavior, creativity, interaction, and intelligent systems.",
  alternates: { canonical: "/writing/" },
};

export default function WritingPage() {
  const items = essays.filter((essay) => essay.lang === "en");
  return (
    <>
      <SiteHeader />
      <main>
        <header className="archive-hero shell">
          <p className="eyebrow">Research notebook · 2026—</p>
          <h1>Ideas in motion,<br /><em>not conclusions in stone.</em></h1>
          <p>
            Essays on how models acquire capability, how training shapes behavior, and how
            intelligent systems can interact with people naturally. These are dated snapshots;
            the scope will continue expanding toward embodied intelligence, robotics, and beyond.
          </p>
        </header>
        <section className="archive-list shell" aria-label="Research notes">
          {items.map((essay, index) => (
            <a href={`/writing/${essay.slug}/`} className="archive-row" key={essay.slug}>
              <span className="index-number">{String(index + 1).padStart(2, "0")}</span>
              <div><h2>{essay.title}</h2><p>{essay.description}</p></div>
              <time dateTime={essay.dateISO}>{essay.dateLabel}<br />{essay.readingTime}</time>
              <span aria-hidden="true">→</span>
            </a>
          ))}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
