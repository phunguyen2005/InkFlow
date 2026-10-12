import { describe, expect, it } from "vitest";
import { seedStudio, makeDocument } from "../data/fixtures";
import { documentText } from "../data/selectors";
import { applyIntelligence } from "./commands";
import { buildContext, createCheckpoint, checkpointStale } from "./context";
import { migrateWorkspace } from "./migration";
import {
  defaultGenerationOptions as options,
  type DraftCandidate,
} from "./contracts";
const storyId = "story-blood-orchard",
  chapterId = "blood-orchard-ch-03";
const now = "2026-10-11T00:00:00.000Z";
function referenced() {
  const state = seedStudio();
  return applyIntelligence(
    state,
    {
      type: "AI_CHECKPOINT",
      storyId,
      chapterIds: state.chapters
        .filter((c) => c.storyId === storyId)
        .map((c) => c.id),
    },
    "checkpoint",
    now,
  );
}
function pending() {
  let state = referenced();
  state = applyIntelligence(
    state,
    {
      type: "AI_START",
      storyId,
      chapterId,
      prompt: "Continue Elara's journey",
      intent: "DRAFT",
      options,
      runId: "run",
    },
    "start",
    now,
  );
  const candidate: DraftCandidate = {
    id: "candidate",
    storyId,
    chapterId,
    runId: "run",
    kind: "DRAFT",
    title: "A new scene",
    body: "A candidate scene.",
    document: makeDocument(["A candidate scene."], "candidate"),
    outline: [],
    findings: [],
    status: "PENDING",
  };
  return applyIntelligence(
    state,
    { type: "AI_FINISH", storyId, runId: "run", candidate, reply: "Ready" },
    "finish",
    now,
  );
}
describe("Intelligence boundaries", () => {
  it("blocks drafting without fresh context and concurrent requests in the same conversation", () => {
    const command = {
      type: "AI_START" as const,
      storyId,
      chapterId,
      prompt: "Continue",
      intent: "DRAFT" as const,
      options,
      runId: "first",
    };
    expect(() =>
      applyIntelligence(seedStudio(), command, "start", now),
    ).toThrow(/reference/);
    const state = applyIntelligence(referenced(), command, "start", now);
    expect(() =>
      applyIntelligence(state, { ...command, runId: "second" }, "start", now),
    ).toThrow(/running request/);
    const changed = pending();
    changed.facts.find(
      (f) => f.storyId === storyId && f.status === "CONFIRMED",
    )!.value = "New Canon";
    expect(() =>
      applyIntelligence(
        changed,
        {
          type: "AI_APPLY",
          storyId,
          candidateId: "candidate",
          operation: "REPLACE",
          expectedRevision: changed.chapters.find((c) => c.id === chapterId)!
            .revision,
        },
        "apply",
        now,
      ),
    ).toThrow(/reference changed/);
  });
  it("migrates v1 without losing manuscripts or Canon", () => {
    const state = seedStudio();
    const legacy = { ...state, version: 1, intelligence: undefined };
    const next = migrateWorkspace(legacy);
    expect(next.version).toBe(2);
    expect(next.chapters).toEqual(state.chapters);
    expect(next.facts).toEqual(state.facts);
    expect(next.intelligence.runs).toEqual([]);
    expect(() => migrateWorkspace({ ...legacy, version: 99 })).toThrow();
  });
  it("requires a reference and detects changed revisions, ordering and Canon", () => {
    const state = referenced(),
      checkpoint = state.intelligence.checkpoints[0];
    expect(
      buildContext(seedStudio(), storyId, chapterId, "Plan", options).status,
    ).toBe("NEEDS_UPDATE");
    expect(checkpointStale(state, checkpoint)).toBe(false);
    for (const change of ["revision", "order", "canon"] as const) {
      const next = structuredClone(state);
      if (change === "canon")
        next.facts.find(
          (f) => f.storyId === storyId && f.status === "CONFIRMED",
        )!.value = "Changed";
      else next.chapters.find((c) => c.id === chapterId)![change]++;
      expect(checkpointStale(next, checkpoint)).toBe(true);
      expect(
        buildContext(next, storyId, chapterId, "Plan", options).status,
      ).toBe("NEEDS_UPDATE");
    }
  });
  it.each([30, 100, 300])(
    "retrieves an old clue across %i chapters without future or other-story text",
    (count) => {
      const state = seedStudio(),
        template = state.chapters.find((c) => c.id === chapterId)!;
      state.facts = [];
      state.chapters = Array.from({ length: count + 1 }, (_, i) => ({
        ...template,
        id: `chapter-${i + 1}`,
        order: i + 1,
        document: makeDocument(
          [
            i === 1
              ? "The secret obsidian compass was hidden beneath the floor."
              : i === count
                ? "FUTURE_SPOILER_MARKER"
                : `An ordinary journey continued on day ${i + 1}. `.repeat(12),
          ],
          `chapter-${i + 1}`,
        ),
      }));
      const { checkpoint, memory } = createCheckpoint(
        state,
        storyId,
        state.chapters.map((c) => c.id),
        "cp",
        now,
      );
      state.intelligence.checkpoints.push(checkpoint);
      state.intelligence.memory.push(...memory);
      const pack = buildContext(
        state,
        storyId,
        `chapter-${count}`,
        "Find the obsidian compass",
        options,
        1400,
      );
      expect(pack.status).toBe("READY");
      expect(pack.estimatedTokens).toBeLessThanOrEqual(1400);
      expect(pack.sections.map((s) => s.text).join("\n")).toContain(
        "obsidian compass",
      );
      expect(pack.sections.map((s) => s.text).join("\n")).not.toContain(
        "FUTURE_SPOILER_MARKER",
      );
      expect(
        pack.sections.every((s) =>
          s.sources.every(
            (source) => Number(source.chapterId.split("-").at(-1)) <= count,
          ),
        ),
      ).toBe(true);
      expect(pack.omitted).toBeGreaterThan(0);
      expect(() =>
        buildContext(state, "story-axiom-drift", "chapter-1", "Plan", options),
      ).toThrow(/belong/);
    },
  );
  it("does not silently drop required context; flashbacks require a POV and exclude later manuscript", () => {
    const state = referenced();
    const chapter = state.chapters.find((c) => c.id === chapterId)!;
    chapter.document = makeDocument(
      ["LATER_KNOWLEDGE " + "long ".repeat(1000)],
      "changed",
    );
    chapter.revision++;
    const { checkpoint, memory } = createCheckpoint(
      state,
      storyId,
      state.chapters.filter((c) => c.storyId === storyId).map((c) => c.id),
      "fresh",
      now,
    );
    state.intelligence.checkpoints.push(checkpoint);
    state.intelligence.memory.push(...memory);
    expect(
      buildContext(state, storyId, chapterId, "Write", options, 100).status,
    ).toBe("NEEDS_CLARIFICATION");
    expect(
      buildContext(state, storyId, chapterId, "Write", {
        ...options,
        chronology: "flashback",
      }).status,
    ).toBe("NEEDS_CLARIFICATION");
    const pack = buildContext(state, storyId, chapterId, "Recall the arrival", {
      ...options,
      chronology: "flashback",
      pov: "Elara",
      asOfChapterId: "blood-orchard-ch-02",
    });
    expect(pack.status).toBe("READY");
    expect(pack.throughChapter).toBe(1);
    expect(pack.sections.map((s) => s.text).join("\n")).not.toContain(
      "LATER_KNOWLEDGE",
    );
  });
  it.each(["APPEND", "REPLACE"] as const)(
    "%s requires approval, keeps a backup, is one-shot and never edits Canon",
    (operation) => {
      const state = pending(),
        original = state.chapters.find((c) => c.id === chapterId)!;
      expect(documentText(original.document)).not.toContain(
        "A candidate scene.",
      );
      const applied = applyIntelligence(
        state,
        {
          type: "AI_APPLY",
          storyId,
          candidateId: "candidate",
          operation,
          expectedRevision: original.revision,
        },
        "backup",
        now,
      );
      const chapter = applied.chapters.find((c) => c.id === chapterId)!;
      expect(documentText(chapter.document)).toContain("A candidate scene.");
      expect(applied.facts).toEqual(state.facts);
      expect(applied.intelligence.backups[0].document).toEqual(
        original.document,
      );
      expect(() =>
        applyIntelligence(
          applied,
          {
            type: "AI_APPLY",
            storyId,
            candidateId: "candidate",
            operation,
            expectedRevision: chapter.revision,
          },
          "twice",
          now,
        ),
      ).toThrow(/pending/);
      const restored = applyIntelligence(
        applied,
        {
          type: "AI_RESTORE",
          storyId,
          backupId: "backup",
          expectedRevision: chapter.revision,
        },
        "restore",
        now,
      );
      expect(
        restored.chapters.find((c) => c.id === chapterId)!.document,
      ).toEqual(original.document);
      expect(restored.intelligence.backups).toHaveLength(2);
      expect(restored.facts).toEqual(state.facts);
    },
  );
  it("rejects stale candidates and ignores late completion after stopping", () => {
    const state = pending(),
      chapter = state.chapters.find((c) => c.id === chapterId)!;
    chapter.revision++;
    expect(() =>
      applyIntelligence(
        state,
        {
          type: "AI_APPLY",
          storyId,
          candidateId: "candidate",
          operation: "REPLACE",
          expectedRevision: chapter.revision,
        },
        "apply",
        now,
      ),
    ).toThrow(/changed/);
    let next = referenced();
    next = applyIntelligence(
      next,
      {
        type: "AI_START",
        storyId,
        chapterId,
        intent: "BEATS",
        prompt: "Plan",
        options,
        runId: "stopped",
      },
      "start",
      now,
    );
    next = applyIntelligence(
      next,
      { type: "AI_STOP", storyId, runId: "stopped" },
      "stop",
      now,
    );
    next = applyIntelligence(
      next,
      {
        type: "AI_FINISH",
        storyId,
        runId: "stopped",
        candidate: null,
        reply: "Late reply",
      },
      "late",
      now,
    );
    expect(next.intelligence.runs[0].status).toBe("STOPPED");
    expect(next.intelligence.conversations[0].messages).toHaveLength(1);
  });
});
