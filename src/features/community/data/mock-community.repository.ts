import "server-only";
import { cache } from "react";
import type { CommunityRepository } from "./community.repository";
import { mockDiscussions, mockWeeklyPrompt } from "../mock/discussions";

export const community: CommunityRepository = {
  getCommunityHome: async () => {
    const visible = mockDiscussions.filter((d) => d.moderationState === "VISIBLE");
    const featured = visible.find((d) => d.isFeatured) ?? visible[0] ?? null;
    const latest = visible.filter((d) => d.id !== featured?.id).slice(0, 6);
    return {
      featured,
      latest,
      prompt: mockWeeklyPrompt,
    };
  },

  getDiscussionBySlug: cache(async (slug: string) => {
    const item = mockDiscussions.find((d) => d.slug === slug);
    return item ?? null;
  }),

  listDiscussions: async (params) => {
    let items = mockDiscussions.filter((d) => d.moderationState === "VISIBLE");

    if (params.storySlug) {
      items = items.filter((d) => d.storyRef?.storySlug === params.storySlug);
    }

    if (params.category) {
      items = items.filter((d) => d.category === params.category);
    } else if (params.tab === "reviews") {
      items = items.filter((d) => d.category === "READER_REVIEW");
    } else if (params.tab === "discussions") {
      items = items.filter((d) => d.category !== "READER_REVIEW");
    }

    const page = Math.max(1, params.page ?? 1);
    const pageSize = Math.max(1, params.pageSize ?? 10);
    const total = items.length;
    const paged = items.slice((page - 1) * pageSize, page * pageSize);

    return {
      items: paged,
      total,
      page,
      pageSize,
    };
  },

  getDiscussionsByStory: cache(async (storySlug: string) => {
    return mockDiscussions.filter(
      (d) => d.storyRef?.storySlug === storySlug && d.moderationState === "VISIBLE",
    );
  }),

  getWeeklyPrompt: async () => mockWeeklyPrompt,
};
