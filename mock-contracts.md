# InkFlow Public Library Mock Contracts

Version: 1.0  
Scope: Typed mock data for FE-first Public Library build  
Language: English-first fictional content

## 1. Contract Principles

Mock data must behave like future production data:

- Use stable IDs and slugs.
- Keep public Library data separate from Studio draft data.
- Represent only approved published snapshots.
- Make mock-only fields explicit.
- Do not use real copyrighted story titles, real author identities, or fake legal claims.
- Keep rating, review, follow, and save as mock states until backend rules exist.

## 2. TypeScript Types

```ts
export type StoryStatus = "ONGOING" | "COMPLETED" | "HIATUS";

export type StoryProvenance = "HUMAN_WRITTEN" | "AI_ASSISTED" | "UNSPECIFIED";

export type PrimaryGenre =
  | "Fantasy"
  | "Sci-Fi"
  | "Romance"
  | "Mystery"
  | "Thriller"
  | "LitRPG"
  | "Horror"
  | "Contemporary"
  | "Slice of Life";

export interface RatingSummary {
  average: number;
  count: number;
  isMock: boolean;
}

export interface ReviewSummary {
  count: number;
  highlightedExcerpt?: string;
  isMock: boolean;
}

export interface AuthorSummary {
  id: string;
  slug: string;
  penName: string;
  avatarUrl: string;
}

export interface StorySummary {
  id: string;
  slug: string;
  title: string;
  author: AuthorSummary;
  coverUrl: string;
  coverAlt: string;
  primaryGenre: PrimaryGenre;
  genres: PrimaryGenre[];
  tropes: string[];
  tags: string[];
  status: StoryStatus;
  provenance: StoryProvenance;
  synopsisShort: string;
  chapterCount: number;
  latestChapterTitle: string;
  latestChapterSlug: string;
  lastPublishedAt: string;
  rating: RatingSummary;
  reviewSummary: ReviewSummary;
  isFeatured?: boolean;
  isTrending?: boolean;
  isFreshInk?: boolean;
  isCompletedShelf?: boolean;
}

export interface ChapterSummary {
  id: string;
  storyId: string;
  number: number;
  slug: string;
  title: string;
  publishedAt: string;
  estimatedMinutes: number;
  teaser?: string;
}

export interface StoryDetail extends StorySummary {
  synopsisLong: string;
  contentAdvisory?: string[];
  chapters: ChapterSummary[];
  mockFollowState: {
    isFollowing: boolean;
    isMock: true;
  };
}

export interface ChapterDetail extends ChapterSummary {
  story: Pick<StorySummary, "id" | "slug" | "title" | "author" | "primaryGenre">;
  bodyMarkdown: string;
  previousChapterSlug: string | null;
  nextChapterSlug: string | null;
}

export interface AuthorProfile {
  id: string;
  slug: string;
  penName: string;
  avatarUrl: string;
  bio: string;
  joinedYear: number;
  primaryGenres: PrimaryGenre[];
  publishedWorksCount: number;
  publicChapterCount: number;
  works: StorySummary[];
}

export interface StoryQueryParams {
  q?: string;
  genres?: PrimaryGenre[];
  tropes?: string[];
  status?: StoryStatus[];
  provenance?: StoryProvenance[];
  sort?: "latest" | "trending" | "rating" | "newest" | "completed";
  page?: number;
  pageSize?: number;
}

export interface StoryListResult {
  items: StorySummary[];
  total: number;
  page: number;
  pageSize: number;
}
```

## 3. Mock Authors

```ts
export const mockAuthors: AuthorSummary[] = [
  { id: "author-mira-vale", slug: "mira-vale", penName: "Mira Vale", avatarUrl: "/mock/avatars/mira-vale.jpg" },
  { id: "author-orion-kade", slug: "orion-kade", penName: "Orion Kade", avatarUrl: "/mock/avatars/orion-kade.jpg" },
  { id: "author-lena-cross", slug: "lena-cross", penName: "Lena Cross", avatarUrl: "/mock/avatars/lena-cross.jpg" },
  { id: "author-juno-wren", slug: "juno-wren", penName: "Juno Wren", avatarUrl: "/mock/avatars/juno-wren.jpg" },
  { id: "author-silas-noor", slug: "silas-noor", penName: "Silas Noor", avatarUrl: "/mock/avatars/silas-noor.jpg" },
  { id: "author-ivy-marlowe", slug: "ivy-marlowe", penName: "Ivy Marlowe", avatarUrl: "/mock/avatars/ivy-marlowe.jpg" },
  { id: "author-ren-ashford", slug: "ren-ashford", penName: "Ren Ashford", avatarUrl: "/mock/avatars/ren-ashford.jpg" },
  { id: "author-celia-voss", slug: "celia-voss", penName: "Celia Voss", avatarUrl: "/mock/avatars/celia-voss.jpg" }
];
```

