import source from "./content-source.json";
import genreTaxonomy from "./taxonomy.json";
import type {
  PrimaryGenre,
  StorySummary,
  AuthorSummary,
} from "../types/library";
import { coverAsset } from "../data/assets";
import { label } from "../utils/formatting";

const taxonomy = genreTaxonomy as Record<string, PrimaryGenre>;
export const authorSeeds = source.authors;
export const authors: AuthorSummary[] = source.authors.map((a) => ({
  id: a.id,
  slug: a.slug,
  penName: a.name,
  avatarRefId: a.avatarRefId,
}));
export const catalog: StorySummary[] = source.stories.map((s) => {
  const author = authors.find((a) => a.id === s.authorId);
  if (!author) throw new Error(`Missing author for ${s.id}`);
  const primaryGenre = taxonomy[s.primaryGenre];
  if (!primaryGenre)
    throw new Error(`Unknown primary genre for ${s.id}: ${s.primaryGenre}`);
  const statuses = {
    completed: "COMPLETED",
    hiatus: "HIATUS",
    ongoing: "ONGOING",
  } as const;
  const status = statuses[s.status as keyof typeof statuses];
  if (!status) throw new Error(`Unknown status for ${s.id}: ${s.status}`);
  return {
    id: s.id,
    slug: s.slug,
    title: s.title,
    author,
    imageRefId: s.imageRefId,
    coverUrl: coverAsset(s.slug, s.imageRefId).src,
    coverAlt: `Original illustration for ${s.title}`,
    primaryGenre,
    genreLabel: label(s.primaryGenre),
    genres: [
      ...new Set([
        primaryGenre,
        ...s.secondaryGenres.flatMap((g) => (taxonomy[g] ? [taxonomy[g]] : [])),
      ]),
    ],
    tropes: s.tropes,
    tags: s.secondaryGenres,
    mood: s.mood,
    status,
    provenance: "UNSPECIFIED",
    synopsisShort: s.synopsis,
    chapterCount: s.chapterCount,
    sampleChapterCount: 5,
    lastPublishedAt: `${s.publishedAt}T12:00:00.000Z`,
    // A deterministic mock chronology; the supplied date is the latest update.
    firstPublishedAt: new Date(
      Date.parse(`${s.publishedAt}T12:00:00Z`) -
        (s.chapterCount - 1) * 3 * 86400000,
    ).toISOString(),
    rating: { ...s.rating, isMock: true },
    isFeatured: s.id === "story-001",
    isTrending: [
      "story-001",
      "story-002",
      "story-003",
      "story-007",
      "story-010",
      "story-009",
    ].includes(s.id),
  };
});
export const allTropes = [...new Set(catalog.flatMap((s) => s.tropes))].sort();
