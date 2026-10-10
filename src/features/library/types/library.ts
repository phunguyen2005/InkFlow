export const GENRES = [
  "Fantasy",
  "Sci-Fi",
  "Romance",
  "Mystery",
  "Thriller",
  "LitRPG",
  "Horror",
  "Contemporary",
  "Slice of Life",
] as const;
export type PrimaryGenre = (typeof GENRES)[number];
export type StoryStatus = "ONGOING" | "COMPLETED" | "HIATUS";
export type StoryProvenance = "HUMAN_WRITTEN" | "AI_ASSISTED" | "UNSPECIFIED";
export const SORTS = [
  "latest",
  "trending",
  "rating",
  "newest",
  "completed",
] as const;
export type StorySort = (typeof SORTS)[number];
export interface AuthorSummary {
  id: string;
  slug: string;
  penName: string;
  avatarRefId: string;
}
export interface StorySummary {
  id: string;
  slug: string;
  title: string;
  author: AuthorSummary;
  imageRefId: string;
  coverUrl: string;
  coverAlt: string;
  primaryGenre: PrimaryGenre;
  genreLabel: string;
  genres: PrimaryGenre[];
  tropes: string[];
  tags: string[];
  mood: string;
  status: StoryStatus;
  provenance: StoryProvenance;
  synopsisShort: string;
  chapterCount: number;
  sampleChapterCount: number;
  firstPublishedAt: string;
  lastPublishedAt: string;
  rating: { average: number; count: number; isMock: true };
  isFeatured: boolean;
  isTrending: boolean;
}
export interface ChapterSummary {
  id: string;
  storyId: string;
  slug: string;
  number: number;
  title: string;
  publishedAt: string;
  estimatedMinutes: number;
  isSample: true;
}
export interface StoryDetail extends StorySummary {
  synopsisLong: string;
  chapters: ChapterSummary[];
}
export interface ChapterDetail extends ChapterSummary {
  story: Pick<StorySummary, "id" | "slug" | "title" | "author">;
  bodyMarkdown: string;
  previousChapterSlug: string | null;
  nextChapterSlug: string | null;
}
export interface AuthorProfile extends AuthorSummary {
  bio: string;
  location: string;
  language: string;
  declaredWorkCount: number;
  publishedWorksCount: number;
  publicChapterCount: number;
  primaryGenres: PrimaryGenre[];
  works: StorySummary[];
}
export interface StoryQueryParams {
  q?: string;
  genres?: PrimaryGenre[];
  tropes?: string[];
  status?: StoryStatus[];
  provenance?: StoryProvenance[];
  sort?: StorySort;
  page?: number;
  pageSize?: number;
}
export interface StoryListResult {
  items: StorySummary[];
  total: number;
  page: number;
  pageSize: number;
}
