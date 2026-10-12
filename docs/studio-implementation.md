# InkFlow Studio UI

Implemented frontend-first in the existing Next.js App Router application. This is a functional local prototype, not a deployed private account system or Canon Engine implementation.

## Screens

| Route                                            | Responsibility                                                                                                |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| `/studio`                                        | Continue writing, search/sort projects, grid/list, create/edit/archive/restore                                |
| `/studio/stories/[storyId]`                      | Story identity, synopsis, manuscript outline, counts, create/rename/reorder chapters                          |
| `/studio/stories/[storyId]/assistant`            | Chat-first story development and approval of an outline for an empty story                                    |
| `/studio/stories/[storyId]/chapters/[chapterId]` | Tiptap manuscript, inline formatting, undo/redo, beats, contextual Canon/issues, local saves, export          |
| `/studio/stories/[storyId]/canon`                | Entity browser/editing, chapter-aware confirmed facts, evidence, proposals and explicit decisions             |
| `/studio/stories/[storyId]/review`               | Sample findings, severity/status/chapter filters, excerpt/evidence comparison, dismiss/resolve/reopen/propose |

This delivery covers these screens; it does not prohibit later product screens.

## Boundaries

- `src/app/(workspace)/studio`: thin routing/layout/error boundaries.
- `src/features/studio/data/contracts.ts`: typed documents, entities, facts, evidence, findings, repository commands.
- `data/commands.ts`: pure validation and state transitions; no React or browser storage dependency.
- `data/selectors.ts`: manuscript text/counting, chapter ordering, evidence availability and temporal Canon queries.
- `data/local-repository.ts`: versioned IndexedDB adapter and atomic read-modify-write transactions.
- `shared`: Studio navigation, save guards, focus management, dialogs, cover primitive and scoped styling.
- `dashboard`, `stories`, `editor`, `canon`, `continuity`: screen ownership and interaction logic.

Library content remains in its existing repository. Studio fixtures and writes never edit published Library content. Shared cover artwork does not imply shared mutable story records. Public styles are loaded from the public layout; Studio uses CSS modules and its own tokens.

## Local Persistence

IndexedDB database `inkflow-studio-v1`, schema version 2, stores the workspace snapshot atomically. Existing version 1 drafts migrate in place without being reseeded. The single-snapshot adapter is deliberately small for this prototype. A larger dataset should use indexed stores per aggregate behind the same repository interface.

Every manuscript save carries `expectedRevision`; stale-tab writes are rejected. Saves debounce by 700ms and flush on blur, Save, Ctrl/Cmd+S, internal guarded navigation and component teardown. A dirty tab warns on browser unload. Failed writes retain the in-memory document and expose Retry and JSON export. Browser termination is not guaranteed to flush an asynchronous write; local storage is not a backup.

BroadcastChannel refreshes other tabs' views. An already-open editor retains its draft rather than silently replacing it. Revision checks prevent that stale editor overwriting newer content.

Only editor UI preferences use localStorage (`inkflow:studio:ui:v1`). Default manuscript is dark; light and sepia are optional. Creative is the manual editor with optional panels; Intelligence is a chat workspace with an on-demand draft preview. Focus independently hides the global Studio rail/header without remounting the editor. See `studio-intelligence.md` for generation and context boundaries.

## Canon And Review Semantics

Fact validity uses stable chapter IDs with `from` inclusive and `until` exclusive. Queries resolve the IDs against current chapter ordering. Reorders that reverse an existing validity interval are blocked.

Proposal creation changes only proposed state. Explicit approval is the sole transition into confirmed Canon. Replacement approval closes the earlier interval and preserves its historical record. Rejection remains visible in history. Dismiss and manuscript edits do not approve facts.

Evidence records a stable Tiptap block ID, excerpt and source revision. Review checks whether the excerpt still exists in its block; changed/missing evidence is labeled instead of presented as an exact current match. Evidence passages can be attached to proposals. Recorded sample metadata without textual proof is labeled as missing evidence.

Findings are fictional seeded examples, not results of a live scan. New manuscripts without sample findings show Not checked. Generation responses are simulated locally; no live LLM, Supabase, authentication, billing, moderation or publishing integration is present.

## Visual Direction

Base `#0B1013`, surface `#151C20`, elevated `#20292D`, ivory `#F4EFE7`, coral `#FF7657`, Canon teal `#8CCBD0`. Anton is limited to the Dashboard editorial heading; Cormorant Garamond handles story headings, Source Serif 4 the manuscript, and Inter UI controls. Small covers and restrained borders keep Studio task-focused.

The supplied Studio collage is an art-direction target, not a five-column page implementation. Mobile uses responsive navigation and contextual panels, with keyboard focus containment, Escape and focus restoration. Seven original generated cover/portrait assets are compressed under `public/studio/art`.

## Fixture Inventory

Four fictional projects: The Blood Orchard, Axiom Drift, The Glass Witness, Letters After Midnight. Primary project has 30 chapters, including a manuscript over 5,000 words, 20 Canon entities, 40 base confirmed facts, six proposal fixtures (five pending and one already confirmed), and eight sample findings. Other projects contain English-language passages matching their genres.

## Security And Release Limits

These are device-local, unencrypted demo drafts, not authenticated private resources. Story ownership checks inside mock commands protect consistency, not server authorization. Do not use real sensitive manuscripts or claim production access control. Deploying a real Studio requires authentication, resource authorization, validation, transactional backend persistence and audit logging. Published immutable snapshots must remain separate from draft records.

Deleting site storage/browser profiles can erase drafts. No cross-device sync, backup service, live continuity verification or collaborative merge is implemented. Native IME/mobile keyboard behavior still needs hands-on author testing.
