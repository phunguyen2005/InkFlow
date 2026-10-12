import type { Metadata } from "next";
import Link from "next/link";
import { LibraryShell } from "@/features/library/components/navigation/site-header";
import { library } from "@/features/library/data/library";
import {
  parseRankingsQuery,
  rankingsHref,
  buildChart,
} from "@/features/library/utils/rankings";
import { RankingsHeader } from "@/features/library/components/rankings/rankings-header";
import { ChartTabs } from "@/features/library/components/rankings/chart-tabs";
import { RankingsFilters } from "@/features/library/components/rankings/rankings-filters";
import { TopThree } from "@/features/library/components/rankings/top-three";
import { RankingRow } from "@/features/library/components/rankings/ranking-row";
import { HowRankingsWork } from "@/features/library/components/rankings/how-rankings-work";

export const metadata: Metadata = {
  title: "Rankings",
  description:
    "Curated editorial bestseller charts and demo rankings for InkFlow serial fiction.",
};

export default async function RankingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const params = new URLSearchParams();
  Object.entries(raw).forEach(([key, value]) =>
    (Array.isArray(value) ? value : value ? [value] : []).forEach((v) =>
      params.append(key, v),
    ),
  );

  const query = parseRankingsQuery(params);
  const { items } = await library.listStories({ pageSize: 24 });
  const ranked = buildChart(query, items);

  const topThree = ranked.slice(0, 3);
  const remainder = ranked.slice(3);

  return (
    <LibraryShell active="rankings">
      <main id="main" className="page-width rankings-page">
        <RankingsHeader />
        <ChartTabs
          currentChart={query.chart}
          currentPeriod={query.period}
          currentGenre={query.genre}
        />
        <RankingsFilters currentQuery={query} />

        {ranked.length > 0 ? (
          <>
            <TopThree items={topThree} />
            {remainder.length > 0 && (
              <section
                className="rankings-list"
                aria-label="Remaining charted stories"
              >
                {remainder.map((item) => (
                  <RankingRow key={item.story.id} item={item} />
                ))}
              </section>
            )}
          </>
        ) : (
          <div className="rankings-empty-state">
            <h2>No stories charted for this genre.</h2>
            <p>Try exploring another genre or return to the overall chart.</p>
            <Link
              className="button"
              href={rankingsHref({
                chart: query.chart,
                period: query.period,
                genre: null,
              })}
            >
              Clear genre filter
            </Link>
          </div>
        )}

        <HowRankingsWork />
      </main>
    </LibraryShell>
  );
}
