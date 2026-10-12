import type { PrimaryGenre, StorySummary } from "./library";

export const CHARTS = ["trending", "most-read", "new-rising"] as const;
export type ChartId = (typeof CHARTS)[number];

export const PERIODS = ["week", "month", "all-time"] as const;
export type PeriodId = (typeof PERIODS)[number];

export const VALID_PERIODS_PER_CHART: Record<ChartId, readonly PeriodId[]> = {
  trending: ["week", "month"],
  "most-read": ["week", "month", "all-time"],
  "new-rising": ["week", "month"],
} as const;

export const DEFAULT_CHART: ChartId = "trending";
export const DEFAULT_PERIOD: PeriodId = "week";

export interface RankingsQuery {
  chart: ChartId;
  period: PeriodId;
  genre: PrimaryGenre | null;
}

export interface RankedStory {
  rank: number;
  story: StorySummary;
}

export interface ChartFixture {
  chart: ChartId;
  period: PeriodId;
  slugs: readonly string[];
}
