# InkFlow Community Design Specification

Version: 1.0  
Status: Foundation specification for InkFlow Community feature  
Scope: Story-Centric Literary Social Space (Public Library conversational layer)  
Primary design system: Dark Editorial Conversation (extension of Cinematic Editorial Brutalism)

---

## 1. Design Thesis

InkFlow Community is a **story-centric literary social space** that extends the public fiction catalogue into a conversational layer. It inherits the Dark Editorial visual foundation of the InkFlow Public Library but shifts the core emphasis from cinematic cover-led discovery to **typography-led literary discourse**.

Where the Library emphasizes monumentality, artwork shelves, and catalog exploration, the Community emphasizes:

- **Typography-led conversation**: Discussion titles rendered in literary serif typography rather than full-bleed artwork tiles.
- **Reading-width restraint**: Max content width narrowed to 760px–920px for optimal reading comfort (60–75 characters per line).
- **Contextual anchoring**: Every discussion connects directly to a published story or specific chapter in the Library.
- **Chapter-scoped spoiler protection**: Explicit spoiler boundaries preventing premature revelation of plot points.
- **Honest demo discipline**: Transparent mock labels with zero fabricated engagement metrics, synthetic upvotes, or fake algorithms.

---

## 2. Product Boundaries & Honest Demo Discipline

The Community feature strictly follows Option A (Story-Centric Community MVP):

### Included Surfaces (Exactly 3 Screens)
1. **Community Homepage (`/community`)**: Discovery of conversations, weekly editorial prompt, category filtering, featured discussion, latest discussion list, and community call-to-action.
2. **Discussion Detail (`/community/discussions/[discussionSlug]`)**: Full discussion thread with story/chapter reference, chapter-scoped spoiler overlay, formatted markdown post body, one-level replies, report stub, and mock editorial notice.
3. **Story Detail Integration (`/stories/[storySlug]`)**: Dedicated "Conversations" section embedded between the chapter list and related stories shelf, showing story-specific discussions and linking to `/community?story={storySlug}`.

### Excluded Surfaces (Strict Anti-Scope)
- No user profile feeds, reader walls, or follower graphs.
- No direct messaging (DMs) or chat lobbies.
- No general off-topic forums or unbounded open threads.
- No upvoting, downvoting, or algorithmic karma systems.
- No Studio workspaces, draft views, or Canon Engine leakage.

### Public Content & Security Boundaries
- Only approved, published stories and chapters may be referenced.
- Studio drafts, author notes, unpublished chapters, and Canon lore entities must never leak into public community mock data or rendered DOM nodes.
- All mock data entities carry `isMock: true` and the dataset exports `COMMUNITY_ARE_DEMO = true`.

---

## 3. Brand Mood & Tone

### Keywords
- **Literary**: Thoughtful discourse on characters, motifs, prose, and world mechanics.
- **Editorial**: Curated weekly prompts and featured discussions guiding reader focus.
- **Calm & Focused**: Dark, ink-toned backgrounds free from flashing badges or engagement traps.
- **Respectful of Reader Journey**: Readers read at different speeds; spoiler barriers protect the reading experience.

### Anti-Patterns to Avoid
- Social media noise (reaction GIFs, emoji walls, endless feeds).
- Gamified ranking mechanics (reputation scores, upvote leaderboards).
- Purple AI gradients or generic SaaS card layouts.
- Over-promising real user engagement or claiming editorial moderation certifications.

---

## 4. Color Tokens & Semantic Hierarchy

The Community feature adheres to the design tokens established in `design.md`:

| Token | Hex | Role in Community UI |
|---|---:|---|
| `--ink-background` | `#0B1013` | Deep canvas background for all community pages |
| `--ink-background-deep` | `#070B0D` | Darker contrast container for hero and footer |
| `--ink-surface` | `#131B20` | Discussion card containers, reply blocks, filter bars |
| `--ink-surface-hover` | `#1D292F` | Card hover states, interactive control surfaces |
| `--ink-ivory` | `#F4EFE7` | Primary headings, discussion titles, active tab text |
| `--ink-muted` | `#A5B0B1` | Body prose, excerpts, secondary author metadata |
| `--ink-subtle` | `#778287` | Tertiary timestamps, category micro-labels, hairline borders |
| `--ink-border` | `#303B40` | Structural dividers, reply hairlines, card outlines |
| `--ink-coral` | `#FF7657` | Primary action CTA, active filter indicators, category accents |
| `--ink-coral-dark` | `#D65339` | Pressed / active CTA button state |
| `--ink-flow` | `#8CCBD0` | Supportive signals: chapter tags, spoiler reveal toggles, provenance |
| `--ink-gold` | `#D6B56D` | Reserved exclusively for reader review ratings |

### Color Discipline Rules
1. **Coral (`#FF7657`)** denotes primary focus: active tab underbars, primary CTA buttons, and highlighted category chips.
2. **Teal (`#8CCBD0`)** denotes literary intelligence: chapter reference links, spoiler unlock toggles, and metadata tags.
3. **Gold (`#D6B56D`)** is strictly reserved for review ratings and never used for general decoration.
4. Body text remains ivory or muted; accent colors are never used for long-form paragraphs.

---

## 5. Typography System

