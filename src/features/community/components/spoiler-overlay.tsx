"use client";

import { useState, useRef } from "react";
import { AlertTriangle, Eye, EyeOff } from "lucide-react";
import type { SpoilerScope } from "../types/community";

export function SpoilerOverlay({
  scope,
  children,
  defaultRevealed = false,
}: {
  scope: SpoilerScope;
  children: React.ReactNode;
  defaultRevealed?: boolean;
}) {
  const [revealed, setRevealed] = useState(defaultRevealed);
  const [announced, setAnnounced] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const chapterLabel =
    scope.throughChapterNumber != null
      ? `Chapter ${scope.throughChapterNumber}`
      : scope.throughChapterTitle ?? "full story";

  const handleReveal = () => {
    setRevealed(true);
    setAnnounced(true);
    // Shift focus programmatically to the revealed content container
    setTimeout(() => {
      contentRef.current?.focus();
    }, 50);
  };

  const handleHide = () => {
    setRevealed(false);
    setAnnounced(false);
  };

  if (!revealed) {
    return (
      <div className="spoiler-overlay-container">
        <div className="spoiler-gate">
          <div className="spoiler-warning-badge">
            <AlertTriangle size={15} aria-hidden="true" />
            <span>Spoiler Warning</span>
          </div>

          <h2 className="spoiler-warning-title">Plot Spoilers Protected</h2>

          <p className="spoiler-warning-text">
            ⚠ This discussion contains {chapterLabel} spoilers for{" "}
            <em>{scope.storyTitle}</em>.
          </p>

          <button
            type="button"
            onClick={handleReveal}
            className="spoiler-reveal-btn"
          >
            <Eye size={15} aria-hidden="true" />
            <span>Reveal discussion</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="spoiler-overlay-container">
      {announced && (
        <span className="sr-only" role="status">
          Discussion revealed
        </span>
      )}

      <div className="spoiler-unblurred-banner">
        <span>
          ⚠ Showing {chapterLabel} spoilers for <em>{scope.storyTitle}</em>
        </span>
        <button
          type="button"
          onClick={handleHide}
          className="spoiler-rehide-btn"
          aria-label="Hide discussion spoilers again"
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
            <EyeOff size={12} aria-hidden="true" /> Hide spoilers
          </span>
        </button>
      </div>

      <div
        ref={contentRef}
        tabIndex={-1}
        style={{ outline: "none" }}
      >
        {children}
      </div>
    </div>
  );
}
