import { Sparkles, Calendar } from "lucide-react";
import type { WeeklyPrompt as WeeklyPromptType } from "../types/community";

export function WeeklyPrompt({ prompt }: { prompt: WeeklyPromptType }) {
  return (
    <section aria-labelledby="weekly-prompt-title" className="weekly-prompt">
      <div className="weekly-prompt-badge">
        <Sparkles size={13} aria-hidden="true" />
        <span>Question of the Week</span>
      </div>

      <h2 id="weekly-prompt-title" className="weekly-prompt-question">
        {prompt.question}
      </h2>

      <p className="weekly-prompt-description">{prompt.description}</p>

      <div className="weekly-prompt-meta">
        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
          <Calendar size={13} aria-hidden="true" />
          <span>Week {prompt.activeWeek.replace(/^\d{4}-W/, "")} Editorial Prompt</span>
        </span>
      </div>
    </section>
  );
}
