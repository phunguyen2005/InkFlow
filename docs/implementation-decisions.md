# Implementation Decisions

2026-10-10. Implementation authorized after review of FRONTEND_IMPLEMENTATION_PLAN.md.

- Root foundation Markdown files supplied by the user remain the source documents; no duplicate docs/library copy is created.
- The user's new `content-library.md` supersedes the older story/author seed examples. A Markdown AST importer produces deterministic typed fixture input before development/build.
- All 20 source stories, 20 authors, original slugs, summaries, ratings, catalog chapter counts, dates and imageRefIds are preserved. The Blood Orchard is the featured story.
- The source contains no chapter bodies. Each story receives five original sample chapters, separately counted and explicitly marked as reading samples. Catalog chapter counts are not replaced with five and unavailable chapters are not represented as working links.
- Author declared lifetime works are preserved as source metadata, while displayed available works and sample chapter totals are derived from this catalog. No invented author identities or verification claims.
- Publication dates are interpreted as the latest catalog update, not a verified first publication date. Newest uses a deterministic sample first-publication timestamp derived from catalog count; this is demo ordering, documented in data. Provenance remains UNSPECIFIED because the new source does not specify it.
- Third-party imageRefIds remain stable references behind the asset adapter. Original generated art replaces third-party covers, and author avatars use initials instead of fictional claims of real portraits.
- Tailwind CSS theme variables replace the old illustrative config shape. Tokens and font choices remain unchanged; tracking is zero and type uses fixed responsive steps.
- Reader uses a separate shell with server-rendered prose. Library header/footer are composed in discovery pages, preserving the specified routes.
- Demo pages are noindex. No authentication, private Studio, backend service or publishing workflow is connected.
- Rankings resolves to sorted Explore; unavailable Community/auth links are omitted. Studio is an informational footer entry until an actual destination exists.
- **2026-10-11 - Header Rankings Navigation**: Updated desktop and mobile header navigation links from `/explore?sort=trending` to dedicated `/rankings` route with `aria-current="page"` active state.
