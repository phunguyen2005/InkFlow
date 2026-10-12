import Link from "next/link";
import { Search, Menu } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { AccountMenu } from "@/features/account/account-menu";
import { HeaderSearch } from "./header-search";
import { SiteFooter } from "./site-footer";

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
  active?: "library" | "explore" | "rankings" | "community";
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
            href="/rankings"
            aria-current={active === "rankings" ? "page" : undefined}
          >
            Rankings
          </Link>
          <Link
            href="/community"
            aria-current={active === "community" ? "page" : undefined}
          >
            Community
          </Link>
          <Link href="/studio">Studio</Link>
        </nav>
        <HeaderSearch />
        <div className="header-actions">
          <div className="header-divider" aria-hidden="true" />
          <AccountMenu />
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
            <Link
              href="/rankings"
              aria-current={active === "rankings" ? "page" : undefined}
            >
              Rankings
            </Link>
            <Link href="/explore?status=completed">Completed stories</Link>
            <div className="mobile-nav-divider" aria-hidden="true" />
            <span className="mobile-nav-heading">Platform</span>
            <Link
              href="/community"
              aria-current={active === "community" ? "page" : undefined}
            >
              Community
            </Link>
            <Link href="/studio">Studio</Link>
            <div className="mobile-nav-divider" aria-hidden="true" />
            <div className="mobile-nav-actions">
              <Link
                className="header-signin-btn mobile-auth-btn"
                href="/sign-in"
              >
                Sign in
              </Link>
              <Link
                className="header-getstarted-btn mobile-auth-btn"
                href="/sign-up"
              >
                Get started
              </Link>
            </div>
          </nav>
        </Dialog>
      </div>
    </header>
  );
}

export { SiteFooter };

export function LibraryShell({
  children,
  active,
}: {
  children: React.ReactNode;
  active?: "library" | "explore" | "rankings" | "community";
}) {
  return (
    <>
      <SiteHeader active={active} />
      {children}
      <SiteFooter />
    </>
  );
}
