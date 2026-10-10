"use client";
import { useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal, X, RotateCcw } from "lucide-react";
import { GENRES, type StoryQueryParams } from "../../types/library";
import { genreSlug, label } from "../../utils/formatting";
import { queryString } from "../../utils/filters";

export function ExploreControls({
  query,
  tropes,
}: {
  query: StoryQueryParams;
  tropes: string[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const form = useRef<HTMLFormElement>(null);
  function submit(data: FormData) {
    const params = new URLSearchParams();
    for (const [key, value] of data)
      if (typeof value === "string" && value.trim())
        params.append(key, value.trim());
    startTransition(() =>
      router.push(`/explore?${params.toString()}`, { scroll: false }),
    );
  }
  const chips = [
    ...(query.genres ?? []).map((g) => ({
      key: "genre",
      value: genreSlug(g),
      text: g,
    })),
    ...(query.tropes ?? []).map((t) => ({
      key: "trope",
      value: t,
      text: label(t),
    })),
    ...(query.status ?? []).map((s) => ({
      key: "status",
      value: s.toLowerCase(),
      text: label(s),
    })),
    ...(query.provenance ?? []).map((p) => ({
      key: "provenance",
      value: p.toLowerCase(),
      text: label(p),
    })),
  ];
  return (
    <div className="explore-controls" aria-busy={pending}>
      <form ref={form} action={submit}>
        <div className="explore-search">
          <Search size={23} />
          <input
            name="q"
            aria-label="Search catalog"
            defaultValue={query.q}
            placeholder="A story, an author, a world..."
            maxLength={200}
          />
          <button className="button" type="submit">
            Search <Search size={16} />
          </button>
        </div>
        <div className="filter-toolbar">
          <details className="filter-disclosure">
            <summary>
              <SlidersHorizontal size={17} /> Filters{" "}
              {chips.length > 0 ? (
                <span className="filter-count">{chips.length}</span>
              ) : null}
            </summary>
            <div className="filter-panel">
              <fieldset>
                <legend>Genres</legend>
                {GENRES.map((g) => (
                  <label key={g}>
                    <input
                      type="checkbox"
                      name="genre"
                      value={genreSlug(g)}
                      defaultChecked={query.genres?.includes(g)}
                    />
                    {g}
                  </label>
                ))}
              </fieldset>
              <fieldset>
                <legend>Status</legend>
                {["ONGOING", "COMPLETED", "HIATUS"].map((s) => (
                  <label key={s}>
                    <input
                      type="checkbox"
                      name="status"
                      value={s.toLowerCase()}
                      defaultChecked={query.status?.some((v) => v === s)}
                    />
                    {label(s)}
                  </label>
                ))}
              </fieldset>
              <fieldset>
                <legend className="secondary-legend">Provenance</legend>
                {["HUMAN_WRITTEN", "AI_ASSISTED", "UNSPECIFIED"].map((p) => (
                  <label key={p}>
                    <input
                      name="provenance"
                      type="checkbox"
                      value={p.toLowerCase()}
                      defaultChecked={query.provenance?.some((v) => v === p)}
                    />
                    {label(p)}
                  </label>
                ))}
              </fieldset>
              <fieldset className="trope-field">
                <legend>Tropes</legend>
                <div className="trope-options">
                  {tropes.map((t) => (
                    <label key={t}>
                      <input
                        type="checkbox"
                        name="trope"
                        value={t}
                        defaultChecked={query.tropes?.includes(t)}
                      />
                      {label(t)}
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="filter-actions">
                <button className="button" type="submit">
                  Apply filters
                </button>
                <button
                  type="button"
                  className="text-link"
                  onClick={() =>
                    startTransition(() =>
                      router.push(`/explore?${queryString({ q: query.q })}`, {
                        scroll: false,
                      }),
                    )
                  }
                >
                  <RotateCcw size={15} />
                  Clear filters
                </button>
              </div>
            </div>
          </details>
          <label className="sort-control">
            Sort by
            <select
              name="sort"
              defaultValue={query.sort}
              onChange={() => form.current?.requestSubmit()}
            >
              <option value="latest">Latest update</option>
              <option value="trending">Trending</option>
              <option value="rating">Highest rated</option>
              <option value="newest">Newest</option>
              <option value="completed">Completed first</option>
            </select>
          </label>
        </div>
      </form>
      <div className="active-filters">
        {chips.map((chip) => (
          <button
            className="filter-chip"
            key={`${chip.key}:${chip.value}`}
            aria-label={`Remove ${chip.text} filter`}
            onClick={() => {
              const p = new URLSearchParams(queryString(query));
              const values = p.getAll(chip.key).filter((v) => v !== chip.value);
              p.delete(chip.key);
              p.delete("page");
              values.forEach((v) => p.append(chip.key, v));
              startTransition(() =>
                router.push(`/explore?${p.toString()}`, { scroll: false }),
              );
            }}
          >
            {chip.text}
            <X size={14} />
          </button>
        ))}
        {query.q || chips.length ? (
          <button
            className="text-link muted"
            onClick={() =>
              startTransition(() => router.push("/explore", { scroll: false }))
            }
          >
            Clear all
          </button>
        ) : null}
        <span className="pending-message" role="status">
          {pending ? "Finding stories..." : ""}
        </span>
      </div>
    </div>
  );
}
