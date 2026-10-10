// imageRefId points to the source mood reference, never a third-party hotlink.
export function coverAsset(storySlug: string, imageRefId: string) {
  return {
    src: `/mock/covers/${storySlug}.webp`,
    width: 768,
    height: 1024,
    imageRefId,
    origin: "generated" as const,
  };
}
