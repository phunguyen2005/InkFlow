# InkFlow Public Library Frontend Architecture

Version: 1.0  
Scope: FE-first architecture for Public Library  
Stack: Next.js App Router, TypeScript, Tailwind CSS

## 1. Architecture Goal

The goal is to build a frontend that can start with typed mock data and later connect to Supabase without rewriting routes, component boundaries, or data shapes.

The first build should validate:

- Discovery experience.
- Search/filter ergonomics.
- Story evaluation flow.
- Long-form reader comfort.
- Public author profile usefulness.

It should not validate Studio, Canon Engine, AI generation, moderation operations, billing, or community systems.

## 2. Route Structure

```txt
app/
  layout.tsx
  globals.css
  (public)/
    layout.tsx
    page.tsx
    explore/
      page.tsx
    stories/
      [storySlug]/
        page.tsx
        chapters/
          [chapterSlug]/
            page.tsx
    authors/
      [authorSlug]/
        page.tsx
```

Route responsibilities:

- `/`: editorial discovery and shelves.
- `/explore`: searchable/filterable public catalog.
- `/stories/[storySlug]`: story detail from approved published story data.
- `/stories/[storySlug]/chapters/[chapterSlug]`: immutable published chapter reader.
- `/authors/[authorSlug]`: public author profile and published works.

## 3. Suggested Directory Structure

```txt
src/
  app/
  features/
    library/
      components/
        navigation/
        discovery/
        search/
        story/
        reader/
        author/
      data/
        library.repository.ts
        mock-library.repository.ts
      mock/
        stories.ts
        chapters.ts
        authors.ts
      types/
        library.ts
        filters.ts
      utils/
        filters.ts
        formatting.ts
        reading-time.ts
  components/
    ui/
  styles/
    tokens.css
```

## 4. Server And Client Component Split

Default to server components for:

- Homepage shelves.
- Explore initial results.
- Story detail content.
- Chapter body.
- Author profile.
- SEO metadata.

Use client components for:

- Mobile menu.
- Search input typing and suggestions.
- Filter controls.
- Save/follow local mock actions.
- Reader settings.
- Reading progress.
- Preview dialogs/drawers.

Keep client components small and leaf-oriented.

## 5. Data Access Pattern

Use a repository interface from day one:

```ts
export interface LibraryRepository {
  listStories(params: StoryQueryParams): Promise<StoryListResult>;
  getStoryBySlug(slug: string): Promise<StoryDetail | null>;
  getChapterBySlug(storySlug: string, chapterSlug: string): Promise<ChapterDetail | null>;
  getAuthorBySlug(slug: string): Promise<AuthorProfile | null>;
}
```

Initial implementation:

```txt
mock-library.repository.ts
```

Future implementation:

```txt
supabase-library.repository.ts
```

The UI should not import raw mock arrays directly except in tests/stories. Pages call repository functions so the backend migration is boring.

## 6. Public Data Boundary

Library data must be modeled as public approved snapshots:

- `publishedStory`
- `publishedChapter`
- `publicAuthorProfile`

Do not model the frontend around private Studio draft objects. The public app may show a story's provenance, genre, status, and published chapter list, but it must not expose:

- Draft body.
- Draft revision history.
- Canon facts.
- Author notes.
- Moderation notes.
- Internal trust/risk score.
- Private cost or AI-generation metadata.

## 7. State Management

Use URL state for:

- Search query.
- Genre.
- Tropes.
- Status.
- Sort.
- Pagination.

Use local component state for:

- Open/closed menus.
- Temporary filter panel state before apply.
- Mock saved/follow toggles.

Use local storage for:

- Reader theme.
- Reader font family.
- Reader font size.
- Reader line height.
- Reader width.

Do not add a global client state library for the initial build unless a real cross-screen requirement appears.

## 8. Tailwind And Tokens

Map design tokens in `tailwind.config.ts`:

```ts
theme: {
  extend: {
    colors: {
      ink: {
        background: "#0B1013",
        backgroundDeep: "#070B0D",
        surface: "#131B20",
        surfaceHover: "#1D292F",
        ivory: "#F4EFE7",
        muted: "#A5B0B1",
        subtle: "#778287",
        border: "#303B40",
        coral: "#FF7657",
        coralDark: "#D65339",
        flow: "#8CCBD0",
        gold: "#D6B56D"
      },
      reader: {
        sepiaBg: "#F4F0E6",
        sepiaText: "#30383A",
        darkBg: "#18232D",
        darkText: "#DAE0DF",
        whiteBg: "#FBFAF7",
        whiteText: "#252A2C"
      }
    }
  }
}
```

Fonts should be loaded through `next/font/google` or another explicit licensed strategy.

## 9. Image Strategy

Cover contract:

- Ratio: 3:4.
- Provide alt text from title and author.
- Use responsive sizes.
- Avoid CSS distortion.

Hero/feature artwork:

- Prioritize only visible hero art.
- Keep art crop safe on desktop and mobile.
- Do not bake UI copy into images.

Mock phase:

- Use local placeholders, generated images, or remote-safe demo assets only if licensing is clear.
- Do not use copyrighted book covers.

## 10. Search And Filtering

Mock search can filter in memory over:

- Title.
- Author pen name.
- Synopsis.
- Genres.
- Tropes.
- Tags.

Filter function should be pure and testable:

```ts
filterStories(stories, {
  q,
  genres,
  tropes,
  status,
  provenance,
  sort
});
```

Future Supabase version should preserve the same query params and return shape.

## 11. SEO Metadata

Implement per-route metadata:

- Homepage title and description.
- Explore canonical base.
- Story detail Open Graph image from cover or approved feature image.
- Chapter canonical URL.
- Author profile title and description.

Important public story text should be present in rendered HTML.

## 12. Testing And Verification

Minimum checks before handoff:

- TypeScript passes.
- Lint passes.
- Routes render with mock data.
- Filter state is reflected in URL.
- Reader settings persist.
- Keyboard navigation for header, filters, and reader controls.
- No horizontal overflow at 320px and 390px.
- Visual screenshots at 1440px and 390px for the five screens.

Recommended test files:

```txt
features/library/utils/filters.test.ts
features/library/utils/reading-time.test.ts
```

## 13. Migration Path To Backend

When Supabase is introduced:

1. Keep existing route structure.
2. Replace mock repository implementation.
3. Enforce public-only queries at backend/RLS level.
4. Add pagination.
5. Add real ratings/reviews/follows only after product rules are defined.
6. Keep Studio tables separate from Library published snapshots.

## 14. Implementation Sequence

1. Add tokens, fonts, and base layout.
2. Add typed mock contracts and 20 stories.
3. Build shared navigation/footer.
4. Build Homepage.
5. Build Explore & Search.
6. Build Story Detail.
7. Build Chapter Reader.
8. Build Author Profile.
9. Verify responsiveness and accessibility.
10. Replace rough visuals with final licensed/generated assets.

