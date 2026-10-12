import { describe, it, expect } from "vitest";
import { catalog } from "../mock/catalog";
import { GENRES, type PrimaryGenre, type StorySummary } from "../types/library";
import {
  CHARTS,
  PERIODS,
  VALID_PERIODS_PER_CHART,
  type ChartFixture,
  type ChartId,
  type PeriodId,
  type RankingsQuery,
} from "../types/rankings";
import { FIXTURES, RANKINGS_ARE_DEMO } from "../mock/rankings";
import { parseRankingsQuery, rankingsHref, buildChart } from "./rankings";

describe("Rankings Mock Fixtures & Honest Demo Constraints", () => {
  it("declares honest demo flag", () => {
    expect(RANKINGS_ARE_DEMO).toBe(true);
  });

  it("contains exactly 7 fixtures covering all valid (chart, period) pairs", () => {
    expect(CHARTS).toEqual(["trending", "most-read", "new-rising"]);
    expect(PERIODS).toEqual(["week", "month", "all-time"]);
    expect(FIXTURES).toHaveLength(7);

    const validPairs: Array<{ chart: ChartId; period: PeriodId }> = [];
    for (const chart of CHARTS) {
      for (const period of VALID_PERIODS_PER_CHART[chart]) {
        validPairs.push({ chart, period });
      }
    }
    expect(validPairs).toHaveLength(7);

    for (const pair of validPairs) {
      const match = FIXTURES.find(
        (f) => f.chart === pair.chart && f.period === pair.period
      );
      expect(match).toBeDefined();
    }
  });

  it("ensures every fixture has exactly 20 unique slugs from the approved catalog with no duplicates", () => {
    const catalogSlugs = new Set(catalog.map((s) => s.slug));
    expect(catalogSlugs.size).toBe(20);

    for (const fixture of FIXTURES) {
      expect(fixture.slugs).toHaveLength(20);
      const uniqueSlugs = new Set(fixture.slugs);
      expect(uniqueSlugs.size).toBe(20);

      for (const slug of fixture.slugs) {
        expect(catalogSlugs.has(slug)).toBe(true);
      }
    }
  });

  it("contains zero private, draft, or studio data slugs in fixtures", () => {
    const forbiddenMarkers = ["draft", "private", "canon", "studio", "unpublished"];
    for (const fixture of FIXTURES) {
      for (const slug of fixture.slugs) {
        for (const marker of forbiddenMarkers) {
          expect(slug.toLowerCase()).not.toContain(marker);
        }
      }
    }
  });
});

