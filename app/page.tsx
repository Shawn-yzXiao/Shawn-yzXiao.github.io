import Image from "next/image";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { essays, profile, research } from "@/lib/content";

const experience = [
  {
    years: "2025—Now",
    role: "Machine Learning Engineer",
    place: "Apple",
    detail: "Large-scale pre-training and post-training—including SFT and reinforcement learning—for conversational and multimodal foundation models.",
  },
  {
    years: "2024",
    role: "Machine Learning Engineer Intern",
    place: "Apple · Vision Pro",
    detail: "Multimodal agents for content creation, bringing perception, language, and action into a spatial computing environment.",
  },
];

const personStructuredData = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  mainEntity: {
    "@type": "Person",
    name: "Yunzhong Xiao",
    alternateName: ["Shawn Xiao", "Yunzhong Shawn Xiao", "肖云中"],
    url: "https://shawn-yzxiao.github.io/",
    image: "https://shawn-yzxiao.github.io/shawn-profile.jpg",
    jobTitle: "Machine Learning Researcher",
    worksFor: { "@type": "Organization", name: "Apple" },
    alumniOf: [
      { "@type": "CollegeOrUniversity", name: "Carnegie Mellon University" },
      { "@type": "CollegeOrUniversity", name: "SUSTech" },
    ],
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
          <div className="hero-copy">
            <p className="eyebrow">{profile.eyebrow}</p>
            <h1>Yunzhong <span>“Shawn”</span> Xiao</h1>
            <p className="hero-thesis">{profile.mission}</p>
            <p className="hero-intro">{profile.intro}</p>
            <div className="hero-links" aria-label="Profile links">
              <a href="https://scholar.google.com/citations?user=b9uTwEgAAAAJ&hl=en">Scholar ↗</a>
              <a href="https://github.com/Shawn-yzXiao">GitHub ↗</a>
              <a href="https://www.linkedin.com/in/yzxiao/">LinkedIn ↗</a>
              <a href="mailto:shawncloudy@gmail.com">Email ↗</a>
            </div>
          </div>
          <figure className="portrait-wrap">
            <div className="portrait-rule" aria-hidden="true" />
            <Image className="portrait" src="/shawn-profile.jpg" width={1200} height={1200} priority alt="Portrait of Yunzhong Shawn Xiao" />
            <figcaption><span>Currently</span>{profile.currently}</figcaption>
          </figure>
        </section>

        <section className="section shell" id="agenda">
          <div className="section-heading">
            <p className="eyebrow">Research agenda</p>
            <h2>Learning deeply. Acting intelligently. Interacting naturally.</h2>
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
              <p className="eyebrow">Selected research</p>
              <h2>Models that perceive, remember, and use tools.</h2>
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
              <div><p className="eyebrow">Research notes</p><h2>Questions I am thinking through in public.</h2></div>
              <Link className="section-link" href="/writing/">View the notebook →</Link>
            </div>
            <p className="notes-context">
              Dated snapshots of earlier explorations—not a closed research agenda. The notebook will grow across
              training, behavior, interaction, embodied intelligence, robotics, and broader intelligent systems.
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

        <section className="section shell profile-section" id="experience">
          <div className="profile-intro">
            <p className="eyebrow">Background</p>
            <h2>Full-stack model research, from systems to behavior.</h2>
            <p>
              I studied computer systems at Carnegie Mellon and previously industrial design and computer
              engineering at SUSTech. That combination continues to shape how I think: models are both technical
              systems and things people must understand, trust, and work with.
            </p>
            <p className="reviewer-note">Reviewer · NeurIPS · ACL</p>
          </div>
          <div className="timeline">
            {experience.map((item) => (
              <article className="timeline-row" key={`${item.years}-${item.role}`}>
                <time>{item.years}</time>
                <div><h3>{item.role}</h3><p className="timeline-place">{item.place}</p><p>{item.detail}</p></div>
              </article>
            ))}
            <article className="timeline-row education-row">
              <time>2024</time>
              <div><h3>M.S. Computer Systems</h3><p className="timeline-place">Carnegie Mellon University</p></div>
            </article>
          </div>
        </section>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personStructuredData) }} />
    </>
  );
}
