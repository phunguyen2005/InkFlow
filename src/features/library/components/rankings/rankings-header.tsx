export function RankingsHeader() {
  return (
    <header className="rankings-header">
      <div className="rankings-eyebrow-row">
        <span className="eyebrow muted">Charts · Demo edition</span>
        <span className="rankings-demo-pill" role="status">
          Demo chart
        </span>
      </div>
      <h1 className="display-heading rankings-title">
        RANKINGS<span className="coral">.</span>
      </h1>
      <p className="rankings-deck">
        Curated editorial chart ordering across the InkFlow catalog.
      </p>
      <p className="rankings-disclaimer fine-print muted">
        Editorial demo ordering – not live reader activity.
      </p>
    </header>
  );
}
