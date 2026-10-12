import Link from "next/link";
import { LibraryShell } from "@/features/library/components/navigation/site-header";

export default function AboutPage() {
  return (
    <LibraryShell>
      <main id="main" className="page-width prose-page">
        <span className="eyebrow coral">About InkFlow</span>
        <h1>Stories stay coherent. Writers stay in control.</h1>
        <p>
          InkFlow pairs a public home for English-language serialized fiction
          with a focused private writing workspace. The Library helps readers
          discover finished and ongoing worlds. Studio helps writers draft,
          organize canon, and review continuity without giving up authorship.
        </p>
        <p>
          This build is a visual prototype. Its catalog, authors, ratings,
          reader accounts, and AI responses are fictional and stored locally in
          your browser.
        </p>
        <Link className="button" href="/explore">
          Explore the catalog
        </Link>
      </main>
    </LibraryShell>
  );
}
