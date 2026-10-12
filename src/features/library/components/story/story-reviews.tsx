"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { useAccount } from "@/features/account/account-provider";

export function StoryReviews({
  storyId,
  baselineAverage,
  baselineCount,
}: {
  storyId: string;
  baselineAverage: number;
  baselineCount: number;
}) {
  const { state, saveReview } = useAccount();
  const existing = state.reviews[storyId];
  const [draftRating, setDraftRating] = useState<number | null>(null);
  const [draftBody, setDraftBody] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const rating = draftRating ?? existing?.rating ?? 0;
  const body = draftBody ?? existing?.body ?? "";
  const count = baselineCount + (existing ? 1 : 0);
  const average =
    (baselineAverage * baselineCount + (existing?.rating ?? 0)) / count;
  return (
    <section className="story-reviews" aria-labelledby="reader-reviews-heading">
      <div className="review-summary">
        <div>
          <strong>{average.toFixed(1)}</strong>
          <span>Estimated reader rating</span>
        </div>
        <div className="rating-bars" aria-label={`${count} ratings`}>
          {[5, 4, 3, 2, 1].map((value) => (
            <span key={value}>
              <small>{value}</small>
              <i>
                <b style={{ width: `${Math.max(8, value * 17 - 10)}%` }} />
              </i>
            </span>
          ))}
        </div>
      </div>
      <form
        className="review-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (!rating) {
            setMessage("Choose a rating first.");
            return;
          }
          saveReview(storyId, {
            rating,
            body: body.trim(),
            updatedAt: new Date().toISOString(),
          });
          setMessage(
            existing
              ? "Review updated on this device."
              : "Review saved on this device.",
          );
        }}
      >
        <h3 id="reader-reviews-heading">Your review</h3>
        <div className="star-picker" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              aria-label={`${value} star${value > 1 ? "s" : ""}`}
              aria-pressed={rating === value}
              onClick={() => setDraftRating(value)}
            >
              <Star
                size={19}
                fill={value <= rating ? "currentColor" : "none"}
              />
            </button>
          ))}
        </div>
        <label>
          <span className="sr-only">Review</span>
          <textarea
            value={body}
            maxLength={800}
            placeholder="What stayed with you?"
            onChange={(event) => setDraftBody(event.target.value)}
          />
        </label>
        <div>
          <button className="button button-outline" type="submit">
            {existing ? "Update review" : "Save review"}
          </button>
          <span role="status">{message}</span>
        </div>
      </form>
    </section>
  );
}
