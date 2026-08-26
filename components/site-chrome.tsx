import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell masthead">
        <Link className="wordmark" href="/" aria-label="Shawn Xiao, home">
          <span className="wordmark-mark">YX</span>
          <span>Shawn Xiao</span>
        </Link>
        <nav aria-label="Primary navigation">
          <Link href="/#research">Research</Link>
          <Link href="/writing/">Writing</Link>
          <Link href="/#experience">About</Link>
        </nav>
        <a className="contact-link" href="mailto:shawncloudy@gmail.com">
          Let’s talk <span aria-hidden="true">↗</span>
        </a>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <p className="footer-statement">
          Building foundation models that learn deeply, act intelligently, and interact
          naturally with people.
        </p>
        <div>
          <p className="footer-label">Elsewhere</p>
          <a href="https://scholar.google.com/citations?user=b9uTwEgAAAAJ&hl=en">Scholar ↗</a>
          <a href="https://github.com/Shawn-yzXiao">GitHub ↗</a>
          <a href="https://www.linkedin.com/in/yzxiao/">LinkedIn ↗</a>
        </div>
        <div>
          <p className="footer-label">Contact</p>
          <a href="mailto:shawncloudy@gmail.com">shawncloudy@gmail.com</a>
          <p>Cupertino, California</p>
        </div>
      </div>
      <div className="shell footer-base">
        <span>© {new Date().getFullYear()} Yunzhong Shawn Xiao</span>
        <span>Notion-backed · Built for the open web</span>
      </div>
    </footer>
  );
}