## 4. Twenty Mock Stories

Use these as the first public catalog seed. All names are fictional.

| # | Title | Slug | Author | Genre | Status | Tropes | Provenance |
|---:|---|---|---|---|---|---|---|
| 1 | Nocturne of the Fallen | `nocturne-of-the-fallen` | Mira Vale | Fantasy | Ongoing | Fallen Kingdom, Forbidden Magic, Reluctant Heir | AI-assisted |
| 2 | The Silent Blade | `the-silent-blade` | Orion Kade | Fantasy | Ongoing | Assassin, Court Intrigue, Found Family | Human-written |
| 3 | Echoes of Aethel | `echoes-of-aethel` | Juno Wren | Sci-Fi | Ongoing | Ancient Signal, First Contact, Lost Colony | AI-assisted |
| 4 | The Crimson Heir | `the-crimson-heir` | Lena Cross | Romance | Ongoing | Royal Secret, Slow Burn, Enemies to Lovers | Human-written |
| 5 | Lord of Ashes | `lord-of-ashes` | Silas Noor | Fantasy | Completed | Dark Lord, Redemption, War Aftermath | Unspecified |
| 6 | Requiem Protocol | `requiem-protocol` | Ren Ashford | Thriller | Ongoing | Rogue AI, Conspiracy, Countdown | AI-assisted |
| 7 | The Glass Orchard | `the-glass-orchard` | Ivy Marlowe | Mystery | Completed | Locked Room, Family Secrets, Estate Mystery | Human-written |
| 8 | Starfall Cartographers | `starfall-cartographers` | Celia Voss | Sci-Fi | Ongoing | Space Opera, Mapmakers, Political Factions | AI-assisted |
| 9 | A Bakery at the End of Rain | `a-bakery-at-the-end-of-rain` | Mira Vale | Slice of Life | Ongoing | Small Town, Healing, Found Family | Human-written |
| 10 | Dungeon of Second Chances | `dungeon-of-second-chances` | Orion Kade | LitRPG | Ongoing | Dungeon Core, Leveling, Time Loop | AI-assisted |
| 11 | The Last Lighthouse Witch | `the-last-lighthouse-witch` | Juno Wren | Fantasy | Completed | Coastal Magic, Chosen One, Old Curse | Human-written |
| 12 | Paper Moons Over Delphi | `paper-moons-over-delphi` | Celia Voss | Contemporary | Ongoing | Literary, Sisters, Inheritance | Unspecified |
| 13 | Signal Black | `signal-black` | Ren Ashford | Horror | Ongoing | Haunted Broadcast, Isolation, Cosmic Dread | Human-written |
| 14 | The Velvet Equation | `the-velvet-equation` | Ivy Marlowe | Romance | Completed | Academic Rivals, Second Chance, Slow Burn | Human-written |
| 15 | Iron Garden Rebellion | `iron-garden-rebellion` | Silas Noor | Sci-Fi | Ongoing | Bioengineering, Resistance, City State | AI-assisted |
| 16 | Murders in the Clockwork Rain | `murders-in-the-clockwork-rain` | Lena Cross | Mystery | Completed | Detective, Steampunk, Serial Case | Human-written |
| 17 | Crownless at Dawn | `crownless-at-dawn` | Mira Vale | Fantasy | Hiatus | Exile, Prophecy, Political Intrigue | Unspecified |
| 18 | Neon Saints Never Sleep | `neon-saints-never-sleep` | Ren Ashford | Thriller | Ongoing | Cyberpunk, Heist, Undercover | AI-assisted |
| 19 | The Orchard Where Stars Grow | `the-orchard-where-stars-grow` | Juno Wren | Contemporary | Completed | Magical Realism, Grief, Community | Human-written |
| 20 | Raid Party Etiquette | `raid-party-etiquette` | Orion Kade | LitRPG | Ongoing | Guild Drama, Comedy, Progression | Human-written |

