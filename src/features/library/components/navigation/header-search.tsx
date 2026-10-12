"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { catalog } from "../../mock/catalog";

export function HeaderSearch() {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();
  const suggestions = useMemo(
    () =>
      normalized.length < 2
        ? []
        : catalog
            .filter((story) =>
              [
                story.title,
                story.author.penName,
                ...story.tags,
                ...story.tropes,
              ]
                .join(" ")
                .toLowerCase()
                .includes(normalized),
            )
            .slice(0, 5),
    [normalized],
  );
  return (
    <div className="header-search-wrap">
      <form className="header-search" action="/explore" role="search">
        <Search size={16} aria-hidden="true" />
        <input
          role="combobox"
          aria-label="Search stories, authors, or tags"
          aria-autocomplete="list"
          aria-controls="header-search-results"
          aria-expanded={suggestions.length > 0}
          name="q"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search stories, authors, or tags..."
          maxLength={200}
        />
        <button className="sr-only" type="submit">
          Search
        </button>
      </form>
      {suggestions.length ? (
        <div
          className="search-suggestions"
          id="header-search-results"
          role="listbox"
        >
          {suggestions.map((story) => (
            <Link
              key={story.id}
              href={`/stories/${story.slug}`}
              role="option"
              onClick={() => setQuery("")}
            >
              <span>{story.title}</span>
              <small>
                {story.author.penName} · {story.genreLabel}
              </small>
            </Link>
          ))}
          <Link
            className="search-all"
            href={`/explore?q=${encodeURIComponent(query)}`}
          >
            See all results
          </Link>
        </div>
      ) : null}
    </div>
  );
}
