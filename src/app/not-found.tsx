import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LibraryShell } from "@/features/library/components/navigation/site-header";
export default function NotFound() {
  return (
    <LibraryShell>
      <main id="main" className="page-width empty-state error-page">
        <span className="eyebrow coral">404 / A page out of place</span>
        <h1>This chapter hasn&apos;t been written.</h1>
        <p>
          The story, author, or chapter you&apos;re looking for isn&apos;t in
          this catalog.
        </p>
        <Link className="button" href="/explore">
          <ArrowLeft size={17} />
          Back to the library
        </Link>
      </main>
    </LibraryShell>
  );
}