## 5. Story Seed Objects

The implementation can expand these rows into full objects. Minimum object shape:

```ts
export const mockStories: StorySummary[] = [
  {
    id: "story-nocturne-of-the-fallen",
    slug: "nocturne-of-the-fallen",
    title: "Nocturne of the Fallen",
    author: {
      id: "author-mira-vale",
      slug: "mira-vale",
      penName: "Mira Vale",
      avatarUrl: "/mock/avatars/mira-vale.jpg"
    },
    coverUrl: "/mock/covers/nocturne-of-the-fallen.jpg",
    coverAlt: "Cover art for Nocturne of the Fallen by Mira Vale",
    primaryGenre: "Fantasy",
    genres: ["Fantasy"],
    tropes: ["Fallen Kingdom", "Forbidden Magic", "Reluctant Heir"],
    tags: ["dark fantasy", "political intrigue", "magic"],
    status: "ONGOING",
    provenance: "AI_ASSISTED",
    synopsisShort: "A disgraced heir follows a forbidden song through the ruins of a kingdom that refuses to stay dead.",
    chapterCount: 34,
    latestChapterTitle: "The Bell Beneath the Citadel",
    latestChapterSlug: "the-bell-beneath-the-citadel",
    lastPublishedAt: "2026-10-08T18:30:00.000Z",
    rating: { average: 4.7, count: 1284, isMock: true },
    reviewSummary: {
      count: 214,
      highlightedExcerpt: "A brooding, elegant fantasy with a sharp sense of consequence.",
      isMock: true
    },
    isFeatured: true,
    isTrending: true,
    isFreshInk: true
  }
];
```

## 6. Required Synopsis Seeds

Use these short synopses for cards and search results:

1. Nocturne of the Fallen: A disgraced heir follows a forbidden song through the ruins of a kingdom that refuses to stay dead.
2. The Silent Blade: An exiled assassin enters a royal tournament where every victory reveals another layer of the court's betrayal.
3. Echoes of Aethel: A cartographer of dead planets receives a signal from a civilization that vanished before humanity learned to fly.
4. The Crimson Heir: A secret princess and the captain sworn to arrest her must cross a collapsing empire together.
5. Lord of Ashes: After the final battle, the defeated dark lord wakes as the only person who remembers what really destroyed the world.
6. Requiem Protocol: A security analyst discovers an emergency protocol that predicts murders before anyone commits them.
7. The Glass Orchard: At a sealed countryside estate, every branch of a glass orchard preserves a different version of the same death.
8. Starfall Cartographers: Rival mapmakers chart unstable wormholes while three governments race to own the sky between worlds.
9. A Bakery at the End of Rain: A runaway chef inherits a seaside bakery where every recipe returns one memory to the person who eats it.
10. Dungeon of Second Chances: A failed raid leader wakes at level one with one rule: save the party that betrayed him.
11. The Last Lighthouse Witch: The last witch on a storm-bitten coast must keep a cursed lighthouse burning for ships from two worlds.
12. Paper Moons Over Delphi: Two estranged sisters return home to divide an inheritance and uncover the letters their mother hid in plain sight.
13. Signal Black: A night-shift host receives calls from listeners who disappeared decades earlier.
14. The Velvet Equation: Two rival mathematicians reunite at a winter institute where old proofs and old feelings refuse to stay buried.
15. Iron Garden Rebellion: In a city grown from engineered trees and steel, a gardener discovers the roots are listening.
16. Murders in the Clockwork Rain: A detective hunts a killer who times each murder to a mechanical storm.
17. Crownless at Dawn: An exiled prince without an army returns to a homeland that has learned to survive without kings.
18. Neon Saints Never Sleep: A courier joins a cathedral heist in a city where saints are brands and miracles are encrypted.
19. The Orchard Where Stars Grow: A grieving teacher finds a rural orchard where fallen stars ripen into impossible second chances.
20. Raid Party Etiquette: A polite support mage tries to keep the most chaotic raid party on the server from becoming legends for the wrong reasons.

