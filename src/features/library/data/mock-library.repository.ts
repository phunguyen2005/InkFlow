import "server-only";
import { cache } from "react";
import { catalog, authors, authorSeeds, allTropes } from "../mock/catalog";
import { samples, type SampleChapter } from "../mock/sample-chapters";
import { bloodOrchard } from "../mock/blood-orchard";
import type { LibraryRepository } from "./library.repository";
import type { ChapterSummary } from "../types/library";
import { filterStories } from "../utils/filters";
import { readingTime } from "../utils/formatting";

const content: Record<string, SampleChapter[]> = {
  ...samples,
  "the-blood-orchard": bloodOrchard,
};
function chapterSummaries(slug: string): ChapterSummary[] {
  const story = catalog.find((s) => s.slug === slug);
  if (!story) return [];
  return (content[slug] ?? []).map((c, i) => ({
    id: `${story.id}-sample-${i + 1}`,
    storyId: story.id,
    number: i + 1,
    slug: `chapter-${i + 1}`,
    title: c.title,
    estimatedMinutes: readingTime(c.body),
    isSample: true,
    publishedAt: new Date(
      Date.parse(story.firstPublishedAt) + i * 3 * 86400000,
    ).toISOString(),
  }));
}
export const library: LibraryRepository = {
  getCatalogFacets: async () => ({ tropes: allTropes }),
  getPublicSlugs: async () => ({
    stories: catalog.map((story) => story.slug),
    authors: authors.map((author) => author.slug),
  }),
  listStories: async (query) => filterStories(catalog, query),
  getStoryBySlug: cache(async (slug) => {
    const story = catalog.find((s) => s.slug === slug);
    return story
      ? {
          ...story,
          synopsisLong: story.synopsisShort,
          chapters: chapterSummaries(slug),
        }
      : null;
  }),
  getChapterBySlug: cache(async (storySlug, chapterSlug) => {
    const story = catalog.find((s) => s.slug === storySlug);
    const chapters = chapterSummaries(storySlug);
    const index = chapters.findIndex((c) => c.slug === chapterSlug);
    if (!story || index < 0) return null;
    return {
      ...chapters[index],
      story: {
        id: story.id,
        slug: story.slug,
        title: story.title,
        author: story.author,
      },
      bodyMarkdown: content[storySlug][index].body,
      previousChapterSlug: chapters[index - 1]?.slug ?? null,
      nextChapterSlug: chapters[index + 1]?.slug ?? null,
    };
  }),
  getAuthorBySlug: cache(async (slug) => {
    const author = authors.find((a) => a.slug === slug);
    const seed = authorSeeds.find((a) => a.slug === slug);
    if (!author || !seed) return null;
    const works = catalog.filter((s) => s.author.id === author.id);
    return {
      ...author,
      bio: seed.bio,
      location: seed.location,
      language: seed.language,
      declaredWorkCount: seed.declaredWorkCount,
      publishedWorksCount: works.length,
      publicChapterCount: works.reduce(
        (sum, story) => sum + chapterSummaries(story.slug).length,
        0,
      ),
      primaryGenres: [...new Set(works.map((s) => s.primaryGenre))],
      works,
    };
  }),
};
