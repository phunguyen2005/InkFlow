import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

export function CommunityCTA() {
  return (
    <section aria-labelledby="community-cta-heading" className="community-cta">
      <span className="community-cta-eyebrow">Reader Community</span>
      <h2 id="community-cta-heading">Your perspective belongs here.</h2>
      <p className="community-cta-deck">
        Every story is completed by the readers who inhabit its world. Unpack
        pivotal chapter choices, debate elusive lore, and share your literary
        impressions.
      </p>

      <div className="community-cta-actions">
        <Link href="/explore" className="community-cta-btn">
          <span>Discover Stories</span>
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
        <Link href="/rankings" className="community-cta-secondary-btn">
          <BookOpen size={14} aria-hidden="true" />
          <span>Explore Rankings</span>
        </Link>
      </div>
    </section>
  );
}
