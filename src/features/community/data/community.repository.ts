import type {
  CommunityHomeData,
  DiscussionDetail,
  DiscussionQueryParams,
  DiscussionListResult,
  DiscussionSummary,
  WeeklyPrompt,
} from "../types/community";

export interface CommunityRepository {
  getCommunityHome(): Promise<CommunityHomeData>;
  getDiscussionBySlug(slug: string): Promise<DiscussionDetail | null>;
  listDiscussions(params: DiscussionQueryParams): Promise<DiscussionListResult>;
  getDiscussionsByStory(storySlug: string): Promise<DiscussionSummary[]>;
  getWeeklyPrompt(): Promise<WeeklyPrompt>;
}
