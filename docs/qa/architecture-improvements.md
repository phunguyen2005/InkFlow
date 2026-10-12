# Frontend Architecture Improvements

Date: 2026-10-11

## Implemented

- Added a server-only repository composition root; all public routes use it. Facets
  and public slugs now belong to the repository interface.
- Allowed both demo and real public content in rating/chapter contracts while
  preserving explicit demo flags in the current mock adapter.
- Extracted browser storage subscriptions and reading-progress lifecycle into hooks.
  Progress is flushed before route navigation and page hide. Outgoing router scroll
  restoration cannot overwrite the captured bookmark. Resume uses one header offset.
- Validated resume targets against each story's available chapter list instead of a
  hardcoded five-chapter range.
- Normalized search input and searchable content consistently, including hyphens.
- Separated carousel hover, focus, visibility, reduced-motion, and manual pause state;
  added pause/play controls and kept focused rail elements mounted across slides.
- Reduced carousel client props to its required public fields and first chapter slug.
- Validated Markdown table structure, IDs/slugs, taxonomy, status, metrics, dates,
  and author/image relationships before generating JSON. Shared the genre mapping
  between importer validation and catalog conversion.
- Split the large global stylesheet into shared and feature files, preserving import
  order. Corrected desktop rail minimum height leaking into the mobile layout.

## Verification Scope

Verified against the local production server at `http://127.0.0.1:3000`:

- Unit tests: 14/14 passed.
- Playwright tests: 10/10 passed on Chromium.
- ESLint and TypeScript checks: passed.
- Production build: passed; 44 static route entries generated.
- Responsive matrix: all five screens at 320, 390, 768, 1024, and 1440px passed
  overflow and broken-image assertions. Screenshots were refreshed in
  `docs/qa/screenshots/`.
- Automated WCAG-tagged axe checks: no violations in the five tested page states.
  This is automated coverage, not a claim of complete accessibility certification.

Unit coverage includes importing the actual supplied Markdown and rejecting malformed
source data, plus normalized search equivalence and structurally valid bookmarks.
Browser regressions cover navigation-time bookmark flush/resume, unavailable resume
targets, combined hover/focus pause behavior, and explicit carousel pause/play.

The browser suite also exercises the five public screens at five widths, accessibility,
reader preferences, discovery URLs, and all catalog route/cover destinations.

Shared responsive CSS still contains cross-screen overrides. Backend integration and
field performance measurement remain future work; this change does not claim those
have been completed.
