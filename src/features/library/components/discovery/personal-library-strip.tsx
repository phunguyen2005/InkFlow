"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { StorySummary } from "../../types/library";
import { useAccount } from "@/features/account/account-provider";
import type { ReaderProgressState } from "@/features/account/account-store";

function chapterLabel(chapterSlug: string) {
  const match = chapterSlug.match(/^chapter-(\d+)$/);
  return match
    ? `Chapter ${String(Number(match[1])).padStart(2, "0")}`
    : "Saved position";
}

export function PersonalLibraryStrip({ stories }: { stories: StorySummary[] }) {
  const { ready, state } = useAccount();
  const track = useRef<HTMLDivElement>(null);
  const items = useMemo(
    () =>
      Object.entries(state.progress)
        .map(([storyId, progress]) => ({
          story: stories.find((story) => story.id === storyId),
          progress,
        }))
        .filter(
          (
            item,
          ): item is {
            story: StorySummary;
            progress: ReaderProgressState;
          } => Boolean(item.story?.slug && item.progress.chapterSlug),
        )
        .sort((a, b) =>
          b.progress.lastReadAt.localeCompare(a.progress.lastReadAt),
        ),
    [state.progress, stories],
  );

  if (!ready || !items.length) return null;

  function scroll(direction: -1 | 1) {
    track.current?.scrollBy({
      left: direction * Math.max(320, track.current.clientWidth * 0.72),
      behavior: "smooth",
    });
  }

  return (
    <section
      className="continue-reading"
      aria-labelledby="continue-reading-title"
    >
      <div className="continue-heading">
        <div>
          <span className="eyebrow muted">Return to your story</span>
          <h2 id="continue-reading-title">Continue reading</h2>
        </div>
        <div className="continue-actions">
          <button
            className="icon-button"
            aria-label="Previous reading history"
            onClick={() => scroll(-1)}
          >
            <ArrowLeft size={17} />
          </button>
          <button
            className="icon-button"
            aria-label="Next reading history"
            onClick={() => scroll(1)}
          >
            <ArrowRight size={17} />
          </button>
          <Link className="text-link" href="/library">
            My Library <ArrowRight size={16} />
          </Link>
        </div>
      </div>
      <div
        ref={track}
        className="continue-track"
        role="region"
        aria-label="Stories in progress"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            scroll(event.key === "ArrowLeft" ? -1 : 1);
          }
        }}
      >
        {items.map(({ story, progress }) => {
          const chapter = chapterLabel(progress.chapterSlug);
          const hasMeasuredProgress =
            Boolean(progress.lastReadAt) &&
            Number.isFinite(progress.percent) &&
            progress.percent >= 0 &&
            progress.percent <= 100;
          const href = `/stories/${story.slug}/chapters/${progress.chapterSlug}?resume=1`;
          return (
            <Link
              className="continue-card"
              href={href}
              key={story.id}
              aria-label={`Resume ${story.title}, ${chapter}`}
            >
              <span className="continue-cover">
                <Image
                  src={story.coverUrl}
                  alt={story.coverAlt}
                  fill
                  sizes="(max-width: 639px) 34vw, 130px"
                />
              </span>
              <span className="continue-copy">
                <span className="eyebrow coral">In progress</span>
                <strong>{story.title}</strong>
                <span className="continue-chapter">
                  {chapter}
                  {hasMeasuredProgress
                    ? ` · ${Math.round(progress.percent)}%`
                    : ""}
                </span>
                {hasMeasuredProgress ? (
                  <span
                    className="continue-progress"
                    role="progressbar"
                    aria-label={`${story.title} chapter progress`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(progress.percent)}
                  >
                    <span style={{ width: `${progress.percent}%` }} />
                  </span>
                ) : null}
                <span className="continue-resume">
                  Resume reading <ArrowRight size={16} />
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
