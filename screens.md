# InkFlow Public Library Screen Specifications

Version: 1.0  
Scope: First Public Library frontend screens  
Important boundary: These are the requested screens for the first Library build, not a permanent limit on future product scope.

## 1. Public Library Homepage

Route: `/`  
Purpose: Establish InkFlow Library as a cinematic fiction discovery destination and move readers toward a story quickly.

### Primary User Goals

- Understand that this is a global serialized fiction library.
- Search or browse by genre.
- Open a featured or trending story.
- Notice there is a separate Studio product without being pulled away too early.

### Layout

1. Header
2. Cinematic hero with `EXPLORE`
3. Genre navigation strip
4. Trending Now shelf
5. Fresh Ink shelf
6. Beyond the Genre editorial tiles
7. Completed Stories shelf
8. Subtle Studio CTA
9. Footer

### Hero Content

Display word: `EXPLORE`  
Tagline: `Stories beyond imagination.`  
Body: `Discover original serial fiction from independent voices around the world.`  
Primary CTA: `Start Reading`  
Secondary CTA: `Explore Genres`

Featured story example:

- Title: `Nocturne of the Fallen`
- Genre: Fantasy
- Rail copy: `Featured this week`

### Interactions

- Header search opens `/explore?q=...`.
- Genre click opens `/explore?genre=fantasy` or equivalent slug.
- Story cards link to `/stories/[storySlug]`.
- Save/follow icon can show a guest sign-in prompt later; for now it may be visually present with mock behavior.
- Shelf `View all` links to filtered Explore views.

### Empty/Loading States

- Use stable skeletons for cover cards.
- If a shelf has no content, hide the shelf rather than showing fake content.
- Do not fake community activity.

### Acceptance Criteria

- The first viewport clearly reads as an editorial fiction catalogue.
- The selected screenshot direction is recognizable: dark background, huge display word, hero art, genre nav, story shelf.
- `EXPLORE` does not clip at 320px.
- A user can click into a story within seconds.
- The Studio CTA is present but visually secondary.

## 2. Explore & Search

Route: `/explore`  
Purpose: Let readers search, filter, sort, and scan the full public catalog.

### Primary User Goals

- Search by title, author, tag, trope, or keyword.
- Filter by genre, trope, status, provenance, and completion state.
- Sort by latest update, trending, rating, newest, or completed.
- Open a story detail page.

### Layout

1. Header
2. Page title: `Explore Stories`
3. Search input with submitted query reflected in URL
4. Filter bar/sidebar
5. Active filter row
6. Results grid/list
7. Pagination or load more

### Filters

Genres:

- Fantasy
- Sci-Fi
- Romance
- Mystery
- Thriller
- LitRPG
- Horror
- Contemporary
- Slice of Life

Tropes:

- Found Family
- Court Intrigue
- Space Opera
- Slow Burn
- Locked Room
- Apocalypse
- Academy
- Heist
- Time Loop
- Second Chance

Status:

- Ongoing
- Completed
- Hiatus

Provenance:

- Human-written
- AI-assisted
- Unspecified

Sort:

- Latest Update
- Trending
- Highest Rated
- Newest
- Completed First

### Result Card Behavior

Each result should show:

- Cover thumbnail.
- Title.
- Author.
- Synopsis excerpt.
- Primary genre and key tropes.
- Status and chapter count.
- Latest chapter update.
- Rating summary if available.

### URL State

Search and filters must be shareable:

```txt
/explore?q=moon&genre=fantasy&status=ongoing&sort=latest
```

### Empty States

If no results match:

- Show `No stories match these filters.`
- Offer `Clear filters`.
- Keep the search box and filters visible.

### Acceptance Criteria

- Search/filter state survives refresh via URL.
- Results are usable as a grid on desktop and a compact list/grid on mobile.
- Filters are keyboard accessible.
- Mock data includes 20 diverse English-language fictional stories.
- No private Studio draft fields are shown.

## 3. Story Detail

Route: `/stories/[storySlug]`  
Purpose: Help a reader decide whether to start or continue a public published story.

### Primary User Goals

- Understand premise, genre, status, and author.
- Start reading from chapter 1 or continue.
- Browse chapters.
- See rating/review/follow states as mock if backend is absent.

