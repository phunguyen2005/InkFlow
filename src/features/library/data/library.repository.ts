import type {
  StoryQueryParams,
  StoryListResult,
  StoryDetail,
  ChapterDetail,
  AuthorProfile,
} from "../types/library";

export interface LibraryRepository {
  getCatalogFacets(): Promise<{ tropes: string[] }>;
  getPublicSlugs(): Promise<{ stories: string[]; authors: string[] }>;
  listStories(query: StoryQueryParams): Promise<StoryListResult>;
  getStoryBySlug(slug: string): Promise<StoryDetail | null>;
  getChapterBySlug(
    storySlug: string,
    chapterSlug: string,
  ): Promise<ChapterDetail | null>;
  getAuthorBySlug(slug: string): Promise<AuthorProfile | null>;
}
