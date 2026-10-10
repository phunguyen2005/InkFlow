# InkFlow Public Library Design Specification

Version: 1.0  
Status: Foundation for frontend build  
Scope: Public Library, not Studio  
Primary visual source: selected cinematic dark homepage reference

## 1. Design Thesis

InkFlow Public Library should feel like a premium editorial fiction catalogue, not a social feed, admin dashboard, or generic web-novel clone.

The design direction is Cinematic Editorial Brutalism softened by literary typography:

- Monumental discovery typography.
- Dark ink-like surfaces.
- Sparse layout.
- Dramatic story artwork.
- Serif story titles and reading experience.
- Precise modern UI controls.
- Minimal metrics until they help story choice.

The visual reference is useful because it creates immediate editorial gravity: a dark background, huge "EXPLORE" word, restrained nav, cinematic feature art, genre strip, and cover shelf. The implementation should preserve those qualities without copying any specific artwork, brand treatment, or composition one-to-one.

## 2. Product Design Principles

1. Stories lead. Covers, titles, synopses, and reading affordances matter more than metrics.
2. Discovery is editorial first, algorithmic later. Initial shelves can be curated or mock-ranked.
3. Reading comfort beats visual spectacle inside the Chapter Reader.
4. Public Library and Studio stay visually related but functionally separate.
5. Mock states must be honest. Do not make fake ratings, reviews, or follows look like validated production data.
6. The interface is English-first and global, not region-specific.
7. Accessibility, responsiveness, and SEO are product requirements, not polish.

## 3. Brand Mood

Keywords:

- Cinematic
- Literary
- Dark editorial
- Premium but not luxury-fashion sterile
- Human creativity plus intelligent tooling
- Global serialized fiction
- Calm reading depth

Avoid:

- Purple AI gradient identity.
- Rounded bento SaaS layout.
- Busy dashboard cards.
- Anime-only merchandising.
- Wuxia-only assumptions.
- Fake community heat.
- Excessive badges.
- Heavy glassmorphism.
- Decorative animated backgrounds behind reading text.

## 4. Color Tokens

Use CSS variables and map them into Tailwind tokens.

| Token | Hex | Use |
|---|---:|---|
| `ink.background` | `#0B1013` | Main Library background |
| `ink.backgroundDeep` | `#070B0D` | Deep hero/footer areas |
| `ink.surface` | `#131B20` | Search fields, panels |
| `ink.surfaceHover` | `#1D292F` | Hover and active dark surfaces |
| `ink.ivory` | `#F4EFE7` | Primary text and display words |
| `ink.muted` | `#A5B0B1` | Secondary text |
| `ink.subtle` | `#778287` | Tertiary metadata |
| `ink.border` | `#303B40` | Hairlines and card borders |
| `ink.coral` | `#FF7657` | Primary CTA and selected state |
| `ink.coralDark` | `#D65339` | Pressed CTA |
| `ink.flow` | `#8CCBD0` | Ink Flow motif and AI provenance |
| `ink.gold` | `#D6B56D` | Rating accent, used sparingly |
| `reader.sepiaBg` | `#F4F0E6` | Sepia reader background |
| `reader.sepiaText` | `#30383A` | Sepia reader text |
| `reader.darkBg` | `#18232D` | Dark reader background |
| `reader.darkText` | `#DAE0DF` | Dark reader text |
| `reader.whiteBg` | `#FBFAF7` | White reader background |
| `reader.whiteText` | `#252A2C` | White reader text |

Color discipline:

- Coral means selected or primary action.
- Teal means Ink Flow, AI provenance, or subtle intelligence context.
- Gold is only for ratings.
- Do not color body paragraphs with accent colors.
- Check contrast for actual foreground/background combinations.

## 5. Typography

Recommended font stack:

- Display: `Anton`, fallback `Impact`, `Arial Narrow`, `sans-serif`
- Editorial title: `Cormorant Garamond`, fallback `Georgia`, `serif`
- UI and metadata: `Inter`, fallback `system-ui`, `sans-serif`
- Reader body: `Source Serif 4`, fallback `Georgia`, `serif`

| Style | Desktop | Mobile | Weight | Line height | Use |
|---|---:|---:|---:|---:|---|
| Hero display | `clamp(88px, 15.5cqw, 224px)` | 64-100px fitted | 400 | 0.88 | EXPLORE |
| Shelf heading | 48-72px | 36-48px | 400 | 0.95 | TRENDING NOW |
| Editorial title | 40-64px | 30-42px | 500 | 1.05 | Featured story |
| Story title | 20-28px | 18-22px | 600 | 1.15 | Cards/detail |
| UI body | 14-16px | 14-16px | 400 | 1.55 | Metadata |
| Reader body | 18-20px | 17-19px | 400 | 1.75 | Chapter text |
| Micro label | 12-13px | 12-13px | 600 | 1.35 | Genres/status |

