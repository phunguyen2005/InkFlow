import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { DiscussionReply } from "../types/community";
import { SpoilerOverlay } from "./spoiler-overlay";

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

export function DiscussionReplies({
  replies,
}: {
  replies: DiscussionReply[];
}) {
  return (
    <section aria-labelledby="replies-heading" className="discussion-replies">
      <div className="discussion-replies-header">
        <h2 id="replies-heading">
          Replies ({replies.length})
        </h2>
      </div>

      {replies.length > 0 ? (
        <div className="discussion-replies-list">
          {replies.map((reply) => {
            const bodyContent = (
              <div className="reply-body">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {reply.bodyMarkdown}
                </ReactMarkdown>
              </div>
            );

            return (
              <article key={reply.id} className="reply-block">
                <header className="reply-header">
                  <div>
                    <span className="reply-author">
                      {reply.author.displayName}
                    </span>
                    <span className="reply-author-tag">
                      {reply.author.slug ? "(Author)" : "(Reader)"}
                    </span>
                  </div>
                  <time dateTime={reply.createdAt}>
                    {formatDate(reply.createdAt)}
                  </time>
                </header>

                {reply.spoilerScope ? (
                  <SpoilerOverlay scope={reply.spoilerScope}>
                    {bodyContent}
                  </SpoilerOverlay>
                ) : (
                  bodyContent
                )}
              </article>
            );
          })}
        </div>
      ) : (
        <div className="story-discussions-empty">
          <p style={{ margin: 0 }}>No replies yet. Be the first to share your perspective.</p>
        </div>
      )}
    </section>
  );
}
