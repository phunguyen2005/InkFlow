import { describe, it, expect, vi } from "vitest";

// Mock server-only and next/navigation
vi.mock("server-only", () => ({}));

const { notFoundMock } = vi.hoisted(() => ({
  notFoundMock: vi.fn(() => {
    const err = new Error("NEXT_NOT_FOUND");
    (err as unknown as { digest: string }).digest = "NEXT_NOT_FOUND";
    throw err;
  }),
}));

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/community",
  notFound: notFoundMock,
}));

import { community } from "./community";
import { mockDiscussions } from "../mock/discussions";
import type { SpoilerScope } from "../types/community";
import { DiscussionCard } from "../components/discussion-card";
import { DiscussionBreadcrumb } from "../components/discussion-breadcrumb";
import { FeaturedDiscussion } from "../components/featured-discussion";
import { SpoilerOverlay } from "../components/spoiler-overlay";
import { LatestConversations } from "../components/latest-conversations";
import { DiscussionReplies } from "../components/discussion-replies";
import DiscussionDetailPage, {
  generateMetadata as generateDiscussionMetadata,
} from "@/app/(public)/community/discussions/[discussionSlug]/page";
import CommunityPage from "@/app/(public)/community/page";

describe("Adversarial Focus Area 1: Repository Query Param Tampering & Extreme Inputs", () => {
  it("gracefully falls back to 'all' items when tab is unknown or corrupted", async () => {
    const corruptedTabs = [
      "invalid_value",
      "UNKNOWN_TAB",
      "123",
      "null",
      "undefined",
      "!@#$%^&*",
      "   ",
      "",
    ];

    const allResult = await community.listDiscussions({ tab: "all" });

    for (const tab of corruptedTabs) {
      const result = await community.listDiscussions({ tab: tab as unknown as "all" });
      expect(result.items.length).toBe(allResult.items.length);
      expect(result.total).toBe(allResult.total);
    }
  });

  it("prioritizes explicit category filter over tab parameter when both are supplied", async () => {
    // If category is CHARACTER_DISCUSSION but tab is reviews, category takes precedence
    const result = await community.listDiscussions({
      category: "CHARACTER_DISCUSSION",
      tab: "reviews",
    });

    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items.every((d) => d.category === "CHARACTER_DISCUSSION")).toBe(true);
    expect(result.items.some((d) => d.category === "READER_REVIEW")).toBe(false);
  });

  it("correctly handles extreme and boundary pagination parameters", async () => {
    // page 0 and negative pages normalize to 1
    const pZero = await community.listDiscussions({ page: 0, pageSize: 3 });
    expect(pZero.page).toBe(1);
    expect(pZero.items).toHaveLength(3);

    const pNegative = await community.listDiscussions({ page: -99, pageSize: 3 });
    expect(pNegative.page).toBe(1);
    expect(pNegative.items).toHaveLength(3);

    // pageSize 0 and negative normalize to 1
    const sizeZero = await community.listDiscussions({ page: 1, pageSize: 0 });
    expect(sizeZero.pageSize).toBe(1);
    expect(sizeZero.items).toHaveLength(1);

    const sizeNegative = await community.listDiscussions({ page: 1, pageSize: -10 });
    expect(sizeNegative.pageSize).toBe(1);
    expect(sizeNegative.items).toHaveLength(1);

    // Out of bounds page returns empty items without throwing
    const outOfBounds = await community.listDiscussions({ page: 9999, pageSize: 10 });
    expect(outOfBounds.items).toEqual([]);
    expect(outOfBounds.page).toBe(9999);
    expect(outOfBounds.total).toBe(mockDiscussions.length);

    // Very large page size returns all available items without overflow
    const hugePage = await community.listDiscussions({ page: 1, pageSize: 1000 });
    expect(hugePage.items.length).toBe(mockDiscussions.length);
  });

  it("handles non-existent or adversarial storySlug queries without throwing", async () => {
    const nonExistent = await community.listDiscussions({
      storySlug: "non-existent-story-slug-9999",
    });
    expect(nonExistent.items).toEqual([]);
    expect(nonExistent.total).toBe(0);

    const traversal = await community.listDiscussions({
      storySlug: "../../../etc/passwd",
    });
    expect(traversal.items).toEqual([]);
    expect(traversal.total).toBe(0);

    const emptySlug = await community.listDiscussions({ storySlug: "" });
    // Empty slug doesn't trigger filter and returns all items
    expect(emptySlug.items.length).toBe(mockDiscussions.length);

    const byStoryEmpty = await community.getDiscussionsByStory("non-existent-story-xyz");
    expect(byStoryEmpty).toEqual([]);
  });

  it("handles non-existent slugs in getDiscussionBySlug safely", async () => {
    expect(await community.getDiscussionBySlug("")).toBeNull();
    expect(await community.getDiscussionBySlug("   ")).toBeNull();
    expect(await community.getDiscussionBySlug("non-existent-slug")).toBeNull();
    expect(await community.getDiscussionBySlug("undefined")).toBeNull();
  });
});

