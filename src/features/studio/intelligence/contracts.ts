import type { JSONContent } from "@tiptap/core";
import type { CanonFact } from "../data/contracts";
export type Intent = "DISCUSS" | "OUTLINE" | "BEATS" | "DRAFT";
export interface GenerationOptions {
  pov: string;
  tense: "past" | "present";
  length: "short" | "standard";
  chronology: "linear" | "flashback";
  asOfChapterId: string | null;
}
export const defaultGenerationOptions: GenerationOptions = {
  pov: "",
  tense: "past",
  length: "standard",
  chronology: "linear",
  asOfChapterId: null,
};
export interface Conversation {
  id: string;
  storyId: string;
  chapterId: string | null;
  composer: string;
  messages: {
    id: string;
    role: "user" | "assistant";
    text: string;
    runId: string | null;
  }[];
}
export interface ContextSource {
  chapterId: string;
  revision: number;
  blockId?: string;
}
export interface MemoryEntry {
  id: string;
  storyId: string;
  checkpointId: string;
  kind: "SUMMARY" | "THREAD" | "KNOWLEDGE" | "TIMELINE";
  text: string;
  source: ContextSource;
  entityIds: string[];
}
export interface StoryCheckpoint {
  id: string;
  storyId: string;
  createdAt: string;
  storySignature: string;
  canonSignature: string;
  chapters: {
    id: string;
    title: string;
    order: number;
    revision: number;
    document: JSONContent;
  }[];
  facts: CanonFact[];
}
export interface ContextSection {
  kind: "BRIEF" | "CONSTRAINTS" | "CANON" | "RECENT" | "MEMORY" | "EVIDENCE";
  text: string;
  sources: ContextSource[];
}
export interface ContextPack {
  id: string;
  storyId: string;
  chapterId: string | null;
  checkpointId: string | null;
  status: "READY" | "NEEDS_UPDATE" | "NEEDS_CLARIFICATION";
  reason: string;
  sections: ContextSection[];
  throughChapter: number;
  estimatedTokens: number;
  budget: number;
  omitted: number;
}
export interface DraftCandidate {
  id: string;
  storyId: string;
  chapterId: string | null;
  runId: string;
  kind: "OUTLINE" | "BEATS" | "DRAFT";
  title: string;
  body: string;
  document: JSONContent;
  outline: { title: string; beats: string }[];
  status: "PENDING" | "APPLIED" | "DISCARDED";
  findings: { title: string; source: ContextSource | null }[];
}
export interface GenerationRun {
  id: string;
  ownerId?: string;
  storyId: string;
  chapterId: string | null;
  conversationId: string;
  intent: Intent;
  prompt: string;
  options: GenerationOptions;
  baseRevision: number | null;
  status:
    | "PREPARING"
    | "PLANNING"
    | "STREAMING"
    | "CHECKING"
    | "READY"
    | "STOPPED"
    | "ERROR"
    | "APPLIED"
    | "DISCARDED";
  context: ContextPack;
  partial: string;
  error: string;
  candidateId: string | null;
  createdAt: string;
}
export interface IntelligenceState {
  conversations: Conversation[];
  runs: GenerationRun[];
  candidates: DraftCandidate[];
  checkpoints: StoryCheckpoint[];
  memory: MemoryEntry[];
  backups: {
    id: string;
    storyId: string;
    chapterId: string;
    revision: number;
    document: JSONContent;
    title: string;
    beats: string;
    createdAt: string;
  }[];
}
export function emptyIntelligence(): IntelligenceState {
  return {
    conversations: [],
    runs: [],
    candidates: [],
    checkpoints: [],
    memory: [],
    backups: [],
  };
}
export type IntelligenceCommand =
  | {
      type: "AI_EDIT_CANDIDATE";
      storyId: string;
      candidateId: string;
      body: string;
    }
  | {
      type: "AI_COMPOSER";
      storyId: string;
      chapterId: string | null;
      text: string;
    }
  | { type: "AI_CHECKPOINT"; storyId: string; chapterIds: string[] }
  | {
      type: "AI_START";
      storyId: string;
      chapterId: string | null;
      prompt: string;
      intent: Intent;
      options: GenerationOptions;
      runId: string;
      ownerId?: string;
    }
  | {
      type: "AI_PROGRESS";
      storyId: string;
      runId: string;
      status: "PLANNING" | "STREAMING" | "CHECKING";
      partial: string;
    }
  | {
      type: "AI_FINISH";
      storyId: string;
      runId: string;
      candidate: DraftCandidate | null;
      reply: string;
    }
  | { type: "AI_STOP"; storyId: string; runId: string; error?: string }
  | {
      type: "AI_APPLY";
      storyId: string;
      candidateId: string;
      operation: "APPEND" | "REPLACE" | "OUTLINE" | "BEATS";
      expectedRevision: number | null;
    }
  | { type: "AI_DISCARD"; storyId: string; candidateId: string }
  | {
      type: "AI_RESTORE";
      storyId: string;
      backupId: string;
      expectedRevision: number;
    };
