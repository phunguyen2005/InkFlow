import { CanonLibrary } from "@/features/studio/canon/canon-library";
export default async function Page({
  params,
}: {
  params: Promise<{ storyId: string }>;
}) {
  const { storyId } = await params;
  return <CanonLibrary key={storyId} storyId={storyId} />;
}
