"use client";
import { useState, useEffect } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { useStudio } from "../shared/studio-provider";
import { StudioLink } from "../shared/studio-link";
import { useEditorPreferences } from "../editor/use-editor-preferences";
import { ChatWorkspace } from "./chat-workspace";
import s from "../shared/studio.module.css";
export function StoryAssistant({ storyId }: { storyId: string }) {
  const { state } = useStudio();
  const story = state.stories.find((story) => story.id === storyId);
  const [, updatePreferences] = useEditorPreferences();
  const [focus, setFocus] = useState(false);
  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-studio-root]");
    if (root) root.dataset.focus = String(focus);
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !document.querySelector("dialog[open]"))
        setFocus(false);
    };
    window.addEventListener("keydown", escape);
    return () => {
      if (root) delete root.dataset.focus;
      window.removeEventListener("keydown", escape);
    };
  }, [focus]);
  if (!story)
    return (
      <main id="main" className={s.page}>
        <h1>Story not found</h1>
      </main>
    );
  return (
    <main id="main">
      <div className={s.assistantBar}>
        <div className={s.tabGroup} role="group" aria-label="Workspace mode">
          <StudioLink
            className={s.outline}
            href={
              story.lastChapterId
                ? `/studio/stories/${storyId}/chapters/${story.lastChapterId}`
                : `/studio/stories/${storyId}`
            }
            onClick={() => updatePreferences({ mode: "creative" })}
          >
            Creative
          </StudioLink>
          <button aria-pressed="true">Intelligence</button>
        </div>
        <button
          className={s.iconButton}
          title="Focus mode"
          aria-label="Focus mode"
          aria-pressed={focus}
          onClick={() => setFocus(!focus)}
        >
          {focus ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
        </button>
      </div>
      <ChatWorkspace key={storyId} storyId={storyId} />
    </main>
  );
}
