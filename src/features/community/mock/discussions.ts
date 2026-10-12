import type {
  DiscussionDetail,
  WeeklyPrompt,
} from "../types/community";

/** Honest demo flag for community mock fixtures */
export const COMMUNITY_ARE_DEMO = true;

/** Curated weekly editorial prompt ("Question of the Week") */
export const mockWeeklyPrompt: WeeklyPrompt = {
  id: "prompt-001",
  question: "What makes a fictional world feel genuinely inhabited rather than constructed?",
  description:
    "Is it the mundane details—the price of tea, the smell of damp coats—or the unsaid history between background characters? Share a scene from an InkFlow story that made you forget you were reading fiction.",
  activeWeek: "2026-W41",
  isMock: true,
};

/** Curated mock discussion threads anchored in published Library stories */
export const mockDiscussions: DiscussionDetail[] = [
  {
    id: "disc-001",
    slug: "was-returning-ever-a-choice",
    title: "Was returning to the orchard ever a choice?",
    category: "CHARACTER_DISCUSSION",
    author: {
      displayName: "Julian Vance",
      slug: null,
      isMock: true,
    },
    storyRef: {
      storyId: "story-001",
      storySlug: "the-blood-orchard",
      storyTitle: "The Blood Orchard",
      coverUrl: "/mock/covers/the-blood-orchard.webp",
      coverAlt: "Original illustration for The Blood Orchard",
      primaryGenre: "Fantasy",
      chapterSlug: "chapter-3",
      chapterNumber: 3,
      chapterTitle: "The Door That Remembers",
    },
    spoilerScope: {
      storySlug: "the-blood-orchard",
      storyTitle: "The Blood Orchard",
      throughChapterNumber: 3,
      throughChapterTitle: "Chapter 3",
    },
    excerpt:
      "A conversation about memory, obligation, and the choices that shape a character.",
    bodyMarkdown:
      "When Elian returns to the orchard in Chapter 3 (\"The Door That Remembers\"), the text deliberately contrasts his conscious intent with the landscape's cold familiarity. The voice calling from beyond the sealed door doesn't sound hostile; it sounds like an overdue creditor waiting on a settled account.\n\nWhat strikes me most is how Voss handles culpability here. Was Elian's return ever truly a free choice, or did his mother's death seal the outcome before the first page opened? The physical details—the frozen latch, the salt across the threshold—suggest an architecture designed to compel rather than invite.\n\nI want to hear from other readers who have reached Chapter 3: do you read Elian's compliance as grief-stricken exhaustion, or the first stage of an inheritance he already understands too well?",
    replyCount: 3,
    replies: [
      {
        id: "reply-001-1",
        author: { displayName: "Rowan K.", slug: null, isMock: true },
        bodyMarkdown:
          "I read it as exhaustion first. He spent three years trying to forget the smell of frozen apples; when the lawyer arrived with the brass key, the silence in his Edinburgh flat was simply louder than the orchard.",
        createdAt: "2026-10-08T15:12:00.000Z",
        moderationState: "VISIBLE",
        spoilerScope: null,
        isMock: true,
      },
      {
        id: "reply-001-2",
        author: { displayName: "Evelyn Reed", slug: null, isMock: true },
        bodyMarkdown:
          "Notice the threshold ritual, though. He doesn't just step inside—he waits until the lock turns itself. There's a subtle surrender in Chapter 3 that makes me think he knows exactly whose name is inscribed on the trees.",
        createdAt: "2026-10-08T16:45:00.000Z",
        moderationState: "VISIBLE",
        spoilerScope: null,
        isMock: true,
      },
      {
        id: "reply-001-3",
        author: { displayName: "OrchardWatcher", slug: null, isMock: true },
        bodyMarkdown:
          "The key sentence for me is: 'A door that remembers is only dangerous if you pretend you are a guest.' That proves he knows this isn't a shelter—it's an exchange.",
        createdAt: "2026-10-08T18:20:00.000Z",
        moderationState: "VISIBLE",
        spoilerScope: null,
        isMock: true,
      },
    ],
    createdAt: "2026-10-08T14:30:00.000Z",
    isFeatured: true,
    moderationState: "VISIBLE",
    isMock: true,
  },
  {
    id: "disc-002",
    slug: "a-world-i-didnt-want-to-leave",
    title: "A world I didn't want to leave: On dream-cartography and pacing",
    category: "READER_REVIEW",
    author: {
      displayName: "Cassian Croft",
      slug: null,
      isMock: true,
    },
    storyRef: {
      storyId: "story-003",
      storySlug: "a-map-for-moonlight",
      storyTitle: "A Map for Moonlight",
      coverUrl: "/mock/covers/a-map-for-moonlight.webp",
      coverAlt: "Original illustration for A Map for Moonlight",
      primaryGenre: "Romance",
      chapterSlug: "chapter-2",
      chapterNumber: 2,
      chapterTitle: "A Prince Without Dreams",
    },
    spoilerScope: null,
    excerpt:
      "A reader review praising the dream-cartography premise, emotional restraint, and slow-burn pacing.",
    bodyMarkdown:
      "*A Map for Moonlight* achieves something rare in modern serialized fantasy: it trusts the reader to sit in quiet spaces. Mira's ability to map only the places she has dreamed about creates an immediate, poetic constraint.\n\nWhen the sleepless prince asks her to guide him through the mountain pass in Chapter 2, the story avoids bombastic stakes in favor of exquisite emotional friction. The prose has the precision of fresh ink on vellum. If you enjoy slow-burn fantasy with deep atmospheric texture, this is an absolute triumph.",
    replyCount: 2,
    replies: [
      {
        id: "reply-002-1",
        author: { displayName: "Talia Brooks", slug: null, isMock: true },
        bodyMarkdown:
          "Completely agree about the restraint. The campfire scene where he turns the pebble between his fingers while she sleeps told me more about his loneliness than twenty pages of backstory.",
        createdAt: "2026-10-09T09:15:00.000Z",
        moderationState: "VISIBLE",
        spoilerScope: null,
        isMock: true,
      },
      {
        id: "reply-002-2",
        author: { displayName: "Arthur Pendelton", slug: null, isMock: true },
        bodyMarkdown:
          "The way dream terrain responds to ink and shadow feels like classic Le Guin. It's gentle without ever feeling lightweight.",
        createdAt: "2026-10-09T11:40:00.000Z",
        moderationState: "VISIBLE",
        spoilerScope: null,
        isMock: true,
      },
    ],
    createdAt: "2026-10-09T08:00:00.000Z",
    isFeatured: false,
    moderationState: "VISIBLE",
    isMock: true,
  },
  {
    id: "disc-003",
    slug: "what-makes-a-machine-remember-grief",
    title: "What makes a machine remember grief? The salvage logs examined",
    category: "WORLD_AND_LORE",
    author: {
      displayName: "Dr. Alistair Thorne",
      slug: null,
      isMock: true,
    },
    storyRef: {
      storyId: "story-002",
      storySlug: "the-quiet-machine-at-dawn",
      storyTitle: "The Quiet Machine at Dawn",
      coverUrl: "/mock/covers/the-quiet-machine-at-dawn.webp",
      coverAlt: "Original illustration for The Quiet Machine at Dawn",
      primaryGenre: "Sci-Fi",
      chapterSlug: "chapter-1",
      chapterNumber: 1,
      chapterTitle: "An Object Without a Name",
    },
    spoilerScope: {
      storySlug: "the-quiet-machine-at-dawn",
      storyTitle: "The Quiet Machine at Dawn",
      throughChapterNumber: 1,
      throughChapterTitle: "Chapter 1",
    },
    excerpt:
      "Lore analysis of the salvage beacon, maternal logs, and mechanical sensory archives.",
    bodyMarkdown:
      "The opening salvage sequence in *The Quiet Machine at Dawn* is a masterclass in sci-fi mood. The machine isn't an alien supercomputer or an apocalyptic weapon; it's an archive of sensory moments—the smell of oranges, wool against a wrist, rain on a kitchen floor.\n\nWhy did the mother leave a green pencil in the chamber? The archive polished away every name, but preserved the physical feeling of loss. It feels less like artificial intelligence and more like a tomb built by someone who wanted to be remembered without being blamed.",
    replyCount: 2,
    replies: [
      {
        id: "reply-003-1",
        author: { displayName: "Selene Wu", slug: null, isMock: true },
        bodyMarkdown:
          "The detail about the orange smell in the airlock broke my heart. It's the exact olfactory trace from her childhood kitchen before her father walked out.",
        createdAt: "2026-10-09T14:20:00.000Z",
        moderationState: "VISIBLE",
        spoilerScope: null,
        isMock: true,
      },
      {
        id: "reply-003-2",
        author: { displayName: "Nico Garza", slug: null, isMock: true },
        bodyMarkdown:
          "I think the machine isn't recording human memory—it's being kept alive by it. Notice the line: 'It asked whether Lena knew what it meant to be kept alive by someone else's recollection.'",
        createdAt: "2026-10-09T16:05:00.000Z",
        moderationState: "VISIBLE",
        spoilerScope: null,
        isMock: true,
      },
    ],
    createdAt: "2026-10-09T13:10:00.000Z",
    isFeatured: false,
    moderationState: "VISIBLE",
    isMock: true,
  },
  {
    id: "disc-004",
    slug: "the-missing-hour-in-room-seven",
    title: "The missing hour in room seven: Who turned the timer?",
    category: "THEORY_AND_PREDICTION",
    author: {
      displayName: "Mina Sterling",
      slug: null,
      isMock: true,
    },
    storyRef: {
      storyId: "story-005",
      storySlug: "snowfall-at-room-seven",
      storyTitle: "Snowfall at Room Seven",
      coverUrl: "/mock/covers/snowfall-at-room-seven.webp",
      coverAlt: "Original illustration for Snowfall at Room Seven",
      primaryGenre: "Mystery",
      chapterSlug: "chapter-3",
      chapterNumber: 3,
      chapterTitle: "The Missing Hour",
    },
    spoilerScope: {
      storySlug: "snowfall-at-room-seven",
      storyTitle: "Snowfall at Room Seven",
      throughChapterNumber: 3,
      throughChapterTitle: "Chapter 3",
    },
    excerpt:
      "Theory debate on who altered the kitchen timer and why the seventh room locked from inside.",
    bodyMarkdown:
      "By Chapter 3, the timeline of *Snowfall at Room Seven* splits into two irreconcilable narratives. The clocks throughout the inn differ by exactly sixty minutes, and both the cook and the manager point to the burned soup as evidence for opposite timelines.\n\nMy theory: the missing woman never arrived on the evening coach at all. The footprints arriving at room seven with the nick in the left heel belong to someone already inside before the snow began. What do you make of the warm glove on the sill?",
    replyCount: 3,
    replies: [
      {
        id: "reply-004-1",
        author: { displayName: "Gideon Cross", slug: null, isMock: true },
        bodyMarkdown:
          "The glove was dry despite snow on the sill. That means someone placed it there *after* the window was closed, from inside the room.",
        createdAt: "2026-10-10T10:30:00.000Z",
        moderationState: "VISIBLE",
        spoilerScope: null,
        isMock: true,
      },
      {
        id: "reply-004-2",
        author: { displayName: "Claire Bennett", slug: null, isMock: true },
        bodyMarkdown:
          "Also pay attention to the plow driver at the end of Chapter 3. He knocked on the window at seven, but nobody heard him because the generator had already been tampered with.",
        createdAt: "2026-10-10T12:15:00.000Z",
        moderationState: "VISIBLE",
        spoilerScope: null,
        isMock: true,
      },
      {
        id: "reply-004-3",
        author: { displayName: "Felix Vance", slug: null, isMock: true },
        bodyMarkdown:
          "The manager pocketing the second emergency candle in Chapter 1 is the smoking gun. He knew the blackout was coming.",
        createdAt: "2026-10-10T14:50:00.000Z",
        moderationState: "VISIBLE",
        spoilerScope: null,
        isMock: true,
      },
    ],
    createdAt: "2026-10-10T09:45:00.000Z",
    isFeatured: false,
    moderationState: "VISIBLE",
    isMock: true,
  },
  {
    id: "disc-005",
    slug: "the-price-of-soap-and-second-chances",
    title: "The price of soap and second chances: Grounded progression fantasy",
    category: "CHARACTER_DISCUSSION",
    author: {
      displayName: "Felix Carver",
      slug: null,
      isMock: true,
    },
    storyRef: {
      storyId: "story-006",
      storySlug: "the-alchemists-second-life",
      storyTitle: "The Alchemist's Second Life",
      coverUrl: "/mock/covers/the-alchemists-second-life.webp",
      coverAlt: "Original illustration for The Alchemist's Second Life",
      primaryGenre: "LitRPG",
      chapterSlug: "chapter-2",
      chapterNumber: 2,
      chapterTitle: "A Recipe for Nothing",
    },
    spoilerScope: null,
    excerpt:
      "Commentary on progression fantasy with grounded, non-heroic protagonists and sensible stakes.",
    bodyMarkdown:
      "Progression fantasy often rushes protagonist power scaling into godhood by chapter ten. What makes Tomas refreshing is his radical lack of ambition. After a lifetime of high alchemy that ended in disaster, his highest aspiration is measuring reagents with steady hands and making soap that removes hereditary curses.\n\nThe dynamic with the inspector in Chapter 2 anchors the world in mundane bureaucracy. It turns fantasy into a trade craft, which makes every small revelation feel earned.",
    replyCount: 1,
    replies: [
      {
        id: "reply-005-1",
        author: { displayName: "Corin Hayes", slug: null, isMock: true },
        bodyMarkdown:
          "'Remedies, repairs, reasonable expectations.' That sign should be the motto of every cozy fantasy novel. Tomas's weary competence is so much more fun to read than chosen-one angst.",
        createdAt: "2026-10-10T16:20:00.000Z",
        moderationState: "VISIBLE",
        spoilerScope: null,
        isMock: true,
      },
    ],
    createdAt: "2026-10-10T15:00:00.000Z",
    isFeatured: false,
    moderationState: "VISIBLE",
    isMock: true,
  },
  {
    id: "disc-006",
    slug: "why-we-read-places-instead-of-endings",
    title: "Why we read places instead of endings: Atmosphere in serial fiction",
    category: "GENERAL",
    author: {
      displayName: "Beatrice Finch",
      slug: null,
      isMock: true,
    },
    storyRef: null,
    spoilerScope: null,
    excerpt:
      "A reflection on atmospheric serial fiction that prioritizes architectural mood over rapid resolution.",
    bodyMarkdown:
      "Across several stories in the InkFlow Library—from Marrow House in *The House Beneath the Stairs* to the shifting coastlines in *The Saltwind Atlas*—the physical setting acts as an active character rather than a backdrop.\n\nDo you find yourself returning to serialized fiction for the resolution of the mystery, or simply to spend twenty minutes inside a specific room or weather pattern? For me, the atmosphere of waiting in an abandoned inn or walking a frosted orchard is the real draw.",
    replyCount: 2,
    replies: [
      {
        id: "reply-006-1",
        author: { displayName: "Leo Martinez", slug: null, isMock: true },
        bodyMarkdown:
          "Always the weather and the rooms. A strong atmosphere makes you forgive slow plot pacing, but a fast plot with generic rooms leaves no memory after you close the tab.",
        createdAt: "2026-10-11T09:10:00.000Z",
        moderationState: "VISIBLE",
        spoilerScope: null,
        isMock: true,
      },
      {
        id: "reply-006-2",
        author: { displayName: "Hannah Zhao", slug: null, isMock: true },
        bodyMarkdown:
          "Serial fiction especially thrives on this. You visit the story once a week like a second apartment. The architecture matters more than the climax.",
        createdAt: "2026-10-11T10:45:00.000Z",
        moderationState: "VISIBLE",
        spoilerScope: null,
        isMock: true,
      },
    ],
    createdAt: "2026-10-11T08:30:00.000Z",
    isFeatured: false,
    moderationState: "VISIBLE",
    isMock: true,
  },
  {
    id: "disc-007",
    slug: "the-architecture-of-slow-horror",
    title: "The architecture of slow horror: How Marrow House disorients the reader",
    category: "READER_REVIEW",
    author: {
      displayName: "Dante Althaus",
      slug: null,
      isMock: true,
    },
    storyRef: {
      storyId: "story-004",
      storySlug: "the-house-beneath-the-stairs",
      storyTitle: "The House Beneath the Stairs",
      coverUrl: "/mock/covers/the-house-beneath-the-stairs.webp",
      coverAlt: "Original illustration for The House Beneath the Stairs",
      primaryGenre: "Horror",
      chapterSlug: "chapter-1",
      chapterNumber: 1,
      chapterTitle: "Four Floors, Certainly",
    },
    spoilerScope: null,
    excerpt:
      "Review analyzing the disorienting floor counts, shifting stairs, and creeping spatial dread.",
    bodyMarkdown:
      "*The House Beneath the Stairs* doesn't rely on jump scares or gore; it unsettles through simple arithmetic. Four floors according to the landlady, five according to the postman, six windows counted from the garden that become three upon re-inspection.\n\nRowan Kade understands that true dread comes from things that almost fit together. The detail where June's lease has a clause added in handwriting she almost recognizes gave me chills. Essential reading for fans of house-as-organism horror.",
    replyCount: 2,
    replies: [
      {
        id: "reply-007-1",
        author: { displayName: "Vera Holst", slug: null, isMock: true },
        bodyMarkdown:
          "The staircase with thirteen steps that stretches past twenty when you start descending is classic liminal horror executed with surgical precision.",
        createdAt: "2026-10-11T12:00:00.000Z",
        moderationState: "VISIBLE",
        spoilerScope: null,
        isMock: true,
      },
      {
        id: "reply-007-2",
        author: { displayName: "Marcus Kane", slug: null, isMock: true },
        bodyMarkdown:
          "'You may leave whenever the house agrees.' That single line is easily the best premise hook in the whole horror catalogue.",
        createdAt: "2026-10-11T13:30:00.000Z",
        moderationState: "VISIBLE",
        spoilerScope: null,
        isMock: true,
      },
    ],
    createdAt: "2026-10-11T11:15:00.000Z",
    isFeatured: false,
    moderationState: "VISIBLE",
    isMock: true,
  },
  {
    id: "disc-008",
    slug: "the-twenty-fifth-place-setting",
    title: "The twenty-fifth place setting: Who is the winter feast waiting for?",
    category: "THEORY_AND_PREDICTION",
    author: {
      displayName: "Valerie Cole",
      slug: null,
      isMock: true,
    },
    storyRef: {
      storyId: "story-001",
      storySlug: "the-blood-orchard",
      storyTitle: "The Blood Orchard",
      coverUrl: "/mock/covers/the-blood-orchard.webp",
      coverAlt: "Original illustration for The Blood Orchard",
      primaryGenre: "Fantasy",
      chapterSlug: "chapter-4",
      chapterNumber: 4,
      chapterTitle: "The Winter Room",
    },
    spoilerScope: {
      storySlug: "the-blood-orchard",
      storyTitle: "The Blood Orchard",
      throughChapterNumber: 4,
      throughChapterTitle: "Chapter 4",
    },
    excerpt:
      "Second Blood Orchard theory debate on the twenty-fourth heir and the raw horn setting.",
    bodyMarkdown:
      "In Chapter 4 (\"The Winter Room\"), Elian uncovers the frozen dining hall with twenty-four place settings laid with silver and one setting laid with raw horn. If the orchard family line had twenty-four registered inheritors before Elian, who was the twenty-fifth setting laid for?\n\nMy theory: the horn setting isn't for a descendant at all—it's for the thing beneath the roots that provided the original bloodline covenant. When Elian touches the goblet, it isn't cold; it's body temperature. What do you think?",
    replyCount: 2,
    replies: [
      {
        id: "reply-008-1",
        author: { displayName: "Simon Drake", slug: null, isMock: true },
        bodyMarkdown:
          "Notice that the horn setting doesn't have a chair. It has a stone mounting bracket built directly into the floor. Whatever sits there doesn't have legs.",
        createdAt: "2026-10-11T15:20:00.000Z",
        moderationState: "VISIBLE",
        spoilerScope: null,
        isMock: true,
      },
      {
        id: "reply-008-2",
        author: { displayName: "Kaelen Ross", slug: null, isMock: true },
        bodyMarkdown:
          "And in Chapter 2, his mother's ledger mentioned 'the uninvited guest who arrived first.' That confirms the twenty-fifth entity predates the orchard manor.",
        createdAt: "2026-10-11T16:00:00.000Z",
        moderationState: "VISIBLE",
        spoilerScope: null,
        isMock: true,
      },
    ],
    createdAt: "2026-10-11T14:40:00.000Z",
    isFeatured: false,
    moderationState: "VISIBLE",
    isMock: true,
  },
];
