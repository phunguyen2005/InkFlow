"use client";

import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import type { ChapterSummary } from "../../types/library";
import { dateLabel } from "../../utils/formatting";
import { useAccount } from "@/features/account/account-provider";
import { useLocalValue } from "../../hooks/use-local-value";
import { parseBookmark } from "../../utils/reader-storage";

export function StoryChapterList({
  storyId,
  storySlug,
  chapters,
}: {
  storyId: string;
  storySlug: string;
  chapters: ChapterSummary[];
}) {
  const { state } = useAccount();
  const raw = useLocalValue(`inkflow:progress:v1:${storyId}`);
  const mark = parseBookmark(raw);
  const activeSlug = mark?.chapterSlug ?? state.progress[storyId]?.chapterSlug;
  const completedSlugs = new Set(
    state.progress[storyId]?.completedChapterSlugs ??
      mark?.completedChapterSlugs ??
      [],
  );

  return (
    <ol className="chapter-list">
      {chapters.map((c) => {
        const isReading = c.slug === activeSlug;
        const isCompleted = completedSlugs.has(c.slug);

        return (
          <li
            key={c.id}
            className={
              isReading
                ? "chapter-item is-reading"
                : isCompleted
                  ? "chapter-item is-completed"
                  : "chapter-item"
            }
          >
            <Link
              href={`/stories/${storySlug}/chapters/${c.slug}${isReading ? "?resume=1" : ""}`}
              aria-current={isReading ? "step" : undefined}
            >
              <span className="chapter-number">
                {String(c.number).padStart(2, "0")}
              </span>
              <div className="chapter-info">
                <h3>{c.title}</h3>
                <span>
                  {c.estimatedMinutes} min read{" "}
                  <span className="list-divider">/</span>{" "}
                  <time dateTime={c.publishedAt}>
                    {dateLabel(c.publishedAt)}
                  </time>
                </span>
              </div>
              <div className="chapter-status-col">
                {isReading ? (
                  <span className="chapter-status-pill is-reading">
                    Reading
                  </span>
                ) : isCompleted ? (
                  <span className="chapter-status-pill is-completed">
                    <Check size={13} aria-hidden="true" />
                    Completed
                  </span>
                ) : null}
                <ArrowUpRight size={19} aria-hidden="true" />
              </div>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
