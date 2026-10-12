"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useStudio } from "../shared/studio-provider";
import { conversationKey } from "./commands";
import { mockGenerationService } from "./mock-service";
import type { GenerationOptions, Intent } from "./contracts";
export function useConversation(storyId: string, chapterId: string | null) {
  const { state, execute } = useStudio();
  const key = conversationKey(storyId, chapterId);
  const conversation = state.intelligence.conversations.find(
    (c) => c.id === key,
  );
  const runs = state.intelligence.runs.filter((r) => r.conversationId === key),
    latest = runs.at(-1);
  const [prompt, setPromptState] = useState(conversation?.composer ?? ""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const controller = useRef<AbortController | null>(null),
    initialRuns = useRef(state.intelligence.runs),
    ownerId = useRef(""),
    runId = useRef<string | null>(null),
    composeTimer = useRef<ReturnType<typeof setTimeout> | null>(null),
    promptRef = useRef(prompt),
    executeRef = useRef(execute);
  useEffect(() => {
    executeRef.current = execute;
  }, [execute]);
  useEffect(() => {
    try {
      ownerId.current =
        sessionStorage.getItem("inkflow-ai-owner") ?? crypto.randomUUID();
      sessionStorage.setItem("inkflow-ai-owner", ownerId.current);
    } catch {
      ownerId.current = crypto.randomUUID();
    }
    const interrupted = initialRuns.current.filter(
      (r) =>
        r.conversationId === key &&
        r.ownerId === ownerId.current &&
        ["PREPARING", "PLANNING", "STREAMING", "CHECKING"].includes(r.status),
    );
    for (const run of interrupted)
      if (run.id !== runId.current)
        void executeRef
          .current({
            type: "AI_STOP",
            storyId,
            runId: run.id,
            error:
              "This request was interrupted. Retry to create a fresh candidate.",
          })
          .catch(() => undefined);
    return () => {
      controller.current?.abort();
      if (runId.current)
        void executeRef
          .current({ type: "AI_STOP", storyId, runId: runId.current })
          .catch(() => undefined);
      if (composeTimer.current) clearTimeout(composeTimer.current);
      void executeRef
        .current({
          type: "AI_COMPOSER",
          storyId,
          chapterId,
          text: promptRef.current,
        })
        .catch(() => undefined);
    };
  }, [key, storyId, chapterId]);
  function setPrompt(text: string) {
    setPromptState(text);
    promptRef.current = text;
    if (composeTimer.current) clearTimeout(composeTimer.current);
    composeTimer.current = setTimeout(
      () =>
        void execute({ type: "AI_COMPOSER", storyId, chapterId, text }).catch(
          (reason) =>
            setError(
              reason instanceof Error
                ? reason.message
                : "Could not save your prompt.",
            ),
        ),
      300,
    );
  }
  const start = useCallback(
    async (text: string, intent: Intent, options: GenerationOptions) => {
      if (controller.current) return;
      setError("");
      setBusy(true);
      const id = crypto.randomUUID(),
        abort = new AbortController();
      controller.current = abort;
      runId.current = id;
      try {
        if (composeTimer.current) clearTimeout(composeTimer.current);
        const snapshot = await execute({
          type: "AI_START",
          storyId,
          chapterId,
          prompt: text,
          intent,
          options,
          runId: id,
          ownerId: ownerId.current,
        });
        if (abort.signal.aborted) {
          await execute({ type: "AI_STOP", storyId, runId: id });
          return;
        }
        setPromptState("");
        promptRef.current = "";
        const run = snapshot.intelligence.runs.find((r) => r.id === id)!;
        const result = await mockGenerationService.generate(
          snapshot,
          run,
          abort.signal,
          async (status, partial) => {
            if (!abort.signal.aborted)
              await execute({
                type: "AI_PROGRESS",
                storyId,
                runId: id,
                status,
                partial,
              });
          },
        );
        if (!abort.signal.aborted)
          await execute({ type: "AI_FINISH", storyId, runId: id, ...result });
      } catch (reason) {
        if (!abort.signal.aborted) {
          const message =
            reason instanceof Error
              ? reason.message
              : "Unable to prepare the draft.";
          setError(message);
          await execute({
            type: "AI_STOP",
            storyId,
            runId: id,
            error: message,
          }).catch(() => undefined);
        }
      } finally {
        controller.current = null;
        runId.current = null;
        setBusy(false);
      }
    },
    [execute, storyId, chapterId],
  );
  async function stop() {
    controller.current?.abort();
    if (runId.current)
      try {
        await execute({ type: "AI_STOP", storyId, runId: runId.current });
      } catch (reason) {
        setError(
          reason instanceof Error
            ? reason.message
            : "Could not save the stopped request.",
        );
      }
  }
  return {
    conversation,
    runs,
    latest,
    prompt,
    setPrompt,
    error,
    busy,
    start,
    stop,
  };
}
