# InkFlow Public Library Frontend Agent Guide

Version: 1.0  
Scope: InkFlow Public Library frontend foundation  
Primary stack: Next.js App Router, TypeScript, Tailwind CSS  
Language: English-first UI and mock content

## 1. Product Boundary

InkFlow has two major product surfaces:

- Public Library: discovery, browsing, public story detail pages, chapter reading, and public author profiles.
- Studio: private author workspace for drafting, canon management, AI co-writing, and publishing submission.

This frontend foundation covers the Public Library only. Do not build Studio workflows, Canon Engine screens, author drafting tools, moderation dashboards, billing, or AI generation flows unless a later task explicitly asks for them.

The Library must display only approved published content. Studio drafts, private notes, unpublished revisions, moderation queues, and Canon data must never appear in public UI, mock APIs, search indexes, previews, or image metadata.

## 2. FE-First Working Rules

Build the first implementation as a production-oriented frontend prototype, not a throwaway mock.

Required behavior:

- Use typed mock data contracts before connecting Supabase.
- Keep routes, components, and data access shaped like the real app.
- Prefer server-rendered public content where possible.
- Use client components only for search input state, filters, reader settings, saved/follow buttons, previews, menus, and other real interactivity.
- Treat mocked rating, review, follow, and save states as explicit mock states.
- Do not invent real reader counts, reviews, revenue metrics, moderation outcomes, or legal compliance claims.

Avoid:

- Building generic SaaS dashboards.
- Building Studio UI inside Library routes.
- Treating "Author" as a global security role.
- Mixing user badges, trust/risk score, and security permissions.
- Overbuilding recommendation engines, social feeds, realtime features, or complex personalization before validation.

## 3. Design Direction

Use Cinematic Editorial Brutalism:

- Dark ink background.
- Giant condensed display typography for discovery moments.
- Literary serif titles and reader typography.
- Sparse editorial layout.
- Story artwork provides most color.
- Coral highlights selected navigation and primary actions.
- Teal is reserved for Ink Flow / AI provenance / subtle brand intelligence signals.

The selected homepage reference has the right energy: large "EXPLORE", dark cinematic composition, strong cover shelf, narrow editorial rail, and minimal chrome. Use it as direction, not as a template to copy.

## 4. Requested Screens For This Foundation

This foundation specifies these screens:

- Public Library Homepage
- Explore & Search
- Story Detail
- Chapter Reader
- Author Profile

This is not a permanent product limit. These are the first screens to design and implement because they validate the public reader loop: discover -> evaluate -> read -> understand author.

## 5. Frontend Architecture Rules

Use Next.js App Router route groups:

```txt
app/
  (public)/
    page.tsx
    explore/page.tsx
    stories/[storySlug]/page.tsx
    stories/[storySlug]/chapters/[chapterSlug]/page.tsx
    authors/[authorSlug]/page.tsx
```

Keep feature code modular:

```txt
features/library/
  components/
  data/
  mock/
  types/
  utils/
```

Suggested component families:

- Navigation: `SiteHeader`, `MobileMenu`, `SearchBox`, `SiteFooter`
- Discovery: `FeaturedHero`, `GenreNav`, `StoryShelf`, `StoryCard`, `GenreTile`
- Search: `ExploreFilters`, `StoryResultList`, `SortSelect`, `ActiveFilters`
- Story: `StoryHeader`, `StoryMetadata`, `ChapterList`, `ReviewPreview`, `ProvenanceBadge`
- Reader: `ReaderShell`, `ReaderToolbar`, `ReaderSettings`, `ChapterBody`, `ChapterNav`, `ReadingProgress`
- Author: `AuthorHeader`, `AuthorWorks`, `AuthorMetadata`

## 6. Data And Contract Discipline

Define TypeScript contracts before UI implementation. Mock data must match realistic backend boundaries:

- `Story` represents a public approved work summary.
- `StoryDetail` represents a public approved work page.
- `Chapter` represents an immutable published chapter snapshot.
- `AuthorProfile` represents public author metadata.
- `ReviewSummary` and `RatingSummary` are mocked until real backend is available.

Mock stories must be English-language fictional works across diverse genres. Do not use existing copyrighted book titles or real author names in fake catalog data.

## 7. Accessibility And Readability

Accessibility is part of the product definition:

- Keyboard navigation must work for header, search, filters, story cards, menus, reader settings, and chapter navigation.
- Focus rings must be visible.
- Story covers need useful alt text or a complete accessible label.
- Reader supports Sepia, Dark, and White themes.
- Reader text targets 60-75 characters per line on desktop.
- Reader default font size should start around 18px with line-height around 1.75.
- Respect `prefers-reduced-motion`.
- Avoid horizontal overflow at 320px, 390px, 768px, 1024px, and 1440px widths.

## 8. Performance Rules

Public Library is content-heavy, so performance must be designed in from the start:

- Use `next/image` for covers and hero artwork.
- Prioritize only the first visible hero image.
- Lazy-load below-the-fold shelves.
- Keep carousel behavior native with scroll-snap before adding dependencies.
- Avoid large client bundles for static shelves.
- Avoid layout shift by setting stable aspect ratios for covers and tiles.
- Keep search/filter state shareable through URL params.

Initial targets to measure after implementation:

- LCP under 2.5s on a representative mid-range mobile device.
- CLS under 0.1.
- INP under 200ms.
- No horizontal page overflow.

## 9. Content And Policy Rules

Public Library text must be measured and honest:

- Use "AI-assisted" only when the mock contract explicitly says the story has that provenance.
- Do not claim legal compliance, identity verification, or editorial endorsement from a badge.
- Ratings, reviews, follow, and save may be shown as mock states if labeled internally in data and not presented as real production evidence.
- Public content must imply approved published snapshots, not live drafts.

## 10. Agent Handoff Checklist

Before coding:

- Read `design.md`.
- Read `screens.md`.
- Read `architecture.md`.
- Read `mock-contracts.md`.
- Confirm routes and component names match these docs unless there is a strong implementation reason to change them.

Before finalizing a frontend implementation:

- Verify desktop and mobile screenshots.
- Test keyboard navigation.
- Test reader themes and font controls.
- Confirm mock contracts compile.
- Confirm no Studio/private draft language leaks into Library routes.
- Confirm the five specified screens can be visited through stable routes.


<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
