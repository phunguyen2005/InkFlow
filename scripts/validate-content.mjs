import taxonomy from "../src/features/library/mock/taxonomy.json" with { type: "json" };

function check(condition, context, field) {
  if (!condition) throw new Error(`${context}: invalid ${field}`);
}

export function validateContent(content) {
  const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  check(
    content.authors.length > 0 && content.stories.length > 0,
    "Content library",
    "missing tables",
  );
  for (const [section, records] of Object.entries(content)) {
    const ids = new Set();
    const slugs = new Set();
    for (const record of records) {
      const context = `${section} ${record.id}`;
      check(
        record.id && !ids.has(record.id),
        context,
        "duplicate or missing id",
      );
      ids.add(record.id);
      if (section !== "imageReferences") {
        check(
          slugPattern.test(record.slug) && !slugs.has(record.slug),
          context,
          "duplicate or invalid slug",
        );
        slugs.add(record.slug);
      }
    }
  }
  for (const author of content.authors) {
    check(
      Number.isSafeInteger(author.declaredWorkCount) &&
        author.declaredWorkCount >= 0,
      author.id,
      "declaredWorkCount",
    );
  }
  for (const story of content.stories) {
    check(
      content.authors.some((author) => author.id === story.authorId),
      story.id,
      "authorId",
    );
    check(
      content.imageReferences.some((image) => image.id === story.imageRefId),
      story.id,
      "imageRefId",
    );
    check(
      Object.hasOwn(taxonomy, story.primaryGenre),
      story.id,
      "primaryGenre",
    );
    check(
      ["ongoing", "completed", "hiatus"].includes(story.status),
      story.id,
      "status",
    );
    check(
      Number.isFinite(story.rating.average) &&
        story.rating.average >= 0 &&
        story.rating.average <= 5,
      story.id,
      "rating.average",
    );
    check(
      Number.isSafeInteger(story.rating.count) && story.rating.count >= 0,
      story.id,
      "rating.count",
    );
    check(
      Number.isSafeInteger(story.chapterCount) && story.chapterCount > 0,
      story.id,
      "chapterCount",
    );
    const date = new Date(`${story.publishedAt}T00:00:00Z`);
    check(
      /^\d{4}-\d{2}-\d{2}$/.test(story.publishedAt) &&
        Number.isFinite(date.getTime()) &&
        date.toISOString().slice(0, 10) === story.publishedAt,
      story.id,
      "publishedAt",
    );
  }
  for (const image of content.imageReferences) {
    check(
      typeof image.sourcePage === "string" &&
        /^https?:\/\//.test(image.sourcePage),
      image.id,
      "sourcePage",
    );
  }
  return content;
}
