import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { DiscussionSummary } from "../types/community";

export function DiscussionBreadcrumb({
  discussion,
}: {
  discussion: Pick<DiscussionSummary, "title" | "storyRef">;
}) {
  return (
    <nav aria-label="Breadcrumb" className="discussion-breadcrumb">
      <Link href="/community">Community</Link>
      <ChevronRight
        size={12}
        className="discussion-breadcrumb-sep"
        aria-hidden="true"
      />
      {discussion.storyRef ? (
        <>
          <Link href={`/stories/${discussion.storyRef.storySlug}`}>
            {discussion.storyRef.storyTitle}
          </Link>
          <ChevronRight
            size={12}
            className="discussion-breadcrumb-sep"
            aria-hidden="true"
          />
        </>
      ) : null}
      <span
        className="discussion-breadcrumb-current"
        aria-current="page"
        title={discussion.title}
      >
        {discussion.title}
      </span>
    </nav>
  );
}
