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
          <h1>Research Notes</h1>
          <p>
            I write primarily to record and clarify my own thinking. Many notes begin with a
            question that I explore through reading and discussion, often using AI to test ideas,
            organize material, and refine the writing. I share them here when I think the resulting
            ideas or insights may also be useful to others.
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
