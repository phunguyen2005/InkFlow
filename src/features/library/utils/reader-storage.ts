export interface ReaderPreferences {
  theme: "sepia" | "dark" | "white";
  font: "serif" | "sans";
  size: number;
  lineHeight: number;
  width: number;
}
export const defaultPreferences: ReaderPreferences = {
  theme: "sepia",
  font: "serif",
  size: 18,
  lineHeight: 1.75,
  width: 700,
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
  chapterSlug: string;
  paragraph: number;
}
export function parseBookmark(raw: string | null): Bookmark | null {
  try {
    const v = JSON.parse(raw ?? "null");
    return v &&
      typeof v.chapterSlug === "string" &&
      /^chapter-[1-5]$/.test(v.chapterSlug) &&
      Number.isSafeInteger(v.paragraph) &&
      v.paragraph >= 0 &&
      v.paragraph < 10000
      ? v
      : null;
  } catch {
    return null;
  }
}
