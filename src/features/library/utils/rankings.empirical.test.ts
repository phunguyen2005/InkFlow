import { describe, it, expect } from "vitest";
import { catalog } from "../mock/catalog";
import { GENRES, type PrimaryGenre, type StorySummary } from "../types/library";
import {
  CHARTS,
  VALID_PERIODS_PER_CHART,
  DEFAULT_CHART,
  DEFAULT_PERIOD,
  type ChartId,
  type PeriodId,
  type RankingsQuery,
} from "../types/rankings";
import { FIXTURES, RANKINGS_ARE_DEMO } from "../mock/rankings";
import { parseRankingsQuery, rankingsHref, buildChart } from "./rankings";

describe("Empirical Challenger 1 — Adversarial Stress Test Suite", () => {
  // --------------------------------------------------------------------------
  // Vector 1: Hostile, Fuzzed & Malicious Query Inputs
  // --------------------------------------------------------------------------
  describe("Hostile & Fuzzed Inputs (parseRankingsQuery & rankingsHref)", () => {
    it("handles null, undefined, empty, and non-standard primitives gracefully", () => {
      const canonicalDefaults: RankingsQuery = {
        chart: DEFAULT_CHART,
        period: DEFAULT_PERIOD,
        genre: null,
      };

      expect(parseRankingsQuery(null)).toEqual(canonicalDefaults);
      expect(parseRankingsQuery(undefined)).toEqual(canonicalDefaults);
      expect(parseRankingsQuery({})).toEqual(canonicalDefaults);
      expect(parseRankingsQuery(new URLSearchParams())).toEqual(canonicalDefaults);
      expect(parseRankingsQuery(Object.create(null))).toEqual(canonicalDefaults);
    });

    it("handles hostile array parameters (empty, multi-element, null-containing)", () => {
      // Empty array in parameters
      const emptyArrayResult = parseRankingsQuery({
        chart: [],
        period: [],
        genre: [],
      });
      expect(emptyArrayResult).toEqual({
        chart: DEFAULT_CHART,
        period: DEFAULT_PERIOD,
        genre: null,
      });

      // Multi-element array picks first element
      const multiArrayResult = parseRankingsQuery({
        chart: ["most-read", "trending", "new-rising"],
        period: ["month", "week"],
        genre: ["fantasy", "sci-fi"],
      });
      expect(multiArrayResult).toEqual({
        chart: "most-read",
        period: "month",
        genre: "Fantasy",
      });

      // Array with undefined/null as first element
      const nullInArrayResult = parseRankingsQuery({
        chart: [undefined as unknown as string],
        period: [null as unknown as string],
        genre: [""],
      });
      expect(nullInArrayResult).toEqual({
        chart: DEFAULT_CHART,
        period: DEFAULT_PERIOD,
        genre: null,
      });
    });

    it("resists SQL injection, XSS, and script payloads", () => {
      const maliciousPayloads = [
        "'; DROP TABLE stories; --",
        "<script>alert('xss')</script>",
        "javascript:alert(1)",
        "\" UNION SELECT * FROM users --",
        "' OR '1'='1",
        "{{7*7}}",
        "${alert(1)}",
        "../../etc/passwd",
        "%00%2e%2e%2f",
        "\u0000\u001F\u007F",
      ];

      for (const payload of maliciousPayloads) {
        // As query params to parseRankingsQuery
        const parsed = parseRankingsQuery({
          chart: payload,
          period: payload,
          genre: payload,
        });

        expect(parsed.chart).toBe(DEFAULT_CHART);
        expect(parsed.period).toBe(DEFAULT_PERIOD);
        expect(parsed.genre).toBeNull();

        // As URLSearchParams
        const searchParams = new URLSearchParams();
        searchParams.set("chart", payload);
        searchParams.set("period", payload);
        searchParams.set("genre", payload);

        const parsedFromUrl = parseRankingsQuery(searchParams);
        expect(parsedFromUrl.chart).toBe(DEFAULT_CHART);
        expect(parsedFromUrl.period).toBe(DEFAULT_PERIOD);
        expect(parsedFromUrl.genre).toBeNull();

        // Passed to rankingsHref
        const href = rankingsHref({
          chart: payload as unknown as ChartId,
          period: payload as unknown as PeriodId,
          genre: payload as unknown as PrimaryGenre,
        });
        expect(href).toBe("/rankings");
        expect(href).not.toContain(payload);
      }
    });

    it("resists prototype pollution and unexpected object properties", () => {
      const hostileObject: Record<string, string | string[] | undefined> = {
        __proto__: "malicious",
        constructor: "polluted",
        toString: "override",
        valueOf: "override",
      };

      const parsed = parseRankingsQuery(hostileObject);
      expect(parsed).toEqual({
        chart: DEFAULT_CHART,
        period: DEFAULT_PERIOD,
        genre: null,
      });
    });

    it("handles extreme string lengths without crashing or hanging", () => {
      const giantString = "a".repeat(20000);
      const parsed = parseRankingsQuery({
        chart: giantString,
        period: giantString,
        genre: giantString,
      });
      expect(parsed).toEqual({
        chart: DEFAULT_CHART,
        period: DEFAULT_PERIOD,
        genre: null,
      });

      const href = rankingsHref({
        chart: giantString as unknown as ChartId,
        period: giantString as unknown as PeriodId,
        genre: giantString as unknown as PrimaryGenre,
      });
      expect(href).toBe("/rankings");
    });

    it("enforces period validity matrix and normalizes invalid combinations", () => {
      // 1. Trending supports only 'week' and 'month'. 'all-time' must normalize to 'week'.
      expect(parseRankingsQuery({ chart: "trending", period: "all-time" })).toEqual({
        chart: "trending",
        period: "week",
        genre: null,
      });

      // 2. New & Rising supports only 'week' and 'month'. 'all-time' must normalize to 'week'.
      expect(parseRankingsQuery({ chart: "new-rising", period: "all-time" })).toEqual({
        chart: "new-rising",
        period: "week",
        genre: null,
      });

      // 3. Most Read supports 'week', 'month', AND 'all-time'.
      expect(parseRankingsQuery({ chart: "most-read", period: "all-time" })).toEqual({
        chart: "most-read",
        period: "all-time",
        genre: null,
      });

      // 4. Invalid chart name with 'all-time' -> chart becomes 'trending', period normalizes to 'week'.
      expect(parseRankingsQuery({ chart: "unknown-chart", period: "all-time" })).toEqual({
        chart: "trending",
        period: "week",
        genre: null,
      });

      // 5. Completely invalid periods
      const invalidPeriods = ["daily", "quarter", "decade", "forever", "today", ""];
      for (const p of invalidPeriods) {
        expect(parseRankingsQuery({ chart: "most-read", period: p }).period).toBe("week");
      }
    });

    it("tests casing sensitivity behavior for chart, period, and genre", () => {
      // Genres ARE case-insensitive and whitespace-tolerant
      expect(parseRankingsQuery({ genre: "  FANTASY  " }).genre).toBe("Fantasy");
      expect(parseRankingsQuery({ genre: "sCi-Fi" }).genre).toBe("Sci-Fi");
      expect(parseRankingsQuery({ genre: "SLiCe-OF-LiFE" }).genre).toBe("Slice of Life");
      expect(parseRankingsQuery({ genre: "LiTrPg" }).genre).toBe("LitRPG");

      // Non-existent genres resolve to null
      expect(parseRankingsQuery({ genre: "Cyberpunk" }).genre).toBeNull();
      expect(parseRankingsQuery({ genre: "Non-Fiction" }).genre).toBeNull();

      // Charts and periods: upper case chart does not match CHARTS (which are lowercase),
      // so it falls back to DEFAULT_CHART ('trending').
      expect(parseRankingsQuery({ chart: "TRENDING" }).chart).toBe("trending");
      expect(parseRankingsQuery({ chart: "MOST-READ" }).chart).toBe("trending");
      expect(parseRankingsQuery({ chart: "NEW-RISING" }).chart).toBe("trending");

      // Upper case period does not match allowedPeriods -> falls back to 'week'
      expect(parseRankingsQuery({ chart: "most-read", period: "MONTH" }).period).toBe("week");
      expect(parseRankingsQuery({ chart: "most-read", period: "ALL-TIME" }).period).toBe("week");
    });
  });

  // --------------------------------------------------------------------------
  // Vector 2: Idempotency, Immutability & Determinism
  // --------------------------------------------------------------------------
  describe("Idempotency, Immutability & Determinism", () => {
    it("guarantees 100% identical outputs across 100 repeated executions with random parameters", () => {
      const charts: ChartId[] = ["trending", "most-read", "new-rising"];
      const periods: PeriodId[] = ["week", "month", "all-time"];
      const genres: Array<PrimaryGenre | null> = [null, ...GENRES];

      for (let i = 0; i < 50; i++) {
        const randChart = charts[Math.floor(Math.random() * charts.length)];
        const randPeriod = periods[Math.floor(Math.random() * periods.length)];
        const randGenre = genres[Math.floor(Math.random() * genres.length)];

        const query = parseRankingsQuery({
          chart: randChart,
          period: randPeriod,
          genre: randGenre ?? undefined,
        });

        // Run buildChart 5 times in a row
        const run1 = buildChart(query, catalog);
        const run2 = buildChart(query, catalog);
        const run3 = buildChart(query, catalog);
        const run4 = buildChart(query, catalog);
        const run5 = buildChart(query, catalog);

        expect(run1).toEqual(run2);
        expect(run2).toEqual(run3);
        expect(run3).toEqual(run4);
        expect(run4).toEqual(run5);

        // Verify ranks are contiguous 1..n
        run1.forEach((item, idx) => {
          expect(item.rank).toBe(idx + 1);
        });
      }
    });

    it("never mutates input catalog or fixtures data structures", () => {
      const initialCatalogSnapshot = JSON.stringify(catalog);
      const initialFixturesSnapshot = JSON.stringify(FIXTURES);

      // Run multiple builds across all fixtures and genres
      for (const fixture of FIXTURES) {
        for (const genre of [null, ...GENRES]) {
          buildChart(
            { chart: fixture.chart, period: fixture.period, genre },
            catalog
          );
        }
      }

      // Assert zero mutations
      expect(JSON.stringify(catalog)).toBe(initialCatalogSnapshot);
      expect(JSON.stringify(FIXTURES)).toBe(initialFixturesSnapshot);
    });
  });

  // --------------------------------------------------------------------------
  // Vector 3: Boundary Cases & Failure Modes
  // --------------------------------------------------------------------------
  describe("Boundary Cases & Throw Behavior (buildChart)", () => {
    it("throws a descriptive Error when catalog is empty []", () => {
      const emptyCatalog: StorySummary[] = [];
      expect(() =>
        buildChart({ chart: "trending", period: "week", genre: null }, emptyCatalog)
      ).toThrowError(/^Unknown slug in fixture:/);
    });

    it("throws a descriptive Error when catalog is missing any fixture slug", () => {
      // Pick the first fixture slug
      const missingSlug = FIXTURES[0].slugs[0];
      const corruptCatalog = catalog.filter((s) => s.slug !== missingSlug);

      expect(() =>
        buildChart({ chart: "trending", period: "week", genre: null }, corruptCatalog)
      ).toThrowError(`Unknown slug in fixture: ${missingSlug}`);
    });

    it("throws a descriptive Error when fixtures array is empty", () => {
      expect(() =>
        buildChart(
          { chart: "trending", period: "week", genre: null },
          catalog,
          []
        )
      ).toThrowError("Unknown rankings fixture for trending / week");
    });

    it("correctly assigns dense rank 1 for single-story genres", () => {
      // "Horror" has exactly 1 story in the catalog
      const horrorStories = catalog.filter((s) => s.primaryGenre === "Horror");
      expect(horrorStories).toHaveLength(1);

      for (const fixture of FIXTURES) {
        const result = buildChart(
          { chart: fixture.chart, period: fixture.period, genre: "Horror" },
          catalog
        );
        expect(result).toHaveLength(1);
        expect(result[0].rank).toBe(1);
        expect(result[0].story.slug).toBe(horrorStories[0].slug);
      }
    });

    it("returns empty array [] without error when genre filter matches zero stories in catalog", () => {
      // Create a mock catalog where no stories have genre 'Horror'
      const catalogWithoutHorror: StorySummary[] = catalog.map((s) =>
        s.primaryGenre === "Horror"
          ? { ...s, primaryGenre: "Fantasy" as PrimaryGenre }
          : s
      );

      const result = buildChart(
        { chart: "trending", period: "week", genre: "Horror" },
        catalogWithoutHorror
      );
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it("maintains dense 1..n ranks for multi-story genres across all fixtures", () => {
      // Fantasy has 7 stories
      for (const fixture of FIXTURES) {
        const fantasyChart = buildChart(
          { chart: fixture.chart, period: fixture.period, genre: "Fantasy" },
          catalog
        );
        expect(fantasyChart).toHaveLength(7);
        const ranks = fantasyChart.map((r) => r.rank);
        expect(ranks).toEqual([1, 2, 3, 4, 5, 6, 7]);
      }
    });
  });

  // --------------------------------------------------------------------------
  // Vector 4: Fixture Integrity & Honest Catalog Contracts
  // --------------------------------------------------------------------------
  describe("Fixture Integrity & Honest Catalog Contracts", () => {
    it("declares honest demo flag RANKINGS_ARE_DEMO = true", () => {
      expect(RANKINGS_ARE_DEMO).toBe(true);
    });

    it("contains exactly 7 fixtures representing every valid (chart, period) pair", () => {
      expect(FIXTURES).toHaveLength(7);

      const expectedPairs: Array<{ chart: ChartId; period: PeriodId }> = [];
      for (const chart of CHARTS) {
        for (const period of VALID_PERIODS_PER_CHART[chart]) {
          expectedPairs.push({ chart, period });
        }
      }
      expect(expectedPairs).toHaveLength(7);

      for (const expected of expectedPairs) {
        const found = FIXTURES.find(
          (f) => f.chart === expected.chart && f.period === expected.period
        );
        expect(found).toBeDefined();
      }
    });

    it("verifies all 7 fixtures contain exactly 20 unique slugs from the catalog", () => {
      const catalogSlugs = new Set(catalog.map((s) => s.slug));
      expect(catalogSlugs.size).toBe(20);

      for (const fixture of FIXTURES) {
        expect(fixture.slugs).toHaveLength(20);
        const uniqueInFixture = new Set(fixture.slugs);
        expect(uniqueInFixture.size).toBe(20);

        // Every slug in fixture must exist in catalog
        for (const slug of fixture.slugs) {
          expect(catalogSlugs.has(slug)).toBe(true);
        }

        // Every slug in catalog must exist in fixture (complete permutation)
        for (const slug of catalogSlugs) {
          expect(uniqueInFixture.has(slug)).toBe(true);
        }
      }
    });

    it("asserts no private, draft, studio, or forbidden tokens exist in fixture slugs", () => {
      const forbiddenTokens = [
        "draft",
        "private",
        "studio",
        "canon",
        "unpublished",
        "wip",
        "temp",
        "test",
        "dummy",
        "admin",
      ];

      for (const fixture of FIXTURES) {
        for (const slug of fixture.slugs) {
          for (const token of forbiddenTokens) {
            expect(slug.toLowerCase()).not.toContain(token);
          }
        }
      }
    });

    it("ensures fixtures contain no fabricated numeric metrics or movement symbols", () => {
      for (const fixture of FIXTURES) {
        const keys = Object.keys(fixture);
        expect(keys.sort()).toEqual(["chart", "period", "slugs"].sort());

        // Check fixture object has no movement indicators or numbers
        const fixtureStr = JSON.stringify(fixture);
        expect(fixtureStr).not.toContain("▲");
        expect(fixtureStr).not.toContain("▼");
        expect(fixtureStr).not.toContain("rankChange");
        expect(fixtureStr).not.toContain("readCount");
        expect(fixtureStr).not.toContain("viewCount");
      }
    });
  });

  // --------------------------------------------------------------------------
  // Vector 5: Canonical URL Generation & Round-Trip Fidelity
  // --------------------------------------------------------------------------
  describe("Canonical URL Generation & Round-Trip Fidelity (rankingsHref)", () => {
    it("omits default parameters producing clean /rankings", () => {
      expect(rankingsHref({})).toBe("/rankings");
      expect(rankingsHref({ chart: "trending" })).toBe("/rankings");
      expect(rankingsHref({ period: "week" })).toBe("/rankings");
      expect(rankingsHref({ genre: null })).toBe("/rankings");
      expect(
        rankingsHref({ chart: "trending", period: "week", genre: null })
      ).toBe("/rankings");
    });

    it("formats non-default parameters cleanly into query string", () => {
      expect(rankingsHref({ chart: "most-read" })).toBe("/rankings?chart=most-read");
      expect(rankingsHref({ period: "month" })).toBe("/rankings?period=month");
      expect(rankingsHref({ genre: "Fantasy" })).toBe("/rankings?genre=fantasy");
      expect(rankingsHref({ genre: "Sci-Fi" })).toBe("/rankings?genre=sci-fi");

      expect(
        rankingsHref({
          chart: "most-read",
          period: "all-time",
          genre: "LitRPG",
        })
      ).toBe("/rankings?chart=most-read&period=all-time&genre=litrpg");
    });

    it("omits invalid periods for charts that do not support them", () => {
      // Trending does not support 'all-time' -> period omitted
      expect(rankingsHref({ chart: "trending", period: "all-time" })).toBe("/rankings");

      // New & Rising does not support 'all-time' -> period omitted, chart kept
      expect(rankingsHref({ chart: "new-rising", period: "all-time" })).toBe(
        "/rankings?chart=new-rising"
      );
    });

    it("guarantees 100% round-trip fidelity across all 70 valid combinations", () => {
      const allGenres: Array<PrimaryGenre | null> = [null, ...GENRES];
      let roundTripsTested = 0;

      for (const chart of CHARTS) {
        for (const period of VALID_PERIODS_PER_CHART[chart]) {
          for (const genre of allGenres) {
            const originalQuery: RankingsQuery = { chart, period, genre };
            const href = rankingsHref(originalQuery);

            const parsedFromHref = parseRankingsQuery(
              new URL(href, "https://inkflow.local").searchParams
            );

            expect(parsedFromHref).toEqual(originalQuery);
            roundTripsTested++;
          }
        }
      }

      // Exactly 7 fixtures * 10 genres = 70 combinations
      expect(roundTripsTested).toBe(70);
    });
  });
});
