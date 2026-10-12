import { readFile, writeFile, mkdir } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import { toString } from "mdast-util-to-string";
import { validateContent } from "./validate-content.mjs";

// Parse the user's Markdown tables as an AST so links and formatting stay intact.
export function parseContentLibrary(source) {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(source);
  let section = "";
  const content = { authors: [], stories: [], imageReferences: [] };
  for (const node of tree.children) {
    if (node.type === "heading") section = toString(node);
    if (node.type !== "table") continue;
    for (const row of node.children.slice(1)) {
      const cells = row.children.map(toString);
      const expectedColumns = {
        "Fictional Authors": 6,
        "Fictional Story Mock Data": 7,
        "Image Reference Catalog": 6,
      }[section];
      if (!expectedColumns) continue;
      const context = `${section}, line ${row.position?.start.line ?? "unknown"}, ${cells[0]}`;
      if (
        cells.length !== expectedColumns ||
        cells.some((cell) => !cell.trim())
      )
        throw new Error(`${context}: invalid columns`);
      const split = (value, separator, count, field) => {
        const values = value.split(separator).map((part) => part.trim());
        if (values.length !== count || values.some((part) => !part))
          throw new Error(`${context}: invalid ${field}`);
        return values;
      };
      if (section === "Fictional Authors") {
        const [id, name, slug, avatarRefId, bio, metadata] = cells;
        const [location, language, works] = split(metadata, ";", 3, "metadata");
        if (!/^\d+ works?$/.test(works))
          throw new Error(`${context}: invalid declaredWorkCount`);
        content.authors.push({
          id,
          name,
          slug,
          avatarRefId,
          bio,
          location,
          language,
          declaredWorkCount: parseInt(works, 10),
        });
      }
      if (section === "Fictional Story Mock Data") {
        const [
          identity,
          author,
          taxonomy,
          state,
          imageRefId,
          synopsis,
          metrics,
        ] = cells;
        const [id, slug, title] = split(identity, " / ", 3, "identity");
        const [primaryGenre, secondary, tropeList] = split(
          taxonomy,
          ";",
          3,
          "taxonomy",
        );
        const [status, mood] = split(state, ";", 2, "state");
        const [rating, chapters, publishedAt] = split(
          metrics,
          ";",
          3,
          "metrics",
        );
        const [average, count] = split(rating, "/", 2, "rating").map(Number);
        content.stories.push({
          id,
          slug,
          title,
          authorId: author.split(" ")[0],
          primaryGenre,
          secondaryGenres: secondary.split(", "),
          tropes: tropeList.split(", "),
          status,
          mood,
          imageRefId,
          synopsis,
          rating: { average, count },
          chapterCount: Number(chapters),
          publishedAt,
        });
      }
      if (section === "Image Reference Catalog") {
        const [id, title, genre, mood, , note] = cells;
        const link = row.children[4].children.find((n) => n.type === "link");
        content.imageReferences.push({
          id,
          title,
          genre,
          mood,
          sourcePage: link?.url,
          note,
        });
      }
    }
  }
  return validateContent(content);
}
export async function importContentLibrary() {
  const source = await readFile(
    new URL("../content-library.md", import.meta.url),
    "utf8",
  );
  const content = parseContentLibrary(source);
  const directory = new URL("../src/features/library/mock/", import.meta.url);
  await mkdir(directory, { recursive: true });
  await writeFile(
    new URL("content-source.json", directory),
    JSON.stringify(content, null, 2) + "\n",
  );
  console.log(
    `Imported ${content.stories.length} stories, ${content.authors.length} authors, ${content.imageReferences.length} visual references from content-library.md`,
  );
}
// Importing the parser in tests must not rewrite the generated catalog.
if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url)
  await importContentLibrary();
