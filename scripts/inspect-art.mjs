import sharp from "sharp";
import { readdir, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const directory = process.argv[2];
const files = (await readdir(directory))
  .filter((f) => f.endsWith(".png"))
  .sort();
await mkdir("docs/qa", { recursive: true });
const tiles = await Promise.all(
  files.map(async (file, i) => {
    const thumb = await sharp(path.join(directory, file))
      .resize(180, 230, { fit: "contain", background: "#172026" })
      .toBuffer();
    const label = Buffer.from(
      `<svg width="180" height="28"><rect width="180" height="28" fill="white"/><text x="8" y="20" font-size="16">${i}: ${file.slice(5, 13)}</text></svg>`,
    );
    return [
      { input: thumb, left: (i % 5) * 180, top: Math.floor(i / 5) * 258 },
      { input: label, left: (i % 5) * 180, top: Math.floor(i / 5) * 258 + 230 },
    ];
  }),
);
await sharp({
  create: {
    width: 900,
    height: Math.ceil(files.length / 5) * 258,
    channels: 3,
    background: "#172026",
  },
})
  .composite(tiles.flat())
  .png()
  .toFile("docs/qa/art-contact-sheet.png");
await writeFile("docs/qa/art-files.json", JSON.stringify(files, null, 2));
console.log(files.map((file, i) => `${i}: ${file}`).join("\n"));