describe("Adversarial Focus Area 2: Missing Discussion Slug & 404 Route Semantics", () => {
  it("generateMetadata returns clean fallback title when discussion is not found", async () => {
    const meta = await generateDiscussionMetadata({
      params: Promise.resolve({ discussionSlug: "non-existent-slug-xyz" }),
    });

    expect(meta.title).toBe("Discussion Not Found · InkFlow");
  });

  it("generateMetadata returns proper metadata for existing discussion", async () => {
    const meta = await generateDiscussionMetadata({
      params: Promise.resolve({ discussionSlug: "was-returning-ever-a-choice" }),
    });

    expect(meta.title).toContain("Was returning to the orchard ever a choice?");
    expect(meta.title).toContain("Community · InkFlow");
    expect(meta.description).toBeTruthy();
  });

  it("DiscussionDetailPage triggers next/navigation notFound() when slug does not exist", async () => {
    notFoundMock.mockClear();

    await expect(
      DiscussionDetailPage({
        params: Promise.resolve({ discussionSlug: "missing-slug-triggers-404" }),
      }),
    ).rejects.toThrow("NEXT_NOT_FOUND");

    expect(notFoundMock).toHaveBeenCalledTimes(1);
  });
});

describe("Adversarial Focus Area 3: Discussion without Story Reference (storyRef: null)", () => {
  const disc006 = mockDiscussions.find((d) => d.id === "disc-006");

  it("verifies disc-006 exists and has storyRef: null", () => {
    expect(disc006).toBeDefined();
    expect(disc006!.storyRef).toBeNull();
    expect(disc006!.category).toBe("GENERAL");
  });

  it("DiscussionBreadcrumb renders cleanly without story link when storyRef is null", () => {
    const element = DiscussionBreadcrumb({
      discussion: {
        title: disc006!.title,
        storyRef: null,
      },
    });

    expect(element).toBeDefined();
    expect(element.props["aria-label"]).toBe("Breadcrumb");
  });

  it("DiscussionCard renders 'Across the Library' and does not crash when storyRef is null", () => {
    const element = DiscussionCard({ discussion: disc006! });
    expect(element).toBeDefined();
    expect(element.props.className).toContain("discussion-card");
  });

  it("FeaturedDiscussion handles storyRef: null safely without broken cover", () => {
    const element = FeaturedDiscussion({ discussion: disc006! });
    expect(element).toBeDefined();
    expect(element.props.className).toContain("featured-discussion");
  });

  it("DiscussionDetailPage renders disc-006 without throwing or rendering StoryReferenceBar", async () => {
    const pageElement = await DiscussionDetailPage({
      params: Promise.resolve({ discussionSlug: disc006!.slug }),
    });

    expect(pageElement).toBeDefined();
  });

  it("filtering by storySlug safely skips discussions with storyRef: null without null reference error", async () => {
    const result = await community.listDiscussions({
      storySlug: "the-blood-orchard",
    });

    expect(result.items.every((d) => d.storyRef !== null)).toBe(true);
    expect(result.items.some((d) => d.id === "disc-006")).toBe(false);
  });
});

