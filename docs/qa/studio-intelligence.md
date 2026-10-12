# Studio Intelligence QA

Date: 2026-10-11. Device-local production build at `http://127.0.0.1:3000`.

## Results

| Check                 | Result                                                  |
| --------------------- | ------------------------------------------------------- |
| `npm run build`       | Passed, including TypeScript compilation                |
| `npm run typecheck`   | Passed                                                  |
| `npm run lint`        | Passed without warnings                                 |
| `npm run test`        | 30 passed across four files                             |
| `npx playwright test` | 21 passed: four Intelligence, ten Library, seven Studio |

## New Coverage

- Empty story -> premise -> proposed outline -> accepted empty chapters -> scene beats -> candidate -> accepted manuscript -> reload.
- Stop/retry without writing generated prose into the manuscript; explicit Append and restoration of the previous document.
- Manual text and the same editor DOM instance retained through mode changes and AI approval/restoration.
- Composer persistence, independent Focus, and Escape closing generation options without exiting Focus.
- Another browser tab does not cancel the owning tab's request. Refreshing the owning tab exposes an interrupted request for explicit retry.
- Schema v1 migration preserves stories, manuscripts and Canon. Unknown workspace versions fail instead of reseeding.
- Context fixtures at 30, 100 and 300 chapters retrieve an old clue and exclude future/other-story sources within the configured estimated budget.
- Mandatory context overflow, flashback clarification, changed source revisions, chapter order and Canon trigger the expected guards.
- Stale candidates are rejected, repeat approval is rejected, late completion after Stop is ignored, and generation/apply/restore do not edit Canon.

The existing regression suite also covers local storage failure, stale manuscript writes from another tab, Canon proposal approval, review decisions, Library discovery and reader persistence.

## Visual Evidence

Chat and draft preview are captured at 1440, 1024, 390 and 320px widths under `docs/qa/intelligence/`. The empty story assistant is captured at 1440px. Desktop and mobile captures were inspected, including the narrow 320px preview. No horizontal document overflow was detected; axe reported no WCAG 2 A/AA violations in the tested chat/preview states.

The existing five Studio screens and five Library screens were also checked at 1440, 1024, 768, 390 and 320px. Image checks wait for visible images to load; intentionally hidden lazy-loaded chat artwork is not treated as a broken visible image.

## Limits

These checks verify a local frontend prototype, not production authentication, cloud persistence or real AI quality. Context tests use synthetic chapter fixtures and deterministic lexical retrieval. Token sizes are estimates, not provider-tokenizer measurements. Summaries and review are simulated/extractive; they do not prove continuity across a real 300-chapter novel.

No real LLM, queue, Model Gateway, Supabase or billing is integrated. Mobile IME/soft-keyboard behavior, screen-reader author workflows and realistic long-manuscript performance still require hands-on testing. IndexedDB is unencrypted device-local storage, not a backup service.
