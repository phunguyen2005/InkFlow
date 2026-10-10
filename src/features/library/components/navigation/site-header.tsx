import Link from "next/link";
import { Search, Menu, ArrowUpRight } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";

export function Wordmark() {
  return (
    <Link className="wordmark" href="/" aria-label="InkFlow Library home">
      InkFlow<span>.</span>
    </Link>
  );
}
export function SiteHeader({
  active = "library",
}: {
  active?: "library" | "explore";
}) {
  return (
    <header className="site-header">
      <div className="page-width header-inner">
        <Wordmark />
        <nav className="desktop-nav" aria-label="Main navigation">
          <Link
            href="/"
            aria-current={active === "library" ? "page" : undefined}
          >
            Library
          </Link>
          <Link
            href="/explore"
            aria-current={active === "explore" ? "page" : undefined}
          >
            Explore
          </Link>
          <Link href="/explore?sort=trending">Rankings</Link>
        </nav>
        <form className="header-search" action="/explore" role="search">
          <Search size={17} aria-hidden="true" />
          <input
            aria-label="Search stories, authors, or tags"
            name="q"
            placeholder="Stories, authors, or tags..."
            maxLength={200}
          />
          <button className="sr-only" type="submit">
            Search
          </button>
        </form>
        <Link className="button header-cta" href="/explore">
          Find your next read <ArrowUpRight size={16} />
        </Link>
        <Link
          className="icon-button mobile-search"
          href="/explore"
          aria-label="Search stories"
        >
          <Search size={22} />
        </Link>
        <Dialog
          title="Navigation"
          trigger={<Menu size={22} />}
          className="mobile-menu-button"
        >
          <nav className="mobile-nav" aria-label="Mobile navigation">
            <Link href="/">Library</Link>
            <Link href="/explore">Explore stories</Link>
            <Link href="/explore?sort=trending">Rankings</Link>
            <Link href="/explore?status=completed">Completed stories</Link>
          </nav>
        </Dialog>
      </div>
    </header>
  );
}
export function SiteFooter() {
  return (
    <footer className="site-footer page-width">
      <div className="footer-top">
        <div>
          <Wordmark />
          <p>Stories beyond imagination.</p>
        </div>
        <nav aria-label="Footer">
          <Link href="/explore">Explore stories</Link>
          <Link href="/explore?status=completed">Completed stories</Link>
          <Link href="/explore?sort=latest">Fresh ink</Link>
        </nav>
        <div className="studio-note">
          <span className="eyebrow">For the storytellers</span>
          <p>InkFlow Studio</p>
          <span className="muted">Coming soon</span>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 InkFlow</span>
        <span>Demo catalog · Fictional stories and sample ratings</span>
        <span>Made for the next chapter.</span>
      </div>
    </footer>
  );
}
export function LibraryShell({
  children,
  active,
}: {
  children: React.ReactNode;
  active?: "library" | "explore";
}) {
  return (
    <>
      <SiteHeader active={active} />
      {children}
      <SiteFooter />
    </>
  );
}
