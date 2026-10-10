import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { LibraryShell } from "@/features/library/components/navigation/site-header";
import { StoryShelf } from "@/features/library/components/discovery/story-shelf";
import { library } from "@/features/library/data/mock-library.repository";
import { GENRES } from "@/features/library/types/library";
import { genreSlug } from "@/features/library/utils/formatting";

import { HeroSlider, type FeaturedStoryItem } from "@/features/library/components/discovery/hero-slider";

export default async function HomePage() {
  const [featuredStory, quietMachine, mapMoonlight, lanternRow, trending, latest, completed] = await Promise.all([
    library.getStoryBySlug("the-blood-orchard"),
    library.getStoryBySlug("the-quiet-machine-at-dawn"),
    library.getStoryBySlug("a-map-for-moonlight"),
    library.getStoryBySlug("the-lanterns-of-briar-row"),
    library.listStories({ sort: "trending", pageSize: 6 }),
    library.listStories({ sort: "latest", pageSize: 6 }),
    library.listStories({ status: ["COMPLETED"], sort: "rating", pageSize: 6 }),
  ]);

  const featuredItems: FeaturedStoryItem[] = [
    ...(featuredStory
      ? [
          {
            story: featuredStory,
            heroImage: "/mock/heroes/blood-orchard.webp",
            tagline: "A name erased. An orchard that remembers.",
          },
        ]
      : []),
    ...(quietMachine
      ? [
          {
            story: quietMachine,
            heroImage: "/mock/heroes/the-quiet-machine-at-dawn.webp",
            tagline: "A silent machine drifting beyond the mapped moons.",
          },
        ]
      : []),
    ...(mapMoonlight
      ? [
          {
            story: mapMoonlight,
            tagline: "Love, against the odds across uncharted skies.",
          },
        ]
      : []),
    ...(lanternRow
      ? [
          {
            story: lanternRow,
            tagline: "A little magic. A place to belong.",
          },
        ]
      : []),
  ];

  return (
    <LibraryShell>
      <main id="main" className="page-width">
        <HeroSlider items={featuredItems} />
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