## 7. Mock Chapter Contract

Each story should have at least 5 mock chapter summaries for UI work. The featured story should have a complete chapter body for the Reader.

Example for `Nocturne of the Fallen`:

```ts
export const nocturneChapters: ChapterSummary[] = [
  {
    id: "chapter-nocturne-001",
    storyId: "story-nocturne-of-the-fallen",
    number: 1,
    slug: "the-song-in-the-ruins",
    title: "The Song in the Ruins",
    publishedAt: "2026-08-01T10:00:00.000Z",
    estimatedMinutes: 12,
    teaser: "A forbidden melody leads Elian back to the city that erased his name."
  },
  {
    id: "chapter-nocturne-002",
    storyId: "story-nocturne-of-the-fallen",
    number: 2,
    slug: "ashes-under-glass",
    title: "Ashes Under Glass",
    publishedAt: "2026-08-03T10:00:00.000Z",
    estimatedMinutes: 10,
    teaser: "The first relic answers, but not in a language meant for the living."
  },
  {
    id: "chapter-nocturne-003",
    storyId: "story-nocturne-of-the-fallen",
    number: 3,
    slug: "the-bell-beneath-the-citadel",
    title: "The Bell Beneath the Citadel",
    publishedAt: "2026-10-08T18:30:00.000Z",
    estimatedMinutes: 14,
    teaser: "Beneath the old throne room, a bell rings for a monarch no one crowned."
  }
];
```

## 8. Mock Reader Body

Use public-domain-safe original placeholder prose. Keep enough paragraphs to test long reading width, rhythm, progress, and navigation.

```md
The first note rose from beneath the broken avenue, thin as a blade drawn from silk.

Elian stopped with one hand on the rain-black wall. Around him, the dead capital held its breath. Roofless towers leaned toward the moon. Vines moved through windows where ministers had once whispered taxes and treasons. Somewhere below the stones, the song repeated itself, patient and exact.

No one in the border villages admitted the city still had a voice. They called it wind, old plumbing, grief caught in the tunnels. But Elian had grown up behind the citadel gates. He knew the difference between a rumor and a summons.

The second note found the scar beneath his collarbone.

He pressed his palm against it until the pain steadied him. "I heard you," he said.

The city answered with a bell.
```

## 9. Author Profile Contract

```ts
export const miraValeProfile: AuthorProfile = {
  id: "author-mira-vale",
  slug: "mira-vale",
  penName: "Mira Vale",
  avatarUrl: "/mock/avatars/mira-vale.jpg",
  bio: "Mira Vale writes atmospheric fantasy and quiet speculative stories about memory, inheritance, and worlds that keep their own accounts.",
  joinedYear: 2026,
  primaryGenres: ["Fantasy", "Slice of Life"],
  publishedWorksCount: 3,
  publicChapterCount: 71,
  works: []
};
```

## 10. Mock Repository Behavior

Required functions:

```ts
export async function listStories(params: StoryQueryParams): Promise<StoryListResult>;
export async function getStoryBySlug(slug: string): Promise<StoryDetail | null>;
export async function getChapterBySlug(storySlug: string, chapterSlug: string): Promise<ChapterDetail | null>;
export async function getAuthorBySlug(slug: string): Promise<AuthorProfile | null>;
```

Behavior:

- `listStories` filters by query, genre, trope, status, provenance, and sort.
- `getStoryBySlug` returns full synopsis and chapter summaries.
- `getChapterBySlug` returns body, previous slug, and next slug.
- `getAuthorBySlug` returns public profile and public works.

Sorting:

- `latest`: newest `lastPublishedAt` first.
- `trending`: `isTrending` first, then rating count.
- `rating`: average rating first, then count.
- `newest`: newest story creation date if added later; for now use last published date.
- `completed`: completed first, then latest.

## 11. FE Mock Warnings

These are mock-only until backend rules exist:

- Ratings.
- Review counts.
- Follow state.
- Save/add-to-library state.
- Trending order.
- Featured selection.
- Provenance labels unless explicitly encoded in story data.

Do not present these as verified production truth in documentation or UI copy.

