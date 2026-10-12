"use client";
import Link from "next/link";
import { useState } from "react";
import { useLocalValue } from "../../hooks/use-local-value";
import { Bookmark, Check, Heart, Share2, ArrowRight, BookOpen } from "lucide-react";
import { writeStorage, parseBookmark } from "../../utils/reader-storage";
import { useAccount } from "@/features/account/account-provider";
import type { ChapterSummary } from "../../types/library";

export function SaveButton({
  storyId,
  compact = false,
  follow = false,
}: {
  storyId: string;
  compact?: boolean;
  follow?: boolean;
}) {
  const key = `inkflow:${follow ? "follow" : "saved"}:v1:${storyId}`;
  const { ready, state, toggle } = useAccount();
  const collection = follow ? "followedStoryIds" : "savedStoryIds";
  const legacyStored = useLocalValue(key) === "true";
  const stored = ready ? state[collection].includes(storyId) : legacyStored;
  const [local, setLocal] = useState<boolean | null>(null);
  const [message, setMessage] = useState("");
  const selected = local ?? stored;
  const Icon = selected ? Check : follow ? Heart : Bookmark;
  const text = follow
    ? selected
      ? "Following"
      : "Follow story"
    : selected
      ? "Saved"
      : "Save to library";
  return (
    <span className={compact ? "save-control" : "local-action"}>
      <button
        className={compact ? "icon-button cover-save" : "button button-outline"}
        aria-label={`${text}${compact ? " on this device" : ""}`}
        aria-pressed={selected}
        title={`${text} on this device`}
        onClick={() => {
          const next = !selected;
          const saved = writeStorage(key, String(next));
          if (state[collection].includes(storyId) !== next) {
            toggle(collection, storyId);
          }
          setLocal(saved ? null : next);
          setMessage(
            saved
              ? next
                ? "Saved on this device."
                : "Removed from this device."
              : "Saved for this visit. Device storage is unavailable.",
          );
        }}
      >
        <Icon size={18} />
        {!compact ? text : null}
      </button>
      <span role="status" className={compact ? "sr-only" : "action-message"}>
        {message}
      </span>
    </span>
  );
}
export function ShareButton() {
  const [message, setMessage] = useState("");
  const [url, setUrl] = useState("");
  return (
    <span className="local-action">
      <button
        className="icon-button"
        aria-label="Share story"
        title="Copy story link"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(location.href);
            setMessage("Link copied.");
          } catch {
            setUrl(location.href);
            setMessage("Copy this link:");
          }
        }}
      >
        <Share2 size={19} />
      </button>
      <span role="status" className="action-message">
        {message}
      </span>
      {url ? (
        <input
          aria-label="Story link"
          value={url}
          readOnly
          onFocus={(e) => e.target.select()}
        />
      ) : null}
    </span>
  );
}

export function ContinueReading({
  storyId,
  slug,
  chapterSlugs,
  chapters,
}: {
  storyId: string;
  slug: string;
  chapterSlugs?: string[];
  chapters?: ChapterSummary[];
}) {
  const raw = useLocalValue(`inkflow:progress:v1:${storyId}`);
  const mark = parseBookmark(raw);
  const validSlugs = chapterSlugs ?? chapters?.map((c) => c.slug) ?? [];
  if (!mark || !validSlugs.includes(mark.chapterSlug)) return null;

  const currentChapter = chapters?.find((c) => c.slug === mark.chapterSlug);
  const chapterDisplay = currentChapter
    ? `Chapter ${String(currentChapter.number).padStart(2, "0")} · ${currentChapter.title}`
    : `Chapter ${mark.chapterSlug.replace(/^chapter-/, "")}`;

  return (
    <div className="resume-panel" role="region" aria-label="Reading progress">
      <div className="resume-panel-copy">
        <span className="eyebrow coral">Continue where you left off</span>
        <strong className="resume-chapter-name">{chapterDisplay}</strong>
      </div>
      <Link
        className="button button-resume"
        href={`/stories/${slug}/chapters/${mark.chapterSlug}?resume=1`}
      >
        <BookOpen size={17} aria-hidden="true" />
        Continue reading
        <ArrowRight size={17} />
      </Link>
    </div>
  );
}
