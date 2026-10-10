import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { StorySummary } from "../../types/library";
import { StoryCard } from "./story-card";

export function StoryShelf({
  title,
  eyebrow,
  stories,
  href,
  ranked = false,
}: {
  title: string;
  eyebrow?: string;
  stories: StorySummary[];
  href: string;
  ranked?: boolean;
}) {
  if (!stories.length) return null;
  return (
    <section className="story-shelf">
      <div className="shelf-heading">
        {eyebrow ? <span className="eyebrow muted">{eyebrow}</span> : null}
        <h2 className="display-heading">{title}</h2>
        <Link className="text-link" href={href}>
          View all <ArrowUpRight size={18} />
        </Link>
      </div>
      <div
        className="shelf-track"
        tabIndex={0}
        role="region"
        aria-label={`${title} stories`}
      >
        {stories.map((story, i) => (
          <StoryCard
            key={story.id}
            story={story}
            rank={ranked ? i + 1 : undefined}
          />
        ))}
      </div>
    </section>
  );
}
