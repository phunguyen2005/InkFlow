import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Star } from "lucide-react";
import type { RankedStory } from "../../types/rankings";

export function RankingRow({ item }: { item: RankedStory }) {
  const { rank, story } = item;
  const formattedRank = String(rank).padStart(2, "0");

  return (
    <article className="ranking-row">
      <span className="ranking-row-num" aria-hidden="true">
        {formattedRank}
      </span>

      <div className="ranking-row-thumb">
        <Image
          src={story.coverUrl}
          alt={story.coverAlt}
          width={56}
          height={80}
        />
      </div>

      <div className="ranking-row-details">
        <span className="eyebrow coral">{story.genreLabel}</span>
        <h3 className="ranking-row-title">
          <Link
            className="ranking-row-stretched-link"
            href={`/stories/${story.slug}`}
          >
            {story.title}
          </Link>
        </h3>
        <Link
          className="ranking-row-author"
          href={`/authors/${story.author.slug}`}
        >
          {story.author.penName}
        </Link>
      </div>

      <div className="ranking-row-meta">
        <span className="ranking-row-status">
          {story.status === "COMPLETED"
            ? "Complete"
            : `${story.chapterCount} ch.`}
        </span>
        <span className="ranking-row-rating">
          <Star size={12} aria-hidden="true" />
          {story.rating.average.toFixed(1)}{" "}
          <span className="muted">est.</span>
        </span>
      </div>

      <div className="ranking-row-action" aria-hidden="true">
        <ArrowUpRight size={18} />
      </div>
    </article>
  );
}
