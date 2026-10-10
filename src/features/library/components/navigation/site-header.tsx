import Link from "next/link";
import { Search, Menu } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";

export function Wordmark() {
  return (
    <Link className="wordmark" href="/" aria-label="InkFlow Library home">
      InkFlow<span>.</span>
    </Link>
  );
}
function CommunityNotice() {
  return (
    <div className="coming-soon-modal">
      <span className="eyebrow">Readers & Creators</span>
      <p className="coming-soon-lead">Reader discussions & community forums are coming soon.</p>
      <p className="coming-soon-desc">
        Connect with fellow readers, explore serialized fiction theories, follow author updates, and share reading reactions.
      </p>
      <div className="coming-soon-actions">
        <Link href="/explore" className="button" data-dialog-close>
          Explore Free Stories
        </Link>
      </div>
    </div>
  );
}

function StudioNotice() {
  return (
    <div className="coming-soon-modal">
      <span className="eyebrow">Author Workspace</span>
      <p className="coming-soon-lead">The private creative workspace for serial authors.</p>
      <p className="coming-soon-desc">
        InkFlow Studio features long-form chapter drafting, Canon Engine continuity verification, manuscript organization, and direct publishing to the Public Library.
      </p>
      <div className="coming-soon-actions">
        <Link href="/explore" className="button" data-dialog-close>
          Browse Published Works
        </Link>
      </div>
    </div>
  );
}

function SignInNotice() {
  return (
    <div className="coming-soon-modal">
      <span className="eyebrow">Preview Milestone</span>
      <p className="coming-soon-lead">Reader accounts will launch in the next milestone.</p>
      <p className="coming-soon-desc">
        During this public preview, all 20 serialized stories, full chapter reading, customizable appearance themes, and saved lists are free and accessible without an account on your device.
      </p>
      <div className="coming-soon-actions">
        <Link href="/explore" className="button" data-dialog-close>
          Start Reading Now
        </Link>
      </div>
    </div>
  );
}

function GetStartedNotice() {
  return (
    <div className="coming-soon-modal">
      <span className="eyebrow">Public Preview</span>
      <p className="coming-soon-lead">Welcome to the InkFlow Public Library.</p>
      <p className="coming-soon-desc">
        Explore 20 original serialized fiction titles across fantasy, sci-fi, romance, horror, and mystery. Customize your reading experience and discover fresh author voices.
      </p>
      <div className="coming-soon-actions">
        <Link href="/explore" className="button" data-dialog-close>
          Explore the Catalog
        </Link>
      </div>
    </div>
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
          <Link href="/explore?sort=trending">Rankings</Link>
          <Dialog
            title="InkFlow Community"
            trigger="Community"
            triggerVariant="raw"
            className="desktop-nav-link"
          >
            <CommunityNotice />
          </Dialog>
          <Dialog
            title="InkFlow Studio"
            trigger="Studio"
            triggerVariant="raw"
            className="desktop-nav-link"
          >
            <StudioNotice />
          </Dialog>
        </nav>
        <form className="header-search" action="/explore" role="search">
          <Search size={16} aria-hidden="true" />
          <input
            aria-label="Search stories, authors, or tags"
            name="q"
            placeholder="Search stories, authors, or tags..."
            maxLength={200}
          />
          <button className="sr-only" type="submit">
            Search
          </button>
        </form>
        <div className="header-actions">
          <div className="header-divider" aria-hidden="true" />
          <Dialog
            title="Sign In"
            trigger="Sign in"
            triggerVariant="raw"
            className="header-signin-btn"
          >
            <SignInNotice />
          </Dialog>
          <Dialog
            title="Get Started"
            trigger="Get Started"
            triggerVariant="raw"
            className="header-getstarted-btn"
          >
            <GetStartedNotice />
          </Dialog>
        </div>
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
            <div className="mobile-nav-divider" aria-hidden="true" />
            <span className="mobile-nav-heading">Platform</span>
            <Dialog
              title="InkFlow Community"
              trigger={
                <>
                  Community <span className="badge-soon">Soon</span>
                </>
              }
              triggerVariant="raw"
              className="mobile-nav-link-btn"
            >
              <CommunityNotice />
            </Dialog>
            <Dialog
              title="InkFlow Studio"
              trigger={
                <>
                  Studio <span className="badge-soon">Soon</span>
                </>
              }
              triggerVariant="raw"
              className="mobile-nav-link-btn"
            >
              <StudioNotice />
            </Dialog>
            <div className="mobile-nav-divider" aria-hidden="true" />
            <div className="mobile-nav-actions">
              <Dialog
                title="Sign In"
                trigger="Sign in"
                triggerVariant="raw"
                className="header-signin-btn mobile-auth-btn"
              >
                <SignInNotice />
              </Dialog>
              <Dialog
                title="Get Started"
                trigger="Get Started"
                triggerVariant="raw"
                className="header-getstarted-btn mobile-auth-btn"
              >
                <GetStartedNotice />
              </Dialog>
            </div>
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
