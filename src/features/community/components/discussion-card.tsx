import Link from "next/link";
import { MessageSquare } from "lucide-react";
import type { DiscussionSummary } from "../types/community";
import { CategoryBadge } from "./category-badge";

function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return isoString;
  }
}

export function DiscussionCard({
  discussion,
  compact = false,
}: {
  discussion: DiscussionSummary;
  compact?: boolean;
}) {
  const story = discussion.storyRef;
  const detailHref = `/community/discussions/${discussion.slug}`;

  const storyHref = story
    ? story.chapterSlug
      ? `/stories/${story.storySlug}/chapters/${story.chapterSlug}`
      : `/stories/${story.storySlug}`
    : null;

  const chapterLabel =
    story?.chapterNumber != null
      ? `Chapter ${story.chapterNumber}`
      : story?.chapterTitle ?? null;

  return (
    <article
      aria-labelledby={`disc-card-title-${discussion.id}`}
      className={`discussion-card ${compact ? "compact" : ""}`.trim()}
    >
      <div className="discussion-card-header">
        <CategoryBadge category={discussion.category} />
        <span className="discussion-card-replies">
          <MessageSquare size={13} aria-hidden="true" />
          <span>
            {discussion.replyCount}{" "}
            {discussion.replyCount === 1 ? "reply" : "replies"}
          </span>
        </span>
      </div>

      <h3 id={`disc-card-title-${discussion.id}`} className="discussion-card-title">
        <Link href={detailHref}>{discussion.title}</Link>
      </h3>

      {story && storyHref ? (
        <Link href={storyHref} className="discussion-card-ref">
          <span>✦</span>
          <span>
            {story.storyTitle}
            {chapterLabel ? ` · ${chapterLabel}` : ""}
          </span>
        </Link>
      ) : (
        <span className="discussion-card-ref" style={{ color: "var(--ink-muted)" }}>
          <span>✦</span>
          <span>Across the Library</span>
        </span>
      )}

      <p className="discussion-card-excerpt">{discussion.excerpt}</p>

      <div className="discussion-card-footer">
        <span className="discussion-card-author">
          By {discussion.author.displayName}
        </span>
        <time dateTime={discussion.createdAt}>
          {formatDate(discussion.createdAt)}
        </time>
      </div>
    </article>
  );
}
