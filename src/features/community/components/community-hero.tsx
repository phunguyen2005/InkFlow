import Image from "next/image";

export function CommunityHero() {
  return (
    <section
      aria-labelledby="community-hero-heading"
      className="community-hero"
    >
      <div className="community-hero-copy">
        <span className="community-hero-eyebrow">
          InkFlow Community · Literary Discourse
        </span>
        <h1 id="community-hero-heading">BEYOND THE PAGE.</h1>
        <p className="community-hero-deck">
          Where stories spill past their margins. Discuss character choices,
          debate world lore, and share reader reviews.
        </p>
      </div>

      <div className="community-hero-art">
        <Image
          src="/mock/heroes/community-hero.webp"
          alt="InkFlow Community editorial conversation atmosphere"
          fill
          sizes="(max-width: 768px) 100vw, 45vw"
          priority
        />
      </div>
    </section>
  );
}