| Style | Font Family | Desktop Size | Mobile Size | Weight | Line Height | Usage |
|---|---|---|---|---|---|---|
| **Community Hero** | `Anton` / Display | 96px | 44px–56px | 400 | 1.05 | "BEYOND THE PAGE." hero display |
| **Section Headings** | `Cormorant Garamond` | 32px–36px | 24px–28px | 500 | 1.15 | "Conversations", "Question of the Week" |
| **Discussion Titles** | `Cormorant Garamond` | 24px–28px | 20px–22px | 500 | 1.20 | Card titles and detail thread headings |
| **Category Micro-labels** | `Inter` / Sans | 11px–12px | 11px | 600 | 1.20 | Uppercase tracking (`0.08em`) |
| **Discussion Body Prose** | `Source Serif 4` / Serif | 18px | 16px | 400 | 1.75 | Post markdown and reading paragraphs |
| **UI & Metadata** | `Inter` / Sans | 13px–14px | 12px–13px | 400–500 | 1.50 | Author pen names, timestamps, buttons |

---

## 6. Layout Principles & Reading Column Architecture

### Grid and Width Discipline
- **Community Homepage**: Max width `1200px` for hero and filter header, collapsing to a single-column layout under `768px`.
- **Discussion Detail View**: Max reading width `760px–800px` centered within a `920px` shell. This enforces 60–75 characters per line for high legibility.
- **Card Anatomy**: Discussion cards are horizontal editorial text blocks, not vertical image posters. Artwork is included only as a compact thumbnail or subtle story reference badge.

### Viewport Guardrails
Layouts must render without horizontal overflow across five tested responsive widths:
- `320px` (Compact Mobile)
- `390px` (Modern Mobile)
- `768px` (Tablet Portrait)
- `1024px` (Small Desktop / Tablet Landscape)
- `1440px` (Standard Desktop)

---

## 7. Component Inventory & Functional Anatomy

### 1. `CommunityHero`
- **Copy**: Eyebrow: `InkFlow Community · Literary Discourse`, Heading: `BEYOND THE PAGE.`, Deck: `Where readers dissect plotlines, untangle character motives, and share perspectives on published serials.`
- **Layout**: 55% copy / 45% artwork split on desktop; collapses to stacked single column on mobile.
- **Artwork**: `public/mock/heroes/community-hero.webp` with priority loading.

### 2. `CommunityNav` (Filter Tabs)
- **Options**: `All`, `Discussions`, `Reviews`.
- **State**: Controlled via URL query param (`?tab=discussions`).
- **Accessibility**: Keyboard navigable with `aria-current="page"` on the active tab link.

### 3. `FeaturedDiscussion`
- **Role**: Highlights an editorial anchor discussion linked to a published story (e.g. *The Blood Orchard*).
- **Anatomy**: Category badge, story cover pill, chapter reference tag, large serif title, excerpt, author avatar, reply count, and reading link.

### 4. `WeeklyPrompt` ("Question of the Week")
- **Role**: Sparks communal literary reflection.
- **Anatomy**: Editorial badge, highlighted question text, reflective prompt body, active week identifier (`2026-W41`).

### 5. `DiscussionCard`
- **Role**: Compact, text-driven card for latest conversations and story detail embeds.
- **Anatomy**:
  ```
  ┌──────────────────────────────────────────────────────────┐
  │ CHARACTER DISCUSSION                       3 replies     │
  │ Was returning to the orchard ever a choice?             │
  │ ✦ The Blood Orchard · Chapter 3                         │
  │ A conversation about memory, obligation, and the...     │
  │ By Mara Voss (Reader) · 2 days ago                      │
  └──────────────────────────────────────────────────────────┘
  ```

### 6. `SpoilerOverlay`
- **Role**: Conceals discussion body and comments containing plot spoilers until explicitly unlocked.
- **Anatomy**: Warning shield icon, specific story and chapter scope declaration (e.g. *"Contains Chapter 3 spoilers"*), "Reveal discussion" action button.
- **Accessibility**: Polite `aria-live` status announcement and automatic focus shift to the revealed content upon toggle.

### 7. `DiscussionReplies`
- **Role**: Flattens reader replies to a clean, single-level structure.
- **Anatomy**: Author name, reader tag, relative timestamp, markdown reply body, and mock moderation status indicator.

### 8. `StoryReferenceBar`
- **Role**: Unidirectional breadcrumb navigation anchoring the discussion back to the Library.
- **Anatomy**: Story cover thumbnail, story title link, primary genre tag, and chapter anchor link.

---

## 8. Accessibility & Performance Specifications

### Accessibility (WCAG 2.1 AA)
- Full axe-core audit zero violation requirement across all community routes.
- Focus rings: 2px solid `--ink-coral` with 2px offset on all interactive buttons, links, and tab triggers.
- Color contrast: All text meets minimum contrast ratio 4.5:1 against dark surfaces (`--ink-surface` and `--ink-background`).
- Respects `prefers-reduced-motion` for transitions and scroll behaviors.

### Performance Guardrails
- Core Web Vitals target: Lab LCP < 2.5s, CLS < 0.1 on Chromium runs.
- Images use `next/image` with explicit aspect ratios and responsive `sizes` attributes.
- Zero client bundle leakage for server-rendered discussion threads.
