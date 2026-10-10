import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { LibraryShell } from "@/features/library/components/navigation/site-header";
import { StoryShelf } from "@/features/library/components/discovery/story-shelf";
import { library } from "@/features/library/data/mock-library.repository";
import { GENRES } from "@/features/library/types/library";
import { genreSlug } from "@/features/library/utils/formatting";

export default async function HomePage() {
  const [featured, trending, latest, completed] = await Promise.all([
    library.getStoryBySlug("the-blood-orchard"),
    library.listStories({ sort: "trending", pageSize: 6 }),
    library.listStories({ sort: "latest", pageSize: 6 }),
    library.listStories({ status: ["COMPLETED"], sort: "rating", pageSize: 6 }),
  ]);
  return (
    <LibraryShell>
      <main id="main" className="page-width">
        <section className="hero" aria-label="Featured story">
          <Image
            className="hero-art"
            src="/mock/heroes/blood-orchard.webp"
            alt="A lone heir beneath crimson orchard trees, facing a ruined manor under the moon"
            fill
            sizes="(max-width: 1440px) 100vw, 1360px"
            preload
          />
          <div className="hero-main">
            <span className="hero-kicker">
              InkFlow Public Library <span className="tiny-dot" /> Demo edition
            </span>
            <h1>EXPLORE</h1>
            <div className="hero-bottom">
              <p className="hero-tagline">
                Stories
                <br />
                beyond
                <br />
                <em>imagination.</em>
              </p>
              <div className="hero-intro">
                <p>
                  Original voices.
                  <br />
                  Uncharted worlds.
                  <br />
                  Your next great read.
                </p>
                <Link
                  className="circle-link"
                  aria-label="Explore all stories"
                  href="/explore"
                >
                  <ArrowUpRight size={28} />
                </Link>
              </div>
            </div>
          </div>
          <div className="hero-rail">
            <span className="eyebrow">The featured story</span>
            <h2>{featured?.title ?? "The Blood Orchard"}</h2>
            <span className="rail-rule" />
            <p>
              A name erased.
              <br />
              An orchard that remembers.
            </p>
            <Link className="text-link" href="/stories/the-blood-orchard">
              Discover the story <ArrowRight size={17} />
            </Link>
            <Link
              className="button"
              href="/stories/the-blood-orchard/chapters/chapter-1"
            >
              Start reading <ArrowUpRight size={17} />
            </Link>
          </div>
        </section>
        <nav className="genre-strip" aria-label="Browse by genre">
          <span className="eyebrow">Genres</span>
          <Link className="genre-all" href="/explore">
            All
          </Link>
          {GENRES.map((g) => (
            <Link key={g} href={`/explore?genre=${genreSlug(g)}`}>
              {g}
            </Link>
          ))}
          <Link
            className="genre-view-all"
            href="/explore"
            aria-label="View all genres"
          >
            <ArrowRight size={20} />
          </Link>
        </nav>
        <StoryShelf
          title="Trending now"
          eyebrow="Find your next obsession"
          stories={trending.items}
          href="/explore?sort=trending"
          ranked
        />
        <StoryShelf
          title="Fresh ink"
          eyebrow="The story continues"
          stories={latest.items}
          href="/explore?sort=latest"
        />
        <section className="beyond-section">
          <div className="section-line">
            <div>
              <span className="eyebrow muted">Follow your curiosity</span>
              <h2 className="display-heading">Beyond the genre</h2>
            </div>
            <Link className="text-link" href="/explore">
              Explore more <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="editorial-grid">
            {[
              {
                title: "A little magic. A place to belong.",
                tag: "Cozy worlds",
                slug: "the-lanterns-of-briar-row",
                query: "genre=slice-of-life",
              },
              {
                title: "Love, against the odds.",
                tag: "Slow-burning stories",
                slug: "a-map-for-moonlight",
                query: "genre=romance",
              },
              {
                title: "Nothing is what it seems.",
                tag: "Stay for the mystery",
                slug: "snowfall-at-room-seven",
                query: "genre=mystery",
              },
            ].map((item) => (
              <Link
                key={item.slug}
                href={`/explore?${item.query}`}
                className="editorial-feature"
              >
                <Image
                  src={`/mock/covers/${item.slug}.webp`}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 90vw, 33vw"
                />
                <div>
                  <span className="eyebrow">{item.tag}</span>
                  <h3>{item.title}</h3>
                  <ArrowUpRight size={24} />
                </div>
              </Link>
            ))}
          </div>
        </section>
        <StoryShelf
          title="The whole story"
          eyebrow="Completed & ready to read"
          stories={completed.items}
          href="/explore?status=completed"
        />
        <section className="studio-band">
          <span className="eyebrow">Every world starts with a word.</span>
          <p>Your story starts here.</p>
          <span>
            InkFlow Studio <span className="muted">/ Coming soon</span>
          </span>
        </section>
      </main>
    </LibraryShell>
  );
}
