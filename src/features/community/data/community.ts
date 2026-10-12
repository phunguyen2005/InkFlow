import "server-only";
import { community as mockCommunity } from "./mock-community.repository";
import type { CommunityRepository } from "./community.repository";
import type { DiscussionQueryParams } from "../types/community";

/**
 * Select the public-data adapter in one place.
 * Public routes and feature components depend on this boundary.
 */
export const community: CommunityRepository = mockCommunity;
export const getCommunityHome = () => community.getCommunityHome();
export const getDiscussionBySlug = (slug: string) => community.getDiscussionBySlug(slug);
export const getDiscussionsByStory = (storySlug: string) => community.getDiscussionsByStory(storySlug);
export const listDiscussions = (params: DiscussionQueryParams) => community.listDiscussions(params);
export const getWeeklyPrompt = () => community.getWeeklyPrompt();
