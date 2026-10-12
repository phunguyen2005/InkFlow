import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Globe2 } from "lucide-react";
import { LibraryShell } from "@/features/library/components/navigation/site-header";
import { StoryCard } from "@/features/library/components/discovery/story-card";
import { library, getPublicSlugs } from "@/features/library/data/library";
import { initials, genreSlug } from "@/features/library/utils/formatting";
import { AuthorFollowButton } from "@/features/account/author-follow-button";

type Props = { params: Promise<{ authorSlug: string }> };
export async function generateStaticParams() {
  return (await getPublicSlugs()).authors.map((authorSlug) => ({ authorSlug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = await library.getAuthorBySlug((await params).authorSlug);
  return { title: a?.penName ?? "Author not found", description: a?.bio };
}
export default async function AuthorPage({ params }: Props) {
  const author = await library.getAuthorBySlug((await params).authorSlug);
  if (!author) notFound();
  return (
    <LibraryShell>
      <main id="main" className="page-width author-page">
        <Link className="back-link" href="/explore">
          <ArrowLeft size={16} />
          Explore stories
        </Link>
        <section className="author-hero">
          <span className="avatar avatar-large author-art" role="img" aria-label={`Profile artwork for ${author.penName}`}>
            {author.works[0] ? <Image src={author.works[0].coverUrl} alt="" fill sizes="160px" /> : initials(author.penName)}
          </span>
          <div className="author-intro">
            <span className="eyebrow coral">The voice behind the story</span>
            <h1>{author.penName}</h1>
            <p>{author.bio}</p>
            <div className="author-location">
              <span>
                <MapPin size={15} />
                {author.location}
              </span>
              <span>
                <Globe2 size={15} />
                {author.language}
              </span>
            </div>
            <AuthorFollowButton authorId={author.id} />
          </div>
          <div className="author-count">
            <strong>
              {String(author.publishedWorksCount).padStart(2, "0")}
            </strong>
            <span>
              {author.publishedWorksCount === 1 ? "work" : "works"} in this
              catalog
            </span>
            <span>{author.publicChapterCount} chapters available</span>
          </div>
        </section>
        <section className="author-works">
          <div className="section-line">
            <h2 className="display-heading">Published works</h2>
            <div className="author-genres">
              {author.primaryGenres.map((g) => (
                <Link
                  className="text-link muted"
                  key={g}
                  href={`/explore?genre=${genreSlug(g)}`}
                >
                  {g}
                </Link>
              ))}
            </div>
          </div>
          {author.works.length ? (
            <div className="author-work-grid">
              {author.works.map((s) => (
                <StoryCard key={s.id} story={s} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>No published works yet.</h3>
            </div>
          )}
        </section>
      </main>
    </LibraryShell>
  );
}
