import Link from "next/link";
import { CatenaryLogo } from "@/components/catenary-logo";
import { ProfileIconLink } from "@/components/profile-icon-link";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell masthead">
        <Link className="wordmark" href="/" aria-label="Shawn Xiao, home">
          <CatenaryLogo className="catenary-logo" />
          <span>Shawn Xiao</span>
        </Link>
        <nav aria-label="Primary navigation">
          <Link href="/#research">Research</Link>
          <Link href="/writing/">Blogs</Link>
          <Link href="/#about">About</Link>
        </nav>
        <div className="header-actions">
          <ThemeToggle />
          <ProfileIconLink className="contact-link" href="mailto:shawncloudy@gmail.com" icon="talk">
            Let’s talk
          </ProfileIconLink>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <p className="footer-statement">
          From fluent predictors to reliable collaborators.
        </p>
        <div>
          <p className="footer-label">Elsewhere</p>
          <ProfileIconLink href="https://scholar.google.com/citations?user=b9uTwEgAAAAJ&hl=en" icon="scholar">
            Scholar
          </ProfileIconLink>
          <ProfileIconLink href="https://www.linkedin.com/in/yzxiao/" icon="linkedin">LinkedIn</ProfileIconLink>
        </div>
        <div>
          <p className="footer-label">Contact</p>
          <ProfileIconLink href="mailto:shawncloudy@gmail.com" icon="email">shawncloudy@gmail.com</ProfileIconLink>
        </div>
      </div>
      <div className="shell footer-base">
        <span>© {new Date().getFullYear()} Yunzhong Shawn Xiao</span>
      </div>
    </footer>
  );
}
