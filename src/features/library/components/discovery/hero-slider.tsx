"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { StorySummary } from "@/features/library/types/library";

export interface FeaturedStoryItem {
  story: StorySummary;
  heroImage?: string;
  tagline?: string;
}

interface HeroSliderProps {
  items: FeaturedStoryItem[];
  autoPlayIntervalMs?: number;
}

export function HeroSlider({ items, autoPlayIntervalMs = 6000 }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentItem = items[currentIndex] || items[0];

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (isPaused || items.length <= 1) return;

    timerRef.current = setInterval(() => {
      goToNext();
    }, autoPlayIntervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, items.length, autoPlayIntervalMs, goToNext]);

  if (!currentItem) return null;

  return (
    <section
      className="hero"
      aria-label="Featured stories"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
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
          InkFlow Public Library <span className="tiny-dot" /> Demo edition
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
          {items.length > 1 && (
            <div className="hero-slider-nav" aria-label="Slider navigation">
              <button
                type="button"
                className="hero-nav-btn"
                onClick={goToPrev}
                aria-label="Previous featured story"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="hero-slide-counter" aria-live="polite">
                {currentIndex + 1} / {items.length}
              </span>
              <button
                type="button"
                className="hero-nav-btn"
                onClick={goToNext}
                aria-label="Next featured story"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Content with smooth fade */}
        <div key={currentItem.story.id} className="hero-rail-content animate-fade">
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
            href={`/stories/${currentItem.story.slug}/chapters/chapter-1`}
          >
            Start reading <ArrowUpRight size={17} />
          </Link>
        </div>

        {/* Progress Dots */}
        {items.length > 1 && (
          <div className="hero-dots" role="tablist" aria-label="Featured stories selection">
            {items.map((item, idx) => (
              <button
                key={item.story.id}
                type="button"
                role="tab"
                aria-selected={idx === currentIndex}
                aria-label={`Slide ${idx + 1}: ${item.story.title}`}
                className={`hero-dot ${idx === currentIndex ? "active" : ""}`}
                onClick={() => setCurrentIndex(idx)}
              >
                <span className="hero-dot-indicator" />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
