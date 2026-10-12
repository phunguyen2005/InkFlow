export interface ReaderPreferences {
  theme: "sepia" | "dark" | "white";
  font: "serif" | "sans";
  size: number;
  lineHeight: number;
  width: number;
  showProgress: boolean;
}
export const defaultPreferences: ReaderPreferences = {
  theme: "sepia",
  font: "serif",
  size: 18,
  lineHeight: 1.75,
  width: 700,
  showProgress: false,
};
export const READER_KEY = "inkflow:reader:v1";
export function parsePreferences(raw: string | null): ReaderPreferences {
  try {
    const value = JSON.parse(raw ?? "null");
    if (!value || typeof value !== "object") return defaultPreferences;
    const numeric = (
      input: unknown,
      min: number,
      max: number,
      fallback: number,
    ) =>
      typeof input === "number" && Number.isFinite(input)
        ? Math.min(max, Math.max(min, input))
        : fallback;
    return {
      theme: ["sepia", "dark", "white"].includes(value.theme)
        ? value.theme
        : "sepia",
      font: value.font === "sans" ? "sans" : "serif",
      size: numeric(value.size, 16, 28, 18),
      lineHeight: numeric(value.lineHeight, 1.5, 2.1, 1.75),
      width: numeric(value.width, 560, 820, 700),
      showProgress:
        typeof value.showProgress === "boolean" ? value.showProgress : false,
    };
  } catch {
    return defaultPreferences;
  }
}
export function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}
export function writeStorage(key: string, value: string): boolean {
  try {
    window.localStorage.setItem(key, value);
    window.dispatchEvent(new Event("inkflow-storage"));
    return true;
  } catch {
    return false;
  }
}
export interface Bookmark {
  storyId?: string;
  chapterId?: string;
  chapterSlug: string;
  chapterRevisionId?: string;
  blockId?: string | null;
  paragraph: number;
  offsetRatio?: number;
  percent?: number;
  completedChapterSlugs?: string[];
  updatedAt?: string;
  lastReadAt?: string;
}

export type ReadingProgress = Bookmark;

export function parseBookmark(raw: string | null): Bookmark | null {
  try {
    const v = JSON.parse(raw ?? "null");
    if (
      !v ||
      typeof v.chapterSlug !== "string" ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v.chapterSlug) ||
      !Number.isSafeInteger(v.paragraph) ||
      v.paragraph < 0 ||
      v.paragraph >= 10000
    ) {
      return null;
    }
    const bookmark: Bookmark = {
      chapterSlug: v.chapterSlug,
      paragraph: v.paragraph,
    };
    if (typeof v.storyId === "string") bookmark.storyId = v.storyId;
    if (typeof v.chapterId === "string") bookmark.chapterId = v.chapterId;
    if (typeof v.chapterRevisionId === "string")
      bookmark.chapterRevisionId = v.chapterRevisionId;
    if (typeof v.blockId === "string" || v.blockId === null)
      bookmark.blockId = v.blockId;
    if (typeof v.offsetRatio === "number" && Number.isFinite(v.offsetRatio))
      bookmark.offsetRatio = Math.max(0, Math.min(1, v.offsetRatio));
    if (typeof v.percent === "number" && Number.isFinite(v.percent))
      bookmark.percent = Math.max(0, Math.min(100, v.percent));
    if (Array.isArray(v.completedChapterSlugs))
      bookmark.completedChapterSlugs = v.completedChapterSlugs.filter(
        (slug: unknown): slug is string => typeof slug === "string",
      );
    if (typeof v.updatedAt === "string") bookmark.updatedAt = v.updatedAt;
    if (typeof v.lastReadAt === "string") bookmark.lastReadAt = v.lastReadAt;
    return bookmark;
  } catch {
    return null;
  }
}
