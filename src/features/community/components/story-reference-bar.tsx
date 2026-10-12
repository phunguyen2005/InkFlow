import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { StoryReference } from "../types/community";

export function StoryReferenceBar({
  storyRef,
}: {
  storyRef: StoryReference;
}) {
  const chapterHref = storyRef.chapterSlug
    ? `/stories/${storyRef.storySlug}/chapters/${storyRef.chapterSlug}`
    : `/stories/${storyRef.storySlug}`;

  const chapterLabel =
    storyRef.chapterNumber != null
      ? `Chapter ${storyRef.chapterNumber}`
      : storyRef.chapterTitle ?? null;

  return (
    <aside aria-label="Story reference" className="story-reference-bar">
      <div className="story-reference-left">
        <div className="story-reference-cover">
          <Image
            src={storyRef.coverUrl}
            alt={storyRef.coverAlt || `Cover of ${storyRef.storyTitle}`}
            fill
            sizes="36px"
          />
        </div>

        <div className="story-reference-details">
          <span className="story-reference-label">Discussing Story</span>
          <Link
            href={`/stories/${storyRef.storySlug}`}
            className="story-reference-title"
          >
            {storyRef.storyTitle}
          </Link>
        </div>
      </div>

      <Link href={chapterHref} className="story-reference-link">
        <span>
          {chapterLabel ? `Read ${chapterLabel}` : "Read story"}
        </span>
        <ArrowUpRight size={13} aria-hidden="true" />
      </Link>
    </aside>
  );
}
