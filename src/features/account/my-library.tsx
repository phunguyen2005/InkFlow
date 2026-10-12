"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Bookmark, BookOpen, Heart } from "lucide-react";
import type { StorySummary } from "@/features/library/types/library";
import { StoryCard } from "@/features/library/components/discovery/story-card";
import { useAccount } from "./account-provider";

type Tab = "continue" | "saved" | "following";

export function MyLibrary({ stories }: { stories: StorySummary[] }) {
  const { ready, state } = useAccount();
  const [tab, setTab] = useState<Tab>("continue");
  const items = useMemo(() => {
    const ids =
      tab === "saved"
        ? state.savedStoryIds
        : tab === "following"
          ? state.followedStoryIds
          : Object.entries(state.progress)
              .sort((a, b) => b[1].lastReadAt.localeCompare(a[1].lastReadAt))
              .map(([id]) => id);
    return ids
      .map((id) => stories.find((story) => story.id === id))
      .filter((story): story is StorySummary => Boolean(story));
  }, [state, stories, tab]);
  const labels: Record<Tab, string> = {
    continue: "Continue reading",
    saved: "Saved stories",
    following: "Following",
  };
  return (
    <section className="library-dashboard" aria-busy={!ready}>
      <div className="library-heading">
        <span className="eyebrow coral">Your reading space</span>
        <h1>My Library</h1>
        <p>Stories you saved, followed, or started on this device.</p>
      </div>
      <div className="library-tabs" role="tablist" aria-label="Library views">
        {(["continue", "saved", "following"] as const).map((item) => (
          <button
            key={item}
            role="tab"
            aria-selected={tab === item}
            onClick={() => setTab(item)}
          >
            {item === "continue" ? (
              <BookOpen size={16} />
            ) : item === "saved" ? (
              <Bookmark size={16} />
            ) : (
              <Heart size={16} />
            )}
            {labels[item]}
          </button>
        ))}
      </div>
      {ready && items.length ? (
        <div className="library-story-grid">
          {items.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      ) : ready ? (
        <div className="library-empty">
          <BookOpen size={28} />
          <h2>No stories here yet.</h2>
          <p>Open the catalog and choose a world worth returning to.</p>
          <Link className="button" href="/explore">
            Explore stories <ArrowRight size={17} />
          </Link>
        </div>
      ) : null}
    </section>
  );
}
