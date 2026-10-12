"use client";
import { useState } from "react";
import { useStudio } from "../shared/studio-provider";
import { Modal } from "../shared/modal";
import type { StudioStory } from "../data/contracts";
import s from "../shared/studio.module.css";
export function StoryForm({
  story,
  onClose,
  onCreated,
}: {
  story?: StudioStory;
  onClose: () => void;
  onCreated?: (id: string) => void;
}) {
  const { state, execute } = useStudio();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  return (
    <Modal
      title={story ? "Edit story" : "Create a new story"}
      onClose={onClose}
    >
      <form
        className={s.form}
        onSubmit={async (event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          setPending(true);
          try {
            const title = String(form.get("title"));
            const synopsis = String(form.get("synopsis"));
            const next = await execute(
              story
                ? { type: "UPDATE_STORY", id: story.id, title, synopsis }
                : {
                    type: "CREATE_STORY",
                    title,
                    synopsis,
                    genre: String(form.get("genre")),
                  },
            );
            onClose();
            const created = next.stories.find(
              (item) =>
                !state.stories.some((previous) => previous.id === item.id),
            );
            if (created) onCreated?.(created.id);
          } catch (reason) {
            setError(
              reason instanceof Error
                ? reason.message
                : "Could not save story.",
            );
          } finally {
            setPending(false);
          }
        }}
      >
        <label>
          Title
          <input
            name="title"
            defaultValue={story?.title}
            required
            maxLength={200}
            autoFocus
          />
        </label>
        {!story && (
          <label>
            Genre
            <select name="genre">
              <option>Fantasy</option>
              <option>Science Fiction</option>
              <option>Mystery / Thriller</option>
              <option>Contemporary Romance</option>
              <option>LitRPG</option>
              <option>Horror</option>
              <option>Contemporary</option>
            </select>
          </label>
        )}
        <label>
          Synopsis
          <textarea
            name="synopsis"
            defaultValue={story?.synopsis}
            maxLength={4000}
          />
        </label>
        {error && (
          <p className={s.error} role="alert">
            {error}
          </p>
        )}
        <div className={s.actions}>
          <button className={s.button} disabled={pending}>
            {pending ? "Saving..." : story ? "Save story" : "Create story"}
          </button>
          <button type="button" className={s.outline} onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}
