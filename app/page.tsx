import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { ProfileIconLink } from "@/components/profile-icon-link";
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
    image: "https://shawn-yzxiao.github.io/shawn-zion.jpg",
    jobTitle: "Machine Learning Researcher",
    worksFor: { "@type": "Organization", name: "Apple" },
    alumniOf: { "@type": "CollegeOrUniversity", name: "Carnegie Mellon University" },
    sameAs: [
      "https://www.linkedin.com/in/yzxiao/",
      "https://scholar.google.com/citations?user=b9uTwEgAAAAJ&hl=en",
    ],
  },
};

export default function Home() {
  const englishEssays = essays.filter((essay) => essay.lang === "en");
  const bioParagraphs = profile.bio.split(/\n\s*\n/);
  const capabilityParagraph = bioParagraphs[1] ?? "";
  const experienceParagraph = bioParagraphs[2] ?? "";
  const missionParagraph = bioParagraphs[3] ?? "";
  const writingParagraph = bioParagraphs[4] ?? "";
  const contactParagraph = bioParagraphs[5] ?? "";
  const capabilitySeparator = capabilityParagraph.indexOf(":");
  const capabilityLead = capabilitySeparator === -1
    ? capabilityParagraph
    : `${capabilityParagraph.slice(0, capabilitySeparator)}.`;
  const capabilityDetails = capabilitySeparator === -1
    ? ""
    : capabilityParagraph.slice(capabilitySeparator + 1).trim();
  const focusAreas = [
    {
      number: "01",
      title: "Foundation model training",
      text: profile.roleBullets[0],
    },
    {
      number: "02",
      title: "Data, systems & evaluation",
      text: profile.roleBullets[1],
    },
    {
      number: "03",
      title: "Agents & interaction",
      text: profile.agenda[2].text,
    },
  ];

  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero shell" id="about">
          <div className="hero-identity">
            <p className="eyebrow">{profile.eyebrow}</p>
            <div className="hero-name-lockup">
              <div className="hero-name">
                <h1>Shawn Xiao</h1>
                <p className="hero-chinese-name" lang="zh-Hans">肖云中</p>
              </div>
              <figure className="hero-portrait">
                <div className="hero-portrait-frame">
                  <Image
                    className="hero-portrait-day"
                    src="/shawn-zion.jpg"
                    alt="Shawn Xiao in Zion National Park"
                    width={720}
                    height={720}
                    sizes="(max-width: 680px) 34vw, (max-width: 900px) 210px, 18vw"
                    priority
                  />
                  <Image
                    className="hero-portrait-night"
                    src="/shawn-zion-night.jpg"
                    alt=""
                    width={720}
                    height={720}
                    sizes="(max-width: 680px) 34vw, (max-width: 900px) 210px, 18vw"
                    priority
                  />
                </div>
              </figure>
            </div>
            <div className="hero-links" aria-label="Profile links">
              <ProfileIconLink href="mailto:shawncloudy@gmail.com" icon="email">Email</ProfileIconLink>
              <ProfileIconLink href="https://www.linkedin.com/in/yzxiao/" icon="linkedin">LinkedIn</ProfileIconLink>
              <ProfileIconLink href="https://scholar.google.com/citations?user=b9uTwEgAAAAJ&hl=en" icon="scholar">
                Google Scholar
              </ProfileIconLink>
            </div>
          </div>
          <div className="hero-bio">
            <div className="hero-bio-introduction">
              <ReactMarkdown>{capabilityLead}</ReactMarkdown>
            </div>
            <div className="hero-bio-core">
              {capabilityDetails && <ReactMarkdown>{capabilityDetails}</ReactMarkdown>}
              <ReactMarkdown>{experienceParagraph}</ReactMarkdown>
              <ReactMarkdown>{missionParagraph}</ReactMarkdown>
            </div>
            <div className="hero-bio-notes">
              <ReactMarkdown>{writingParagraph}</ReactMarkdown>
              <ReactMarkdown>{contactParagraph}</ReactMarkdown>
            </div>
          </div>
        </section>

        <section className="section shell" id="agenda">
          <div className="section-heading">
            <h2>Current Focus</h2>
            <p className="mission-statement"><strong>{profile.mission}</strong> {profile.missionDetail}</p>
          </div>
          <div className="agenda-grid">
            {focusAreas.map((item) => (
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
              <h2>Research Publications</h2>
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
              <div><h2>Blogs</h2></div>
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
