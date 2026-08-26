import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="not-found shell">
        <p className="eyebrow">404 · Not found</p>
        <h1>This path ends here.<br /><em>The notebook continues.</em></h1>
        <p>The page may have moved, or the idea may still be taking shape.</p>
        <Link href="/">Return home →</Link>
      </main>
      <SiteFooter />
    </>
  );
}
