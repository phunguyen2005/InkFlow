import type { DiscussionSummary } from "../types/community";
import { DiscussionCard } from "./discussion-card";

export function LatestConversations({
  discussions,
  title = "Latest Conversations",
}: {
  discussions: DiscussionSummary[];
  title?: string;
}) {
  return (
    <section
      aria-labelledby="latest-conversations-heading"
      className="latest-conversations"
    >
      <div className="latest-conversations-header">
        <h2 id="latest-conversations-heading">{title}</h2>
      </div>

      {discussions.length > 0 ? (
        <div className="discussion-list">
          {discussions.map((discussion) => (
            <DiscussionCard key={discussion.id} discussion={discussion} />
          ))}
        </div>
      ) : (
        <div className="story-discussions-empty">
          <p style={{ margin: 0 }}>No conversations found for this selection.</p>
        </div>
      )}
    </section>
  );
}
