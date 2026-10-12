import type { StudioSnapshot } from "../data/contracts";
import type { DraftCandidate, GenerationRun } from "./contracts";
import { makeDocument } from "../data/fixtures";
import { documentText } from "../data/selectors";
export interface GenerationService {
  generate(
    state: StudioSnapshot,
    run: GenerationRun,
    signal: AbortSignal,
    onProgress: (
      phase: "PLANNING" | "STREAMING" | "CHECKING",
      partial: string,
    ) => Promise<void>,
  ): Promise<{ candidate: DraftCandidate | null; reply: string }>;
}
function pause(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException("Stopped", "AbortError"));
      return;
    }
    const abort = () => {
      clearTimeout(timer);
      reject(new DOMException("Stopped", "AbortError"));
    };
    const timer = setTimeout(() => {
      signal.removeEventListener("abort", abort);
      resolve();
    }, ms);
    signal.addEventListener("abort", abort, { once: true });
  });
}
function prepare(state: StudioSnapshot, run: GenerationRun) {
  const story = state.stories.find((s) => s.id === run.storyId)!,
    chapter = state.chapters.find((c) => c.id === run.chapterId);
  if (run.intent === "DISCUSS")
    return {
      candidate: null,
      reply: `For ${story.title}, the next useful decision is what the protagonist risks in this chapter. Your direction is: ${run.prompt}\n\nGive the scene a concrete objective, one obstacle and a consequence that changes the next chapter. We can turn that direction into scene beats, then a draft for you to review.`,
    };
  const outline = [
    {
      title: "The First Disturbance",
      beats:
        "Introduce the protagonist's ordinary world. An unexpected detail makes the familiar uncertain.",
    },
    {
      title: "A Promise at the Threshold",
      beats:
        "The protagonist chooses a course of action and makes a promise with a cost.",
    },
    {
      title: "The Evidence That Remains",
      beats:
        "A discovery complicates the promise. Revisit the earlier clue without resolving every question.",
    },
    {
      title: "A Different Way Forward",
      beats:
        "Make a consequential choice. Resolve the immediate conflict while leaving the larger question open.",
    },
  ];
  const beats = `1. Establish the scene and the point-of-view character's immediate objective.\n2. Introduce resistance connected to the existing story.\n3. Let a decision change the situation and lead into the next chapter.\n\nDirection: ${run.prompt}`;
  const sci = /science|sci-fi/i.test(story.genre),
    romance = /romance/i.test(story.genre),
    mystery = /mystery|thriller/i.test(story.genre);
  const protagonist =
    state.entities.find((e) => e.storyId === story.id && e.type === "CHARACTER")
      ?.name ??
    (sci ? "Iona" : romance ? "Maya" : mystery ? "Lena" : "the traveller");
  const setting = sci
    ? "the navigation deck"
    : romance
      ? "the closed cafe"
      : mystery
        ? "the quiet evidence room"
        : "the orchard wall";
  const keyDestroyed = run.context.sections.some(
    (s) => s.kind === "CANON" && /Condition = Destroyed/.test(s.text),
  );
  const paragraphs = [
    `${protagonist} stopped at ${setting}, taking a moment to separate what was known from what had merely been assumed. The next choice would have to begin with the evidence already in front of them.`,
    `${keyDestroyed ? "The Ashen Key lay in broken pieces inside its cloth. No gate could be opened with it now." : "A small detail, overlooked on the first visit, had begun to matter."} There was no easy explanation, and no reason to pretend one had appeared.`,
    "The room was quiet enough to hear the weather beyond the window. A familiar sound returned, followed by a pause. Someone had been waiting for a question, but not necessarily the question that would now be asked.",
    "The answer came reluctantly. It changed the meaning of an earlier promise without erasing the promise itself. A name, an absence and a remembered gesture fitted together in a way they had not before.",
    `${protagonist} checked the record again. The new interpretation would need to survive more than a hopeful first reading. There was still a gap where another person's account should have been.`,
    "They agreed on one practical step. Nothing would be resolved by standing still and repeating the same explanation. The evidence could be carried to someone who had been there, and the question could finally be asked without disguise.",
    "Before leaving, the notebook was opened at a clean page. The facts were written first, the unanswered questions beneath them. No claim was made about what might happen next.",
    "At the threshold, the earlier promise returned with its full weight. Keeping it would require a different action than the one originally imagined. The choice was made quietly, with room left for its consequences.",
  ];
  const body =
    run.intent === "OUTLINE"
      ? `A ${story.genre.toLowerCase()} story shaped around this premise: ${run.prompt}\n\nThe protagonist follows a disturbing clue, makes a costly promise and discovers that the safest explanation is incomplete.`
      : run.intent === "BEATS"
        ? beats
        : paragraphs
            .slice(0, run.options.length === "short" ? 4 : 8)
            .join("\n\n");
  const candidate: DraftCandidate = {
    id: `${run.id}:candidate`,
    runId: run.id,
    storyId: story.id,
    chapterId: run.chapterId,
    kind: run.intent,
    title:
      run.intent === "OUTLINE"
        ? story.title
        : (chapter?.title ?? "A New Direction"),
    body,
    document: makeDocument(body.split(/\n\n/), `${run.id}:candidate`),
    outline: run.intent === "OUTLINE" ? outline : [],
    status: "PENDING",
    findings: [],
  };
  if (run.intent === "DRAFT") {
    const issues = state.issues.filter(
      (i) => i.chapterId === run.chapterId && i.status === "OPEN",
    );
    candidate.findings = issues.slice(0, 2).map((issue) => ({
      title: `Existing finding to revisit: ${issue.title}`,
      source: {
        chapterId: issue.anchor.chapterId,
        revision: issue.anchor.revision,
        blockId: issue.anchor.blockId,
      },
    }));
  }
  const reply =
    run.intent === "OUTLINE"
      ? "An outline is ready to review. Its chapters are planned events; accepting it creates empty manuscript chapters."
      : run.intent === "BEATS"
        ? "Scene beats are ready. Adjust them in the preview before using them for this chapter."
        : `Your chapter draft is ready. ${candidate.findings.length ? "There are existing continuity findings to revisit alongside it." : "Review the draft against its reference before applying it."}`;
  return { candidate, reply };
}
export const mockGenerationService: GenerationService = {
  async generate(state, run, signal, onProgress) {
    await onProgress("PLANNING", "");
    await pause(250, signal);
    const result = prepare(state, run),
      text = result.candidate?.body ?? result.reply;
    for (let end = 120; end < text.length + 120; end += 120) {
      await pause(65, signal);
      await onProgress("STREAMING", text.slice(0, end));
    }
    await onProgress("CHECKING", text);
    await pause(200, signal);
    if (
      result.candidate?.kind === "DRAFT" &&
      !documentText(result.candidate.document).trim()
    )
      throw new Error("The preview is empty. Retry this request.");
    return result;
  },
};
