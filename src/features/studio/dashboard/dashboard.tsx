"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  ArrowUpRight,
  Search,
  LayoutGrid,
  List,
  MoreHorizontal,
  Archive,
  RotateCcw,
} from "lucide-react";
import { useStudio } from "../shared/studio-provider";
import { StudioLink } from "../shared/studio-link";
import { StoryForm } from "../stories/story-form";
import { Modal } from "../shared/modal";
import { chaptersFor, wordCount } from "../data/selectors";
import type { StudioStory } from "../data/contracts";
import s from "../shared/studio.module.css";
import { Cover } from "../shared/story-cover";
export function Dashboard() {
  const { state, execute } = useStudio();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("recent");
  const [list, setList] = useState(false);
  const [archive, setArchive] = useState(false);
  const [create, setCreate] = useState(false);
  const [edit, setEdit] = useState<StudioStory>();
  const [archiveStory, setArchiveStory] = useState<StudioStory>();
  const [error, setError] = useState("");
  const stories = state.stories
    .filter(
      (story) =>
        story.archived === archive &&
        `${story.title} ${story.genre}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    )
    .sort((a, b) =>
      sort === "title"
        ? a.title.localeCompare(b.title)
        : b.updatedAt.localeCompare(a.updatedAt),
    );
  const recent = state.stories
    .filter((story) => !story.archived && story.lastChapterId)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
  const chapter = state.chapters.find(
    (item) => item.id === recent?.lastChapterId,
  );
  return (
    <main id="main" className={s.page}>
      <header className={s.pageHeader}>
        <div>
          <span className={s.kicker}>Your private writing space</span>
          <h1 className={s.display}>YOUR STORIES</h1>
        </div>
        <button className={s.button} onClick={() => setCreate(true)}>
          <Plus size={18} />
          Create New Story
        </button>
      </header>
      {recent && chapter && (
        <section className={s.continueBand}>
          <Cover story={recent} />
          <div>
            <span className={s.kicker}>Continue where you left off</span>
            <h2>{recent.title}</h2>
            <p className={s.muted}>
              Chapter {String(chapter.order).padStart(2, "0")} · {chapter.title}
            </p>
            <small className={s.muted}>
              {wordCount(chapter.document).toLocaleString()} words · Private
              draft
            </small>
          </div>
          <StudioLink
            className={s.button}
            href={`/studio/stories/${recent.id}/chapters/${chapter.id}`}
          >
            Continue writing
            <ArrowUpRight size={18} />
          </StudioLink>
        </section>
      )}
      <div className={s.sectionHeading}>
        <h2>{archive ? "Archived stories" : "Your projects"}</h2>
        <span className={s.muted}>{stories.length} stories</span>
      </div>
      <div className={s.toolbar}>
        <label className={s.search}>
          <Search size={16} />
          <input
            aria-label="Search your stories"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search stories..."
          />
        </label>
        <select
          className={s.select}
          aria-label="Sort stories"
          value={sort}
          onChange={(event) => setSort(event.target.value)}
        >
          <option value="recent">Last edited</option>
          <option value="title">Title A–Z</option>
        </select>
        <button
          className={s.iconButton}
          aria-label={list ? "Grid view" : "List view"}
          title={list ? "Grid view" : "List view"}
          onClick={() => setList(!list)}
        >
          {list ? <LayoutGrid size={17} /> : <List size={17} />}
        </button>
        <button className={s.textButton} onClick={() => setArchive(!archive)}>
          <Archive size={16} />
          {archive ? "Active stories" : "Archived"}
        </button>
      </div>
      {stories.length ? (
        <div className={`${s.projects} ${list ? s.projectList : ""}`}>
          {stories.map((story) => {
            const chapters = chaptersFor(state, story.id);
            return (
              <article className={s.project} key={story.id}>
                <StudioLink
                  className={s.projectTop}
                  href={`/studio/stories/${story.id}`}
                >
                  <Cover story={story} />
                  <div>
                    <span className={s.kicker}>{story.genre}</span>
                    <h3>{story.title}</h3>
                    <p>
                      {chapters.length} chapters ·{" "}
                      {chapters
                        .reduce(
                          (total, chapter) =>
                            total + wordCount(chapter.document),
                          0,
                        )
                        .toLocaleString()}{" "}
                      words
                    </p>
                  </div>
                </StudioLink>
                <div className={s.projectBottom}>
                  <span className={s.muted}>Private draft</span>
                  <div className={s.actions}>
                    <button
                      className={s.iconButton}
                      aria-label={`Edit ${story.title}`}
                      title="Edit story"
                      onClick={() => setEdit(story)}
                    >
                      <MoreHorizontal size={18} />
                    </button>
                    <button
                      className={s.iconButton}
                      aria-label={`${archive ? "Restore" : "Archive"} ${story.title}`}
                      title={archive ? "Restore story" : "Archive story"}
                      onClick={() => setArchiveStory(story)}
                    >
                      {archive ? (
                        <RotateCcw size={16} />
                      ) : (
                        <Archive size={16} />
                      )}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className={s.empty}>
          <h2>
            {query ? "No matching stories" : "Your next world starts here"}
          </h2>
          <p>
            {query ? "Try another title or genre." : "Create your first story."}
          </p>
          <button className={s.button} onClick={() => setCreate(true)}>
            <Plus size={18} />
            Create story
          </button>
        </div>
      )}
      {create && (
        <StoryForm
          onClose={() => setCreate(false)}
          onCreated={(id) => router.push(`/studio/stories/${id}`)}
        />
      )}{" "}
      {edit && <StoryForm story={edit} onClose={() => setEdit(undefined)} />}{" "}
      {archiveStory && (
        <Modal
          title={archiveStory.archived ? "Restore story" : "Archive story"}
          onClose={() => {
            setArchiveStory(undefined);
            setError("");
          }}
        >
          <p>
            {archiveStory.title}{" "}
            {archiveStory.archived
              ? "will return to your active projects."
              : "will leave your active projects. Its chapters and Canon will be kept."}
          </p>
          {error && (
            <p role="alert" className={s.error}>
              {error}
            </p>
          )}
          <div className={s.actions}>
            <button
              className={s.button}
              onClick={async () => {
                try {
                  await execute({
                    type: "UPDATE_STORY",
                    id: archiveStory.id,
                    archived: !archiveStory.archived,
                  });
                  setArchiveStory(undefined);
                } catch (reason) {
                  setError(String(reason));
                }
              }}
            >
              {archiveStory.archived ? "Restore" : "Archive"}
            </button>
            <button
              className={s.outline}
              onClick={() => setArchiveStory(undefined)}
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </main>
  );
}
