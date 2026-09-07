import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { essays, getEssayBody, getHeadings, slugify, type Essay } from "@/lib/content";

function nodeText(value: unknown): string {
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (Array.isArray(value)) return value.map(nodeText).join("");
  if (value && typeof value === "object" && "props" in value) {
    return nodeText((value as { props?: { children?: unknown } }).props?.children);
  }
  return "";
}

const markdownComponents: Components = {
  h2: ({ children }) => <h2 id={slugify(nodeText(children))}>{children}</h2>,
  h3: ({ children }) => <h3 id={slugify(nodeText(children))}>{children}</h3>,
  a: ({ href = "", children }) => {
    const external = href.startsWith("http");
    return <a href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>{children}</a>;
  },
};

export function ArticlePage({ essay }: { essay: Essay }) {
  const body = getEssayBody(essay);
  const headings = getHeadings(body);
  const languageHref = essay.lang === "en" ? `/zh/writing/${essay.slug}/` : `/writing/${essay.slug}/`;
  const languageLabel = essay.lang === "en" ? "中文版本" : "English edition";
  const related = essays.filter((item) => item.lang === essay.lang && item.slug !== essay.slug);
  const canonical = essay.lang === "en"
    ? `https://shawn-yzxiao.github.io/writing/${essay.slug}/`
    : `https://shawn-yzxiao.github.io/zh/writing/${essay.slug}/`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: essay.title,
    description: essay.description,
    datePublished: essay.dateISO,
    dateModified: essay.revisedISO,
    inLanguage: essay.lang === "en" ? "en" : "zh-Hans",
    mainEntityOfPage: canonical,
    image: "https://shawn-yzxiao.github.io/og-image.jpg",
    author: {
      "@type": "Person",
      name: "Yunzhong Shawn Xiao",
      url: "https://shawn-yzxiao.github.io/",
    },
  };

  return (
    <div lang={essay.lang === "en" ? "en" : "zh-Hans"}>
      <div className="reading-progress" aria-hidden="true" />
      <SiteHeader />
      <main>
        <header className="article-hero shell">
          <p className="article-kicker">Research note · {essay.dateLabel}</p>
          <h1>{essay.title}</h1>
          <p className="article-deck">{essay.description}</p>
          <div className="article-meta">
            <span>Written {essay.dateLabel}</span>
            <span>{essay.readingTime} read</span>
            <a href={languageHref}>{languageLabel} →</a>
          </div>
        </header>

        <div className="article-rule shell" />
        <div className="article-layout shell">
          <aside className="article-toc" aria-label="Table of contents">
            <p className="toc-label">On this page</p>
            <nav>
              {headings.map((heading) => <a href={`#${heading.id}`} key={heading.id}>{heading.label}</a>)}
            </nav>
          </aside>
          <article className="prose">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{body}</ReactMarkdown>
          </article>
          <aside className="article-aside">
            <span>Context</span>
            <p>This note captures an earlier exploration, not the boundary of my current research agenda.</p>
          </aside>
        </div>

        <nav className="article-next shell" aria-label="More research notes">
          <p className="eyebrow">Continue reading</p>
          {related.map((item) => (
            <a href={item.lang === "en" ? `/writing/${item.slug}/` : `/zh/writing/${item.slug}/`} key={item.slug}>
              <span>{item.dateLabel}</span>
              <strong>{item.shortTitle}</strong>
              <i aria-hidden="true">→</i>
            </a>
          ))}
        </nav>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </div>
  );
}
