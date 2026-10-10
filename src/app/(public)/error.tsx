"use client";
import Link from "next/link";
import { RotateCcw } from "lucide-react";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main" className="page-width empty-state error-page">
      <h1>We lost our place.</h1>
      <p>This page could not be loaded. Please try again.</p>
      <button className="button" onClick={reset}>
        <RotateCcw size={17} />
        Try again
      </button>
      <Link className="text-link" href="/">
        Return to InkFlow
      </Link>
    </main>
  );
}
