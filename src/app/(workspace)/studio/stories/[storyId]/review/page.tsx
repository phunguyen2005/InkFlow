import { ContinuityReview } from "@/features/studio/continuity/continuity-review";
export default async function Page({
  params,
}: {
  params: Promise<{ storyId: string }>;
}) {
  const { storyId } = await params;
  return <ContinuityReview key={storyId} storyId={storyId} />;
}
