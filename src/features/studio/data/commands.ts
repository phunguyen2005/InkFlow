import { chaptersFor, factsAsOf } from "./selectors";
import { makeDocument } from "./fixtures";
import { applyIntelligence } from "../intelligence/commands";
import type { IntelligenceCommand } from "../intelligence/contracts";
import {
  ENTITY_TYPES,
  type StudioSnapshot,
  type StudioCommand,
} from "./contracts";

function required(value: string, name: string, maximum = 200) {
  const text = value.trim();
  if (!text || text.length > maximum)
    throw new Error(`${name} must contain 1-${maximum} characters.`);
  return text;
}
export function applyCommand(
  snapshot: StudioSnapshot,
  command: StudioCommand,
  id = crypto.randomUUID(),
  now = new Date().toISOString(),
): StudioSnapshot {
  if (command.type.startsWith("AI_"))
    return applyIntelligence(snapshot, command as IntelligenceCommand, id, now);
  const state = structuredClone(snapshot);
  const storyId =
    "storyId" in command
      ? command.storyId
      : "entity" in command
        ? command.entity.storyId
        : "fact" in command
          ? command.fact.storyId
          : "id" in command && command.type === "UPDATE_STORY"
            ? command.id
            : null;
  const story = state.stories.find((item) => item.id === storyId);
  if (command.type !== "CREATE_STORY" && !story)
    throw new Error("Story not found.");
  const chapter =
    "id" in command
      ? state.chapters.find(
          (item) => item.id === command.id && item.storyId === storyId,
        )
      : undefined;
  switch (command.type) {
    case "CREATE_STORY":
      state.stories.push({
        id,
        title: required(command.title, "Story title"),
        genre: required(command.genre, "Genre"),
        synopsis: command.synopsis.trim(),
        cover: "",
        archived: false,
        updatedAt: now,
        lastChapterId: null,
      });
      break;
    case "UPDATE_STORY":
      if (command.title !== undefined)
        story!.title = required(command.title, "Story title");
      if (command.synopsis !== undefined)
        story!.synopsis = command.synopsis.trim();
      if (command.archived !== undefined) story!.archived = command.archived;
      break;
    case "CREATE_CHAPTER":
      state.chapters.push({
        id,
        storyId: story!.id,
        title: required(command.title, "Chapter title"),
        order: chaptersFor(state, story!.id).length + 1,
        document: makeDocument([""], id),
        revision: 1,
        updatedAt: now,
        status: "DRAFT",
        beats: "",
      });
      story!.lastChapterId = id;
      break;
    case "RENAME_CHAPTER":
    case "SAVE_CHAPTER":
      if (!chapter) throw new Error("Chapter does not belong to this story.");
      if (command.type === "SAVE_CHAPTER") {
        if (chapter.revision !== command.expectedRevision)
          throw new Error(
            "This chapter changed in another tab. Export your draft before reloading the saved version.",
          );
        if (
          command.document.type !== "doc" ||
          !Array.isArray(command.document.content)
        )
          throw new Error("Invalid manuscript document.");
        chapter.document = structuredClone(command.document);
        chapter.beats = command.beats;
        chapter.status = "IN_PROGRESS";
      }
      chapter.title = required(command.title, "Chapter title");
      chapter.revision++;
      chapter.updatedAt = now;
      story!.lastChapterId = chapter.id;
      break;
    case "MOVE_CHAPTER": {
      if (!chapter) throw new Error("Chapter does not belong to this story.");
      const chapters = chaptersFor(state, story!.id);
      const index = chapters.findIndex((item) => item.id === chapter.id);
      const other = chapters[index + command.direction];
      if (!other) break;
      [chapter.order, other.order] = [other.order, chapter.order];
      const order = new Map(
        chaptersFor(state, story!.id).map((item, index) => [item.id, index]),
      );
      const invalid = state.facts.find(
        (fact) =>
          fact.storyId === story!.id &&
          fact.untilChapterId &&
          order.get(fact.fromChapterId)! > order.get(fact.untilChapterId)!,
      );
      if (invalid)
        throw new Error(
          `Moving this chapter reverses the validity range of ${invalid.attribute}. Update that fact first.`,
        );
      break;
    }
    case "SAVE_ENTITY": {
      if (!ENTITY_TYPES.includes(command.entity.type))
        throw new Error("Invalid entity type.");
      const entity = {
        ...command.entity,
        name: required(command.entity.name, "Entity name"),
      };
      const existing = state.entities.findIndex(
        (item) => item.id === entity.id,
      );
      if (existing >= 0 && state.entities[existing].storyId !== story!.id)
        throw new Error("Entity does not belong to this story.");
      for (const relation of entity.relations)
        if (
          !state.entities.some(
            (item) =>
              item.id === relation.targetId && item.storyId === story!.id,
          )
        )
          throw new Error("Relationship target not found in this story.");
      if (existing < 0) state.entities.push(entity);
      else state.entities[existing] = entity;
      break;
    }
    case "PROPOSE_FACT": {
      const fact = {
        ...command.fact,
        status: "PROPOSED" as const,
        attribute: required(command.fact.attribute, "Attribute"),
        value: required(command.fact.value, "Fact value", 2000),
        createdAt: now,
        decidedAt: null,
      };
      if (state.facts.some((item) => item.id === fact.id))
        throw new Error("Proposal already exists.");
      if (
        !state.entities.some(
          (item) => item.id === fact.entityId && item.storyId === story!.id,
        )
      )
        throw new Error("Entity not found in this story.");
      const chapters = chaptersFor(state, story!.id);
      if (!chapters.some((item) => item.id === fact.fromChapterId))
        throw new Error("Effective chapter not found.");
      if (
        fact.untilChapterId &&
        (!chapters.some((chapter) => chapter.id === fact.untilChapterId) ||
          chapters.findIndex((chapter) => chapter.id === fact.untilChapterId) <=
            chapters.findIndex((chapter) => chapter.id === fact.fromChapterId))
      )
        throw new Error("Invalid fact validity range.");
      if (
        fact.source &&
        !chapters.some((item) => item.id === fact.source!.chapterId)
      )
        throw new Error("Source chapter not found.");
      state.facts.push(fact);
      break;
    }
    case "DECIDE_FACT": {
      const fact = state.facts.find(
        (item) => item.id === command.id && item.storyId === story!.id,
      );
      if (!fact || fact.status !== "PROPOSED")
        throw new Error("This proposal is no longer pending.");
      if (command.approve) {
        const matches = factsAsOf(state, story!.id, fact.fromChapterId).filter(
          (item) =>
            item.entityId === fact.entityId &&
            item.attribute.toLowerCase() === fact.attribute.toLowerCase(),
        );
        if (matches.some((item) => item.id !== fact.replacesFactId))
          throw new Error(
            "A confirmed value already applies. Propose a replacement from its fact row.",
          );
        if (fact.replacesFactId) {
          const previous = matches.find(
            (item) => item.id === fact.replacesFactId,
          );
          if (!previous)
            throw new Error(
              "The fact to replace has changed. Review the proposal again.",
            );
          fact.untilChapterId = previous.untilChapterId;
          previous.untilChapterId = fact.fromChapterId;
        } else {
          const order = chaptersFor(state, story!.id);
          const from = order.findIndex(
            (item) => item.id === fact.fromChapterId,
          );
          if (
            state.facts.some(
              (item) =>
                item.id !== fact.id &&
                item.storyId === story!.id &&
                item.status === "CONFIRMED" &&
                item.entityId === fact.entityId &&
                item.attribute.toLowerCase() === fact.attribute.toLowerCase() &&
                order.findIndex(
                  (chapter) => chapter.id === item.fromChapterId,
                ) >= from,
            )
          )
            throw new Error(
              "A later confirmed value overlaps this proposal. Review its chapter range first.",
            );
        }
      }
      fact.status = command.approve ? "CONFIRMED" : "REJECTED";
      fact.decidedAt = now;
      break;
    }
    case "REVIEW_ISSUE": {
      const issue = state.issues.find(
        (item) => item.id === command.id && item.storyId === story!.id,
      );
      if (!issue) throw new Error("Issue not found in this story.");
      const note =
        command.status === "DISMISSED"
          ? required(command.note, "Dismissal reason", 2000)
          : command.note.trim();
      issue.status = command.status;
      issue.note = note;
      issue.history.push({ status: command.status, note, at: now });
      break;
    }
  }
  if (story) story.updatedAt = now;
  return state;
}
