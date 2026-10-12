import Link from "next/link";
import Image from "next/image";
import { MessageSquare, ArrowUpRight } from "lucide-react";
import type { DiscussionSummary } from "../types/community";
import { CategoryBadge } from "./category-badge";

export function FeaturedDiscussion({
  discussion,
}: {
  discussion: DiscussionSummary;
}) {
  const story = discussion.storyRef;
  const detailHref = `/community/discussions/${discussion.slug}`;

  const chapterHref =
    story && story.chapterSlug
      ? `/stories/${story.storySlug}/chapters/${story.chapterSlug}`
      : story
        ? `/stories/${story.storySlug}`
        : null;

  const chapterLabel =
    story?.chapterNumber != null
      ? `Chapter ${story.chapterNumber}`
      : story?.chapterTitle ?? null;

  return (
    <article
      aria-labelledby={`featured-title-${discussion.id}`}
      className="featured-discussion"
    >
      {story ? (
        <div className="featured-cover">
          <Image
            src={story.coverUrl}
            alt={story.coverAlt || `Cover of ${story.storyTitle}`}
            fill
            sizes="190px"
          />
        </div>
      ) : null}

      <div className="featured-content">
        <div>
          <div className="featured-meta">
            <CategoryBadge category={discussion.category} />
            {story && chapterHref ? (
              <Link href={chapterHref} className="featured-chapter-pill">
                ✦ {story.storyTitle}
                {chapterLabel ? ` · ${chapterLabel}` : ""}
              </Link>
            ) : null}
          </div>

          <h2 id={`featured-title-${discussion.id}`} className="featured-title">
            <Link href={detailHref}>{discussion.title}</Link>
          </h2>

          <p className="featured-excerpt">{discussion.excerpt}</p>
        </div>

        <div className="featured-footer">
          <span className="featured-author">
            By {discussion.author.displayName}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span className="featured-replies">
              <MessageSquare size={14} aria-hidden="true" />
              <span>
                {discussion.replyCount}{" "}
                {discussion.replyCount === 1 ? "reply" : "replies"}
              </span>
            </span>
            <Link
              href={detailHref}
              className="featured-chapter-pill"
              style={{ color: "var(--ink-coral)", fontWeight: 500 }}
            >
              Read conversation <ArrowUpRight size={13} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
