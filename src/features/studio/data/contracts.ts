import type { JSONContent } from "@tiptap/core";
import type {
  IntelligenceState,
  IntelligenceCommand,
} from "../intelligence/contracts";

export const ENTITY_TYPES = [
  "CHARACTER",
  "LOCATION",
  "FACTION",
  "ARTIFACT",
  "POWER_SYSTEM",
  "RULE",
  "EVENT",
] as const;
export type EntityType = (typeof ENTITY_TYPES)[number];
export type IssueStatus = "OPEN" | "RESOLVED" | "DISMISSED";
export type SaveState = "CLEAN" | "DIRTY" | "SAVING" | "SAVED_LOCAL" | "ERROR";
export interface StudioStory {
  id: string;
  title: string;
  genre: string;
  synopsis: string;
  cover: string;
  archived: boolean;
  updatedAt: string;
  lastChapterId: string | null;
}
export interface StudioChapter {
  id: string;
  storyId: string;
  title: string;
  order: number;
  document: JSONContent;
  revision: number;
  updatedAt: string;
  status: "DRAFT" | "IN_PROGRESS";
  beats: string;
}
export interface CanonEntity {
  id: string;
  storyId: string;
  name: string;
  aliases: string[];
  type: EntityType;
  summary: string;
  portrait?: string;
  relations: { label: string; targetId: string }[];
}
export interface EvidenceAnchor {
  chapterId: string;
  blockId: string;
  excerpt: string;
  revision: number;
}
export interface CanonFact {
  id: string;
  storyId: string;
  entityId: string;
  attribute: string;
  value: string;
  fromChapterId: string;
  untilChapterId: string | null;
  source: EvidenceAnchor | null;
  status: "CONFIRMED" | "PROPOSED" | "REJECTED";
  replacesFactId: string | null;
  createdAt: string;
  decidedAt: string | null;
}
export interface ContinuityIssue {
  id: string;
  storyId: string;
  chapterId: string;
  entityId: string;
  factIds: string[];
  kind: "CONTRADICTION" | "AMBIGUITY" | "MISSING_CONTEXT";
  severity: "CRITICAL" | "WARNING" | "INFO";
  status: IssueStatus;
  title: string;
  explanation: string;
  suggestion: string;
  anchor: EvidenceAnchor;
  note: string;
  history: { status: IssueStatus; note: string; at: string }[];
}
export interface StudioSnapshot {
  version: 2;
  intelligence: IntelligenceState;
  stories: StudioStory[];
  chapters: StudioChapter[];
  entities: CanonEntity[];
  facts: CanonFact[];
  issues: ContinuityIssue[];
}
export type StudioCommand =
  | IntelligenceCommand
  | { type: "CREATE_STORY"; title: string; genre: string; synopsis: string }
  | {
      type: "UPDATE_STORY";
      id: string;
      title?: string;
      synopsis?: string;
      archived?: boolean;
    }
  | { type: "CREATE_CHAPTER"; storyId: string; title: string }
  | { type: "RENAME_CHAPTER"; storyId: string; id: string; title: string }
  | { type: "MOVE_CHAPTER"; storyId: string; id: string; direction: -1 | 1 }
  | {
      type: "SAVE_CHAPTER";
      storyId: string;
      id: string;
      document: JSONContent;
      title: string;
      beats: string;
      expectedRevision: number;
    }
  | { type: "SAVE_ENTITY"; entity: CanonEntity }
  | { type: "PROPOSE_FACT"; fact: CanonFact }
  | { type: "DECIDE_FACT"; storyId: string; id: string; approve: boolean }
  | {
      type: "REVIEW_ISSUE";
      storyId: string;
      id: string;
      status: IssueStatus;
      note: string;
    };
export interface StudioRepository {
  getSnapshot(): Promise<StudioSnapshot>;
  execute(command: StudioCommand): Promise<StudioSnapshot>;
}
