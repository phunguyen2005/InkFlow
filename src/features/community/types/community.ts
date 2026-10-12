import type { PrimaryGenre } from "../../library/types/library";

/** Core categories for community discussions */
export const DISCUSSION_CATEGORIES = [
  "CHARACTER_DISCUSSION",
  "READER_REVIEW",
  "WORLD_AND_LORE",
  "THEORY_AND_PREDICTION",
  "GENERAL",
] as const;

export type DiscussionCategory = (typeof DISCUSSION_CATEGORIES)[number];

/** Tab filters displayed in CommunityNav */
export const COMMUNITY_TAB_FILTERS = ["all", "discussions", "reviews"] as const;
export type CommunityTabFilter = (typeof COMMUNITY_TAB_FILTERS)[number];

/** Scope of spoilers contained in a discussion or reply */
export interface SpoilerScope {
  storySlug: string;
  storyTitle: string;
  /** null means spoilers span the entire story */
  throughChapterNumber: number | null;
  throughChapterTitle: string | null;
}

/** Display moderation status for mock display */
export type ModerationState = "VISIBLE" | "HIDDEN" | "REMOVED";

/** Author of a post or reply */
export interface DiscussionAuthor {
  displayName: string;
  /** Slug of author if registered author, or null for reader */
  slug: string | null;
  isMock: true;
}

/** Reference to a published Library story */
export interface StoryReference {
  storyId: string;
  storySlug: string;
  storyTitle: string;
  coverUrl: string;
  coverAlt: string;
  primaryGenre: PrimaryGenre;
  /** Optional chapter link */
  chapterSlug?: string;
  chapterNumber?: number;
  chapterTitle?: string;
}

/** One-level reply to a discussion */
export interface DiscussionReply {
  id: string;
  author: DiscussionAuthor;
  bodyMarkdown: string;
  createdAt: string;
  moderationState: ModerationState;
  spoilerScope: SpoilerScope | null;
  isMock: true;
}

/** Summary for cards, lists, and homepage */
export interface DiscussionSummary {
  id: string;
  slug: string;
  title: string;
  category: DiscussionCategory;
  author: DiscussionAuthor;
  /** null indicates a library-wide general discussion */
  storyRef: StoryReference | null;
  spoilerScope: SpoilerScope | null;
  excerpt: string;
  replyCount: number;
  createdAt: string;
  isFeatured: boolean;
  moderationState: ModerationState;
  isMock: true;
}

/** Full discussion post with body and replies */
export interface DiscussionDetail extends DiscussionSummary {
  bodyMarkdown: string;
  replies: DiscussionReply[];
}

/** Weekly editorial prompt ("Question of the Week") */
export interface WeeklyPrompt {
  id: string;
  question: string;
  description: string;
  activeWeek: string;
  isMock: true;
}

/** Homepage payload bundle */
export interface CommunityHomeData {
  featured: DiscussionSummary | null;
  latest: DiscussionSummary[];
  prompt: WeeklyPrompt;
}

/** Query parameters for repository listing */
export interface DiscussionQueryParams {
  storySlug?: string;
  category?: DiscussionCategory;
  tab?: CommunityTabFilter;
  page?: number;
  pageSize?: number;
}

export interface DiscussionListResult {
  items: DiscussionSummary[];
  total: number;
  page: number;
  pageSize: number;
}
