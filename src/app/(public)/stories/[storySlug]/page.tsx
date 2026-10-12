import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Star,
} from "lucide-react";
import { LibraryShell } from "@/features/library/components/navigation/site-header";
import { StoryShelf } from "@/features/library/components/discovery/story-shelf";
import {
  SaveButton,
  ShareButton,
  ContinueReading,
} from "@/features/library/components/story/local-actions";
import { StoryChapterList } from "@/features/library/components/story/story-chapter-list";
import { library, getPublicSlugs } from "@/features/library/data/library";
import { StoryReviews } from "@/features/library/components/story/story-reviews";
import {
  dateLabel,
  label,
  genreSlug,
  initials,
} from "@/features/library/utils/formatting";
import { community } from "@/features/community/data/community";
import { DiscussionCard } from "@/features/community/components/discussion-card";

type Props = { params: Promise<{ storySlug: string }> };
export async function generateStaticParams() {
  return (await getPublicSlugs()).stories.map((storySlug) => ({ storySlug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const story = await library.getStoryBySlug((await params).storySlug);
  return {
    title: story?.title ?? "Story not found",
    description: story?.synopsisShort,
  };
}
export default async function StoryPage({ params }: Props) {
  const story = await library.getStoryBySlug((await params).storySlug);
  if (!story) notFound();
  const related = await library.listStories({
    genres: [story.primaryGenre],
    pageSize: 6,
  });
  const storyDiscussions = await community.getDiscussionsByStory(story.slug);
  return (
    <LibraryShell>
      <main id="main" className="page-width story-page">
        <Link className="back-link" href="/explore">
          <ArrowLeft size={16} />
          Back to explore
        </Link>
        <section className="story-detail-hero">
          <div className="detail-cover">
            <Image
              src={story.coverUrl}
              alt={story.coverAlt}
              fill
              sizes="(max-width: 640px) 180px, 320px"
              preload
            />
          </div>
          <div className="detail-intro">
            <div className="detail-eyebrow">
              <Link
                className="eyebrow coral"
                href={`/explore?genre=${genreSlug(story.primaryGenre)}`}
              >
                {story.genreLabel}
              </Link>
              <span className={`status-dot ${story.status.toLowerCase()}`}>
                {label(story.status)}
              </span>
            </div>
            <h1>{story.title}</h1>
            <Link
              className="author-byline"
              href={`/authors/${story.author.slug}`}
            >
              <span className="avatar avatar-small">
                {initials(story.author.penName)}
              </span>
              By <strong>{story.author.penName}</strong>
              <ArrowUpRight size={15} />
            </Link>
            <p className="story-synopsis">{story.synopsisLong}</p>
            <div className="detail-stats">
              <span>
                <Star size={17} className="gold" aria-hidden="true" />
                <strong>{story.rating.average.toFixed(1)}</strong>
                <span>{story.rating.count} estimated ratings</span>
              </span>
              <span>
                <BookOpen size={17} />
                <strong>{story.chapters.length}</strong>
                <span>available chapters</span>
              </span>
              <span className="detail-language">English</span>
            </div>
            <div className="detail-reading-actions">
              <ContinueReading
                storyId={story.id}
                slug={story.slug}
                chapterSlugs={story.chapters.map((chapter) => chapter.slug)}
                chapters={story.chapters}
              />
              <Link
                className="button button-outline"
                href={`/stories/${story.slug}/chapters/chapter-1`}
              >
                <BookOpen size={17} />
                Start reading
                <ArrowRight size={17} />
              </Link>
            </div>
            <div className="detail-secondary">
              <SaveButton storyId={story.id} />
              <SaveButton storyId={story.id} follow />
              <ShareButton />
            </div>
            <p className="fine-print">Saves and follows stay on this device.</p>
          </div>
        </section>
        <div className="story-body-grid">
          <section className="chapter-section">
            <div className="section-line">
              <h2>Table of contents</h2>
              <span className="muted">
                {story.chapters.length} available chapters
              </span>
            </div>
            <p className="muted chapter-note">Read every chapter currently published in the Library.</p>
            <StoryChapterList
              storyId={story.id}
              storySlug={story.slug}
              chapters={story.chapters}
            />
          </section>
          <aside className="story-aside">
            <h2>Between the lines</h2>
            <span className="eyebrow muted">Tropes & themes</span>
            <div className="tag-list">
              {story.tropes.map((t) => (
                <Link key={t} href={`/explore?trope=${t}`}>
                  {label(t)}
                  <ArrowUpRight size={12} />
                </Link>
              ))}
            </div>
            <dl>
              <dt>Atmosphere</dt>
              <dd>{label(story.mood)}</dd>
              <dt>Last catalog update</dt>
              <dd>
                <time dateTime={story.lastPublishedAt}>
                  {dateLabel(story.lastPublishedAt)}
                </time>
              </dd>
              <dt>Writing provenance</dt>
              <dd>Unspecified</dd>
            </dl>
            <StoryReviews storyId={story.id} baselineAverage={story.rating.average} baselineCount={story.rating.count} />
          </aside>
        </div>
        <section className="story-discussions-section">
          <div className="story-discussions-header">
            <h2>Conversations</h2>
            <Link
              href={`/community?story=${story.slug}`}
              className="text-link"
            >
              View all <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          </div>
          <p className="story-discussions-note">
            Join readers discussing this story.
          </p>
          {storyDiscussions.length > 0 ? (
            <div className="story-discussions-list">
              {storyDiscussions.slice(0, 3).map((d) => (
                <DiscussionCard key={d.id} discussion={d} compact />
              ))}
            </div>
          ) : (
            <p className="story-discussions-empty">
              No community conversations yet for this story.
            </p>
          )}
        </section>
        <StoryShelf
          title="Another world awaits"
          stories={related.items.filter((s) => s.id !== story.id)}
          href={`/explore?genre=${genreSlug(story.primaryGenre)}`}
        />
      </main>
    </LibraryShell>
  );
}
