import { StoryAssistant } from "@/features/studio/intelligence/story-assistant";
export default async function Page({
  params,
}: {
  params: Promise<{ storyId: string }>;
}) {
  const { storyId } = await params;
  return <StoryAssistant storyId={storyId} />;
}