Rules:

- Do not scale font size directly with viewport width outside controlled `clamp()` usage.
- Letter spacing is normally `0`; micro labels may use positive spacing.
- The hero word must fit its container and must never cause horizontal overflow.
- Display fonts are not allowed in chapter body text.

## 6. Layout System

Page:

- Max content width: 1360px.
- Desktop gutters: 40-56px.
- Tablet gutters: 28-36px.
- Mobile gutters: 20px, down to 16px at 320px.
- Header height: 72-80px desktop, 60-68px mobile.

Hero:

- Desktop composition: text block, cinematic art, editorial rail.
- Mobile composition: headline, feature art, CTA, genre/search entry.
- Avoid fixed hero height on mobile.
- Show a hint of the next section on normal desktop and mobile viewports.

Cards:

- Cover aspect ratio: 3:4.
- Border radius: 0-6px.
- Gap: 16-24px desktop, 12-16px mobile.
- No nested cards.
- Use stable image containers to prevent layout shift.

Shelves:

- Desktop: 5-6 covers visible where space allows.
- Tablet: 3-4 covers.
- Mobile: horizontal scroll with 2-ish covers visible.
- Use scroll-snap before adding a carousel library.

## 7. Core Components

### SiteHeader

Contains:

- Wordmark.
- Primary nav: Library, Rankings, Genres, Community, Studio.
- Search field.
- Sign in.
- Get Started or Studio CTA.

Notes:

- Community may be visually present but can route to a deferred page later.
- Header becomes sticky with subtle background and border on scroll.
- Mobile header uses menu and search affordance.

### FeaturedHero

Contains:

- Giant `EXPLORE`.
- Short tagline: `Stories beyond imagination`.
- Copy: `Discover original serial fiction from independent voices around the world.`
- CTA: `Start Reading`.
- Secondary action: `Explore Genres`.
- Cinematic featured story image.
- Featured story rail if there are multiple hero stories.

### GenreNav

Genres:

- All
- Fantasy
- Sci-Fi
- Romance
- Mystery
- Thriller
- LitRPG
- Horror
- Slice of Life
- Contemporary

Rules:

- Text navigation, not giant pills everywhere.
- Selected state uses coral.
- Horizontal overflow on mobile with visible scroll affordance.

### StoryCard

Shelf card first-view hierarchy:

1. Cover.
2. Title.
3. Primary genre.
4. Optional author or short status.
5. Save/follow icon if auth behavior is planned.

Do not force every metadata field onto the card.

### StoryResult

Search/list hierarchy:

1. Cover thumbnail.
2. Title and author.
3. Synopsis excerpt.
4. Genre/tropes/status.
5. Latest chapter and updated time.
6. Rating summary if available.

### ReaderSettings

Controls:

- Theme: Sepia, Dark, White.
- Font family: Serif, Sans.
- Font size.
- Line height.
- Content width.
- Table of contents.

Persist reader settings locally at first; connect account sync later.

## 8. Motion

- 150-250ms transitions.
- Subtle cover lift or scale only.
- No layout-shifting hover effects.
- No autoplay hero carousel for MVP.
- Respect `prefers-reduced-motion`.
- Loading skeletons preserve final dimensions.

## 9. Accessibility

Required:

- Semantic headings.
- Landmark regions.
- Visible focus rings.
- Keyboard-operable filters and menus.
- Escape closes previews/dialogs.
- Search suggestions, if implemented, use correct combobox/listbox behavior.
- `time` elements include absolute `datetime`.
- Cover links have useful accessible names.
- Reader controls have labels.

Do not bake text into artwork.

## 10. SEO

Public pages should render meaningful content in HTML:

- Homepage shelves.
- Explore results.
- Story title, synopsis, metadata, chapter links.
- Chapter title and body excerpt/full body depending policy.
- Author profile and public works.

Routes:

- `/`
- `/explore`
- `/stories/[storySlug]`
- `/stories/[storySlug]/chapters/[chapterSlug]`
- `/authors/[authorSlug]`

Search/filter pages need deliberate canonical handling. Do not index infinite filter combinations automatically.

## 11. Validation Checklist

Before coding broadly, validate these viewports:

- 1440 desktop
- 1024 laptop/tablet landscape
- 768 tablet
- 390 mobile
- 320 narrow mobile

Acceptance:

- No horizontal overflow.
- EXPLORE fits.
- Story cards are visually consistent.
- Reader text is comfortable for long reading.
- Search/filter controls are usable by keyboard.
- Mock states do not imply production truth.
- Public Library does not expose Studio concepts except a subtle Studio CTA.

