import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { essays } from "@/lib/content";

export const metadata: Metadata = {
  title: "研究笔记",
  description: "肖云中关于基础模型行为、创造力、交互与智能系统的研究笔记。",
  alternates: { canonical: "/zh/writing/", languages: { en: "/writing/", "zh-Hans": "/zh/writing/", "x-default": "/writing/" } },
};

export default function ChineseWritingPage() {
  const items = essays.filter((essay) => essay.lang === "zh");
  return (
    <div lang="zh-Hans">
      <SiteHeader />
      <main>
        <header className="archive-hero shell">
          <p className="eyebrow">研究笔记 · 2026—</p>
          <h1>流动中的想法，<br /><em>而非刻在石上的结论。</em></h1>
          <p>关于模型如何获得能力、训练如何塑造行为，以及智能系统如何与人自然协作。这些都是有时间坐标的思考切片；未来会继续延伸到 embodied intelligence、robotics 与更广阔的智能系统。</p>
        </header>
        <section className="archive-list shell" aria-label="研究笔记">
          {items.map((essay, index) => (
            <a href={`/zh/writing/${essay.slug}/`} className="archive-row" key={essay.slug}>
              <span className="index-number">{String(index + 1).padStart(2, "0")}</span>
              <div><h2>{essay.title}</h2><p>{essay.description}</p></div>
              <time dateTime={essay.dateISO}>{essay.dateLabel}<br />{essay.readingTime}</time>
              <span aria-hidden="true">→</span>
            </a>
          ))}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
