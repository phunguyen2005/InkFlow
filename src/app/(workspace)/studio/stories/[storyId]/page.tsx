import { StoryWorkspace } from "@/features/studio/stories/story-workspace";
export default async function Page({
  params,
}: {
  params: Promise<{ storyId: string }>;
}) {
  const { storyId } = await params;
  return <StoryWorkspace storyId={storyId} />;
}
