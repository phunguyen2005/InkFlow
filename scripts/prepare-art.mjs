import sharp from "sharp";
import { readdir, readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const input = process.argv[2];
const mapping = {
  "the-blood-orchard": "exec-30e0fba8-d49d-47d1-9311-8c14e741dd22.png",
  "the-quiet-machine-at-dawn": "exec-9bd415f5-f9a9-41e6-acbc-86a14eb04978.png",
  "a-map-for-moonlight": "exec-d1757d57-5350-4ba4-9565-f9a32636a837.png",
  "the-house-beneath-the-stairs":
    "exec-0933b748-ce96-4f44-94f1-6b32bf27fd59.png",
  "snowfall-at-room-seven": "exec-f8c20258-3303-4648-b236-9cfefdbb3e46.png",
  "the-alchemists-second-life": "exec-85a45274-78ee-4557-b2f7-51ef8a5922c2.png",
  "the-saltwind-atlas": "exec-c434234c-ffb9-4453-b521-2bc9a2f37e67.png",
  "the-velvet-treaty": "exec-d8e2d3af-4733-42f0-a150-7d958c534c9d.png",
  "the-lanterns-of-briar-row": "exec-9007ffa3-b0c0-46a0-be8d-939e6257fd36.png",
  "black-signal": "exec-acda4c72-70c0-4797-97c8-6eddbae0703d.png",
  "the-last-level-before-dawn": "exec-72126d1d-167d-4010-baab-875bcacd67ad.png",
  "the-fox-in-the-rain-court": "exec-00e22c53-e087-4f41-8c8e-37b6bdcad17a.png",
  "the-unreliable-moon": "exec-0ff87902-598a-4e07-bdf6-65ad80a0d906.png",
  "a-knife-for-every-name": "exec-9123e5b4-6b54-4a55-96f7-9486d1e187cc.png",
  "the-detective-of-small-miracles":
    "exec-b5182cee-fbf4-4986-8df6-0436b851d2a1.png",
};
for (const file of await readdir("docs/reference")) {
  if (!file.startsWith("generated-") || !file.endsWith(".json")) continue;
  const record = JSON.parse(
    await readFile(path.join("docs/reference", file), "utf8"),
  );
  const basename = record.hint.match(/exec-[a-z0-9-]+\.png/)?.[0];
  if (basename) mapping[record.slug] = basename;
}
await mkdir("public/mock/covers", { recursive: true });
await mkdir("public/mock/heroes", { recursive: true });
const manifest = [];
for (const [slug, file] of Object.entries(mapping)) {
  const destination = `public/mock/covers/${slug}.webp`;
  await sharp(path.join(input, file))
    .resize(768, 1024, { fit: "cover" })
    .webp({ quality: 85 })
    .toFile(destination);
  manifest.push({
    slug,
    path: destination,
    sourceFile: file,
    width: 768,
    height: 1024,
    origin: "Original generated illustration; built-in image_gen",
  });
}
await sharp(path.join(input, "exec-6700b419-4149-43bc-8491-51c01a069576.png"))
  .resize({ width: 2200, withoutEnlargement: true })
  .webp({ quality: 88 })
  .toFile("public/mock/heroes/blood-orchard.webp");
await writeFile(
  "docs/reference/asset-manifest.json",
  JSON.stringify(manifest, null, 2) + "\n",
);
console.log(`Prepared ${manifest.length} cover images and hero.`);
