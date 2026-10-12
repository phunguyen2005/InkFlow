import Link from "next/link";
import Image from "next/image";
import type { StorySummary } from "../../types/library";
import { ArrowUpRight } from "lucide-react";
import { SaveButton } from "../story/local-actions";

export function StoryCard({
  story,
  rank,
}: {
  story: StorySummary;
  rank?: number;
}) {
  return (
    <article className="story-card">
      <div className="cover-wrap">
        <Link
          className="cover-link"
          href={`/stories/${story.slug}`}
          aria-label={`Read about ${story.title}`}
        >
          <Image
            src={story.coverUrl}
            alt={story.coverAlt}
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 28vw, 220px"
          />
          {rank ? (
            <span className="cover-rank" aria-hidden="true">
              {String(rank).padStart(2, "0")}
            </span>
          ) : null}
          <span className="cover-arrow">
            <ArrowUpRight size={22} />
          </span>
        </Link>
        <SaveButton storyId={story.id} compact />
      </div>
      <div className="story-card-copy">
        <h3>
          <Link href={`/stories/${story.slug}`}>{story.title}</Link>
        </h3>
        <div className="card-caption">
          <span>{story.genreLabel}</span>
          <span
            className={`completed-dot ${story.status.toLowerCase()}`}
            aria-hidden="true"
          />
          <span>
            {story.status === "COMPLETED"
              ? "Complete"
              : `${story.chapterCount} chapters`}
          </span>
        </div>
      </div>
    </article>
  );
}
