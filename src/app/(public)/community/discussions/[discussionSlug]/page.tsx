import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { community } from "@/features/community/data/community";
import { LibraryShell } from "@/features/library/components/navigation/site-header";
import { DiscussionBreadcrumb } from "@/features/community/components/discussion-breadcrumb";
import { StoryReferenceBar } from "@/features/community/components/story-reference-bar";
import { CategoryBadge } from "@/features/community/components/category-badge";
import { SpoilerOverlay } from "@/features/community/components/spoiler-overlay";
import { DiscussionBody } from "@/features/community/components/discussion-body";
import { DiscussionReplies } from "@/features/community/components/discussion-replies";
import { ReportAction } from "@/features/community/components/report-action";

type Props = {
  params: Promise<{ discussionSlug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { discussionSlug } = await params;
  const discussion = await community.getDiscussionBySlug(discussionSlug);
  if (!discussion) {
    return {
      title: "Discussion Not Found · InkFlow",
    };
  }

  return {
    title: `${discussion.title} · Community · InkFlow`,
    description: discussion.excerpt,
  };
}

export default async function DiscussionDetailPage({ params }: Props) {
  const { discussionSlug } = await params;
  const discussion = await community.getDiscussionBySlug(discussionSlug);

  if (!discussion) {
    notFound();
  }

  const formattedDate = new Date(discussion.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <LibraryShell active="community">
      <main id="main" className="page-width discussion-page">
        <DiscussionBreadcrumb discussion={discussion} />

        {discussion.storyRef && (
          <StoryReferenceBar storyRef={discussion.storyRef} />
        )}

        <header className="discussion-header">
          <div className="discussion-header-meta">
            <CategoryBadge category={discussion.category} />
            {discussion.spoilerScope && (
              <span className="discussion-spoiler-tag">
                Spoilers ·{" "}
                {discussion.spoilerScope.throughChapterNumber != null
                  ? `Chapter ${discussion.spoilerScope.throughChapterNumber}`
                  : "Full Story"}
              </span>
            )}
          </div>

          <h1 className="discussion-title">{discussion.title}</h1>

          <div className="discussion-author-row">
            <div>
              By <span className="discussion-author-name">{discussion.author.displayName}</span>
              {discussion.author.slug && <span className="author-badge"> (Author)</span>}
            </div>
            <time dateTime={discussion.createdAt}>{formattedDate}</time>
          </div>
        </header>

        {discussion.spoilerScope ? (
          <SpoilerOverlay scope={discussion.spoilerScope}>
            <DiscussionBody discussion={discussion} />
          </SpoilerOverlay>
        ) : (
          <DiscussionBody discussion={discussion} />
        )}

        <DiscussionReplies replies={discussion.replies} />

        <ReportAction />

        <p className="community-mock-notice">
          Mock editorial content. Does not represent real posts or interactions. All stories and discussions are fictional.
        </p>
      </main>
    </LibraryShell>
  );
}
