"use client";
import { useState } from "react";
import { useStudio } from "../shared/studio-provider";
import { Modal } from "../shared/modal";
import { chaptersFor, documentText } from "../data/selectors";
import type { CanonFact, EvidenceAnchor } from "../data/contracts";
import s from "../shared/studio.module.css";
export function ProposalForm({
  storyId,
  entityId,
  replaces,
  anchor,
  onClose,
}: {
  storyId: string;
  entityId: string;
  replaces?: CanonFact;
  anchor?: EvidenceAnchor;
  onClose: () => void;
}) {
  const { state, execute } = useStudio();
  const [error, setError] = useState(""),
    [pending, setPending] = useState(false);
  const chapters = chaptersFor(state, storyId);
  const [sourceChapter, setSourceChapter] = useState(anchor?.chapterId ?? "");
  const [sourceBlock, setSourceBlock] = useState(anchor?.blockId ?? "");
  const source = chapters.find((chapter) => chapter.id === sourceChapter);
  const blocks = (source?.document.content ?? []).filter(
    (block) => block.attrs?.id && documentText(block),
  );
  return (
    <Modal title="Propose Canon change" onClose={onClose}>
      <form
        className={s.form}
        onSubmit={async (event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          setPending(true);
          try {
            await execute({
              type: "PROPOSE_FACT",
              fact: {
                id: crypto.randomUUID(),
                storyId,
                entityId,
                attribute: String(data.get("attribute")),
                value: String(data.get("value")),
                fromChapterId: String(data.get("from")),
                untilChapterId: null,
                source:
                  source && sourceBlock
                    ? {
                        chapterId: source.id,
                        blockId: sourceBlock,
                        excerpt: documentText(
                          blocks.find(
                            (block) => block.attrs?.id === sourceBlock,
                          ) ?? {},
                        ),
                        revision: source.revision,
                      }
                    : null,
                status: "PROPOSED",
                replacesFactId: replaces?.id ?? null,
                createdAt: new Date().toISOString(),
                decidedAt: null,
              },
            });
            onClose();
          } catch (reason) {
            setError(
              reason instanceof Error ? reason.message : "Proposal failed.",
            );
          } finally {
            setPending(false);
          }
        }}
      >
        <label>
          Attribute
          <input
            name="attribute"
            required
            maxLength={200}
            defaultValue={replaces?.attribute}
          />
        </label>
        <label>
          Proposed value
          <textarea name="value" required maxLength={2000} />
        </label>
        <label>
          Effective from
          <select
            name="from"
            defaultValue={anchor?.chapterId ?? replaces?.fromChapterId}
          >
            {chapters.map((c) => (
              <option key={c.id} value={c.id}>
                Ch. {c.order} - {c.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          Evidence chapter
          <select
            value={sourceChapter}
            onChange={(event) => {
              setSourceChapter(event.target.value);
              setSourceBlock("");
            }}
          >
            <option value="">No evidence attached</option>
            {chapters.map((chapter) => (
              <option key={chapter.id} value={chapter.id}>
                Ch. {chapter.order} - {chapter.title}
              </option>
            ))}
          </select>
        </label>
        {source && (
          <label>
            Evidence passage
            <select
              required
              value={sourceBlock}
              onChange={(event) => setSourceBlock(event.target.value)}
            >
              <option value="">Select passage</option>
              {blocks.map((block, index) => (
                <option
                  key={String(block.attrs!.id)}
                  value={String(block.attrs!.id)}
                >
                  Paragraph {index + 1}: {documentText(block).slice(0, 70)}
                </option>
              ))}
            </select>
          </label>
        )}
        <p className={s.muted}>
          {sourceBlock
            ? documentText(
                blocks.find((block) => block.attrs?.id === sourceBlock) ?? {},
              )
            : "Evidence missing"}
        </p>
        {replaces && <p className={s.notice}>Replaces: {replaces.value}</p>}
        {error && (
          <p role="alert" className={s.error}>
            {error}
          </p>
        )}
        <button className={s.button} disabled={pending || !chapters.length}>
          {pending ? "Saving..." : "Save proposal"}
        </button>
      </form>
    </Modal>
  );
}
export function SourceEvidence({ fact }: { fact: CanonFact }) {
  const { state } = useStudio();
  const source = fact.source;
  const chapter = state.chapters.find((c) => c.id === source?.chapterId);
  return (
    <p className={s.muted}>
      {source
        ? chapter
          ? `Ch. ${chapter.order}: ${source.excerpt || documentText(chapter.document).slice(0, 100)}`
          : "Source chapter unavailable"
        : "Evidence missing"}
    </p>
  );
}
