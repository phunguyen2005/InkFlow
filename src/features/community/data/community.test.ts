import { describe, it, expect, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  mockDiscussions,
  mockWeeklyPrompt,
  COMMUNITY_ARE_DEMO,
} from "../mock/discussions";
import { community } from "./community";
import { catalog } from "../../library/mock/catalog";
import { DISCUSSION_CATEGORIES } from "../types/community";

describe("Community Mock Data Contracts & Honest Demo Discipline", () => {
  it("exports COMMUNITY_ARE_DEMO as true", () => {
    expect(COMMUNITY_ARE_DEMO).toBe(true);
  });

  it("enforces isMock: true on all discussions, authors, replies, and weekly prompt", () => {
    expect(mockWeeklyPrompt.isMock).toBe(true);

    for (const d of mockDiscussions) {
      expect(d.isMock).toBe(true);
      expect(d.author.isMock).toBe(true);
      expect(d.replies.length).toBeGreaterThan(0);
      for (const r of d.replies) {
        expect(r.isMock).toBe(true);
        expect(r.author.isMock).toBe(true);
      }
    }
  });

  it("references valid published library stories and real chapter numbers", () => {
    const catalogSlugs = new Set(catalog.map((s) => s.slug));
    const catalogMap = new Map(catalog.map((s) => [s.slug, s]));

    for (const d of mockDiscussions) {
      if (d.storyRef) {
        expect(catalogSlugs.has(d.storyRef.storySlug)).toBe(true);
        const story = catalogMap.get(d.storyRef.storySlug)!;
        expect(d.storyRef.storyId).toBe(story.id);
        expect(d.storyRef.primaryGenre).toBe(story.primaryGenre);

        if (d.storyRef.chapterSlug) {
          expect(d.storyRef.chapterNumber).toBeDefined();
          expect(d.storyRef.chapterNumber).toBeGreaterThan(0);
          expect(d.storyRef.chapterSlug).toBe(
            `chapter-${d.storyRef.chapterNumber}`,
          );
        }
      }

      if (d.spoilerScope) {
        expect(catalogSlugs.has(d.spoilerScope.storySlug)).toBe(true);
        if (d.spoilerScope.throughChapterNumber !== null) {
          expect(d.spoilerScope.throughChapterNumber).toBeGreaterThan(0);
        }
      }
    }
  });

  it("anchors The Blood Orchard discussions to existing readable chapters", () => {
    const bloodOrchardDiscussions = mockDiscussions.filter(
      (d) => d.storyRef?.storySlug === "the-blood-orchard",
    );
    expect(bloodOrchardDiscussions.length).toBeGreaterThanOrEqual(2);

    const featured = bloodOrchardDiscussions.find((d) => d.isFeatured);
    expect(featured).toBeDefined();
    expect(featured?.storyRef?.chapterSlug).toBe("chapter-3");
    expect(featured?.storyRef?.chapterTitle).toBe("The Door That Remembers");
    expect(featured?.spoilerScope?.throughChapterNumber).toBe(3);

    const secondary = bloodOrchardDiscussions.find(
      (d) => d.slug === "the-twenty-fifth-place-setting",
    );
    expect(secondary).toBeDefined();
    expect(secondary?.storyRef?.chapterSlug).toBe("chapter-4");
    expect(secondary?.storyRef?.chapterTitle).toBe("The Winter Room");
    expect(secondary?.spoilerScope?.throughChapterNumber).toBe(4);
  });

  it("contains zero studio drafts, private notes, or canon markers", () => {
    const forbidden = ["draft", "private", "canon", "studio", "unpublished"];
    for (const d of mockDiscussions) {
      for (const term of forbidden) {
        expect(d.title.toLowerCase()).not.toContain(term);
        expect(d.slug.toLowerCase()).not.toContain(term);
        expect(d.excerpt.toLowerCase()).not.toContain(term);
      }
    }
  });

  it("has exactly one featured discussion and valid moderation states", () => {
    const featured = mockDiscussions.filter((d) => d.isFeatured);
    expect(featured).toHaveLength(1);

    for (const d of mockDiscussions) {
      expect(["VISIBLE", "HIDDEN", "REMOVED"]).toContain(d.moderationState);
      for (const r of d.replies) {
        expect(["VISIBLE", "HIDDEN", "REMOVED"]).toContain(r.moderationState);
      }
    }
  });

  it("covers all 5 defined discussion categories across the mock dataset", () => {
    const categoriesPresent = new Set(mockDiscussions.map((d) => d.category));
    for (const cat of DISCUSSION_CATEGORIES) {
      expect(categoriesPresent.has(cat)).toBe(true);
    }
  });
});

