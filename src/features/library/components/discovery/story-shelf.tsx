"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
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
  const track = useRef<HTMLDivElement>(null);
  if (!stories.length) return null;
  function scroll(direction: -1 | 1) {
    track.current?.scrollBy({
      left: direction * Math.max(280, track.current.clientWidth * 0.78),
      behavior: "smooth",
    });
  }
  return (
    <section className="story-shelf">
      <div className="shelf-heading">
        {eyebrow ? <span className="eyebrow muted">{eyebrow}</span> : null}
        <h2 className="display-heading">{title}</h2>
        <div className="shelf-actions">
          <button
            className="icon-button"
            aria-label={`Previous ${title} stories`}
            onClick={() => scroll(-1)}
          >
            <ArrowLeft size={17} />
          </button>
          <button
            className="icon-button"
            aria-label={`Next ${title} stories`}
            onClick={() => scroll(1)}
          >
            <ArrowRight size={17} />
          </button>
          <Link className="text-link" href={href}>
            View all <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
      <div
        ref={track}
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
