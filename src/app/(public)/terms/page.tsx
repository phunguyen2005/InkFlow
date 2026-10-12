import { LibraryShell } from "@/features/library/components/navigation/site-header";
export default function TermsPage() {
  return (
    <LibraryShell>
      <main id="main" className="page-width prose-page">
        <span className="eyebrow coral">Terms</span>
        <h1>Prototype terms</h1>
        <p>
          InkFlow is currently a non-production interface prototype. All
          stories, authors, ratings, reader activity, and generated responses
          are fictional demonstrations. Do not rely on this build for permanent
          content storage or commercial publishing.
        </p>
        <h2>Creative control</h2>
        <p>
          Writers remain responsible for reviewing generated drafts, continuity
          suggestions, and proposed canon changes before accepting them.
        </p>
      </main>
    </LibraryShell>
  );
}
