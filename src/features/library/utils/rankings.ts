import { GENRES, type PrimaryGenre, type StorySummary } from "../types/library";
import {
  CHARTS,
  DEFAULT_CHART,
  DEFAULT_PERIOD,
  VALID_PERIODS_PER_CHART,
  type ChartFixture,
  type ChartId,
  type PeriodId,
  type RankedStory,
  type RankingsQuery,
} from "../types/rankings";
import { FIXTURES } from "../mock/rankings";
import { genreSlug } from "./formatting";

/**
 * Validates and normalizes raw rankings query parameters into a typed RankingsQuery.
 * Missing or invalid charts/periods fall back to defaults (chart: "trending", period: "week").
 * Invalid periods for the resolved chart (e.g. "all-time" on "trending") normalize to "week".
 * Genres are matched case-insensitively against primary genres and genre slugs.
 */
export function parseRankingsQuery(
  rawParams?: Record<string, string | string[] | undefined> | URLSearchParams | null
): RankingsQuery {
  const getParam = (key: string): string | undefined => {
    if (!rawParams) return undefined;
    if (rawParams instanceof URLSearchParams) {
      return rawParams.get(key) ?? undefined;
    }
    const val = rawParams[key];
    return Array.isArray(val) ? val[0] : val;
  };

  const rawChart = getParam("chart");
  const chart: ChartId = (CHARTS as readonly string[]).includes(rawChart ?? "")
    ? (rawChart as ChartId)
    : DEFAULT_CHART;

  const allowedPeriods = VALID_PERIODS_PER_CHART[chart];
  const rawPeriod = getParam("period");
  const period: PeriodId = (allowedPeriods as readonly string[]).includes(rawPeriod ?? "")
    ? (rawPeriod as PeriodId)
    : DEFAULT_PERIOD;

  const rawGenre = (getParam("genre") ?? "").trim().toLowerCase();
  const genre: PrimaryGenre | null = rawGenre
    ? GENRES.find((g) => genreSlug(g) === rawGenre || g.toLowerCase() === rawGenre) ?? null
    : null;

  return { chart, period, genre };
}

/**
 * Formats a canonical rankings URL path, omitting default parameters:
 * - chart: "trending" (omitted)
 * - period: "week" (omitted)
 * - genre: null (omitted)
 *
 * Omits invalid parameters (e.g. invalid charts/periods/genres or periods unsupported by the chart).
 * Returns "/rankings" when all parameters are defaults.
 */
export function rankingsHref(query: Partial<RankingsQuery>): string {
  const params = new URLSearchParams();

  const activeChart: ChartId =
    query.chart && (CHARTS as readonly string[]).includes(query.chart)
      ? query.chart
      : DEFAULT_CHART;

  if (query.chart && query.chart !== DEFAULT_CHART && (CHARTS as readonly string[]).includes(query.chart)) {
    params.set("chart", query.chart);
  }

  const allowedPeriods = VALID_PERIODS_PER_CHART[activeChart];
  if (
    query.period &&
    query.period !== DEFAULT_PERIOD &&
    (allowedPeriods as readonly string[]).includes(query.period)
  ) {
    params.set("period", query.period);
  }

  if (query.genre && (GENRES as readonly string[]).includes(query.genre)) {
    params.set("genre", genreSlug(query.genre));
  }

  const qs = params.toString();
  return qs ? `/rankings?${qs}` : "/rankings";
}

/**
 * Resolves a rankings chart from static editorial fixtures:
 * 1. Retrieves the fixture matching (chart, period), falling back to valid defaults if unknown.
 * 2. Maps fixture slugs to StorySummary objects from the catalog (throws if a slug is missing).
 * 3. Filters by primary genre if specified.
 * 4. Assigns contiguous 1-based dense ranks (1..n) to the result.
 */
export function buildChart(
  query: RankingsQuery,
  catalog: readonly StorySummary[],
  fixtures: readonly ChartFixture[] = FIXTURES
): RankedStory[] {
  let fixture = fixtures.find(
    (f) => f.chart === query.chart && f.period === query.period
  );

  if (!fixture) {
    fixture =
      fixtures.find((f) => f.chart === query.chart && f.period === DEFAULT_PERIOD) ??
      fixtures.find((f) => f.chart === DEFAULT_CHART && f.period === DEFAULT_PERIOD);
  }

  if (!fixture) {
    throw new Error(`Unknown rankings fixture for ${query.chart} / ${query.period}`);
  }

  const stories: StorySummary[] = [];
  for (const slug of fixture.slugs) {
    const story = catalog.find((s) => s.slug === slug);
    if (!story) {
      throw new Error(`Unknown slug in fixture: ${slug}`);
    }
    stories.push(story);
  }

  const filtered =
    query.genre === null
      ? stories
      : stories.filter((s) => s.primaryGenre === query.genre);

  return filtered.map((story, index) => ({
    rank: index + 1,
    story,
  }));
}
