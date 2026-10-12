"use client";

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  useSyncExternalStore,
} from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from "lucide-react";
import type { StorySummary } from "@/features/library/types/library";

function subscribeReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

export interface FeaturedStoryItem {
  story: Pick<
    StorySummary,
    "id" | "slug" | "title" | "coverUrl" | "coverAlt" | "synopsisShort"
  >;
  firstChapterSlug: string | null;
  heroImage?: string;
  tagline?: string;
}

interface HeroSliderProps {
  items: FeaturedStoryItem[];
  autoPlayIntervalMs?: number;
}

export function HeroSlider({
  items,
  autoPlayIntervalMs = 6000,
}: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [hasFocusWithin, setHasFocusWithin] = useState(false);
  const [isDocumentHidden, setIsDocumentHidden] = useState(false);
  const [isManuallyPaused, setIsManuallyPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
  const isPaused =
    isHovered ||
    hasFocusWithin ||
    isDocumentHidden ||
    isManuallyPaused ||
    prefersReducedMotion;

  const currentItem = items[currentIndex] || items[0];

  const goToNext = useCallback(() => {
    if (items.length) setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const goToPrev = useCallback(() => {
    if (items.length)
      setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  // Pause on background tab
  useEffect(() => {
    const handleVisibility = () => {
      setIsDocumentHidden(document.hidden);
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goToNext();
      }
    },
    [goToPrev, goToNext],
  );

  // Swipe handling
  const handlePointerDown = (e: React.PointerEvent) => {
    touchStartX.current = e.clientX;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (touchStartX.current === null) return;
    const diff = e.clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(diff) > 40) {
      if (diff > 0) goToPrev();
      else goToNext();
    }
  };

  if (!currentItem) return null;

  return (
    <section
      className={`hero ${isPaused || prefersReducedMotion ? "is-paused" : ""}`}
      aria-label="Featured stories"
      aria-roledescription="carousel"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setHasFocusWithin(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null))
          setHasFocusWithin(false);
      }}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => {
        touchStartX.current = null;
      }}
      style={
        { "--hero-interval": `${autoPlayIntervalMs}ms` } as React.CSSProperties
      }
    >
      {/* Background Images with crossfade */}
      <div className="hero-art-layer" aria-hidden="true">
        {items.map((item, idx) => {
          const imgSrc = item.heroImage || item.story.coverUrl;
          const isActive = idx === currentIndex;
          return (
            <div
              key={item.story.id}
              className={`hero-art-slide ${isActive ? "active" : ""}`}
            >
              <Image
                className="hero-art"
                src={imgSrc}
                alt={item.story.coverAlt || item.story.title}
                fill
                sizes="(max-width: 1440px) 100vw, 1360px"
                priority={idx === 0}
              />
            </div>
          );
        })}
      </div>

      {/* Main static explore typography */}
      <div className="hero-main">
        <span className="hero-kicker">
          InkFlow Public Library <span className="tiny-dot" /> English fiction
        </span>
        <h1>EXPLORE</h1>
        <div className="hero-bottom">
          <p className="hero-tagline">
            Stories
            <br />
            beyond
            <br />
            <em>imagination.</em>
          </p>
          <div className="hero-intro">
            <p>
              Original voices.
              <br />
              Uncharted worlds.
              <br />
              Your next great read.
            </p>
            <Link
              className="circle-link"
              aria-label="Explore all stories"
              href="/explore"
            >
              <ArrowUpRight size={28} />
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Story Dynamic Rail */}
      <div className="hero-rail">
        <div className="hero-rail-header">
          <span className="eyebrow">The featured story</span>
        </div>

        {/* Screen reader live announcement */}
        <div
          className="sr-only"
          aria-live={isPaused ? "polite" : "off"}
          aria-atomic="true"
        >
          Featured story {currentIndex + 1} of {items.length}:{" "}
          {currentItem.story.title}
        </div>

        {/* Content with stable vertical dimensions */}
        <div className="hero-rail-content">
          <h2>{currentItem.story.title}</h2>
          <span className="rail-rule" />
          <p className="hero-story-tagline">
            {currentItem.tagline || currentItem.story.synopsisShort}
          </p>
          <Link
            className="text-link"
            href={`/stories/${currentItem.story.slug}`}
          >
            Discover the story <ArrowRight size={17} />
          </Link>
          <Link
            className="button"
            href={
              currentItem.firstChapterSlug
                ? `/stories/${currentItem.story.slug}/chapters/${currentItem.firstChapterSlug}`
                : `/stories/${currentItem.story.slug}`
            }
          >
            {currentItem.firstChapterSlug ? "Start reading" : "View story"}{" "}
            <ArrowUpRight size={17} />
          </Link>
        </div>

        {/* Bottom controls: segments + clean arrow buttons */}
        {items.length > 1 && (
          <div className="hero-controls" aria-label="Slider navigation">
            <div className="hero-progress" aria-label="Featured stories">
              {items.map((item, idx) => (
                <button
                  key={item.story.id}
                  type="button"
                  aria-current={idx === currentIndex ? "true" : undefined}
                  aria-label={`Show story ${idx + 1}: ${item.story.title}`}
                  className={`hero-segment ${
                    idx === currentIndex
                      ? "active"
                      : idx < currentIndex
                        ? "completed"
                        : ""
                  }`}
                  onClick={() => setCurrentIndex(idx)}
                >
                  <span className="hero-segment-track">
                    <span
                      className="hero-segment-fill"
                      onAnimationEnd={(event) => {
                        if (
                          idx === currentIndex &&
                          event.animationName === "heroFillProgress"
                        ) {
                          goToNext();
                        }
                      }}
                    />
                  </span>
                </button>
              ))}
            </div>
            <div className="hero-arrows">
              <button
                type="button"
                className="hero-arrow-btn"
                onClick={() => setIsManuallyPaused((paused) => !paused)}
                aria-label={
                  isManuallyPaused
                    ? "Play featured stories"
                    : "Pause featured stories"
                }
                title={
                  isManuallyPaused
                    ? "Play featured stories"
                    : "Pause featured stories"
                }
                aria-pressed={isManuallyPaused}
              >
                {isManuallyPaused ? <Play size={18} /> : <Pause size={18} />}
              </button>
              <button
                type="button"
                className="hero-arrow-btn"
                onClick={goToPrev}
                aria-label="Previous featured story"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                className="hero-arrow-btn"
                onClick={goToNext}
                aria-label="Next featured story"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
