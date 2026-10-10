export default function Loading() {
  return (
    <main
      id="main"
      className="page-width loading-page"
      aria-busy="true"
      aria-label="Loading library"
    >
      <div className="skeleton skeleton-heading" />
      <div className="loading-covers">
        {Array.from({ length: 6 }, (_, i) => (
          <div className="skeleton" key={i} />
        ))}
      </div>
      <span className="sr-only" role="status">
        Loading stories...
      </span>
    </main>
  );
}
