import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { LibraryShell } from "@/features/library/components/navigation/site-header";
import { StoryShelf } from "@/features/library/components/discovery/story-shelf";
import { library } from "@/features/library/data/library";
import { GENRES } from "@/features/library/types/library";
import { genreSlug } from "@/features/library/utils/formatting";
import type { StoryDetail } from "@/features/library/types/library";
import { PersonalLibraryStrip } from "@/features/library/components/discovery/personal-library-strip";

import {
  HeroSlider,
  type FeaturedStoryItem,
} from "@/features/library/components/discovery/hero-slider";

function featuredItem(
  story: StoryDetail,
  heroImage: string,
  tagline: string,
): FeaturedStoryItem {
  return {
    story: {
      id: story.id,
      slug: story.slug,
      title: story.title,
      coverUrl: story.coverUrl,
      coverAlt: story.coverAlt,
      synopsisShort: story.synopsisShort,
    },
    firstChapterSlug: story.chapters[0]?.slug ?? null,
    heroImage,
    tagline,
  };
}

export default async function HomePage() {
  const [
    featuredStory,
    quietMachine,
    mapMoonlight,
    lanternRow,
    trending,
    latest,
    completed,
    allStories,
  ] = await Promise.all([
    library.getStoryBySlug("the-blood-orchard"),
    library.getStoryBySlug("the-quiet-machine-at-dawn"),
    library.getStoryBySlug("a-map-for-moonlight"),
    library.getStoryBySlug("the-lanterns-of-briar-row"),
    library.listStories({ sort: "trending", pageSize: 24 }),
    library.listStories({ sort: "latest", pageSize: 24 }),
    library.listStories({ status: ["COMPLETED"], sort: "rating", pageSize: 6 }),
    library.listStories({ pageSize: 24 }),
  ]);

  const completedIds = new Set(completed.items.map((story) => story.id));
  const trendingStories = trending.items
    .filter((story) => !completedIds.has(story.id))
    .slice(0, 6);
  const usedIds = new Set([
    ...completedIds,
    ...trendingStories.map((story) => story.id),
  ]);
  const freshStories = latest.items
    .filter((story) => !usedIds.has(story.id))
    .slice(0, 5);
  const newReleaseLead = freshStories[0];
  const newReleaseList = freshStories.slice(1);

  const featuredItems: FeaturedStoryItem[] = [
    ...(featuredStory
      ? [
          featuredItem(
            featuredStory,
            "/mock/heroes/blood-orchard.webp",
            "A name erased. An orchard that remembers.",
          ),
        ]
      : []),
    ...(quietMachine
      ? [
          featuredItem(
            quietMachine,
            "/mock/heroes/the-quiet-machine-at-dawn.webp",
            "A silent machine drifting beyond the mapped moons.",
          ),
        ]
      : []),
    ...(mapMoonlight
      ? [
          featuredItem(
            mapMoonlight,
            "/mock/heroes/a-map-for-moonlight.webp",
            "A cartographer who draws dreams. A prince who never sleeps.",
          ),
        ]
      : []),
    ...(lanternRow
      ? [
          featuredItem(
            lanternRow,
            "/mock/heroes/the-lanterns-of-briar-row.webp",
            "A botanical haven whose flowers bloom only for secrets.",
          ),
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
        <PersonalLibraryStrip stories={allStories.items} />
        <StoryShelf
          title="Trending now"
          eyebrow="Find your next obsession"
          stories={trendingStories.length ? trendingStories : trending.items}
          href="/explore?sort=trending"
          ranked
        />
        {newReleaseLead ? (
          <section className="new-releases-section">
            <div className="section-line">
              <div>
                <span className="eyebrow muted">The story continues</span>
                <h2 className="display-heading">New releases</h2>
              </div>
              <Link className="text-link" href="/explore?sort=latest">
                Fresh ink <ArrowUpRight size={18} />
              </Link>
            </div>
            <div className="release-layout">
              <Link
                className="release-lead"
                href={`/stories/${newReleaseLead.slug}`}
              >
                <Image
                  src={newReleaseLead.coverUrl}
                  alt={newReleaseLead.coverAlt}
                  fill
                  sizes="(max-width: 760px) 100vw, 50vw"
                />
                <div>
                  <span className="eyebrow">Newest arrival</span>
                  <h3>{newReleaseLead.title}</h3>
                  <p>{newReleaseLead.synopsisShort}</p>
                  <span>
                    {newReleaseLead.genreLabel} ·{" "}
                    {newReleaseLead.status === "COMPLETED"
                      ? "Complete"
                      : "Ongoing"}
                  </span>
                </div>
              </Link>
              <div className="release-list">
                {newReleaseList.map((story) => (
                  <Link key={story.id} href={`/stories/${story.slug}`}>
                    <Image
                      src={story.coverUrl}
                      alt=""
                      width={76}
                      height={104}
                    />
                    <div>
                      <span className="eyebrow muted">{story.genreLabel}</span>
                      <h3>{story.title}</h3>
                      <p>
                        {story.author.penName} · {story.chapterCount} chapters
                      </p>
                    </div>
                    <ArrowUpRight size={17} />
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : null}
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
        <section className="mood-section">
          <div className="section-line">
            <div>
              <span className="eyebrow muted">
                Discover something different
              </span>
              <h2 className="display-heading">What are you in the mood for?</h2>
              <p>Every great story begins with a feeling.</p>
            </div>
          </div>
          <div className="mood-grid">
            {[
              {
                title: "Dark & Mysterious",
                meta: "Secrets · Gothic · Suspense",
                slug: "the-house-beneath-the-stairs",
                query: "genre=horror&trope=haunted-house",
              },
              {
                title: "Cozy & Magical",
                meta: "Found family · Wholesome",
                slug: "the-lanterns-of-briar-row",
                query: "genre=slice-of-life&trope=botanical-magic",
              },
              {
                title: "Epic & Adventurous",
                meta: "Quests · Progression · LitRPG",
                slug: "the-crownless-tournament",
                query: "genre=litrpg&trope=tournament",
              },
              {
                title: "Twisted & Unpredictable",
                meta: "Thrillers · Plot twists",
                slug: "black-signal",
                query: "genre=thriller&trope=conspiracy",
              },
            ].map((mood) => (
              <Link
                key={mood.title}
                href={`/explore?${mood.query}`}
                className="mood-card"
              >
                <Image
                  src={`/mock/covers/${mood.slug}.webp`}
                  alt=""
                  fill
                  sizes="(max-width: 760px) 90vw, 25vw"
                />
                <div>
                  <h3>{mood.title}</h3>
                  <p>{mood.meta}</p>
                  <ArrowUpRight size={19} />
                </div>
              </Link>
            ))}
          </div>
        </section>
        {featuredStory ? (
          <section className="spotlight-section">
            <Image
              src="/mock/heroes/blood-orchard.webp"
              alt="The Blood Orchard story world"
              fill
              sizes="100vw"
            />
            <div className="spotlight-copy">
              <span className="eyebrow">
                Beyond the cover · Story spotlight 01
              </span>
              <h2>Some stories refuse to be forgotten.</h2>
              <p>
                Enter a world of vanished names, impossible promises, and an
                orchard that remembers everything.
              </p>
              <Link className="button" href={`/stories/${featuredStory.slug}`}>
                Explore The Blood Orchard <ArrowRight size={17} />
              </Link>
            </div>
          </section>
        ) : null}
        <section className="studio-band studio-cta">
          <div>
            <span className="eyebrow coral">For the storytellers</span>
            <h2>Every world starts with a word.</h2>
            <p>
              A quieter place to write, build worlds, and keep your story
              connected, from the first chapter to the last.
            </p>
          </div>
          <div>
            <Link className="button" href="/studio">
              Explore InkFlow Studio <ArrowRight size={17} />
            </Link>
            <span>Writing · Worldbuilding · Continuity</span>
          </div>
        </section>
      </main>
    </LibraryShell>
  );
}
