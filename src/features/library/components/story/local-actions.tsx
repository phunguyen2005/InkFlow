"use client";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { Bookmark, Check, Heart, Share2, ArrowRight } from "lucide-react";
import {
  readStorage,
  writeStorage,
  parseBookmark,
} from "../../utils/reader-storage";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("inkflow-storage", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("inkflow-storage", callback);
  };
}
function useLocalValue(key: string) {
  return useSyncExternalStore(
    subscribe,
    () => readStorage(key),
    () => null,
  );
}
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
  const stored = useLocalValue(key) === "true";
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
}: {
  storyId: string;
  slug: string;
}) {
  const raw = useLocalValue(`inkflow:progress:v1:${storyId}`);
  const mark = parseBookmark(raw);
  return mark ? (
    <Link
      className="text-link continue-link"
      href={`/stories/${slug}/chapters/${mark.chapterSlug}?resume=1`}
    >
      Continue reading <ArrowRight size={18} />
    </Link>
  ) : null;
}
