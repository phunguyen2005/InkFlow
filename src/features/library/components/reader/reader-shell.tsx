"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  List,
  Settings2,
  Minus,
  Plus,
  RotateCcw,
} from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import type { ChapterSummary } from "../../types/library";
import { useLocalValue } from "../../hooks/use-local-value";
import { useReadingProgress } from "../../hooks/use-reading-progress";
import { useAccount } from "@/features/account/account-provider";
import {
  READER_KEY,
  defaultPreferences,
  parsePreferences,
  writeStorage,
  type ReaderPreferences,
} from "../../utils/reader-storage";

export function ReaderShell({
  children,
  story,
  chapter,
  chapters,
  previous,
  next,
  resume,
}: {
  children: ReactNode;
  story: { id: string; slug: string; title: string };
  chapter: ChapterSummary;
  chapters: ChapterSummary[];
  previous: string | null;
  next: string | null;
  resume: boolean;
}) {
  const router = useRouter();
  const { state } = useAccount();
  const completedSlugs = useMemo(
    () => new Set(state.progress[story.id]?.completedChapterSlugs ?? []),
    [state.progress, story.id],
  );
  const raw = useLocalValue(READER_KEY);
  const persisted = useMemo(() => parsePreferences(raw), [raw]);
  const [temporary, setTemporary] = useState<ReaderPreferences | null>(null);
  const [storageMessage, setStorageMessage] = useState("");
  const preferences = temporary ?? persisted;
  const body = useRef<HTMLDivElement>(null);
  const progress = useReadingProgress(
    body,
    story.id,
    chapter.slug,
    resume,
    chapter.id,
  );
  function update(changes: Partial<ReaderPreferences>) {
    const value = { ...preferences, ...changes };
    if (writeStorage(READER_KEY, JSON.stringify(value))) {
      setTemporary(null);
      setStorageMessage("");
    } else {
      setTemporary(value);
      setStorageMessage(
        "Preferences apply for this visit. Device storage is unavailable.",
      );
    }
  }
  const route = (slug: string) => `/stories/${story.slug}/chapters/${slug}`;
  useEffect(() => {
    function shortcuts(event: KeyboardEvent) {
      if (
        event.defaultPrevented ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      )
        return;
      if (event.key === "ArrowLeft" && previous)
        router.push(`/stories/${story.slug}/chapters/${previous}`);
      if (event.key === "ArrowRight" && next)
        router.push(`/stories/${story.slug}/chapters/${next}`);
      if (event.key.toLowerCase() === "f") {
        if (document.fullscreenElement) void document.exitFullscreen();
        else void document.documentElement.requestFullscreen?.();
      }
    }
    window.addEventListener("keydown", shortcuts);
    return () => window.removeEventListener("keydown", shortcuts);
  }, [next, previous, router, story.slug]);
  const style = {
    "--reader-size": `${preferences.size}px`,
    "--reader-line": preferences.lineHeight,
    "--reader-width": `${preferences.width}px`,
  } as CSSProperties;
  return (
    <div
      className={`reader-shell theme-${preferences.theme} reading-${preferences.font}`}
      style={style}
    >
      <header className="reader-header">
        <Link className="reader-back" href={`/stories/${story.slug}`}>
          <ArrowLeft size={19} />
          <span>{story.title}</span>
        </Link>
        <Link className="reader-wordmark" href="/" aria-label="InkFlow home">
          InkFlow<span>.</span>
        </Link>
        <div className="reader-tools">
          {preferences.showProgress ? (
            <span className="reader-percent">
              {progress}%<span className="sr-only"> read</span>
            </span>
          ) : null}
          <Dialog title="Table of contents" trigger={<List size={21} />}>
            <nav className="reader-toc" aria-label="Chapters">
              {chapters.map((c) => {
                const isCurrent = c.slug === chapter.slug;
                const isCompleted = completedSlugs.has(c.slug);
                return (
                  <Link
                    key={c.id}
                    href={route(c.slug)}
                    aria-current={isCurrent ? "page" : undefined}
                    className={`reader-toc-item ${isCurrent ? "is-current" : ""} ${isCompleted ? "is-completed" : ""}`}
                  >
                    <span className="toc-number">
                      {String(c.number).padStart(2, "0")}
                    </span>
                    <div className="toc-info">
                      <span className="toc-title">{c.title}</span>
                      <div className="toc-meta">
                        <small>{c.estimatedMinutes} min read</small>
                        {isCurrent ? (
                          <span className="toc-badge is-reading">Reading</span>
                        ) : isCompleted ? (
                          <span className="toc-badge is-completed">
                            <Check size={11} aria-hidden="true" /> Completed
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </nav>
            <p className="fine-print">All currently available chapters</p>
          </Dialog>
          <Dialog title="Reading appearance" trigger={<Settings2 size={20} />}>
            <div className="reader-settings">
              <fieldset>
                <legend>Theme</legend>
                <div className="theme-options">
                  {(["sepia", "dark", "white"] as const).map((theme) => (
                    <label className={`theme-option ${theme}`} key={theme}>
                      <input
                        type="radio"
                        name="reader-theme"
                        aria-label={theme[0].toUpperCase() + theme.slice(1)}
                        value={theme}
                        checked={preferences.theme === theme}
                        onChange={() => update({ theme })}
                      />
                      <span>Aa</span>
                      {theme[0].toUpperCase() + theme.slice(1)}
                    </label>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend>Typeface</legend>
                <div className="segmented">
                  {(["serif", "sans"] as const).map((font) => (
                    <label key={font}>
                      <input
                        type="radio"
                        name="reader-font"
                        checked={preferences.font === font}
                        onChange={() => update({ font })}
                      />
                      <span>
                        {font === "serif" ? "Literary serif" : "Clean sans"}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="setting-row">
                <span>Font size</span>
                <div className="stepper">
                  <button
                    className="icon-button"
                    aria-label="Decrease font size"
                    disabled={preferences.size <= 16}
                    onClick={() => update({ size: preferences.size - 1 })}
                  >
                    <Minus size={17} />
                  </button>
                  <output>{preferences.size}px</output>
                  <button
                    className="icon-button"
                    aria-label="Increase font size"
                    disabled={preferences.size >= 28}
                    onClick={() => update({ size: preferences.size + 1 })}
                  >
                    <Plus size={17} />
                  </button>
                </div>
              </div>
              <label className="range-setting">
                Line height <output>{preferences.lineHeight.toFixed(2)}</output>
                <input
                  aria-label="Line height"
                  type="range"
                  min="1.5"
                  max="2.1"
                  step="0.05"
                  value={preferences.lineHeight}
                  onChange={(e) =>
                    update({ lineHeight: Number(e.target.value) })
                  }
                />
              </label>
              <label className="range-setting">
                Reading width <output>{preferences.width}px</output>
                <input
                  aria-label="Reading width"
                  type="range"
                  min="560"
                  max="820"
                  step="20"
                  value={preferences.width}
                  onChange={(e) => update({ width: Number(e.target.value) })}
                />
              </label>
              <div className="setting-row setting-toggle-row">
                <div className="setting-toggle-info">
                  <span>Show reading progress</span>
                  <small className="fine-print">
                    Subtle indicator and percentage while reading
                  </small>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    role="switch"
                    aria-label="Show reading progress"
                    checked={preferences.showProgress}
                    onChange={(e) => update({ showProgress: e.target.checked })}
                  />
                  <span className="toggle-slider" aria-hidden="true" />
                </label>
              </div>
              <button
                className="text-link"
                onClick={() => update(defaultPreferences)}
              >
                <RotateCcw size={15} />
                Reset appearance
              </button>
              <p className="fine-print" role="status">
                {storageMessage}
              </p>
            </div>
          </Dialog>
        </div>
        {preferences.showProgress ? (
          <div
            className="reader-progress"
            role="progressbar"
            aria-label="Chapter reading progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          >
            <span style={{ width: `${progress}%` }} />
          </div>
        ) : null}
      </header>
      <main id="main" className="reader-main">
        <div className="reader-chapter-heading">
          <Link className="eyebrow" href={`/stories/${story.slug}`}>
            {story.title}
          </Link>
          <span className="chapter-index">
            Chapter {String(chapter.number).padStart(2, "0")}
          </span>
          <h1>{chapter.title}</h1>
          <p>
            {chapter.estimatedMinutes} min read <span>/</span> English
          </p>
          <div className="reader-ornament" aria-hidden="true">
            * &nbsp; * &nbsp; *
          </div>
        </div>
        <div className="reader-content" ref={body}>
          {children}
        </div>
        <div className="end-mark" aria-hidden="true">
          * &nbsp; * &nbsp; *
        </div>
        <nav className="chapter-navigation" aria-label="Chapter navigation">
          {previous ? (
            <Link className="button button-outline" href={route(previous)}>
              <ArrowLeft size={17} />
              Previous
            </Link>
          ) : (
            <button className="button button-outline" disabled>
              <ArrowLeft size={17} />
              Previous
            </button>
          )}
          {next ? (
            <Link
              className="button"
              href={route(next)}
              data-complete-chapter="true"
            >
              Next chapter
              <ArrowRight size={17} />
            </Link>
          ) : (
            <Link className="button" href={`/stories/${story.slug}`}>
              Back to story
              <BookOpen size={17} />
            </Link>
          )}
        </nav>
        <p className="reader-end-note">
          {next
            ? `Chapter ${chapter.number} of ${chapters.length}`
            : "You've reached the end of the available chapters."}
        </p>
      </main>
    </div>
  );
}
