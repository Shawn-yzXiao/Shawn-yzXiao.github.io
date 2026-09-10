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
          <h1>研究笔记</h1>
          <p>我写这些文章，首先是为了记录和澄清自己的思考。很多笔记从一个问题开始，我通过阅读和讨论继续探索，也常用 AI 来检验想法、整理材料和打磨文字。当其中形成的想法或洞见可能对别人也有帮助时，我会把它们分享出来。</p>
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
