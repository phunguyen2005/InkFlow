import "fake-indexeddb/auto";
import { describe, it, expect } from "vitest";
import { seedStudio } from "./fixtures";
import { applyCommand } from "./commands";
import { factsAsOf, wordCount } from "./selectors";
import { studioRepository } from "./local-repository";
const storyId = "story-blood-orchard";
describe("Studio boundaries", () => {
  it("seeds separate projects and a long manuscript", () => {
    const state = seedStudio();
    expect(state.stories).toHaveLength(4);
    expect(state.entities).toHaveLength(20);
    expect(state.issues).toHaveLength(8);
    expect(
      wordCount(state.chapters.find((c) => c.order === 21)!.document),
    ).toBeGreaterThan(5000);
  });
  it("resolves key state by chapter, not latest value", () => {
    const state = seedStudio();
    expect(
      factsAsOf(state, storyId, "blood-orchard-ch-03").find(
        (f) => f.id === "fact-27",
      )?.value,
    ).toBe("Intact");
    expect(
      factsAsOf(state, storyId, "blood-orchard-ch-13").find(
        (f) => f.id === "fact-28",
      )?.value,
    ).toBe("Destroyed");
  });
  it("rejects stale saves and cross-story chapter access", () => {
    const state = seedStudio(),
      chapter = state.chapters[0];
    const command = {
      type: "SAVE_CHAPTER" as const,
      storyId,
      id: chapter.id,
      document: chapter.document,
      title: chapter.title,
      beats: "",
      expectedRevision: 0,
    };
    expect(() => applyCommand(state, command)).toThrow(/another tab/);
    expect(() =>
      applyCommand(state, { ...command, storyId: "story-axiom-drift" }),
    ).toThrow(/belong/);
  });
  it("dismissal requires a reason and never edits Canon", () => {
    const state = seedStudio();
    expect(() =>
      applyCommand(state, {
        type: "REVIEW_ISSUE",
        storyId,
        id: "issue-1",
        status: "DISMISSED",
        note: "",
      }),
    ).toThrow(/reason/);
    const next = applyCommand(state, {
      type: "REVIEW_ISSUE",
      storyId,
      id: "issue-1",
      status: "DISMISSED",
      note: "Intentional unreliable narrator",
    });
    expect(next.facts).toEqual(state.facts);
    expect(next.issues[0].history).toHaveLength(
      state.issues[0].history.length + 1,
    );
  });
  it("approves only explicit pending proposals", () => {
    const state = seedStudio();
    const next = applyCommand(state, {
      type: "DECIDE_FACT",
      storyId,
      id: "proposal-5",
      approve: true,
    });
    expect(next.facts.find((f) => f.id === "proposal-5")?.status).toBe(
      "CONFIRMED",
    );
    expect(() =>
      applyCommand(next, {
        type: "DECIDE_FACT",
        storyId,
        id: "proposal-5",
        approve: true,
      }),
    ).toThrow(/pending/);
  });
  it("persists transactions and leaves state unchanged on validation error", async () => {
    const state = await studioRepository.getSnapshot();
    await expect(
      studioRepository.execute({
        type: "REVIEW_ISSUE",
        storyId,
        id: "issue-1",
        status: "DISMISSED",
        note: "",
      }),
    ).rejects.toThrow();
    expect(await studioRepository.getSnapshot()).toEqual(state);
    const next = await studioRepository.execute({
      type: "CREATE_STORY",
      title: "Transaction Test",
      genre: "Mystery",
      synopsis: "",
    });
    expect((await studioRepository.getSnapshot()).stories).toEqual(
      next.stories,
    );
  });
});
