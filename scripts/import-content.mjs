import { readFile, writeFile, mkdir } from "node:fs/promises";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import { toString } from "mdast-util-to-string";

// Parse the user's Markdown tables as an AST so links and formatting stay intact.
const source = await readFile(
  new URL("../content-library.md", import.meta.url),
  "utf8",
);
const tree = unified().use(remarkParse).use(remarkGfm).parse(source);
let section = "";
const content = { authors: [], stories: [], imageReferences: [] };
for (const node of tree.children) {
  if (node.type === "heading") section = toString(node);
  if (node.type !== "table") continue;
  for (const row of node.children.slice(1)) {
    const cells = row.children.map(toString);
    if (section === "Fictional Authors") {
      const [id, name, slug, avatarRefId, bio, metadata] = cells;
      const [location, language, works] = metadata
        .split(";")
        .map((s) => s.trim());
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
      const [identity, author, taxonomy, state, imageRefId, synopsis, metrics] =
        cells;
      const [id, slug, title] = identity.split(" / ").map((s) => s.trim());
      const [primaryGenre, secondary, tropeList] = taxonomy
        .split(";")
        .map((s) => s.trim());
      const [status, mood] = state.split(";").map((s) => s.trim());
      const [rating, chapters, publishedAt] = metrics
        .split(";")
        .map((s) => s.trim());
      const [average, count] = rating.split("/").map(Number);
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
if (content.stories.length !== 20 || content.authors.length !== 20)
  throw new Error("Expected 20 stories and 20 authors in content-library.md");
for (const story of content.stories) {
  if (!content.authors.some((a) => a.id === story.authorId))
    throw new Error(`Missing author: ${story.id}`);
  if (!content.imageReferences.some((a) => a.id === story.imageRefId))
    throw new Error(`Missing asset reference: ${story.id}`);
}
const directory = new URL("../src/features/library/mock/", import.meta.url);
await mkdir(directory, { recursive: true });
await writeFile(
  new URL("content-source.json", directory),
  JSON.stringify(content, null, 2) + "\n",
);
console.log(
  `Imported ${content.stories.length} stories, ${content.authors.length} authors, ${content.imageReferences.length} visual references from content-library.md`,
);
