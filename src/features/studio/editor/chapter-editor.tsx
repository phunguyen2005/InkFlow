"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import UniqueID from "@tiptap/extension-unique-id";
import {
  Bold,
  Italic,
  Undo2,
  Redo2,
  Save,
  Download,
  PanelLeft,
  PanelRight,
  Maximize2,
  Minimize2,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { useStudio } from "../shared/studio-provider";
import { StudioLink } from "../shared/studio-link";
import {
  chaptersFor,
  factsAsOf,
  documentText,
  wordCount,
} from "../data/selectors";
import type { StudioChapter, SaveState } from "../data/contracts";
import s from "../shared/studio.module.css";
import e from "./editor.module.css";
import { useEditorPreferences } from "./use-editor-preferences";
import { usePanelFocus } from "../shared/use-panel-focus";
import { ChatWorkspace } from "../intelligence/chat-workspace";
import type { StudioSnapshot } from "../data/contracts";

export function ChapterEditor({
  storyId,
  chapterId,
  issueId,
  blockId,
}: {
  storyId: string;
  chapterId: string;
  issueId?: string;
  blockId?: string;
}) {
  const { state } = useStudio();
  const chapter = state.chapters.find(
    (c) => c.id === chapterId && c.storyId === storyId,
  );
  return chapter ? (
    <EditorWorkspace initial={chapter} issueId={issueId} blockId={blockId} />
  ) : (
    <main id="main" className={s.page}>
      <h1>Chapter not found</h1>
      <StudioLink href="/studio">Return to Studio</StudioLink>
    </main>
  );
}
function EditorWorkspace({
  initial,
  issueId,
  blockId,
}: {
  initial: StudioChapter;
  issueId?: string;
  blockId?: string;
}) {
  const { state, execute, registerGuard } = useStudio();
  const [title, setTitle] = useState(initial.title),
    [beats, setBeats] = useState(initial.beats);
  const [status, setStatus] = useState<SaveState>("CLEAN"),
    [error, setError] = useState("");
  const [words, setWords] = useState(wordCount(initial.document));
  const [left, setLeft] = useState(false),
    [right, setRight] = useState(false),
    [focus, setFocus] = useState(false);
  const [tab, setTab] = useState("Canon");
  const [preferences, updatePreferences] = useEditorPreferences();
  const { theme, mode } = preferences;
  const [appearance, setAppearance] = useState(false);
  const writingPosition = useRef(0);
  const [mobileNavigation, setMobileNavigation] = useState(false),
    [mobileContext, setMobileContext] = useState(false);
  const navigationRef = useRef<HTMLElement>(null),
    contextRef = useRef<HTMLElement>(null);
  const closeNavigation = useCallback(() => setMobileNavigation(false), []),
    closeContext = useCallback(() => setMobileContext(false), []);
  usePanelFocus(mobileNavigation, navigationRef, closeNavigation);
  usePanelFocus(mobileContext, contextRef, closeContext);
  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-studio-root]");
    if (root) root.dataset.focus = String(focus);
    return () => {
      if (root) delete root.dataset.focus;
    };
  }, [focus]);
  const draft = useRef({ ...initial }),
    dirty = useRef(false),
    sequence = useRef(0),
    timer = useRef<ReturnType<typeof setTimeout> | null>(null),
    flight = useRef<Promise<boolean> | null>(null);
  const save = useCallback(
    async function flush(): Promise<boolean> {
      if (flight.current) {
        if (!(await flight.current)) return false;
        return flush();
      }
      if (!dirty.current) return true;
      const version = sequence.current,
        payload = structuredClone(draft.current);
      setStatus("SAVING");
      setError("");
      const operation = (async () => {
        try {
          const result = await execute({
            type: "SAVE_CHAPTER",
            storyId: payload.storyId,
            id: payload.id,
            title: payload.title,
            beats: payload.beats,
            document: payload.document,
            expectedRevision: payload.revision,
          });
          draft.current.revision = result.chapters.find(
            (c) => c.id === payload.id,
          )!.revision;
          dirty.current = sequence.current !== version;
          setStatus(dirty.current ? "DIRTY" : "SAVED_LOCAL");
          return true;
        } catch (reason) {
          setError(
            reason instanceof Error
              ? reason.message
              : "Local save failed. Your draft is still open.",
          );
          setStatus("ERROR");
          return false;
        } finally {
          flight.current = null;
        }
      })();
      flight.current = operation;
      if (!(await operation)) return false;
      return dirty.current ? flush() : true;
    },
    [execute],
  );
  const saveRef = useRef(save);
  useEffect(() => {
    saveRef.current = save;
  }, [save]);
  const changed = useCallback(() => {
    dirty.current = true;
    sequence.current++;
    setStatus("DIRTY");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => void saveRef.current(), 700);
  }, []);
  const editor = useEditor({
    extensions: [
      StarterKit,
      UniqueID.configure({ types: ["paragraph", "heading"] }),
    ],
    content: initial.document,
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    editorProps: {
      attributes: {
        "aria-label": "Chapter manuscript",
        role: "textbox",
        "aria-multiline": "true",
      },
    },
    onUpdate: ({ editor }) => {
      draft.current.document = editor.getJSON();
      setWords(wordCount(draft.current.document));
      changed();
    },
    onBlur: () => void saveRef.current(),
  });
  useEffect(() => registerGuard(() => saveRef.current()), [registerGuard]);
  useEffect(() => {
    const unload = (event: BeforeUnloadEvent) => {
      if (dirty.current) {
        event.preventDefault();
      }
    };
    const key = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        void saveRef.current();
      }
      if (event.key === "Escape" && !document.querySelector("dialog[open]"))
        setFocus(false);
    };
    window.addEventListener("beforeunload", unload);
    window.addEventListener("keydown", key);
    return () => {
      if (dirty.current) void saveRef.current();
      if (timer.current) clearTimeout(timer.current);
      window.removeEventListener("beforeunload", unload);
      window.removeEventListener("keydown", key);
    };
  }, []);
  useEffect(() => {
    if (!editor || !blockId) return;
    let position: number | null = null;
    editor.state.doc.descendants((node, pos) => {
      if (node.attrs.id === blockId) position = pos + 1;
    });
    if (position !== null) {
      editor.commands.setTextSelection(position);
      editor.commands.scrollIntoView();
    }
  }, [editor, blockId]);
  const chapters = chaptersFor(state, initial.storyId),
    index = chapters.findIndex((c) => c.id === initial.id);
  const facts = factsAsOf(state, initial.storyId, initial.id),
    issues = state.issues.filter((i) => i.chapterId === initial.id);
  function applied(snapshot: StudioSnapshot) {
    const chapter = snapshot.chapters.find((c) => c.id === initial.id)!;
    draft.current = { ...chapter };
    dirty.current = false;
    sequence.current++;
    setTitle(chapter.title);
    setBeats(chapter.beats);
    setWords(wordCount(chapter.document));
    setStatus("SAVED_LOCAL");
    editor?.commands.setContent(chapter.document, { emitUpdate: false });
  }
  async function switchMode(next: "creative" | "intelligence") {
    if (next === mode) return;
    if (!(await saveRef.current())) return;
    if (next === "intelligence") writingPosition.current = window.scrollY;
    updatePreferences({ mode: next });
    if (next === "creative")
      requestAnimationFrame(() =>
        window.scrollTo({ top: writingPosition.current, behavior: "instant" }),
      );
  }
  function exportDraft() {
    const blob = new Blob(
      [
        JSON.stringify(
          { ...draft.current, plainText: documentText(draft.current.document) },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob),
      a = document.createElement("a");
    a.href = url;
    a.download = `${initial.id}-draft.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <main id="main" className={`${e.workspace} ${focus ? e.focus : ""}`}>
      <header className={e.bar}>
        <div className={s.actions}>
          <button
            className={s.iconButton}
            title="Manuscript navigation"
            aria-label="Toggle manuscript navigation"
            hidden={mode !== "creative"}
            aria-pressed={left}
            onClick={() => {
              setLeft(!left);
              setMobileNavigation(!mobileNavigation);
            }}
          >
            <PanelLeft size={17} />
          </button>
          <span className={s.muted}>Chapter {index + 1}</span>
          <div className={s.tabGroup} role="group" aria-label="Workspace mode">
            <button
              aria-pressed={mode === "creative"}
              onClick={() => void switchMode("creative")}
            >
              Creative
            </button>
            <button
              aria-pressed={mode === "intelligence"}
              onClick={() => void switchMode("intelligence")}
            >
              Intelligence
            </button>
          </div>
        </div>
        <div className={s.actions}>
          <span role="status" hidden={mode !== "creative"}>
            {
              {
                CLEAN: "Saved locally",
                DIRTY: "Unsaved changes",
                SAVING: "Saving...",
                SAVED_LOCAL: "Saved locally",
                ERROR: "Save failed",
              }[status]
            }
          </span>
          <button
            className={s.iconButton}
            aria-label="Save chapter"
            hidden={mode !== "creative"}
            title="Save chapter"
            onClick={() => void save()}
          >
            <Save size={17} />
          </button>
          <button
            className={s.iconButton}
            aria-label="Export draft"
            hidden={mode !== "creative"}
            title="Export draft"
            onClick={exportDraft}
          >
            <Download size={17} />
          </button>
          <button
            className={s.iconButton}
            aria-label="Focus mode"
            title="Focus mode"
            aria-pressed={focus}
            onClick={() => setFocus(!focus)}
          >
            {focus ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
          </button>
          <button
            className={s.iconButton}
            aria-label="Toggle contextual inspector"
            hidden={mode !== "creative"}
            title="Contextual inspector"
            aria-pressed={right}
            onClick={() => {
              setRight(!right);
              setMobileContext(!mobileContext);
            }}
          >
            <PanelRight size={17} />
          </button>
        </div>
      </header>
      {error && (
        <div className={s.notice} role="alert">
          {error}{" "}
          <button className={s.outline} onClick={() => void save()}>
            Retry save
          </button>{" "}
          <button className={s.outline} onClick={exportDraft}>
            Export draft
          </button>
        </div>
      )}
      <div hidden={mode !== "intelligence"}>
        <ChatWorkspace
          storyId={initial.storyId}
          chapterId={initial.id}
          beforeAction={() => saveRef.current()}
          onApplied={applied}
        />
      </div>
      <div
        className={e.panels}
        hidden={mode !== "creative"}
        style={mode !== "creative" ? { display: "none" } : undefined}
      >
        {(left || mobileNavigation) && !focus && (
          <aside
            ref={navigationRef}
            className={`${e.navigation} ${mobileNavigation ? e.mobileOpen : ""}`}
          >
            <button
              className={`${s.iconButton} ${e.panelClose}`}
              aria-label="Close manuscript navigation"
              onClick={closeNavigation}
            >
              <X size={18} />
            </button>
            <span className={s.kicker}>MANUSCRIPT</span>
            {chapters.map((c) => (
              <StudioLink
                key={c.id}
                href={`/studio/stories/${initial.storyId}/chapters/${c.id}`}
                aria-current={c.id === initial.id ? "page" : undefined}
              >
                <small>{String(c.order).padStart(2, "0")}</small>
                {c.title}
              </StudioLink>
            ))}
          </aside>
        )}
        <section
          className={`${e.canvas} ${theme === "sepia" ? e.sepia : theme === "light" ? e.light : ""}`}
        >
          <div className={e.tools}>
            {[
              {
                label: "Bold",
                Icon: Bold,
                run: () => editor?.chain().focus().toggleBold().run(),
              },
              {
                label: "Italic",
                Icon: Italic,
                run: () => editor?.chain().focus().toggleItalic().run(),
              },
              {
                label: "Undo",
                Icon: Undo2,
                run: () => editor?.chain().focus().undo().run(),
              },
              {
                label: "Redo",
                Icon: Redo2,
                run: () => editor?.chain().focus().redo().run(),
              },
            ].map(({ label, Icon, run }) => (
              <button
                key={label}
                className={s.iconButton}
                title={label}
                aria-label={label}
                onClick={run}
              >
                <Icon size={16} />
              </button>
            ))}
            <button
              className={s.iconButton}
              aria-label="Manuscript appearance"
              title="Manuscript appearance"
              aria-expanded={appearance}
              onClick={() => setAppearance(!appearance)}
            >
              <SlidersHorizontal size={16} />
            </button>
            <div hidden={!appearance} className={e.appearance}>
              <label className={s.srOnly} htmlFor="editor-theme">
                Manuscript theme
              </label>
              <select
                id="editor-theme"
                className={s.select}
                value={theme}
                onChange={(event) =>
                  updatePreferences({
                    theme: event.target.value as typeof theme,
                  })
                }
              >
                <option value="dark">Dark</option>
                <option value="sepia">Sepia</option>
                <option value="light">Light</option>
              </select>
              <select
                aria-label="Manuscript font size"
                className={s.select}
                value={preferences.fontSize}
                onChange={(event) =>
                  updatePreferences({ fontSize: Number(event.target.value) })
                }
              >
                {[16, 18, 19, 20, 22, 24].map((size) => (
                  <option key={size} value={size}>
                    {size}px
                  </option>
                ))}
              </select>
              <select
                aria-label="Manuscript line height"
                className={s.select}
                value={preferences.lineHeight}
                onChange={(event) =>
                  updatePreferences({ lineHeight: Number(event.target.value) })
                }
              >
                {[1.5, 1.7, 1.85, 2, 2.2].map((height) => (
                  <option key={height} value={height}>
                    {height}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div
            className={e.manuscript}
            style={
              {
                "--manuscript-size": `${preferences.fontSize}px`,
                "--manuscript-height": preferences.lineHeight,
              } as React.CSSProperties
            }
          >
            <span className={s.kicker}>CHAPTER {index + 1}</span>
            <input
              aria-label="Chapter title"
              maxLength={200}
              className={e.title}
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                draft.current.title = event.target.value;
                changed();
              }}
            />
            <EditorContent editor={editor} />
          </div>
          <footer className={e.footer}>
            <span>{words.toLocaleString()} words</span>
            <span>Draft</span>
            {chapters[index - 1] && (
              <StudioLink
                href={`/studio/stories/${initial.storyId}/chapters/${chapters[index - 1].id}`}
              >
                Previous
              </StudioLink>
            )}
            {chapters[index + 1] && (
              <StudioLink
                href={`/studio/stories/${initial.storyId}/chapters/${chapters[index + 1].id}`}
              >
                Next
              </StudioLink>
            )}
          </footer>
        </section>
        {(right || mobileContext) && !focus && (
          <aside
            ref={contextRef}
            className={`${e.context} ${mobileContext ? e.mobileOpen : ""}`}
          >
            <button
              className={`${s.iconButton} ${e.panelClose}`}
              aria-label="Close contextual inspector"
              onClick={closeContext}
            >
              <X size={18} />
            </button>
            <div className={s.tabGroup}>
              {["Canon", "Beats", "Issues"].map((t) => (
                <button
                  key={t}
                  aria-pressed={tab === t}
                  onClick={() => setTab(t)}
                >
                  {t}
                </button>
              ))}
            </div>
            {tab === "Canon" ? (
              <>
                <div className={s.sectionHeading}>
                  <h2>Canon context</h2>
                </div>
                {facts.slice(0, 12).map((f) => (
                  <div className={s.fact} key={f.id}>
                    <small>
                      {
                        state.entities.find(
                          (entity) => entity.id === f.entityId,
                        )?.name
                      }
                    </small>
                    <strong>{f.attribute}</strong>
                    <p>{f.value}</p>
                  </div>
                ))}
                <StudioLink
                  className={s.outline}
                  href={`/studio/stories/${initial.storyId}/canon`}
                >
                  View full Canon
                </StudioLink>
              </>
            ) : tab === "Beats" ? (
              <label className={s.form}>
                Scene beats
                <textarea
                  aria-label="Scene beats"
                  value={beats}
                  onChange={(event) => {
                    setBeats(event.target.value);
                    draft.current.beats = event.target.value;
                    changed();
                  }}
                />
              </label>
            ) : (
              <>
                <p className={s.notice}>Sample review findings</p>
                {issues.map((issue) => (
                  <StudioLink
                    className={s.issue}
                    key={issue.id}
                    href={`/studio/stories/${initial.storyId}/review?issue=${issue.id}`}
                  >
                    <h3>{issue.title}</h3>
                    <p>{issue.status}</p>
                  </StudioLink>
                ))}
                {!issues.length && (
                  <p className={s.muted}>
                    No sample findings for this chapter. Not checked.
                  </p>
                )}
              </>
            )}
            {issueId && (
              <StudioLink
                className={s.outline}
                href={`/studio/stories/${initial.storyId}/review?issue=${issueId}`}
              >
                Return to review
              </StudioLink>
            )}
          </aside>
        )}
      </div>
    </main>
  );
}
