import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Search, Star } from "lucide-react";
import { LibraryShell } from "@/features/library/components/navigation/site-header";
import { ExploreControls } from "@/features/library/components/search/explore-controls";
import {
  library,
  getCatalogFacets,
} from "@/features/library/data/mock-library.repository";
import { parseQuery, queryString } from "@/features/library/utils/filters";
import { dateLabel, label } from "@/features/library/utils/formatting";

export const metadata: Metadata = { title: "Explore stories" };
export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [raw, facets] = await Promise.all([searchParams, getCatalogFacets()]);
  const params = new URLSearchParams();
  Object.entries(raw).forEach(([key, value]) =>
    (Array.isArray(value) ? value : value ? [value] : []).forEach((v) =>
      params.append(key, v),
    ),
  );
  const query = parseQuery(params, facets.tropes);
  const result = await library.listStories(query);
  const pages = Math.ceil(result.total / result.pageSize);
  return (
    <LibraryShell active="explore">
      <main id="main" className="page-width explore-page">
        <div className="page-heading">
          <span className="eyebrow muted">A world for every reader</span>
          <h1 className="display-heading">
            Explore stories<span className="coral">.</span>
          </h1>
          <p>Find the story that stays with you.</p>
        </div>
        <ExploreControls
          key={params.toString()}
          query={query}
          tropes={facets.tropes}
        />
        <div className="results-heading">
          <span>
            {result.total} {result.total === 1 ? "story" : "stories"}
            {query.q ? ` for "${query.q}"` : " to discover"}
          </span>
          <span className="eyebrow muted">Demo catalog</span>
        </div>
        {result.items.length ? (
          <div className="results-grid">
            {result.items.map((story) => (
              <article className="story-result" key={story.id}>
                <Link
                  className="result-cover"
                  href={`/stories/${story.slug}`}
                  aria-label={`Read about ${story.title}`}
                >
                  <Image
                    src={story.coverUrl}
                    alt={story.coverAlt}
                    fill
                    sizes="(max-width: 640px) 100px, 150px"
                  />
                </Link>
                <div className="result-info">
                  <span className="eyebrow coral">{story.genreLabel}</span>
                  <h2>
                    <Link href={`/stories/${story.slug}`}>{story.title}</Link>
                  </h2>
                  <Link
                    className="result-author"
                    href={`/authors/${story.author.slug}`}
                  >
                    {story.author.penName}
                  </Link>
                  <p>{story.synopsisShort}</p>
                  <div className="result-meta">
                    <span>{label(story.status)}</span>
                    <span>{story.chapterCount} chapters</span>
                    <span className="rating">
                      <Star size={12} aria-hidden="true" />
                      {story.rating.average.toFixed(1)}{" "}
                      <span className="muted">sample</span>
                    </span>
                  </div>
                  <time
                    className="result-date"
                    dateTime={story.lastPublishedAt}
                  >
                    Updated {dateLabel(story.lastPublishedAt)}
                  </time>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Search size={34} />
            <h2>No stories match these filters.</h2>
            <p>Try another title, author, or genre.</p>
            <Link className="button" href="/explore">
              Clear all filters <ArrowRight size={17} />
            </Link>
          </div>
        )}
        {pages > 1 ? (
          <nav className="pagination" aria-label="Result pages">
            {result.page > 1 ? (
              <Link
                className="icon-button"
                aria-label="Previous page"
                href={`/explore?${queryString({ ...query, page: result.page - 1 })}`}
              >
                <ArrowLeft size={18} />
              </Link>
            ) : (
              <button
                className="icon-button"
                aria-label="Previous page"
                disabled
              >
                <ArrowLeft size={18} />
              </button>
            )}
            {Array.from({ length: pages }, (_, i) => (
              <Link
                key={i}
                className="page-number"
                aria-current={i + 1 === result.page ? "page" : undefined}
                href={`/explore?${queryString({ ...query, page: i + 1 })}`}
              >
                {i + 1}
              </Link>
            ))}
            {result.page < pages ? (
              <Link
                className="icon-button"
                aria-label="Next page"
                href={`/explore?${queryString({ ...query, page: result.page + 1 })}`}
              >
                <ArrowRight size={18} />
              </Link>
            ) : (
              <button className="icon-button" aria-label="Next page" disabled>
                <ArrowRight size={18} />
              </button>
            )}
          </nav>
        ) : null}
      </main>
    </LibraryShell>
  );
}