### Layout

1. Header
2. Story hero/header with cover, title, author, genre, status, chapter count
3. Synopsis
4. Metadata row
5. Primary CTA: `Start Reading`
6. Secondary actions: `Follow`, `Add to Library`, `Share` as mock/client states
7. Chapter list
8. Rating/review preview in mock state
9. Related stories shelf or same-author stories if available
10. Footer

### Required Content

- Cover.
- Title.
- Author.
- Synopsis.
- Genre.
- Tags/tropes.
- Chapter listing.
- Start Reading button.
- Rating, reviews, and follow in mock state if backend is not built.

### Chapter List Fields

- Chapter number.
- Chapter title.
- Published date.
- Optional short teaser.
- Reading duration estimate.
- Lock state should not be used unless monetization rules exist.

### Mock States

Rating:

- Show average and count only from mock contract.
- Do not claim editorial validation.

Reviews:

- Show a mock preview area or "Reviews are coming soon" depending implementation choice.

Follow:

- Guest click opens a sign-in prompt later.
- Current FE-first prototype can toggle local state but must be clearly internal to mock data/contracts.

### Acceptance Criteria

- A new reader can find `Start Reading` immediately.
- Chapter links route to `/stories/[storySlug]/chapters/[chapterSlug]`.
- Synopsis and metadata are readable on mobile.
- No mutable Studio draft content appears.

## 4. Chapter Reader

Route: `/stories/[storySlug]/chapters/[chapterSlug]`  
Purpose: Provide a long-form reading experience optimized for comfort, progress, and navigation.

### Primary User Goals

- Read comfortably for a long session.
- Change theme and typography.
- Move to previous/next chapter.
- See reading progress.
- Return to table of contents/story detail.

### Layout

1. Minimal reader header
2. Story/chapter breadcrumb
3. Progress indicator
4. Reader settings controls
5. Chapter title and metadata
6. Chapter body
7. Previous/Next chapter navigation
8. Table of contents drawer or link

### Reader Defaults

Theme: Sepia  
Font: Serif  
Body size: 18px desktop, 17px mobile  
Line height: 1.75  
Max line length: 60-75 characters  
Content width: 680-760px depending font size

### Reader Settings

- Theme: Sepia, Dark, White
- Font: Serif, Sans
- Font size: small, default, large, extra large
- Line height: compact, default, relaxed
- Content width: narrow, default, wide

### Interactions

- Reading progress updates as the user scrolls.
- Settings persist in local storage.
- Previous/Next disabled at story boundaries.
- Keyboard focus remains visible in reader controls.
- Reduced motion respected.

### Content Rules

- No hero art inside the reading canvas.
- No autoplay effects.
- No floating AI animation.
- No busy background textures behind chapter text.
- Body paragraphs must remain selectable text.

### Acceptance Criteria

- Reading text is comfortable at 390px mobile and 1440px desktop.
- Theme switching does not cause illegible contrast.
- Progress indicator does not cover text.
- Previous/Next chapter navigation works from mock contract.
- Reader has no dependency on Canon Engine or Studio data.

## 5. Author Profile

Route: `/authors/[authorSlug]`  
Purpose: Show public author identity, bio, metadata, and published works without building a social network.

### Primary User Goals

- Learn who wrote a story.
- Browse the author's published works.
- See basic metadata.
- Return to story pages.

### Layout

1. Header
2. Author header with avatar, pen name, short bio
3. Public metadata
4. Published works shelf/grid
5. Optional profile links if verified and explicitly present in mock data
6. Footer

### Required Content

- Avatar.
- Pen name.
- Bio.
- Published story list.
- Basic profile metadata.

### Metadata Examples

- Joined year.
- Primary genres.
- Published works count.
- Total public chapters.
- Country/region only if author explicitly provides it in public profile data.

### Non-Goals For This Screen

- No complete social feed.
- No follower system implementation.
- No DM system.
- No author verification policy beyond mock-safe display fields.
- No private Studio workspace links.

### Acceptance Criteria

- Author profile reads as public-facing and safe.
- Story list links back to detail pages.
- Profile does not imply identity verification unless explicit data exists.
- Mobile layout is clear and not badge-heavy.

