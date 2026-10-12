import { describe, it, expect } from "vitest";
import { catalog, authors } from "../mock/catalog";
import source from "../mock/content-source.json";
import { samples, type SampleChapter } from "../mock/sample-chapters";
import { bloodOrchard } from "../mock/blood-orchard";
import { filterStories, parseQuery, queryString } from "./filters";
import {
  parsePreferences,
  parseBookmark,
  defaultPreferences,
} from "./reader-storage";
import { readingTime } from "./formatting";

describe("content-library source fidelity", () => {
  it("preserves all 20 identities and source catalog counts", () => {
    expect(catalog).toHaveLength(20);
    expect(authors).toHaveLength(20);
    expect(new Set(catalog.map((s) => s.slug)).size).toBe(20);
    for (const original of source.stories) {
      const s = catalog.find((s) => s.id === original.id)!;
      expect(s.title).toBe(original.title);
      expect(s.slug).toBe(original.slug);
      expect(s.synopsisShort).toBe(original.synopsis);
      expect(s.chapterCount).toBe(original.chapterCount);
      expect(s.author.id).toBe(original.authorId);
      expect(s.imageRefId).toBe(original.imageRefId);
      expect(s.rating.average).toBe(original.rating.average);
      expect(s.provenance).toBe("UNSPECIFIED");
    }
  });
  it("has five distinct readable samples for every source story", () => {
    const bodies: Record<string, SampleChapter[]> = {
      ...samples,
      "the-blood-orchard": bloodOrchard,
    };
    for (const story of catalog) {
      const chapters = bodies[story.slug];
      expect(chapters).toHaveLength(5);
      expect(new Set(chapters.map((c) => c.title)).size).toBe(5);
      for (const c of chapters) {
        expect(c.body.length).toBeGreaterThan(200);
        expect(readingTime(c.body)).toBeGreaterThanOrEqual(1);
      }
    }
    expect(
      bloodOrchard.slice(0, 3).every((c) => readingTime(c.body) >= 4),
    ).toBe(true);
  });
});
describe("discovery query behavior", () => {
  const tropes = [...new Set(catalog.flatMap((s) => s.tropes))];
  it("round trips multi filters and rejects malformed parameters", () => {
    const q = parseQuery(
      new URLSearchParams(
        "q=moon&genre=romance&genre=mystery&genre=romance&genre=invalid&status=completed&trope=slow-burn&trope=bad&sort=rating&page=2",
      ),
      tropes,
    );
    expect(q.genres).toEqual(["Romance", "Mystery"]);
    expect(q.tropes).toEqual(["slow-burn"]);
    expect(parseQuery(new URLSearchParams(queryString(q)), tropes)).toEqual(q);
    expect(parseQuery(new URLSearchParams("page=-1&sort=wrong"))).toMatchObject(
      { page: 1, sort: "latest" },
    );
  });
  it("combines OR within filters and AND between groups", () => {
    const r = filterStories(catalog, {
      genres: ["Romance", "Mystery"],
      status: ["COMPLETED"],
      pageSize: 24,
    });
    expect(r.total).toBeGreaterThan(0);
    expect(
      r.items.every(
        (s) =>
          s.status === "COMPLETED" &&
          (s.genres.includes("Romance") || s.genres.includes("Mystery")),
      ),
    ).toBe(true);
  });
  it("searches author, synopsis and normalized tropes", () => {
    expect(filterStories(catalog, { q: "Mara Voss" }).items[0].slug).toBe(
      "the-blood-orchard",
    );
    expect(filterStories(catalog, { q: "slow burn" }).items[0].slug).toBe(
      "a-map-for-moonlight",
    );
    expect(filterStories(catalog, { q: "slow-burn" }).items).toEqual(
      filterStories(catalog, { q: "slow burn" }).items,
    );
    expect(filterStories(catalog, { q: "Sci-Fi" }).items).toEqual(
      filterStories(catalog, { q: "sci fi" }).items,
    );
    expect(filterStories(catalog, { q: "not-a-real-story" }).total).toBe(0);
  });
  it("sorts stably and clamps pages without mutating fixtures", () => {
    const ids = catalog.map((s) => s.id);
    const first = filterStories(catalog, { sort: "rating", pageSize: 12 });
    const last = filterStories(catalog, { page: 999, pageSize: 12 });
    expect(first.items[0].slug).toBe("the-lanterns-of-briar-row");
    expect(last.page).toBe(2);
    expect(last.items).toHaveLength(8);
    expect(catalog.map((s) => s.id)).toEqual(ids);
    expect(
      filterStories(catalog, { sort: "completed", pageSize: 24 }).total,
    ).toBe(20);
    expect(filterStories(catalog, { status: ["HIATUS"] }).total).toBe(0);
  });
});
describe("local reader storage", () => {
  it("validates and bounds reader values", () => {
    expect(parsePreferences("broken")).toEqual(defaultPreferences);
    expect(
      parsePreferences(
        '{"theme":"unknown","font":"sans","size":100,"width":0,"lineHeight":1}',
      ),
    ).toMatchObject({
      theme: "sepia",
      font: "sans",
      size: 28,
      width: 560,
      lineHeight: 1.5,
    });
    expect(parsePreferences('{"size":"20"}').size).toBe(18);
    expect(parsePreferences('{"showProgress":true}').showProgress).toBe(true);
    expect(parsePreferences('{"showProgress":"invalid"}').showProgress).toBe(
      false,
    );
  });
  it("does not trust malformed or unsupported resume targets", () => {
    expect(parseBookmark('{"chapterSlug":"chapter-2","paragraph":7}')).toEqual({
      chapterSlug: "chapter-2",
      paragraph: 7,
    });
    expect(
      parseBookmark('{"chapterSlug":"javascript:alert(1)","paragraph":1}'),
    ).toBeNull();
    expect(parseBookmark('{"chapterSlug":"chapter-9","paragraph":0}')).toEqual({
      chapterSlug: "chapter-9",
      paragraph: 0,
    });
    expect(parseBookmark("{}")).toBeNull();
  });
  it("parses rich reading progress with blockId and chapterRevisionId", () => {
    const raw = JSON.stringify({
      storyId: "story-001",
      chapterId: "chapter-001",
      chapterSlug: "chapter-1",
      chapterRevisionId: "chapter-001-rev1",
      blockId: "block-chapter-001-3",
      paragraph: 3,
      offsetRatio: 0.45,
      percent: 45,
      completedChapterSlugs: ["chapter-1"],
      updatedAt: "2026-10-12T00:00:00.000Z",
      lastReadAt: "2026-10-12T00:00:00.000Z",
    });
    const parsed = parseBookmark(raw);
    expect(parsed).toEqual({
      storyId: "story-001",
      chapterId: "chapter-001",
      chapterSlug: "chapter-1",
      chapterRevisionId: "chapter-001-rev1",
      blockId: "block-chapter-001-3",
      paragraph: 3,
      offsetRatio: 0.45,
      percent: 45,
      completedChapterSlugs: ["chapter-1"],
      updatedAt: "2026-10-12T00:00:00.000Z",
      lastReadAt: "2026-10-12T00:00:00.000Z",
    });
  });
});