describe("Community Repository Queries", () => {
  it("retrieves community home bundle correctly", async () => {
    const home = await community.getCommunityHome();
    expect(home.featured).not.toBeNull();
    expect(home.featured?.isFeatured).toBe(true);
    expect(home.latest.length).toBeGreaterThan(0);
    expect(home.latest.length).toBeLessThanOrEqual(6);
    expect(home.latest.some((d) => d.id === home.featured?.id)).toBe(false);
    expect(home.prompt.question).toBeTruthy();
    expect(home.prompt.isMock).toBe(true);
  });

  it("retrieves discussion by slug and handles not found gracefully", async () => {
    const firstSlug = mockDiscussions[0].slug;
    const found = await community.getDiscussionBySlug(firstSlug);
    expect(found).not.toBeNull();
    expect(found?.slug).toBe(firstSlug);
    expect(found?.replies.length).toBeGreaterThan(0);

    const missing = await community.getDiscussionBySlug("non-existent-discussion");
    expect(missing).toBeNull();
  });

  it("filters discussions by category and tab", async () => {
    // Specific category filter
    const characterDiscussions = await community.listDiscussions({
      category: "CHARACTER_DISCUSSION",
    });
    expect(characterDiscussions.items.length).toBeGreaterThan(0);
    expect(
      characterDiscussions.items.every(
        (d) => d.category === "CHARACTER_DISCUSSION",
      ),
    ).toBe(true);

    // Tab filter: reviews
    const reviews = await community.listDiscussions({ tab: "reviews" });
    expect(reviews.items.length).toBeGreaterThan(0);
    expect(
      reviews.items.every((d) => d.category === "READER_REVIEW"),
    ).toBe(true);

    // Tab filter: discussions
    const discussions = await community.listDiscussions({ tab: "discussions" });
    expect(discussions.items.length).toBeGreaterThan(0);
    expect(
      discussions.items.every((d) => d.category !== "READER_REVIEW"),
    ).toBe(true);

    // Tab filter: all
    const all = await community.listDiscussions({ tab: "all" });
    expect(all.total).toBe(mockDiscussions.length);
  });

  it("filters discussions by storySlug", async () => {
    const orchardDiscussions = await community.getDiscussionsByStory(
      "the-blood-orchard",
    );
    expect(orchardDiscussions.length).toBeGreaterThanOrEqual(2);
    expect(
      orchardDiscussions.every(
        (d) => d.storyRef?.storySlug === "the-blood-orchard",
      ),
    ).toBe(true);

    const emptyDiscussions = await community.getDiscussionsByStory(
      "non-existent-story",
    );
    expect(emptyDiscussions).toEqual([]);
  });

  it("handles pagination parameters correctly", async () => {
    const page1 = await community.listDiscussions({ page: 1, pageSize: 3 });
    expect(page1.items).toHaveLength(3);
    expect(page1.page).toBe(1);
    expect(page1.pageSize).toBe(3);
    expect(page1.total).toBe(mockDiscussions.length);

    const page2 = await community.listDiscussions({ page: 2, pageSize: 3 });
    expect(page2.items).toHaveLength(3);
    expect(page2.page).toBe(2);
    expect(page2.items[0].id).not.toBe(page1.items[0].id);
  });

  it("retrieves the active weekly prompt", async () => {
    const prompt = await community.getWeeklyPrompt();
    expect(prompt.id).toBe("prompt-001");
    expect(prompt.activeWeek).toBe("2026-W41");
    expect(prompt.question).toContain("fictional world");
  });
});
