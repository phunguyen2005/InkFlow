"use client";
import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  List,
  Settings2,
  Minus,
  Plus,
  RotateCcw,
} from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import type { ChapterSummary } from "../../types/library";
import {
  READER_KEY,
  defaultPreferences,
  parsePreferences,
  readStorage,
  writeStorage,
  parseBookmark,
  type ReaderPreferences,
} from "../../utils/reader-storage";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("inkflow-storage", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("inkflow-storage", callback);
  };
}
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
  const raw = useSyncExternalStore(
    subscribe,
    () => readStorage(READER_KEY),
    () => null,
  );
  const persisted = useMemo(() => parsePreferences(raw), [raw]);
  const [temporary, setTemporary] = useState<ReaderPreferences | null>(null);
  const [storageMessage, setStorageMessage] = useState("");
  const preferences = temporary ?? persisted;
  const [progress, setProgress] = useState(0);
  const body = useRef<HTMLDivElement>(null);
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
  useEffect(() => {
    let active = true;
    let frame = 0;
    let saveTimer: ReturnType<typeof setTimeout>;
    let observer: ResizeObserver | undefined;
    const key = `inkflow:progress:v1:${story.id}`;
    function measure() {
      const element = body.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const viewport = window.innerHeight - 90;
      const travel = Math.max(0, rect.height - viewport);
      const amount =
        travel > 0
          ? Math.round(Math.min(1, Math.max(0, (90 - rect.top) / travel)) * 100)
          : rect.bottom <= window.innerHeight
            ? 100
            : 0;
      setProgress(amount);
      clearTimeout(saveTimer);
      saveTimer = setTimeout(() => {
        const paragraphs = [
          ...element.querySelectorAll<HTMLElement>("[data-paragraph]"),
        ];
        const index = paragraphs.findLastIndex(
          (p) => p.getBoundingClientRect().top <= 120,
        );
        writeStorage(
          key,
          JSON.stringify({
            chapterSlug: chapter.slug,
            paragraph: Math.max(0, index),
          }),
        );
      }, 350);
    }
    function queue() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    }
    async function initialize() {
      await document.fonts.ready;
      if (!active) return;
      if (resume) {
        const mark = parseBookmark(readStorage(key));
        if (mark?.chapterSlug === chapter.slug)
          body.current
            ?.querySelector(`[data-paragraph="${mark.paragraph}"]`)
            ?.scrollIntoView({ block: "start" });
      }
      queue();
      window.addEventListener("scroll", queue, { passive: true });
      window.addEventListener("resize", queue);
      observer = new ResizeObserver(queue);
      if (body.current) observer.observe(body.current);
    }
    void initialize();
    return () => {
      active = false;
      cancelAnimationFrame(frame);
      clearTimeout(saveTimer);
      observer?.disconnect();
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
    };
  }, [chapter.slug, story.id, resume]);
  const route = (slug: string) => `/stories/${story.slug}/chapters/${slug}`;
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
          <span className="reader-percent">
            {progress}%<span className="sr-only"> read</span>
          </span>
          <Dialog title="Table of contents" trigger={<List size={21} />}>
            <nav className="reader-toc" aria-label="Chapters">
              {chapters.map((c) => (
                <Link
                  key={c.id}
                  href={route(c.slug)}
                  aria-current={c.slug === chapter.slug ? "page" : undefined}
                >
                  <span>{String(c.number).padStart(2, "0")}</span>
                  <div>
                    {c.title}
                    <small>{c.estimatedMinutes} min read</small>
                  </div>
                </Link>
              ))}
            </nav>
            <p className="fine-print">Original demo reading samples</p>
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
            {chapter.estimatedMinutes} min read <span>/</span> Original reading
            sample
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
            <Link className="button" href={route(next)}>
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
            ? `Chapter ${chapter.number} of ${chapters.length} samples`
            : "You've reached the end of the available samples."}
        </p>
      </main>
    </div>
  );
}
