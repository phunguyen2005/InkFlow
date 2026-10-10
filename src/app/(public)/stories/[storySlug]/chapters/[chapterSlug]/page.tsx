import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { library } from "@/features/library/data/mock-library.repository";
import { ReaderShell } from "@/features/library/components/reader/reader-shell";

type Props = {
  params: Promise<{ storySlug: string; chapterSlug: string }>;
  searchParams: Promise<{ resume?: string }>;
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await params;
  const c = await library.getChapterBySlug(p.storySlug, p.chapterSlug);
  return { title: c ? `${c.title} - ${c.story.title}` : "Chapter not found" };
}
export default async function ChapterPage({ params, searchParams }: Props) {
  const [p, query] = await Promise.all([params, searchParams]);
  const [chapter, story] = await Promise.all([
    library.getChapterBySlug(p.storySlug, p.chapterSlug),
    library.getStoryBySlug(p.storySlug),
  ]);
  if (!chapter || !story) notFound();
  return (
    <ReaderShell
      key={chapter.id}
      story={{ id: story.id, slug: story.slug, title: story.title }}
      chapter={story.chapters.find((item) => item.slug === chapter.slug)!}
      chapters={story.chapters}
      previous={chapter.previousChapterSlug}
      next={chapter.nextChapterSlug}
      resume={query.resume === "1"}
    >
      {chapter.bodyMarkdown.split(/\n\n+/).map((paragraph, i) => (
        <div key={i} id={`paragraph-${i}`} data-paragraph={i}>
          <ReactMarkdown skipHtml>{paragraph}</ReactMarkdown>
        </div>
      ))}
    </ReaderShell>
  );
}