describe("parseRankingsQuery", () => {
  it("returns canonical defaults when params are empty, null, or undefined", () => {
    const expected: RankingsQuery = {
      chart: "trending",
      period: "week",
      genre: null,
    };

    expect(parseRankingsQuery({})).toEqual(expected);
    expect(parseRankingsQuery(null)).toEqual(expected);
    expect(parseRankingsQuery(undefined)).toEqual(expected);
    expect(parseRankingsQuery(new URLSearchParams())).toEqual(expected);
  });

  it("parses valid queries correctly from Record and URLSearchParams", () => {
    const recordQuery = parseRankingsQuery({
      chart: "most-read",
      period: "month",
      genre: "fantasy",
    });
    expect(recordQuery).toEqual({
      chart: "most-read",
      period: "month",
      genre: "Fantasy",
    });

    const searchParams = new URLSearchParams(
      "chart=new-rising&period=month&genre=sci-fi"
    );
    const searchParamsQuery = parseRankingsQuery(searchParams);
    expect(searchParamsQuery).toEqual({
      chart: "new-rising",
      period: "month",
      genre: "Sci-Fi",
    });
  });

  it("handles array parameters from Next.js by taking the first element", () => {
    const query = parseRankingsQuery({
      chart: ["most-read", "trending"],
      period: ["month", "week"],
      genre: ["romance", "horror"],
    });
    expect(query).toEqual({
      chart: "most-read",
      period: "month",
      genre: "Romance",
    });
  });

  it("falls back to default chart and period on invalid chart value", () => {
    const query = parseRankingsQuery({ chart: "non-existent-chart" });
    expect(query.chart).toBe("trending");
    expect(query.period).toBe("week");
  });

  it("falls back to default period on invalid period value", () => {
    const query = parseRankingsQuery({
      chart: "most-read",
      period: "invalid-period",
    });
    expect(query.chart).toBe("most-read");
    expect(query.period).toBe("week");
  });

  it("normalizes unsupported periods to chart default period", () => {
    // all-time is only allowed on most-read
    const trendingAllTime = parseRankingsQuery({
      chart: "trending",
      period: "all-time",
    });
    expect(trendingAllTime.chart).toBe("trending");
    expect(trendingAllTime.period).toBe("week");

    const newRisingAllTime = parseRankingsQuery({
      chart: "new-rising",
      period: "all-time",
    });
    expect(newRisingAllTime.chart).toBe("new-rising");
    expect(newRisingAllTime.period).toBe("week");

    // most-read supports all-time
    const mostReadAllTime = parseRankingsQuery({
      chart: "most-read",
      period: "all-time",
    });
    expect(mostReadAllTime.chart).toBe("most-read");
    expect(mostReadAllTime.period).toBe("all-time");
  });

  it("resolves genre slugs and case-insensitive names against GENRES", () => {
    expect(parseRankingsQuery({ genre: "sci-fi" }).genre).toBe("Sci-Fi");
    expect(parseRankingsQuery({ genre: "Sci-Fi" }).genre).toBe("Sci-Fi");
    expect(parseRankingsQuery({ genre: "slice-of-life" }).genre).toBe("Slice of Life");
    expect(parseRankingsQuery({ genre: "Slice of Life" }).genre).toBe("Slice of Life");
    expect(parseRankingsQuery({ genre: "fantasy" }).genre).toBe("Fantasy");
    expect(parseRankingsQuery({ genre: "FANTASY" }).genre).toBe("Fantasy");
    expect(parseRankingsQuery({ genre: "litrpg" }).genre).toBe("LitRPG");

    // Invalid or unknown genres resolve to null
    expect(parseRankingsQuery({ genre: "cyberpunk" }).genre).toBeNull();
    expect(parseRankingsQuery({ genre: "" }).genre).toBeNull();
    expect(parseRankingsQuery({ genre: "   " }).genre).toBeNull();
  });
});

describe("rankingsHref", () => {
  it("omits default values producing clean canonical /rankings URL", () => {
    expect(rankingsHref({})).toBe("/rankings");
    expect(
      rankingsHref({ chart: "trending", period: "week", genre: null })
    ).toBe("/rankings");
  });

  it("builds query strings omitting only default values", () => {
    expect(rankingsHref({ chart: "most-read" })).toBe("/rankings?chart=most-read");
    expect(rankingsHref({ period: "month" })).toBe("/rankings?period=month");
    expect(rankingsHref({ genre: "Fantasy" })).toBe("/rankings?genre=fantasy");
    expect(rankingsHref({ genre: "Sci-Fi" })).toBe("/rankings?genre=sci-fi");
    expect(rankingsHref({ genre: "Slice of Life" })).toBe(
      "/rankings?genre=slice-of-life"
    );

    expect(
      rankingsHref({
        chart: "most-read",
        period: "all-time",
        genre: "LitRPG",
      })
    ).toBe("/rankings?chart=most-read&period=all-time&genre=litrpg");
  });

  it("omits invalid parameters and unsupported periods for the chart", () => {
    // Unsupported period for trending -> omitted
    expect(rankingsHref({ chart: "trending", period: "all-time" })).toBe(
      "/rankings"
    );

    // Unsupported period for new-rising -> period omitted
    expect(rankingsHref({ chart: "new-rising", period: "all-time" })).toBe(
      "/rankings?chart=new-rising"
    );

    // Invalid chart -> omitted
    expect(rankingsHref({ chart: "invalid-chart" as unknown as ChartId })).toBe("/rankings");

    // Invalid genre -> omitted
    expect(rankingsHref({ genre: "Cyberpunk" as unknown as PrimaryGenre })).toBe("/rankings");
  });

  it("round-trips with parseRankingsQuery across representative query states", () => {
    const testCases: RankingsQuery[] = [
      { chart: "trending", period: "week", genre: null },
      { chart: "trending", period: "month", genre: "Fantasy" },
      { chart: "most-read", period: "week", genre: "Romance" },
      { chart: "most-read", period: "month", genre: "Mystery" },
      { chart: "most-read", period: "all-time", genre: "Sci-Fi" },
      { chart: "new-rising", period: "week", genre: "Slice of Life" },
      { chart: "new-rising", period: "month", genre: "Horror" },
    ];

    for (const original of testCases) {
      const href = rankingsHref(original);
      const url = new URL(href, "https://inkflow.local");
      const parsed = parseRankingsQuery(url.searchParams);
      expect(parsed).toEqual(original);
    }
  });
});

