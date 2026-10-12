"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main">
      <h1>We could not open this workspace.</h1>
      <button onClick={reset}>Retry</button>
    </main>
  );
}
