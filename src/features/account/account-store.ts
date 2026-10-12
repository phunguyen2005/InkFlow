export const ACCOUNT_KEY = "inkflow:account:v2";

export interface ReaderProgressState {
  storyId?: string;
  chapterId?: string;
  chapterSlug: string;
  chapterRevisionId?: string;
  blockId?: string | null;
  offsetRatio?: number;
  paragraph: number;
  percent: number;
  completedChapterSlugs: string[];
  updatedAt?: string;
  lastReadAt: string;
}

export interface LocalReview {
  rating: number;
  body: string;
  updatedAt: string;
}

export interface DeviceLibraryState {
  version: 2;
  profile: { name: string; email: string } | null;
  savedStoryIds: string[];
  followedStoryIds: string[];
  followedAuthorIds: string[];
  progress: Record<string, ReaderProgressState>;
  reviews: Record<string, LocalReview>;
}

export const emptyDeviceLibrary: DeviceLibraryState = {
  version: 2,
  profile: null,
  savedStoryIds: [],
  followedStoryIds: [],
  followedAuthorIds: [],
  progress: {},
  reviews: {},
};

function strings(value: unknown) {
  return Array.isArray(value)
    ? [
        ...new Set(
          value.filter((item): item is string => typeof item === "string"),
        ),
      ]
    : [];
}

export function parseDeviceLibrary(raw: string | null): DeviceLibraryState {
  try {
    const value = JSON.parse(
      raw ?? "null",
    ) as Partial<DeviceLibraryState> | null;
    if (!value || value.version !== 2) return emptyDeviceLibrary;
    return {
      version: 2,
      profile:
        value.profile &&
        typeof value.profile.name === "string" &&
        typeof value.profile.email === "string"
          ? { name: value.profile.name, email: value.profile.email }
          : null,
      savedStoryIds: strings(value.savedStoryIds),
      followedStoryIds: strings(value.followedStoryIds),
      followedAuthorIds: strings(value.followedAuthorIds),
      progress:
        value.progress && typeof value.progress === "object"
          ? value.progress
          : {},
      reviews:
        value.reviews && typeof value.reviews === "object" ? value.reviews : {},
    };
  } catch {
    return emptyDeviceLibrary;
  }
}

export function migrateLegacyState(state: DeviceLibraryState) {
  const next: DeviceLibraryState = {
    ...state,
    savedStoryIds: [...state.savedStoryIds],
    followedStoryIds: [...state.followedStoryIds],
    progress: { ...state.progress },
  };
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (!key) continue;
    const saved = key.match(/^inkflow:saved:v1:(.+)$/);
    const followed = key.match(/^inkflow:follow:v1:(.+)$/);
    const progress = key.match(/^inkflow:progress:v1:(.+)$/);
    if (saved && localStorage.getItem(key) === "true")
      next.savedStoryIds.push(saved[1]);
    if (followed && localStorage.getItem(key) === "true")
      next.followedStoryIds.push(followed[1]);
    if (progress && !next.progress[progress[1]]) {
      try {
        const bookmark = JSON.parse(localStorage.getItem(key) ?? "null");
        if (bookmark && typeof bookmark.chapterSlug === "string") {
          next.progress[progress[1]] = {
            storyId:
              typeof bookmark.storyId === "string"
                ? bookmark.storyId
                : progress[1],
            chapterId:
              typeof bookmark.chapterId === "string"
                ? bookmark.chapterId
                : bookmark.chapterSlug,
            chapterSlug: bookmark.chapterSlug,
            chapterRevisionId:
              typeof bookmark.chapterRevisionId === "string"
                ? bookmark.chapterRevisionId
                : `${bookmark.chapterSlug}-rev1`,
            blockId:
              typeof bookmark.blockId === "string" || bookmark.blockId === null
                ? bookmark.blockId
                : null,
            offsetRatio:
              typeof bookmark.offsetRatio === "number"
                ? bookmark.offsetRatio
                : 0,
            paragraph: Number.isSafeInteger(bookmark.paragraph)
              ? bookmark.paragraph
              : 0,
            percent:
              typeof bookmark.percent === "number" ? bookmark.percent : 0,
            completedChapterSlugs: strings(bookmark.completedChapterSlugs),
            updatedAt:
              typeof bookmark.updatedAt === "string"
                ? bookmark.updatedAt
                : typeof bookmark.lastReadAt === "string"
                  ? bookmark.lastReadAt
                  : "",
            lastReadAt:
              typeof bookmark.lastReadAt === "string"
                ? bookmark.lastReadAt
                : "",
          };
        }
      } catch {
        // Invalid legacy entries are ignored without blocking the rest of migration.
      }
    }
  }
  next.savedStoryIds = strings(next.savedStoryIds);
  next.followedStoryIds = strings(next.followedStoryIds);
  return next;
}
