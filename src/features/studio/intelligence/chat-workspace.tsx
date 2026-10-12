"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import {
  ArrowUp,
  Square,
  BookOpen,
  SlidersHorizontal,
  PanelRight,
  RotateCcw,
  X,
  Check,
  Feather,
} from "lucide-react";
import { useStudio } from "../shared/studio-provider";
import { StudioLink } from "../shared/studio-link";
import { Modal } from "../shared/modal";
import { chaptersFor, documentText } from "../data/selectors";
import type { StudioSnapshot } from "../data/contracts";
import { buildContext } from "./context";
import { defaultGenerationOptions, type DraftCandidate } from "./contracts";
import { useConversation } from "./use-conversation";
import s from "../shared/studio.module.css";
import c from "./chat.module.css";
export function ChatWorkspace({
  storyId,
  chapterId = null,
  beforeAction,
  onApplied,
}: {
  storyId: string;
  chapterId?: string | null;
  beforeAction?: () => Promise<boolean>;
  onApplied?: (snapshot: StudioSnapshot) => void;
}) {
  const { state, execute } = useStudio(),
    chat = useConversation(storyId, chapterId);
  const story = state.stories.find((story) => story.id === storyId),
    chapter = state.chapters.find(
      (chapter) => chapter.id === chapterId && chapter.storyId === storyId,
    ),
    chapters = chaptersFor(state, storyId);
  const [previewId, setPreviewId] = useState<string | null>(null),
    [contextOpen, setContextOpen] = useState(false),
    [settingsOpen, setSettingsOpen] = useState(false),
    [referenceOpen, setReferenceOpen] = useState(false);
  const [options, setOptions] = useState(
      chat.latest?.options ?? defaultGenerationOptions,
    ),
    [error, setError] = useState(""),
    [working, setWorking] = useState(false),
    [applyCandidate, setApplyCandidate] = useState<DraftCandidate | null>(null),
    [editing, setEditing] = useState(false),
    [editBody, setEditBody] = useState("");
  const [selectedChapters, setSelectedChapters] = useState<string[]>(
    chapters.map((chapter) => chapter.id),
  );
  const bottom = useRef<HTMLDivElement>(null),
    composer = useRef<HTMLTextAreaElement>(null);
  const candidate = state.intelligence.candidates.find(
    (candidate) => candidate.id === (previewId ?? chat.latest?.candidateId),
  );
  const liveContext = buildContext(
    state,
    storyId,
    chapterId,
    chat.prompt || chapter?.beats || "Continue the story",
    options,
  );
  const activeContext = chat.latest?.context ?? liveContext;
  const backups = state.intelligence.backups.filter(
    (backup) => backup.chapterId === chapterId && backup.storyId === storyId,
  );
  useEffect(() => {
    if (chat.busy)
      bottom.current?.scrollIntoView({ block: "nearest", behavior: "auto" });
  }, [chat.latest?.partial, chat.busy]);
  if (!story)
    return (
      <div className={s.empty}>
        <h1>Story not found</h1>
      </div>
    );
  async function act(action: () => Promise<void>) {
    setWorking(true);
    setError("");
    try {
      if (beforeAction && !(await beforeAction())) return;
      await action();
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "This action could not be saved.",
      );
    } finally {
      setWorking(false);
    }
  }
  async function send(
    intent: "DISCUSS" | "OUTLINE" | "BEATS" | "DRAFT",
    text = chat.prompt,
  ) {
    if (!text.trim() || chat.busy) return;
    await act(async () => {
      await chat.start(text, intent, options);
    });
  }
  function messageIntent() {
    if (!chapter) return chapters.length ? "DISCUSS" : "OUTLINE";
    if (
      /^(write|generate|continue)\b/i.test(chat.prompt.trim()) &&
      chapter.beats.trim()
    )
      return "DRAFT";
    if (!chapter.beats.trim() || /\b(plan|beats|outline)\b/i.test(chat.prompt))
      return "BEATS";
    return "DISCUSS";
  }
  async function apply(
    candidate: DraftCandidate,
    operation: "APPEND" | "REPLACE" | "OUTLINE" | "BEATS",
  ) {
    await act(async () => {
      const snapshot = await execute({
        type: "AI_APPLY",
        storyId,
        candidateId: candidate.id,
        operation,
        expectedRevision: chapter?.revision ?? null,
      });
      onApplied?.(snapshot);
      setApplyCandidate(null);
      setPreviewId(null);
    });
  }
  const status = chat.busy
    ? (
        {
          PREPARING: "Preparing context",
          PLANNING: "Planning scenes",
          STREAMING: "Writing draft",
          CHECKING: "Reviewing references",
        } as Record<string, string>
      )[chat.latest?.status ?? "PREPARING"]
    : liveContext.status === "READY"
      ? "Context ready"
      : liveContext.status === "NEEDS_UPDATE"
        ? "Needs update"
        : "Needs clarification";
  return (
    <section
      className={`${c.workspace} ${previewId ? c.withPreview : ""}`}
      aria-label="Intelligence workspace"
    >
      <header className={c.header}>
        <div className={c.identity}>
          {story.cover && (
            <Image src={story.cover} alt="" width={28} height={38} />
          )}
          <div>
            <h1>{chapter?.title ?? story.title}</h1>
            <span>
              {chapter ? `Chapter ${chapter.order}` : "Story development"}
            </span>
          </div>
        </div>
        <div className={s.actions}>
          <span className={c.demo}>Demo responses</span>
          <button
            className={s.iconButton}
            title="Reference context"
            aria-label="Reference context"
            onClick={() => setContextOpen(true)}
          >
            <BookOpen size={17} />
          </button>
          <button
            className={s.iconButton}
            title="Open preview"
            aria-label="Open preview"
            disabled={!candidate}
            onClick={() => setPreviewId(candidate?.id ?? null)}
          >
            <PanelRight size={17} />
          </button>
        </div>
      </header>
      <div className={c.columns}>
        <div className={c.chat}>
          <div className={c.messages} aria-label="Conversation">
            {!chat.conversation?.messages.length && (
              <div className={c.empty}>
                <Feather size={28} />
                <h2>
                  {chapter
                    ? "Where should this chapter go?"
                    : "What story is on your mind?"}
                </h2>
                <div className={c.starters}>
                  {(chapter
                    ? ["Plan this chapter", "Write from my beats"]
                    : ["Develop an idea", "Plan a story outline"]
                  ).map((text) => (
                    <button
                      className={s.outline}
                      key={text}
                      onClick={() => {
                        chat.setPrompt(text);
                        composer.current?.focus();
                      }}
                    >
                      {text}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {chat.conversation?.messages.map((message) => {
              const run = chat.runs.find((run) => run.id === message.runId),
                item = state.intelligence.candidates.find(
                  (candidate) => candidate.id === run?.candidateId,
                );
              return (
                <article
                  key={message.id}
                  className={message.role === "user" ? c.user : c.assistant}
                >
                  <span className={c.role}>
                    {message.role === "user" ? "You" : "InkFlow"}
                  </span>
                  <div className={c.messageText}>{message.text}</div>
                  {item && message.role === "assistant" && (
                    <div className={c.result}>
                      <span>
                        {item.kind === "OUTLINE"
                          ? "Story outline"
                          : item.kind === "BEATS"
                            ? "Scene beats"
                            : "Chapter draft"}{" "}
                        · {item.status.toLowerCase()}
                      </span>
                      <button
                        className={s.textButton}
                        onClick={() => {
                          setEditing(false);
                          setPreviewId(item.id);
                        }}
                      >
                        Review <PanelRight size={14} />
                      </button>
                      {item.kind === "BEATS" && item.status === "APPLIED" && (
                        <button
                          className={s.textButton}
                          disabled={chat.busy || working}
                          onClick={() =>
                            void send(
                              "DRAFT",
                              `Write this chapter using the approved scene beats. ${chat.prompt}`,
                            )
                          }
                        >
                          Generate chapter <ArrowUp size={14} />
                        </button>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
            {chat.busy && (
              <article className={c.assistant}>
                <span className={c.role}>InkFlow</span>
                <p className={c.phase} role="status">
                  {status}
                </p>
                <div className={c.messageText}>{chat.latest?.partial}</div>
              </article>
            )}
            {chat.latest &&
              ["STOPPED", "ERROR"].includes(chat.latest.status) && (
                <div className={c.interrupted}>
                  <p>
                    {chat.latest.error ||
                      "Generation stopped. The existing manuscript is unchanged."}
                  </p>
                  {chat.latest.partial && (
                    <details>
                      <summary>Partial response</summary>
                      <p className={c.messageText}>{chat.latest.partial}</p>
                    </details>
                  )}
                  <button
                    className={s.outline}
                    disabled={chat.busy}
                    onClick={() =>
                      void send(chat.latest!.intent, chat.latest!.prompt)
                    }
                  >
                    <RotateCcw size={15} />
                    Retry
                  </button>
                </div>
              )}
            <div ref={bottom} />
          </div>
          <div className={c.composerArea}>
            {(error || chat.error) && (
              <p className={s.error} role="alert">
                {error || chat.error}
              </p>
            )}
            <div className={c.contextLine}>
              <button
                className={s.textButton}
                onClick={() => setContextOpen(true)}
              >
                <span
                  className={
                    liveContext.status === "READY" ? c.ready : c.attention
                  }
                />
                {status}
              </button>
              {chapter && liveContext.status === "NEEDS_UPDATE" && (
                <button
                  className={s.textButton}
                  disabled={working || chat.busy}
                  onClick={() => {
                    setSelectedChapters(chapters.map((chapter) => chapter.id));
                    setReferenceOpen(true);
                  }}
                >
                  Update reference
                </button>
              )}
            </div>
            <form
              className={c.composer}
              onSubmit={(event) => {
                event.preventDefault();
                void send(messageIntent());
              }}
            >
              <textarea
                ref={composer}
                aria-label="Message InkFlow"
                placeholder={
                  chapter
                    ? "Describe the next scene..."
                    : "Describe your story idea..."
                }
                maxLength={12000}
                rows={2}
                value={chat.prompt}
                disabled={chat.busy}
                onChange={(event) => {
                  chat.setPrompt(event.target.value);
                  event.target.style.height = "auto";
                  event.target.style.height = `${Math.min(180, event.target.scrollHeight)}px`;
                }}
                onBlur={() =>
                  void execute({
                    type: "AI_COMPOSER",
                    storyId,
                    chapterId,
                    text: chat.prompt,
                  }).catch((reason) => setError(String(reason)))
                }
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !event.shiftKey &&
                    !event.nativeEvent.isComposing
                  ) {
                    event.preventDefault();
                    if (chat.prompt.trim()) void send(messageIntent());
                  }
                }}
              />
              <div className={c.composerTools}>
                <button
                  type="button"
                  className={s.iconButton}
                  aria-label="Generation options"
                  title="Generation options"
                  onClick={() => setSettingsOpen(true)}
                >
                  <SlidersHorizontal size={17} />
                </button>
                <span>
                  {options.pov || "Story voice"} · {options.length}
                </span>
                {chat.busy ? (
                  <button
                    type="button"
                    className={s.iconButton}
                    aria-label="Stop generation"
                    title="Stop"
                    onClick={() => void chat.stop()}
                  >
                    <Square size={16} />
                  </button>
                ) : (
                  <button
                    className={s.button}
                    disabled={!chat.prompt.trim() || working}
                    aria-label="Send message"
                    title="Send"
                  >
                    <ArrowUp size={18} />
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
        {previewId && candidate && (
          <aside className={c.preview} aria-label="Draft preview">
            <header>
              <span>
                {candidate.kind === "OUTLINE"
                  ? "Outline"
                  : candidate.kind === "BEATS"
                    ? "Scene beats"
                    : "Draft preview"}
              </span>
              <button
                className={s.iconButton}
                aria-label="Close preview"
                title="Close preview"
                onClick={() => setPreviewId(null)}
              >
                <X size={17} />
              </button>
            </header>
            <div className={c.previewBody}>
              <h2>{candidate.title}</h2>
              {editing ? (
                <textarea
                  className={c.editPreview}
                  aria-label="Edit generated preview"
                  value={editBody}
                  onChange={(event) => setEditBody(event.target.value)}
                />
              ) : (
                <div
                  className={
                    candidate.kind === "DRAFT" ? c.prose : c.messageText
                  }
                >
                  {candidate.body}
                </div>
              )}
              {candidate.outline.map((item, index) => (
                <div className={c.outlineChapter} key={item.title}>
                  <small>CHAPTER {index + 1}</small>
                  <h3>{item.title}</h3>
                  <p>{item.beats}</p>
                </div>
              ))}
              {candidate.findings.length > 0 && (
                <div className={s.notice}>
                  {candidate.findings.map((finding) => (
                    <p key={finding.title}>{finding.title}</p>
                  ))}
                  <StudioLink
                    className={s.textButton}
                    href={`/studio/stories/${storyId}/review`}
                  >
                    Open Continuity Review
                  </StudioLink>
                </div>
              )}
            </div>
            <footer>
              {candidate.status === "PENDING" ? (
                <>
                  {editing ? (
                    <button
                      className={s.button}
                      disabled={working}
                      onClick={() =>
                        void act(async () => {
                          await execute({
                            type: "AI_EDIT_CANDIDATE",
                            storyId,
                            candidateId: candidate.id,
                            body: editBody,
                          });
                          setEditing(false);
                        })
                      }
                    >
                      <Check size={16} />
                      Save preview
                    </button>
                  ) : (
                    <>
                      <button
                        className={s.button}
                        disabled={working || chat.busy}
                        onClick={() => {
                          if (candidate.kind === "OUTLINE")
                            void apply(candidate, "OUTLINE");
                          else if (candidate.kind === "BEATS")
                            void apply(candidate, "BEATS");
                          else if (
                            chapter &&
                            documentText(chapter.document).trim()
                          )
                            setApplyCandidate(candidate);
                          else void apply(candidate, "REPLACE");
                        }}
                      >
                        {candidate.kind === "OUTLINE"
                          ? "Use outline"
                          : candidate.kind === "BEATS"
                            ? "Use beats"
                            : "Use draft"}
                      </button>
                      {candidate.kind !== "OUTLINE" && (
                        <button
                          className={s.textButton}
                          onClick={() => {
                            setEditBody(candidate.body);
                            setEditing(true);
                          }}
                        >
                          Revise
                        </button>
                      )}
                      <button
                        className={s.textButton}
                        disabled={working}
                        onClick={() =>
                          void act(async () => {
                            await execute({
                              type: "AI_DISCARD",
                              storyId,
                              candidateId: candidate.id,
                            });
                            setPreviewId(null);
                          })
                        }
                      >
                        Discard
                      </button>
                    </>
                  )}
                </>
              ) : (
                <span>
                  {candidate.status === "APPLIED"
                    ? "Accepted into your story"
                    : "Discarded"}
                </span>
              )}
            </footer>
          </aside>
        )}
      </div>
      {contextOpen && (
        <Modal title="Story context" onClose={() => setContextOpen(false)}>
          <p className={c.phase}>
            {liveContext.status === "READY"
              ? "Context ready"
              : liveContext.reason}
          </p>
          <p className={s.muted}>
            Through Chapter {liveContext.throughChapter}. Saved reference
            excerpts; summaries and review are simulated.
          </p>
          {chapter && (
            <button
              className={s.outline}
              disabled={chat.busy}
              onClick={() => {
                setContextOpen(false);
                setSelectedChapters(chapters.map((chapter) => chapter.id));
                setReferenceOpen(true);
              }}
            >
              Choose reference chapters
            </button>
          )}
          <details className={s.history}>
            <summary>Sources used ({activeContext.sections.length})</summary>
            {activeContext.sections.map((section, index) => (
              <div key={index} className={s.fact}>
                <strong>{section.kind}</strong>
                <p>{section.text}</p>
                {section.sources.map((source, i) => (
                  <StudioLink
                    key={i}
                    className={s.textButton}
                    href={`/studio/stories/${storyId}/chapters/${source.chapterId}${source.blockId ? `?block=${encodeURIComponent(source.blockId)}` : ""}`}
                  >
                    Source chapter · revision {source.revision}
                  </StudioLink>
                ))}
              </div>
            ))}
          </details>
          {backups.length > 0 && (
            <details className={s.history}>
              <summary>Previous manuscript versions ({backups.length})</summary>
              {backups
                .slice()
                .reverse()
                .map((backup) => (
                  <div className={s.fact} key={backup.id}>
                    <strong>Revision {backup.revision}</strong>
                    <p>
                      {documentText(backup.document).slice(0, 160) ||
                        "Empty manuscript"}
                    </p>
                    <button
                      className={s.outline}
                      disabled={working}
                      onClick={() =>
                        void act(async () => {
                          const snapshot = await execute({
                            type: "AI_RESTORE",
                            storyId,
                            backupId: backup.id,
                            expectedRevision: chapter!.revision,
                          });
                          onApplied?.(snapshot);
                          setContextOpen(false);
                        })
                      }
                    >
                      Restore this version
                    </button>
                  </div>
                ))}
            </details>
          )}
        </Modal>
      )}
      {referenceOpen && (
        <Modal
          title="Choose story reference"
          onClose={() => setReferenceOpen(false)}
        >
          <form
            className={s.form}
            onSubmit={(event) => {
              event.preventDefault();
              void act(async () => {
                await execute({
                  type: "AI_CHECKPOINT",
                  storyId,
                  chapterIds: selectedChapters,
                });
                setReferenceOpen(false);
              });
            }}
          >
            <div className={c.referenceList}>
              {chapters.map((chapter) => (
                <label key={chapter.id}>
                  <input
                    type="checkbox"
                    checked={selectedChapters.includes(chapter.id)}
                    onChange={(event) =>
                      setSelectedChapters((ids) =>
                        event.target.checked
                          ? [...ids, chapter.id]
                          : ids.filter((id) => id !== chapter.id),
                      )
                    }
                  />
                  <span>
                    Ch. {chapter.order} · {chapter.title}
                  </span>
                </label>
              ))}
            </div>
            <button className={s.button} disabled={working}>
              Use saved chapters
            </button>
          </form>
        </Modal>
      )}
      {settingsOpen && (
        <Modal
          title="Generation options"
          onClose={() => setSettingsOpen(false)}
        >
          <div className={s.form}>
            <label>
              Point of view
              <input
                value={options.pov}
                placeholder="Existing narrative voice"
                onChange={(event) =>
                  setOptions({ ...options, pov: event.target.value })
                }
              />
            </label>
            <label>
              Tense
              <select
                value={options.tense}
                onChange={(event) =>
                  setOptions({
                    ...options,
                    tense: event.target.value as typeof options.tense,
                  })
                }
              >
                <option value="past">Past</option>
                <option value="present">Present</option>
              </select>
            </label>
            <label>
              Length
              <select
                value={options.length}
                onChange={(event) =>
                  setOptions({
                    ...options,
                    length: event.target.value as typeof options.length,
                  })
                }
              >
                <option value="short">Short</option>
                <option value="standard">Standard</option>
              </select>
            </label>
            <label>
              Timeline
              <select
                value={options.chronology}
                onChange={(event) =>
                  setOptions({
                    ...options,
                    chronology: event.target.value as typeof options.chronology,
                  })
                }
              >
                <option value="linear">Continue timeline</option>
                <option value="flashback">Flashback</option>
              </select>
            </label>
            {options.chronology === "flashback" && (
              <label>
                Earlier chapter boundary
                <select
                  value={options.asOfChapterId ?? ""}
                  onChange={(event) =>
                    setOptions({
                      ...options,
                      asOfChapterId: event.target.value || null,
                    })
                  }
                >
                  <option value="">Choose boundary</option>
                  {chapters
                    .filter((c) => !chapter || c.order <= chapter.order)
                    .map((chapter) => (
                      <option key={chapter.id} value={chapter.id}>
                        Before Ch. {chapter.order}
                      </option>
                    ))}
                </select>
              </label>
            )}
            <button className={s.button} onClick={() => setSettingsOpen(false)}>
              Done
            </button>
          </div>
        </Modal>
      )}
      {applyCandidate && (
        <Modal
          title="Apply chapter draft"
          onClose={() => setApplyCandidate(null)}
        >
          <div className={c.comparison}>
            <div>
              <h3>Current manuscript</h3>
              <p>{documentText(chapter!.document)}</p>
            </div>
            <div>
              <h3>Candidate</h3>
              <p>{applyCandidate.body}</p>
            </div>
          </div>
          <div className={s.actions}>
            <button
              className={s.button}
              disabled={working}
              onClick={() => void apply(applyCandidate, "APPEND")}
            >
              Append
            </button>
            <button
              className={s.outline}
              disabled={working}
              onClick={() => void apply(applyCandidate, "REPLACE")}
            >
              Replace
            </button>
          </div>
          {error && (
            <p role="alert" className={s.error}>
              {error}
            </p>
          )}
        </Modal>
      )}
    </section>
  );
}
