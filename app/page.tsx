import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { essays, profile, research } from "@/lib/content";

const personStructuredData = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  mainEntity: {
    "@type": "Person",
    name: "Yunzhong Xiao",
    alternateName: ["Shawn Xiao", "Yunzhong Shawn Xiao", "肖云中"],
    url: "https://shawn-yzxiao.github.io/",
    jobTitle: "Machine Learning Researcher",
    worksFor: { "@type": "Organization", name: "Apple" },
    alumniOf: { "@type": "CollegeOrUniversity", name: "Carnegie Mellon University" },
    sameAs: [
      "https://github.com/Shawn-yzXiao",
      "https://www.linkedin.com/in/yzxiao/",
      "https://scholar.google.com/citations?user=b9uTwEgAAAAJ&hl=en",
    ],
  },
};

export default function Home() {
  const englishEssays = essays.filter((essay) => essay.lang === "en");

  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero shell" id="about">
          <div className="hero-identity">
            <p className="eyebrow">{profile.eyebrow}</p>
            <h1>Yunzhong <span>“Shawn”</span> Xiao</h1>
            <ul className="hero-focus">
              {profile.roleBullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
            </ul>
            <div className="hero-links" aria-label="Profile links">
              <a href="mailto:shawncloudy@gmail.com">Email ↗</a>
              <a href="https://www.linkedin.com/in/yzxiao/">LinkedIn ↗</a>
              <a href="https://scholar.google.com/citations?user=b9uTwEgAAAAJ&hl=en">Google Scholar ↗</a>
              <a href="https://github.com/Shawn-yzXiao">GitHub ↗</a>
            </div>
          </div>
          <div className="hero-bio">
            <ReactMarkdown>{profile.bio}</ReactMarkdown>
          </div>
        </section>

        <section className="section shell" id="agenda">
          <div className="section-heading">
            <p className="eyebrow">Mission</p>
            <h2>Mission &amp; Research Agenda</h2>
            <p className="mission-statement"><strong>{profile.mission}</strong> {profile.missionDetail}</p>
          </div>
          <div className="agenda-grid">
            {profile.agenda.map((item) => (
              <article className="agenda-item" key={item.number}>
                <span className="index-number">{item.number}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section shell" id="research">
          <div className="section-heading heading-row">
            <div>
              <p className="eyebrow">Research</p>
              <h2>Selected Research</h2>
            </div>
            <a className="section-link" href="https://scholar.google.com/citations?user=b9uTwEgAAAAJ&hl=en">All publications ↗</a>
          </div>
          <div className="index-list research-list">
            {research.map((item, index) => (
              <a className="index-row" href={item.href} key={item.title}>
                <span className="index-number">{String(index + 1).padStart(2, "0")}</span>
                <span className="index-main"><strong>{item.title}</strong><span>{item.summary}</span></span>
                <span className="index-meta">{item.venue}<br />{item.year}</span>
                <span className="index-arrow" aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </section>

        <section className="section notes-section" id="writing">
          <div className="shell">
            <div className="section-heading heading-row">
              <div><p className="eyebrow">Writing</p><h2>Blogs</h2></div>
              <Link className="section-link" href="/writing/">View the notebook →</Link>
            </div>
            <p className="notes-context">
              These are dated snapshots of questions I explored in 2026—not a closed research agenda. The notebook
              will grow across model training, behavior, interaction, embodied intelligence, robotics, and broader
              intelligent systems.
            </p>
            <div className="index-list">
              {englishEssays.map((essay, index) => (
                <Link className="index-row note-row" href={`/writing/${essay.slug}/`} key={essay.slug}>
                  <span className="index-number">{String(index + 1).padStart(2, "0")}</span>
                  <span className="index-main"><strong>{essay.title}</strong><span>{essay.description}</span></span>
                  <time className="index-meta" dateTime={essay.dateISO}>{essay.dateLabel}</time>
                  <span className="index-arrow" aria-hidden="true">→</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personStructuredData) }} />
    </>
  );
}
