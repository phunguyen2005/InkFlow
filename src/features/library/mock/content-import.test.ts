import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parseContentLibrary } from "../../../../scripts/import-content.mjs";
import source from "./content-source.json";

const markdown = readFileSync(
  new URL("../../../../content-library.md", import.meta.url),
  "utf8",
);
describe("Markdown import boundary", () => {
  it("imports the supplied Markdown without losing source fields", () => {
    expect(parseContentLibrary(markdown)).toEqual(source);
  });
  it.each([
    ["duplicate identity", "`story-002` /", "`story-001` /", /duplicate.*id/],
    ["unknown genre", "dark-fantasy;", "unknown-genre;", /primaryGenre/],
    ["unknown status", "ongoing;", "unknown-status;", /status/],
    ["invalid date", "2026-05-18", "2026-02-30", /publishedAt/],
  ])("rejects %s with field context", (_label, from, to, error) => {
    // Use a fixture date from the actual source rather than relying on its spelling.
    const input =
      from === "2026-05-18"
        ? markdown.replace(source.stories[0].publishedAt, String(to))
        : markdown.replace(String(from), String(to));
    expect(() => parseContentLibrary(input)).toThrow(error as RegExp);
  });
  it("rejects malformed table cells before accessing nested fields", () => {
    expect(() =>
      parseContentLibrary(markdown.replace("; 24;", "; bad-number;")),
    ).toThrow(/chapterCount/);
  });
});
