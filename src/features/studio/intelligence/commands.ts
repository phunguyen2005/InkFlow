import type { StudioSnapshot } from "../data/contracts";
import type {
  IntelligenceCommand,
  Conversation,
  GenerationRun,
} from "./contracts";
import { buildContext, createCheckpoint, checkpointStale } from "./context";
import { makeDocument } from "../data/fixtures";
import { chaptersFor, documentText } from "../data/selectors";
export function conversationKey(storyId: string, chapterId: string | null) {
  return `${storyId}:${chapterId ?? "story"}`;
}
function refreshReference(
  state: StudioSnapshot,
  storyId: string,
  chapterIds: string[],
  id: string,
  now: string,
) {
  const { checkpoint, memory } = createCheckpoint(
    state,
    storyId,
    chapterIds,
    id,
    now,
  );
  state.intelligence.checkpoints.push(checkpoint);
  state.intelligence.memory.push(...memory);
}
export function applyIntelligence(
  snapshot: StudioSnapshot,
  command: IntelligenceCommand,
  id: string,
  now: string,
): StudioSnapshot {
  const state = structuredClone(snapshot),
    story = state.stories.find((s) => s.id === command.storyId);
  if (!story) throw new Error("Story not found.");
  const ai = state.intelligence;
  function conversation(chapterId: string | null): Conversation {
    if (
      chapterId &&
      !state.chapters.some((c) => c.id === chapterId && c.storyId === story!.id)
    )
      throw new Error("Chapter does not belong to this story.");
    const key = conversationKey(story!.id, chapterId);
    let result = ai.conversations.find((c) => c.id === key);
    if (!result) {
      result = {
        id: key,
        storyId: story!.id,
        chapterId,
        composer: "",
        messages: [],
      };
      ai.conversations.push(result);
    }
    return result;
  }
  function run(runId: string): GenerationRun {
    const result = ai.runs.find(
      (r) => r.id === runId && r.storyId === story!.id,
    );
    if (!result) throw new Error("Generation run not found.");
    return result;
  }
  const active = (r: GenerationRun) =>
    ["PREPARING", "PLANNING", "STREAMING", "CHECKING"].includes(r.status);
  switch (command.type) {
    case "AI_EDIT_CANDIDATE": {
      const candidate = ai.candidates.find(
        (c) => c.id === command.candidateId && c.storyId === story.id,
      );
      if (
        !candidate ||
        candidate.status !== "PENDING" ||
        candidate.kind === "OUTLINE"
      )
        throw new Error("This preview cannot be edited.");
      if (!command.body.trim() || command.body.length > 60000)
        throw new Error("Preview must contain 1-60,000 characters.");
      candidate.body = command.body;
      candidate.document = makeDocument(
        command.body.split(/\n\n/),
        candidate.id,
      );
      break;
    }
    case "AI_COMPOSER":
      conversation(command.chapterId).composer = command.text.slice(0, 12000);
      break;
    case "AI_CHECKPOINT":
      refreshReference(state, story.id, command.chapterIds, id, now);
      break;
    case "AI_START": {
      if (!command.prompt.trim() || command.prompt.length > 12000)
        throw new Error("Enter a request of up to 12,000 characters.");
      if (ai.runs.some((r) => r.id === command.runId))
        throw new Error("Request already exists.");
      const chat = conversation(command.chapterId);
      if (ai.runs.some((r) => r.conversationId === chat.id && active(r)))
        throw new Error("This conversation already has a running request.");
      const chapter = state.chapters.find(
        (c) => c.id === command.chapterId && c.storyId === story.id,
      );
      if (command.intent === "DRAFT" && (!chapter || !chapter.beats.trim()))
        throw new Error("Approve scene beats before generating a chapter.");
      if (command.intent === "OUTLINE" && command.chapterId)
        throw new Error("Story outlines belong to the story conversation.");
      const context = buildContext(
        state,
        story.id,
        command.chapterId,
        command.prompt,
        command.options,
      );
      if (command.intent === "DRAFT" && context.status !== "READY")
        throw new Error(context.reason);
      ai.runs.push({
        id: command.runId,
        ownerId: command.ownerId,
        storyId: story.id,
        chapterId: command.chapterId,
        conversationId: chat.id,
        intent: command.intent,
        prompt: command.prompt,
        options: command.options,
        baseRevision: chapter?.revision ?? null,
        status: "PREPARING",
        context,
        partial: "",
        error: "",
        candidateId: null,
        createdAt: now,
      });
      chat.messages.push({
        id: `${command.runId}:user`,
        role: "user",
        text: command.prompt,
        runId: command.runId,
      });
      chat.composer = "";
      break;
    }
    case "AI_PROGRESS": {
      const current = run(command.runId);
      if (!active(current)) break;
      const order = ["PREPARING", "PLANNING", "STREAMING", "CHECKING"];
      if (order.indexOf(command.status) < order.indexOf(current.status)) break;
      current.status = command.status;
      current.partial = command.partial;
      break;
    }
    case "AI_FINISH": {
      const current = run(command.runId);
      if (!active(current)) break;
      if (command.candidate) {
        if (
          command.candidate.storyId !== story.id ||
          command.candidate.chapterId !== current.chapterId ||
          command.candidate.runId !== current.id ||
          command.candidate.kind !== current.intent ||
          ai.candidates.some((c) => c.id === command.candidate!.id) ||
          !command.candidate.body.trim() ||
          command.candidate.body.length > 60000 ||
          (current.intent === "OUTLINE" && !command.candidate.outline.length)
        )
          throw new Error("Candidate does not belong to this request.");
        ai.candidates.push({ ...command.candidate, status: "PENDING" });
        current.candidateId = command.candidate.id;
      }
      current.status = "READY";
      current.partial = "";
      const chat = conversation(current.chapterId);
      chat.messages.push({
        id: `${current.id}:assistant`,
        role: "assistant",
        text: command.reply,
        runId: current.id,
      });
      break;
    }
    case "AI_STOP": {
      const current = run(command.runId);
      if (!active(current)) break;
      current.status = command.error ? "ERROR" : "STOPPED";
      current.error = command.error ?? "";
      break;
    }
    case "AI_DISCARD": {
      const candidate = ai.candidates.find(
        (c) => c.id === command.candidateId && c.storyId === story.id,
      );
      if (!candidate || candidate.status !== "PENDING")
        throw new Error("This candidate is no longer pending.");
      candidate.status = "DISCARDED";
      run(candidate.runId).status = "DISCARDED";
      break;
    }
    case "AI_APPLY": {
      const candidate = ai.candidates.find(
        (c) => c.id === command.candidateId && c.storyId === story.id,
      );
      if (!candidate || candidate.status !== "PENDING")
        throw new Error("This candidate is no longer pending.");
      const current = run(candidate.runId);
      if (candidate.kind === "OUTLINE") {
        if (
          command.operation !== "OUTLINE" ||
          chaptersFor(state, story.id).length
        )
          throw new Error(
            "An outline can create chapters only in an empty story.",
          );
        if (
          current.context.sections.find((s) => s.kind === "BRIEF")?.text !==
          `${story.title}\n${story.genre}\n${story.synopsis}`
        )
          throw new Error("Story details changed. Develop the outline again.");
        story.synopsis = candidate.body;
        candidate.outline.forEach((item, index) => {
          const chapterId = `${current.id}-chapter-${index + 1}`;
          state.chapters.push({
            id: chapterId,
            storyId: story.id,
            title: item.title,
            order: index + 1,
            revision: 1,
            document: makeDocument([""], chapterId),
            beats: item.beats,
            status: "DRAFT",
            updatedAt: now,
          });
        });
        story.lastChapterId =
          state.chapters.find((c) => c.storyId === story.id)?.id ?? null;
      } else {
        const chapter = state.chapters.find(
          (c) => c.id === candidate.chapterId && c.storyId === story.id,
        );
        if (!chapter || chapter.revision !== command.expectedRevision)
          throw new Error(
            "The manuscript changed. Compare the latest version before applying this draft.",
          );
        if (command.expectedRevision !== current.baseRevision)
          throw new Error(
            "The manuscript changed since generation. Review the new version and generate a fresh candidate.",
          );
        if (candidate.kind === "DRAFT") {
          const checkpoint = ai.checkpoints.find(
            (c) => c.id === current.context.checkpointId,
          );
          if (!checkpoint || checkpointStale(state, checkpoint))
            throw new Error(
              "The reference changed. Update context and generate a fresh candidate.",
            );
          if (!["APPEND", "REPLACE"].includes(command.operation))
            throw new Error("Choose Append or Replace.");
          ai.backups.push({
            id,
            storyId: story.id,
            chapterId: chapter.id,
            revision: chapter.revision,
            document: structuredClone(chapter.document),
            title: chapter.title,
            beats: chapter.beats,
            createdAt: now,
          });
          const content =
            command.operation === "APPEND" &&
            documentText(chapter.document).trim()
              ? [
                  ...(chapter.document.content ?? []),
                  ...(candidate.document.content ?? []),
                ]
              : candidate.document.content;
          chapter.document = {
            type: "doc",
            content: structuredClone(content ?? []),
          };
          chapter.status = "IN_PROGRESS";
        } else {
          if (command.operation !== "BEATS")
            throw new Error("Use beats for this candidate.");
          chapter.beats = candidate.body;
        }
        chapter.revision++;
        chapter.updatedAt = now;
        story.lastChapterId = chapter.id;
      }
      candidate.status = "APPLIED";
      current.status = "APPLIED";
      story.updatedAt = now;
      const previous = ai.checkpoints
        .filter((c) => c.storyId === story.id)
        .at(-1);
      const ids = new Set([
        ...(previous?.chapters.map((c) => c.id) ?? []),
        ...(candidate.chapterId ? [candidate.chapterId] : []),
      ]);
      if (ids.size)
        refreshReference(state, story.id, [...ids], `${id}:checkpoint`, now);
      break;
    }
    case "AI_RESTORE": {
      const backup = ai.backups.find(
          (b) => b.id === command.backupId && b.storyId === story.id,
        ),
        chapter = state.chapters.find(
          (c) => c.id === backup?.chapterId && c.storyId === story.id,
        );
      if (!backup || !chapter || chapter.revision !== command.expectedRevision)
        throw new Error("The manuscript changed. Refresh before restoring.");
      ai.backups.push({
        id,
        storyId: story.id,
        chapterId: chapter.id,
        revision: chapter.revision,
        document: structuredClone(chapter.document),
        title: chapter.title,
        beats: chapter.beats,
        createdAt: now,
      });
      chapter.document = structuredClone(backup.document);
      chapter.title = backup.title;
      chapter.beats = backup.beats;
      chapter.revision++;
      chapter.updatedAt = now;
      break;
    }
  }
  return state;
}