describe("buildChart", () => {
  it("guarantees dense rank determinism 1..n across all 70 (chart, period, genre) combinations", () => {
    const genreOptions: Array<PrimaryGenre | null> = [null, ...GENRES];
    let combinationsTested = 0;

    for (const fixture of FIXTURES) {
      for (const genre of genreOptions) {
        combinationsTested++;
        const query: RankingsQuery = {
          chart: fixture.chart,
          period: fixture.period,
          genre,
        };

        const result = buildChart(query, catalog);

        // Result count should match catalog stories for that genre (or 20 if null)
        const expectedCount =
          genre === null
            ? catalog.length
            : catalog.filter((s) => s.primaryGenre === genre).length;

        expect(result).toHaveLength(expectedCount);
        expect(result.length).toBeGreaterThan(0);

        // Verify strictly dense ranks 1..n
        result.forEach((item, index) => {
          expect(item.rank).toBe(index + 1);
        });

        // Verify no duplicate ranks
        const ranks = result.map((r) => r.rank);
        expect(new Set(ranks).size).toBe(result.length);

        // Verify no duplicate stories
        const slugs = result.map((r) => r.story.slug);
        expect(new Set(slugs).size).toBe(result.length);

        // Verify all stories match the filtered genre
        if (genre !== null) {
          for (const item of result) {
            expect(item.story.primaryGenre).toBe(genre);
          }
        }
      }
    }

    // Exactly 7 fixtures * 10 genre options = 70 combinations
    expect(combinationsTested).toBe(70);
  });

  it("handles genres with single or multiple catalog stories correctly", () => {
    // Horror has exactly 1 story: "the-house-beneath-the-stairs"
    const horrorChart = buildChart(
      { chart: "trending", period: "week", genre: "Horror" },
      catalog
    );
    expect(horrorChart).toHaveLength(1);
    expect(horrorChart[0].rank).toBe(1);
    expect(horrorChart[0].story.slug).toBe("the-house-beneath-the-stairs");

    // Fantasy has 7 stories, ranks should be 1..7
    const fantasyChart = buildChart(
      { chart: "trending", period: "week", genre: "Fantasy" },
      catalog
    );
    expect(fantasyChart).toHaveLength(7);
    expect(fantasyChart.map((r) => r.rank)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("falls back gracefully when an unsupported period is passed", () => {
    // Trending does not have all-time in fixtures, so it falls back to week
    const fallbackResult = buildChart(
      { chart: "trending", period: "all-time", genre: null },
      catalog
    );
    expect(fallbackResult).toHaveLength(20);
    expect(fallbackResult[0].rank).toBe(1);
    expect(fallbackResult[0].story.slug).toBe("the-blood-orchard");
  });

  it("throws descriptive Error when catalog is missing a fixture slug", () => {
    const corruptCatalog: StorySummary[] = catalog.filter(
      (s) => s.slug !== "the-blood-orchard"
    );

    expect(() =>
      buildChart(
        { chart: "trending", period: "week", genre: null },
        corruptCatalog
      )
    ).toThrowError("Unknown slug in fixture: the-blood-orchard");
  });

  it("throws descriptive Error when no fixture is found", () => {
    const emptyFixtures: ChartFixture[] = [];
    expect(() =>
      buildChart(
        { chart: "trending", period: "week", genre: null },
        catalog,
        emptyFixtures
      )
    ).toThrowError("Unknown rankings fixture for trending / week");
  });

  it("is pure and immutable: identical inputs yield identical outputs without mutating catalog", () => {
    const query: RankingsQuery = {
      chart: "trending",
      period: "week",
      genre: "Sci-Fi",
    };

    const initialCatalogJson = JSON.stringify(catalog);
    const run1 = buildChart(query, catalog);
    const run2 = buildChart(query, catalog);

    expect(run1).toEqual(run2);
    expect(JSON.stringify(catalog)).toBe(initialCatalogJson);
  });
});
