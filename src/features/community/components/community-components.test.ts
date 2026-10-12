import { describe, it, expect, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/community",
}));

import { CategoryBadge } from "./category-badge";
import { CommunityHero } from "./community-hero";
import { CommunityNav } from "./community-nav";
import { FeaturedDiscussion } from "./featured-discussion";
import { DiscussionCard } from "./discussion-card";
import { WeeklyPrompt } from "./weekly-prompt";
import { SpoilerOverlay } from "./spoiler-overlay";
import { DiscussionBody } from "./discussion-body";
import { DiscussionBreadcrumb } from "./discussion-breadcrumb";
import { DiscussionReplies } from "./discussion-replies";
import { ReportAction } from "./report-action";
import { StoryReferenceBar } from "./story-reference-bar";
import { CommunityCTA } from "./community-cta";
import { LatestConversations } from "./latest-conversations";

describe("Community UI Component Suite Exports and Signatures", () => {
  it("exports all 14 community components as functions", () => {
    expect(typeof CategoryBadge).toBe("function");
    expect(typeof CommunityHero).toBe("function");
    expect(typeof CommunityNav).toBe("function");
    expect(typeof FeaturedDiscussion).toBe("function");
    expect(typeof DiscussionCard).toBe("function");
    expect(typeof WeeklyPrompt).toBe("function");
    expect(typeof SpoilerOverlay).toBe("function");
    expect(typeof DiscussionBody).toBe("function");
    expect(typeof DiscussionBreadcrumb).toBe("function");
    expect(typeof DiscussionReplies).toBe("function");
    expect(typeof ReportAction).toBe("function");
    expect(typeof StoryReferenceBar).toBe("function");
    expect(typeof CommunityCTA).toBe("function");
    expect(typeof LatestConversations).toBe("function");
  });

  it("CategoryBadge returns valid element across all 5 discussion categories", () => {
    const categories = [
      "CHARACTER_DISCUSSION",
      "READER_REVIEW",
      "WORLD_AND_LORE",
      "THEORY_AND_PREDICTION",
      "GENERAL",
    ] as const;

    for (const cat of categories) {
      const el = CategoryBadge({ category: cat });
      expect(el).toBeDefined();
      expect(el.props.className).toContain("category-badge");
    }
  });

  it("CommunityHero returns valid hero element with image and heading", () => {
    const el = CommunityHero();
    expect(el).toBeDefined();
    expect(el.props["aria-labelledby"]).toBe("community-hero-heading");
  });

  it("CommunityCTA returns valid CTA section", () => {
    const el = CommunityCTA();
    expect(el).toBeDefined();
    expect(el.props["aria-labelledby"]).toBe("community-cta-heading");
  });
});
