import {
  GENRES,
  SORTS,
  type StorySummary,
  type StoryQueryParams,
  type StoryListResult,
} from "../types/library";
import { genreSlug } from "./formatting";

export function parseQuery(
  params: URLSearchParams,
  tropes: string[] = [],
): StoryQueryParams {
  const unique = (key: string) => [...new Set(params.getAll(key))];
  const sort = SORTS.find((s) => s === params.get("sort")) ?? "latest";
  const page = Number(params.get("page"));
  return {
    q: (params.get("q") ?? "").trim().slice(0, 200),
    genres: GENRES.filter((g) => unique("genre").includes(genreSlug(g))),
    tropes: unique("trope").filter((t) => tropes.includes(t)),
    status: (["ONGOING", "COMPLETED", "HIATUS"] as const).filter((s) =>
      unique("status").includes(s.toLowerCase()),
    ),
    provenance: (
      ["HUMAN_WRITTEN", "AI_ASSISTED", "UNSPECIFIED"] as const
    ).filter((p) => unique("provenance").includes(p.toLowerCase())),
    sort,
    page: Number.isSafeInteger(page) && page > 0 ? page : 1,
    pageSize: 12,
  };
}
export function queryString(query: StoryQueryParams): string {
  const p = new URLSearchParams();
  if (query.q) p.set("q", query.q);
  query.genres?.forEach((g) => p.append("genre", genreSlug(g)));
  query.tropes?.forEach((t) => p.append("trope", t));
  query.status?.forEach((s) => p.append("status", s.toLowerCase()));
  query.provenance?.forEach((v) => p.append("provenance", v.toLowerCase()));
  if (query.sort && query.sort !== "latest") p.set("sort", query.sort);
  if (query.page && query.page > 1) p.set("page", String(query.page));
  return p.toString();
}
export function filterStories(
  stories: readonly StorySummary[],
  query: StoryQueryParams,
): StoryListResult {
  const tokens =
    query.q?.toLowerCase().trim().split(/\s+/).filter(Boolean) ?? [];
  const filtered = stories.filter((story) => {
    const search = [
      story.title,
      story.author.penName,
      story.synopsisShort,
      ...story.genres,
      ...story.tropes,
      ...story.tags,
    ]
      .join(" ")
      .replaceAll("-", " ")
      .toLowerCase();
    return (
      tokens.every((token) => search.includes(token)) &&
      (!query.genres?.length ||
        query.genres.some((g) => story.genres.includes(g))) &&
      (!query.tropes?.length ||
        query.tropes.some((t) => story.tropes.includes(t))) &&
      (!query.status?.length || query.status.includes(story.status)) &&
      (!query.provenance?.length || query.provenance.includes(story.provenance))
    );
  });
  filtered.sort((a, b) => {
    let order = 0;
    switch (query.sort) {
      case "rating":
        order =
          b.rating.average - a.rating.average ||
          b.rating.count - a.rating.count;
        break;
      case "trending":
        order =
          Number(b.isTrending) - Number(a.isTrending) ||
          b.rating.count - a.rating.count;
        break;
      case "newest":
        order = b.firstPublishedAt.localeCompare(a.firstPublishedAt);
        break;
      case "completed":
        order =
          Number(b.status === "COMPLETED") - Number(a.status === "COMPLETED") ||
          b.lastPublishedAt.localeCompare(a.lastPublishedAt);
        break;
      default:
        order = b.lastPublishedAt.localeCompare(a.lastPublishedAt);
    }
    return order || a.slug.localeCompare(b.slug);
  });
  const pageSize = Math.min(24, Math.max(1, query.pageSize ?? 12));
  const page = Math.min(
    Math.max(1, query.page ?? 1),
    Math.max(1, Math.ceil(filtered.length / pageSize)),
  );
  return {
    items: filtered.slice((page - 1) * pageSize, page * pageSize),
    total: filtered.length,
    page,
    pageSize,
  };
}
