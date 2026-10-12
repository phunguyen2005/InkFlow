"use client";

import { useState } from "react";
import { Flag, Check } from "lucide-react";

export function ReportAction() {
  const [submitted, setSubmitted] = useState(false);

  const handleReport = () => {
    setSubmitted(true);
  };

  return (
    <div className="report-action-wrap">
      {submitted ? (
        <span role="status" className="report-feedback">
          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
            <Check size={13} aria-hidden="true" />
            Report submitted for review (mock)
          </span>
        </span>
      ) : (
        <button
          type="button"
          onClick={handleReport}
          className="report-action-btn"
          aria-label="Report this discussion"
        >
          <Flag size={13} aria-hidden="true" />
          <span>Report</span>
        </button>
      )}
    </div>
  );
}
