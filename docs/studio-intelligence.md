# Studio Intelligence Prototype

## Delivery Boundary

Functional frontend-first chat and deterministic context preparation. Responses, outline planning, prose generation and semantic review are mock. There are no provider calls, credentials, billing, queue or cloud persistence. The UI labels responses as a demo.

Creative and Intelligence share the existing chapter route. Focus is independent of both. The Tiptap instance remains mounted when changing modes; switching flushes pending manual edits first. Appearance, manuscript navigation and contextual inspector are optional controls, not permanent panels. Story development lives at `/studio/stories/[storyId]/assistant`, entered via Develop with AI in the Story Workspace.

The chat is the primary surface. A candidate opens only on Review or the preview icon. At desktop widths of 1280px and above it opens beside the chat. Smaller viewports show the preview instead; Close preview returns to the conversation. Context, references and generation options are separate dialogs.

## Happy Paths

1. Create an empty story, open Develop with AI and describe the premise.
2. Review the proposed outline. Use outline creates planned, empty manuscript chapters; it does not fabricate published chapters or approve Canon.
3. Open a chapter, switch to Intelligence and request scene beats.
4. Review or revise the beats, then Use beats. The accepted change creates a reference checkpoint for the chapter.
5. Generate chapter. If earlier chapters are absent or stale, use Update reference to select saved chapters before retrying.
6. Review the candidate. Use draft writes into an empty manuscript, or opens Append/Replace comparison for an existing one.
7. Return to Creative to edit. Previous manuscript versions are available in Reference context for explicit restoration.

For an existing story, the story-level chat discusses direction rather than overwriting its chapter structure. In chapter chat, requests containing plan/beats/outline propose beats; write/generate/continue requests use accepted beats to draft; other requests discuss direction. This is deterministic mock routing, not an LLM intent classifier. The visible Generate chapter action is the unambiguous drafting path.

## Module Ownership

- `intelligence/contracts.ts`: conversations, runs, candidates, checkpoints, provenance, generation options and commands.
- `intelligence/context.ts`: deterministic source filtering, temporal Canon, revision freshness and budget packing.
- `intelligence/commands.ts`: pure validated transitions, pending candidate approval, backups and restore.
- `intelligence/mock-service.ts`: abortable service adapter; staged local responses, not semantic intelligence.
- `intelligence/use-conversation.ts`: composer persistence, service lifecycle and interruption recovery.
- `intelligence/chat-workspace.tsx`: conversation, preview and progressive disclosure of options/references.
- `data/local-repository.ts`: atomic IndexedDB persistence, v1-to-v2 migration and cross-tab consistency via the existing provider.

The database name is unchanged. Schema version 2 preserves existing stories, manuscripts, Canon and review history. Unknown or invalid workspace versions fail visibly rather than silently reseeding. UI preferences retain their existing key; the old default mode maps to Creative.

## Context Foundation

A checkpoint snapshots the author-selected saved manuscript revisions, chapter ordering, story brief, confirmed Canon and extractive memory. Memory entries retain chapter/revision/block provenance. A later edit, reorder, story brief change or confirmed Canon change invalidates the reference. Creating a checkpoint does not approve Canon.

Context preparation enforces story ownership and a target chapter boundary. Only earlier reference chapters are eligible; the current draft is included for ordinary continuation. Flashbacks require an explicit POV and earlier boundary and exclude the later current manuscript. Earlier missing chapters block drafting. Future chapter prose and future source evidence are excluded. Planned beats are labelled as plans, not established events.

Relevant confirmed facts are selected through entity names, aliases and direct relationships, with inclusive-from/exclusive-until temporal validity. Mandatory content includes the request, constraints, brief, relevant Canon and current manuscript. Optional recent passages, memory and directly matching evidence compete for the remaining budget; matching source excerpts outrank lossy summaries. The pack records source references, omissions and estimated size.

Token estimation uses characters divided by four with a 6,000-token preview budget. It is not a provider tokenizer and does not reserve a model-specific output allowance. Required context overflow blocks generation; it is never silently truncated. Tests cover synthetic 30/100/300-chapter stories, old clue retrieval, future exclusion, freshness, flashbacks and overflow.

These are lexical and structural safeguards, not a guarantee that an AI remembers everything. Extractive summaries, keyword thread detection and hard chapter boundaries do not model character knowledge, off-page events, semantic relevance or all continuity contradictions. Review findings are seeded examples, not newly detected conflicts. An unseen long-range clue can still be omitted by lexical retrieval or a finite context budget.

## Write Safety

One active run is allowed per conversation. Run ownership uses a tab-scoped session identifier so another tab opening the editor does not cancel its generation. Refreshing the owning tab marks an interrupted run for explicit retry. Stop aborts the service, retains partial output and leaves the manuscript untouched. Late progress/completion is ignored for terminal runs.

Candidates remain separate from the manuscript until explicit approval. Applying validates story/chapter ownership, candidate kind, pending status, original manuscript revision and reference freshness. An applied/discarded candidate cannot be applied again. Append and Replace preserve the preceding document, title and beats. Restore also backs up the current version and checks its revision. No generation command mutates Canon facts or Library snapshots.

Writes can fail. The manuscript editor retains an exportable in-memory draft; chat actions surface storage errors and do not display success before the transaction completes. Browser storage is local and unencrypted, and deletion of site data can erase drafts. The full-snapshot adapter and unbounded checkpoint history are prototype limitations, not production storage design.

## Next Production Gates

Before real generation, validate the author workflow using this prototype. Then add authenticated server ownership checks and durable storage behind the repository interface. Provider calls must stay server-side behind the single Model Gateway, with validated inputs/outputs, token/cost measurement and rate limits.

Production context needs model-specific input/output budgets, incremental revision-aware summaries, evidence-linked open-thread/timeline/knowledge records, hybrid lexical/semantic retrieval and evaluation of missed clues and contradictions. Use immutable context manifests per run; changed upstream chapters invalidate dependent memory. Explicit author approval remains separate from draft saving and Canon acceptance.

Long chapter generation should use queued, resumable scene jobs with idempotency keys, saved scene checkpoints and cancellation propagation. Reserve output tokens per scene and carry accepted prior-scene state forward. Run an independent evidence-grounded verification pass and expose its limitations; disagreement is an author decision, not an automatic Canon commit. These backend capabilities are not implemented in this delivery.
