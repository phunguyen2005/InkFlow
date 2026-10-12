import type { JSONContent } from "@tiptap/core";
import type { CanonFact, StudioSnapshot, EvidenceAnchor } from "./contracts";

export function documentText(document: JSONContent): string {
  if (document.text) return document.text;
  return (document.content ?? [])
    .map(documentText)
    .join(document.type === "doc" ? "\n\n" : "");
}
export function wordCount(document: JSONContent): number {
  return documentText(document).trim().split(/\s+/u).filter(Boolean).length;
}
export function chaptersFor(state: StudioSnapshot, storyId: string) {
  return state.chapters
    .filter((chapter) => chapter.storyId === storyId)
    .sort((a, b) => a.order - b.order);
}
export function factsAsOf(
  state: StudioSnapshot,
  storyId: string,
  chapterId: string,
): CanonFact[] {
  const chapters = chaptersFor(state, storyId);
  const position = chapters.findIndex((chapter) => chapter.id === chapterId);
  if (position < 0) return [];
  return state.facts.filter((fact) => {
    if (fact.storyId !== storyId || fact.status !== "CONFIRMED") return false;
    const from = chapters.findIndex(
      (chapter) => chapter.id === fact.fromChapterId,
    );
    const until = fact.untilChapterId
      ? chapters.findIndex((chapter) => chapter.id === fact.untilChapterId)
      : chapters.length;
    return from >= 0 && until >= 0 && position >= from && position < until;
  });
}
export function anchoredBlock(
  document: JSONContent,
  anchor: EvidenceAnchor,
): JSONContent | null {
  for (const block of document.content ?? []) {
    if (block.attrs?.id === anchor.blockId) return block;
    const nested = anchoredBlock(block, anchor);
    if (nested) return nested;
  }
  return null;
}
export function evidenceMatches(
  state: StudioSnapshot,
  storyId: string,
  anchor: EvidenceAnchor,
) {
  const chapter = state.chapters.find(
    (chapter) => chapter.id === anchor.chapterId && chapter.storyId === storyId,
  );
  const block = chapter && anchoredBlock(chapter.document, anchor);
  return Boolean(block && documentText(block).includes(anchor.excerpt));
}
