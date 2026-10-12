"use client";
import { useEffect, useRef, useState, type RefObject } from "react";
import {
  parseBookmark,
  readStorage,
  writeStorage,
  type Bookmark,
} from "../utils/reader-storage";
import { useAccount } from "@/features/account/account-provider";

export function useReadingProgress(
  body: RefObject<HTMLDivElement | null>,
  storyId: string,
  chapterSlug: string,
  resume: boolean,
  chapterId?: string,
) {
  const { ready, state, updateProgress } = useAccount();
  const existingProgress = useRef(state.progress[storyId]);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (ready) existingProgress.current = state.progress[storyId];
  }, [ready, state.progress, storyId]);
  useEffect(() => {
    if (!ready) return;
    let active = true;
    let departing = false;
    let frame = 0;
    let saveTimer: ReturnType<typeof setTimeout> | undefined;
    let observer: ResizeObserver | undefined;
    let pending: Bookmark | null = null;
    const key = `inkflow:progress:v1:${storyId}`;
    const completed = new Set(
      existingProgress.current?.completedChapterSlugs ?? [],
    );
    function flush() {
      clearTimeout(saveTimer);
      if (pending) {
        writeStorage(key, JSON.stringify(pending));
        updateProgress(storyId, {
          storyId: pending.storyId,
          chapterId: pending.chapterId,
          chapterSlug: pending.chapterSlug,
          chapterRevisionId: pending.chapterRevisionId,
          blockId: pending.blockId,
          offsetRatio: pending.offsetRatio,
          paragraph: pending.paragraph,
          percent: pending.percent ?? 0,
          completedChapterSlugs: pending.completedChapterSlugs ?? [],
          updatedAt: pending.updatedAt,
          lastReadAt: pending.lastReadAt ?? new Date().toISOString(),
        });
        pending = null;
      }
    }
    function measure() {
      if (departing) return;
      const element = body.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const travel = Math.max(0, rect.height - (window.innerHeight - 90));
      const percent =
        travel > 0
          ? Math.round(Math.min(1, Math.max(0, (90 - rect.top) / travel)) * 100)
          : rect.bottom <= window.innerHeight
            ? 100
            : 0;
      setProgress(percent);
      if (percent >= 95) completed.add(chapterSlug);
      const paragraphs = [
        ...element.querySelectorAll<HTMLElement>("[data-paragraph]"),
      ];
      const index = paragraphs.findLastIndex(
        (paragraph) => paragraph.getBoundingClientRect().top <= 120,
      );
      const activeIndex = Math.max(0, index);
      const activeParagraph = paragraphs[activeIndex];
      const blockId =
        activeParagraph?.dataset.blockId ??
        (activeIndex >= 0 ? `block-${chapterId ?? chapterSlug}-${activeIndex}` : null);
      const offsetRatio =
        travel > 0
          ? Math.max(0, Math.min(1, Number(((90 - rect.top) / travel).toFixed(4))))
          : rect.bottom <= window.innerHeight
            ? 1
            : 0;
      const now = new Date().toISOString();
      pending = {
        storyId,
        chapterId: chapterId ?? chapterSlug,
        chapterSlug,
        chapterRevisionId: `${chapterId ?? chapterSlug}-rev1`,
        blockId,
        paragraph: activeIndex,
        offsetRatio,
        percent,
        completedChapterSlugs: [...completed],
        updatedAt: now,
        lastReadAt: now,
      };
      clearTimeout(saveTimer);
      saveTimer = setTimeout(flush, 350);
    }
    function queue() {
      if (departing) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    }
    function leave() {
      // Capture a scroll that has not reached the next animation frame yet.
      if (body.current && active) measure();
      flush();
    }
    function visibility() {
      if (document.hidden) leave();
    }
    function navigate(event: MouseEvent) {
      if (
        event.button !== 0 ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const link =
        event.target instanceof Element
          ? event.target.closest<HTMLAnchorElement>("a[href]")
          : null;
      if (
        !link ||
        link.hasAttribute("download") ||
        (link.target && link.target !== "_self")
      )
        return;
      if (link.dataset.completeChapter === "true") {
        completed.add(chapterSlug);
        if (pending) pending.completedChapterSlugs = [...completed];
      }
      const destination = new URL(link.href);
      if (
        destination.pathname === location.pathname &&
        destination.search === location.search
      )
        return;
      // Flush before router scroll restoration can replace the outgoing position.
      leave();
      departing = true;
    }
    function historyNavigation() {
      leave();
      departing = true;
    }
    async function initialize() {
      await document.fonts.ready;
      if (!active) return;
      if (resume) {
        const mark = parseBookmark(readStorage(key));
        if (mark?.chapterSlug === chapterSlug) {
          let target: HTMLElement | null = null;
          if (mark.blockId && body.current) {
            target =
              body.current.querySelector<HTMLElement>(
                `[data-block-id="${mark.blockId}"]`,
              ) ??
              body.current.querySelector<HTMLElement>(`#${mark.blockId}`);
          }
          if (!target && Number.isSafeInteger(mark.paragraph) && body.current) {
            target = body.current.querySelector<HTMLElement>(
              `[data-paragraph="${mark.paragraph}"]`,
            );
          }
          if (target) {
            target.scrollIntoView({ block: "start", behavior: "instant" });
          } else if (
            typeof mark.offsetRatio === "number" &&
            mark.offsetRatio > 0 &&
            body.current
          ) {
            const rect = body.current.getBoundingClientRect();
            const travel = Math.max(0, rect.height - (window.innerHeight - 90));
            window.scrollTo({
              top: window.scrollY + rect.top - 90 + travel * mark.offsetRatio,
              behavior: "instant",
            });
          }
        }
      }
      queue();
      window.addEventListener("scroll", queue, { passive: true });
      window.addEventListener("resize", queue);
      window.addEventListener("pagehide", leave);
      document.addEventListener("visibilitychange", visibility);
      document.addEventListener("click", navigate, true);
      window.addEventListener("popstate", historyNavigation);
      observer = new ResizeObserver(queue);
      if (body.current) observer.observe(body.current);
    }
    void initialize();
    return () => {
      active = false;
      cancelAnimationFrame(frame);
      flush();
      observer?.disconnect();
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
      window.removeEventListener("pagehide", leave);
      document.removeEventListener("visibilitychange", visibility);
      document.removeEventListener("click", navigate, true);
      window.removeEventListener("popstate", historyNavigation);
    };
  }, [body, chapterSlug, storyId, resume, ready, updateProgress, chapterId]);
  return progress;
}
