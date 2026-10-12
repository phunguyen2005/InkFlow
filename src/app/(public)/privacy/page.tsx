import { LibraryShell } from "@/features/library/components/navigation/site-header";
export default function PrivacyPage() {
  return (
    <LibraryShell>
      <main id="main" className="page-width prose-page">
        <span className="eyebrow coral">Privacy</span>
        <h1>Your preview data stays on your device.</h1>
        <p>
          This prototype does not send account credentials, bookmarks, follows,
          reviews, reading progress, or Studio drafts to a production backend.
          Those values are stored in this browser and can be removed by clearing
          site data.
        </p>
        <h2>Before a public launch</h2>
        <p>
          Authentication, consent, retention, export, deletion, and regional
          privacy requirements must be implemented and independently reviewed.
        </p>
      </main>
    </LibraryShell>
  );
}
