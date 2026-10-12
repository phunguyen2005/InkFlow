import Link from "next/link";
import type { PrimaryGenre } from "../../types/library";
import {
  CHARTS,
  VALID_PERIODS_PER_CHART,
  type ChartId,
  type PeriodId,
} from "../../types/rankings";
import { rankingsHref } from "../../utils/rankings";

const CHART_LABELS: Record<ChartId, string> = {
  trending: "Trending",
  "most-read": "Most Read",
  "new-rising": "New & Rising",
};

export function ChartTabs({
  currentChart,
  currentPeriod,
  currentGenre,
}: {
  currentChart: ChartId;
  currentPeriod: PeriodId;
  currentGenre: PrimaryGenre | null;
}) {
  return (
    <nav className="chart-tabs" aria-label="Ranking charts">
      {CHARTS.map((chart) => {
        const allowedPeriods = VALID_PERIODS_PER_CHART[chart];
        const period = allowedPeriods.includes(currentPeriod)
          ? currentPeriod
          : allowedPeriods[0];
        const href = rankingsHref({ chart, period, genre: currentGenre });
        const isActive = chart === currentChart;

        return (
          <Link
            key={chart}
            href={href}
            scroll={false}
            className={`chart-tab ${isActive ? "active" : ""}`}
            aria-current={isActive ? "page" : undefined}
          >
            {CHART_LABELS[chart]}
          </Link>
        );
      })}
    </nav>
  );
}
