import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import type { RankedStory } from "../../types/rankings";

export function TopThree({ items }: { items: RankedStory[] }) {
  if (items.length === 0) return null;

  return (
    <section className="rankings-top-three" aria-label="Top ranked stories">
      {items.map(({ rank, story }) => {
        const isFirst = rank === 1;
        const formattedRank = String(rank).padStart(2, "0");

        return (
          <article
            key={story.id}
            className={`top-three-card ${isFirst ? "top-three-lead" : "top-three-sub"}`}
          >
            <div className="top-three-cover-wrap">
              <Link
                href={`/stories/${story.slug}`}
                className="top-three-cover-link"
                aria-label={`Rank ${rank}: ${story.title}`}
              >
                <Image
                  src={story.coverUrl}
                  alt={story.coverAlt}
                  fill
                  priority={isFirst}
                  sizes={
                    isFirst
                      ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 680px"
                      : "(max-width: 768px) 50vw, 340px"
                  }
                />
                <span className="top-three-numeral" aria-hidden="true">
                  {formattedRank}
                </span>
                <div className="top-three-scrim" />
              </Link>
            </div>

            <div className="top-three-info">
              <span className="eyebrow coral">{story.genreLabel}</span>
              <h2 className="top-three-title">
                <Link href={`/stories/${story.slug}`}>{story.title}</Link>
              </h2>
              <Link
                className="top-three-author"
                href={`/authors/${story.author.slug}`}
              >
                {story.author.penName}
              </Link>
              <div className="top-three-meta">
                <span>
                  {story.status === "COMPLETED"
                    ? "Complete"
                    : `${story.chapterCount} ch.`}
                </span>
                <span className="rating">
                  <Star size={13} aria-hidden="true" />
                  {story.rating.average.toFixed(1)}{" "}
                  <span className="muted">est.</span>
                </span>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
