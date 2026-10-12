import Link from "next/link";
import { Wordmark } from "./site-header";

export function SiteFooter() {
  return (
    <footer className="site-footer page-width">
      <div className="footer-top">
        <div>
          <Wordmark />
          <p>Stories beyond imagination.</p>
        </div>
        <nav aria-label="Discover">
          <strong>Discover</strong>
          <Link href="/explore">Explore stories</Link>
          <Link href="/community">Community</Link>
          <Link href="/explore?status=completed">Completed stories</Link>
          <Link href="/explore?sort=latest">Fresh ink</Link>
        </nav>
        <nav aria-label="Product">
          <strong>Product</strong>
          <Link href="/studio">InkFlow Studio</Link>
          <Link href="/about">About InkFlow</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </nav>
        <div className="studio-note">
          <span className="eyebrow">For the storytellers</span>
          <p>InkFlow Studio</p>
          <Link href="/studio">Explore the Studio</Link>
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
