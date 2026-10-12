import { ChapterEditor } from "@/features/studio/editor/chapter-editor";
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ storyId: string; chapterId: string }>;
  searchParams: Promise<{ issue?: string; block?: string }>;
}) {
  const p = await params;
  const query = await searchParams;
  return (
    <ChapterEditor
      key={decodeURIComponent(p.chapterId)}
      storyId={p.storyId}
      chapterId={decodeURIComponent(p.chapterId)}
      issueId={query.issue}
      blockId={query.block}
    />
  );
}