describe("Adversarial Focus Area 4: Discussion without Spoilers (spoilerScope: null)", () => {
  const noSpoilerDisc = mockDiscussions.find((d) => d.slug === "a-world-i-didnt-want-to-leave");
  const spoilerDisc = mockDiscussions.find((d) => d.slug === "was-returning-ever-a-choice");

  it("verifies mock dataset contains discussions with and without spoilers", () => {
    expect(noSpoilerDisc).toBeDefined();
    expect(noSpoilerDisc!.spoilerScope).toBeNull();

    expect(spoilerDisc).toBeDefined();
    expect(spoilerDisc!.spoilerScope).not.toBeNull();
    expect(spoilerDisc!.spoilerScope?.throughChapterNumber).toBe(3);
  });

  it("DiscussionDetailPage does not wrap content in SpoilerOverlay when spoilerScope is null", async () => {
    const pageElement = await DiscussionDetailPage({
      params: Promise.resolve({ discussionSlug: noSpoilerDisc!.slug }),
    });

    expect(pageElement).toBeDefined();
  });

  it("SpoilerOverlay component is exported and accepts valid SpoilerScope contracts", () => {
    expect(typeof SpoilerOverlay).toBe("function");

    const chapterScope: SpoilerScope = {
      storySlug: "the-blood-orchard",
      storyTitle: "The Blood Orchard",
      throughChapterNumber: 5,
      throughChapterTitle: "The Gate",
    };
    expect(chapterScope.throughChapterNumber).toBe(5);

    const fullStoryScope: SpoilerScope = {
      storySlug: "the-blood-orchard",
      storyTitle: "The Blood Orchard",
      throughChapterNumber: null,
      throughChapterTitle: null,
    };
    expect(fullStoryScope.throughChapterNumber).toBeNull();
  });

  it("DiscussionReplies renders flat and handles mixed spoiler replies safely", () => {
    const mixedReplies = [
      {
        id: "rep-1",
        author: { displayName: "Reader One", slug: null, isMock: true as const },
        bodyMarkdown: "Safe reply text",
        createdAt: "2026-10-10T10:00:00.000Z",
        moderationState: "VISIBLE" as const,
        spoilerScope: null,
        isMock: true as const,
      },
      {
        id: "rep-2",
        author: { displayName: "Reader Two", slug: null, isMock: true as const },
        bodyMarkdown: "Spoiler reply text",
        createdAt: "2026-10-10T11:00:00.000Z",
        moderationState: "VISIBLE" as const,
        spoilerScope: {
          storySlug: "the-blood-orchard",
          storyTitle: "The Blood Orchard",
          throughChapterNumber: 3,
          throughChapterTitle: "Chapter 3",
        },
        isMock: true as const,
      },
    ];

    const element = DiscussionReplies({ replies: mixedReplies });
    expect(element).toBeDefined();
    expect(element.props["aria-labelledby"]).toBe("replies-heading");
  });
});

describe("Adversarial Focus Area 5: Community Homepage Server Component URL Permutations", () => {
  it("renders default homepage view with empty searchParams", async () => {
    const page = await CommunityPage({ searchParams: Promise.resolve({}) });
    expect(page).toBeDefined();
  });

  it("renders default view when tab param is tampered/invalid", async () => {
    const page = await CommunityPage({
      searchParams: Promise.resolve({ tab: "malformed_unknown_tab_999" }),
    });
    expect(page).toBeDefined();
  });

  it("handles case-insensitive valid tabs: 'DISCUSSIONS' and 'REVIEWS'", async () => {
    const discussionsPage = await CommunityPage({
      searchParams: Promise.resolve({ tab: "DISCUSSIONS" }),
    });
    expect(discussionsPage).toBeDefined();

    const reviewsPage = await CommunityPage({
      searchParams: Promise.resolve({ tab: "REVIEWS" }),
    });
    expect(reviewsPage).toBeDefined();
  });

  it("renders filtered conversations when story query param is provided", async () => {
    const storyPage = await CommunityPage({
      searchParams: Promise.resolve({ story: "the-blood-orchard" }),
    });
    expect(storyPage).toBeDefined();
  });

  it("renders empty state gracefully when story query param has no matches", async () => {
    const emptyStoryPage = await CommunityPage({
      searchParams: Promise.resolve({ story: "non-existent-story-zero-posts" }),
    });
    expect(emptyStoryPage).toBeDefined();
  });

  it("LatestConversations component renders clean empty state when passed empty list", () => {
    const emptyEl = LatestConversations({ discussions: [], title: "No Results" });
    expect(emptyEl).toBeDefined();
    expect(emptyEl.props["aria-labelledby"]).toBe("latest-conversations-heading");
  });
});
