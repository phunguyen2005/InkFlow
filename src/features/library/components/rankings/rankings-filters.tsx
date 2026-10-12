import Link from "next/link";
import { GENRES } from "../../types/library";
import {
  VALID_PERIODS_PER_CHART,
  type PeriodId,
  type RankingsQuery,
} from "../../types/rankings";
import { rankingsHref } from "../../utils/rankings";

const PERIOD_LABELS: Record<PeriodId, string> = {
  week: "This week",
  month: "This month",
  "all-time": "All time",
};

export function RankingsFilters({
  currentQuery,
}: {
  currentQuery: RankingsQuery;
}) {
  const allowedPeriods = VALID_PERIODS_PER_CHART[currentQuery.chart];

  return (
    <div className="rankings-filters">
      <nav className="rankings-period-nav" aria-label="Time period">
        {allowedPeriods.map((period) => {
          const href = rankingsHref({ ...currentQuery, period });
          const isActive = period === currentQuery.period;
          return (
            <Link
              key={period}
              href={href}
              scroll={false}
              className={`period-link ${isActive ? "active" : ""}`}
              aria-current={isActive ? "page" : undefined}
            >
              {PERIOD_LABELS[period]}
            </Link>
          );
        })}
      </nav>

      <div className="rankings-genre-scroll">
        <nav className="rankings-genre-nav" aria-label="Filter by genre">
          <Link
            href={rankingsHref({ ...currentQuery, genre: null })}
            scroll={false}
            className={`genre-chip ${currentQuery.genre === null ? "active" : ""}`}
            aria-current={currentQuery.genre === null ? "page" : undefined}
          >
            All genres
          </Link>
          {GENRES.map((g) => {
            const isActive = currentQuery.genre === g;
            return (
              <Link
                key={g}
                href={rankingsHref({ ...currentQuery, genre: g })}
                scroll={false}
                className={`genre-chip ${isActive ? "active" : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                {g}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
