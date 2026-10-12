"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Pencil,
  Library,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useStudio } from "../shared/studio-provider";
import { StudioLink } from "../shared/studio-link";
import { Modal } from "../shared/modal";
import { StoryForm } from "./story-form";
import { Cover } from "../shared/story-cover";
import { chaptersFor, wordCount } from "../data/selectors";
import s from "../shared/studio.module.css";
export function StoryWorkspace({ storyId }: { storyId: string }) {
  const { state, execute } = useStudio();
  const router = useRouter();
  const story = state.stories.find((item) => item.id === storyId);
  const chapters = chaptersFor(state, storyId);
  const [query, setQuery] = useState("");
  const [edit, setEdit] = useState(false);
  const [dialog, setDialog] = useState<{ id?: string; title: string } | null>(
    null,
  );
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  if (!story)
    return (
      <main id="main" className={s.empty}>
        <h1>Story not found</h1>
        <StudioLink href="/studio">Return to your stories</StudioLink>
      </main>
    );
  const last =
    chapters.find((item) => item.id === story.lastChapterId) ?? chapters[0];
  return (
    <main id="main" className={`${s.page} ${s.workspace}`}>
      <section className={s.identity}>
        <Cover story={story} />
        <span className={s.kicker}>{story.genre} · Private draft</span>
        <h1>{story.title}</h1>
        <p>{story.synopsis || "A new story, waiting for its first words."}</p>
        <div className={s.actions}>
          <StudioLink
            className={last ? s.outline : s.button}
            href={`/studio/stories/${story.id}/assistant`}
          >
            <Sparkles size={16} />
            Develop with AI
          </StudioLink>
          {last && (
            <StudioLink
              className={s.button}
              href={`/studio/stories/${story.id}/chapters/${last.id}`}
            >
              Open editor
              <ArrowRight size={16} />
            </StudioLink>
          )}
          <button
            className={s.iconButton}
            title="Edit story"
            aria-label="Edit story"
            onClick={() => setEdit(true)}
          >
            <Pencil size={16} />
          </button>
        </div>
        <div className={s.stats}>
          <div>
            <strong>{chapters.length}</strong>
            <span>chapters</span>
          </div>
          <div>
            <strong>
              {chapters
                .reduce(
                  (total, chapter) => total + wordCount(chapter.document),
                  0,
                )
                .toLocaleString()}
            </strong>
            <span>words</span>
          </div>
        </div>
        <div className={s.actions}>
          <StudioLink
            className={s.textButton}
            href={`/studio/stories/${story.id}/canon`}
          >
            <Library size={16} />
            Canon Library
          </StudioLink>
          <StudioLink
            className={s.textButton}
            href={`/studio/stories/${story.id}/review`}
          >
            <ShieldCheck size={16} />
            Continuity Review
          </StudioLink>
        </div>
      </section>
      <section>
        <header className={s.pageHeader}>
          <div>
            <span className={s.kicker}>Manuscript outline</span>
            <h2>Chapters</h2>
          </div>
          <button
            className={s.button}
            onClick={() => {
              setDialog({ title: "" });
              setError("");
            }}
          >
            <Plus size={17} />
            New chapter
          </button>
        </header>
        <div className={s.toolbar}>
          <input
            className={s.select}
            aria-label="Search chapters"
            placeholder="Find a chapter..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <span className={s.muted}>{chapters.length} chapters</span>
        </div>
        {error && !dialog && (
          <p className={s.error} role="alert">
            {error}
          </p>
        )}
        <div className={s.chapterList}>
          {chapters
            .filter((chapter) =>
              chapter.title.toLowerCase().includes(query.toLowerCase()),
            )
            .map((chapter) => (
              <article className={s.chapterRow} key={chapter.id}>
                <span className={s.chapterNumber}>
                  {String(chapter.order).padStart(2, "0")}
                </span>
                <StudioLink
                  href={`/studio/stories/${story.id}/chapters/${chapter.id}`}
                >
                  <h3>{chapter.title}</h3>
                  <small>
                    {wordCount(chapter.document).toLocaleString()} words ·{" "}
                    {chapter.status === "DRAFT" ? "Draft" : "In progress"}
                  </small>
                </StudioLink>
                <span className={s.badge}>
                  {new Date(chapter.updatedAt).toLocaleDateString("en", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <div className={s.rowActions}>
                  <button
                    className={s.iconButton}
                    aria-label={`Rename ${chapter.title}`}
                    title="Rename chapter"
                    onClick={() => {
                      setDialog({ id: chapter.id, title: chapter.title });
                      setError("");
                    }}
                  >
                    <Pencil size={14} />
                  </button>
                  {([-1, 1] as const).map((direction) => (
                    <button
                      key={direction}
                      className={s.iconButton}
                      title={direction < 0 ? "Move up" : "Move down"}
                      aria-label={`${direction < 0 ? "Move up" : "Move down"} ${chapter.title}`}
                      disabled={
                        direction < 0
                          ? chapter.order === 1
                          : chapter.order === chapters.length
                      }
                      onClick={async () => {
                        try {
                          await execute({
                            type: "MOVE_CHAPTER",
                            storyId,
                            id: chapter.id,
                            direction,
                          });
                          setError("");
                        } catch (reason) {
                          setError(String(reason));
                        }
                      }}
                    >
                      {direction < 0 ? (
                        <ArrowUp size={14} />
                      ) : (
                        <ArrowDown size={14} />
                      )}
                    </button>
                  ))}
                </div>
              </article>
            ))}
        </div>
        {!chapters.length && (
          <div className={s.empty}>
            <h2>The first page is yours</h2>
            <p>Create a chapter to begin.</p>
          </div>
        )}
      </section>
      {edit && <StoryForm story={story} onClose={() => setEdit(false)} />}{" "}
      {dialog && (
        <Modal
          title={dialog.id ? "Rename chapter" : "New chapter"}
          onClose={() => setDialog(null)}
        >
          <form
            className={s.form}
            onSubmit={async (event) => {
              event.preventDefault();
              setPending(true);
              const title = String(
                new FormData(event.currentTarget).get("title"),
              );
              try {
                const next = await execute(
                  dialog.id
                    ? { type: "RENAME_CHAPTER", storyId, id: dialog.id, title }
                    : { type: "CREATE_CHAPTER", storyId, title },
                );
                setDialog(null);
                if (!dialog.id) {
                  const created = next.chapters.find(
                    (item) =>
                      item.storyId === storyId &&
                      !chapters.some((old) => old.id === item.id),
                  );
                  if (created)
                    router.push(
                      `/studio/stories/${storyId}/chapters/${created.id}`,
                    );
                }
              } catch (reason) {
                setError(String(reason));
              } finally {
                setPending(false);
              }
            }}
          >
            <label>
              Chapter title
              <input
                name="title"
                defaultValue={dialog.title}
                maxLength={200}
                required
                autoFocus
              />
            </label>
            {error && (
              <p className={s.error} role="alert">
                {error}
              </p>
            )}
            <button className={s.button} disabled={pending}>
              {pending
                ? "Saving..."
                : dialog.id
                  ? "Save title"
                  : "Create chapter"}
            </button>
          </form>
        </Modal>
      )}
    </main>
  );
}
