"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useStudio } from "../shared/studio-provider";
import { StudioLink } from "../shared/studio-link";
import { Modal } from "../shared/modal";
import { ProposalForm, SourceEvidence } from "../canon/proposal-form";
import { evidenceMatches, chaptersFor } from "../data/selectors";
import type { ContinuityIssue, IssueStatus } from "../data/contracts";
import s from "../shared/studio.module.css";
export function ContinuityReview({ storyId }: { storyId: string }) {
  const { state, execute } = useStudio(),
    params = useSearchParams();
  const [selected, setSelected] = useState(params.get("issue") ?? ""),
    [status, setStatus] = useState("ALL"),
    [severity, setSeverity] = useState("ALL"),
    [chapter, setChapter] = useState("ALL"),
    [dismiss, setDismiss] = useState(false),
    [propose, setPropose] = useState(false),
    [error, setError] = useState(""),
    [pending, setPending] = useState(false);
  const issues = state.issues.filter((i) => i.storyId === storyId),
    visible = issues.filter(
      (i) =>
        (status === "ALL" || i.status === status) &&
        (severity === "ALL" || i.severity === severity) &&
        (chapter === "ALL" || i.chapterId === chapter),
    ),
    issue = visible.find((i) => i.id === selected) ?? visible[0],
    chapters = chaptersFor(state, storyId);
  async function update(item: ContinuityIssue, next: IssueStatus, note = "") {
    setPending(true);
    setError("");
    try {
      await execute({
        type: "REVIEW_ISSUE",
        storyId,
        id: item.id,
        status: next,
        note,
      });
      setDismiss(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Review action failed.");
    } finally {
      setPending(false);
    }
  }
  return (
    <main id="main" className={s.page}>
      <header className={s.pageHeader}>
        <div>
          <span className={s.kicker}>MANUSCRIPT & EVIDENCE</span>
          <h1>Continuity Review</h1>
        </div>
        <span className={s.badge}>Sample findings</span>
      </header>
      <div className={s.toolbar}>
        <select
          aria-label="Review status"
          className={s.select}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {["ALL", "OPEN", "RESOLVED", "DISMISSED"].map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
        <select
          aria-label="Severity"
          className={s.select}
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
        >
          {["ALL", "CRITICAL", "WARNING", "INFO"].map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
        <select
          aria-label="Review chapter"
          className={s.select}
          value={chapter}
          onChange={(e) => setChapter(e.target.value)}
        >
          <option value="ALL">All chapters</option>
          {chapters.map((c) => (
            <option key={c.id} value={c.id}>
              Chapter {c.order}
            </option>
          ))}
        </select>
        <span className={s.muted}>{visible.length} findings</span>
      </div>
      {error && (
        <p className={s.error} role="alert">
          {error}
        </p>
      )}
      <div className={s.split}>
        <section className={s.issueList} aria-label="Review findings">
          {visible.map((i) => (
            <button
              className={s.issue}
              aria-pressed={issue?.id === i.id}
              key={i.id}
              onClick={() => setSelected(i.id)}
            >
              <span
                className={
                  i.severity === "CRITICAL"
                    ? s.severityCritical
                    : i.severity === "WARNING"
                      ? s.severityWarning
                      : s.severityInfo
                }
              >
                {i.severity}
              </span>
              <h3>{i.title}</h3>
              <p>{i.explanation}</p>
              <small>
                Ch. {chapters.find((c) => c.id === i.chapterId)?.order} ·{" "}
                {i.status}
              </small>
            </button>
          ))}
          {!visible.length && (
            <div className={s.empty}>
              <h2>No findings</h2>
              <p>
                {issues.length
                  ? "No findings match these filters."
                  : "This manuscript has not been checked."}
              </p>
            </div>
          )}
        </section>
        {issue && (
          <aside className={s.inspector}>
            <span className={s.kicker}>
              {state.entities.find((e) => e.id === issue.entityId)?.name}
            </span>
            <h2>{issue.title}</h2>
            <h3>Manuscript excerpt</h3>
            <blockquote className={s.excerpt}>
              {evidenceMatches(state, storyId, issue.anchor) ? (
                <mark>{issue.anchor.excerpt}</mark>
              ) : (
                issue.anchor.excerpt
              )}
            </blockquote>
            {!evidenceMatches(state, storyId, issue.anchor) && (
              <p className={s.notice}>
                This excerpt has changed or its block is missing. Open the
                chapter to review the current draft.
              </p>
            )}
            <StudioLink
              className={s.outline}
              href={`/studio/stories/${storyId}/chapters/${issue.chapterId}?issue=${issue.id}&block=${encodeURIComponent(issue.anchor.blockId)}`}
            >
              Edit manuscript
            </StudioLink>
            <h3>Canon evidence</h3>
            {issue.factIds
              .map((id) => state.facts.find((f) => f.id === id))
              .filter((f) => !!f)
              .map((f) => (
                <div className={s.fact} key={f.id}>
                  <strong>
                    {f.attribute}: {f.value}
                  </strong>
                  <SourceEvidence fact={f} />
                  {f.source && (
                    <StudioLink
                      className={s.textButton}
                      href={`/studio/stories/${storyId}/chapters/${f.source.chapterId}?block=${encodeURIComponent(f.source.blockId)}`}
                    >
                      Open evidence
                    </StudioLink>
                  )}
                </div>
              ))}
            <h3>Suggested consideration</h3>
            <p className={s.muted}>{issue.suggestion}</p>
            <div className={s.actions} style={{ marginTop: 24 }}>
              <button
                disabled={pending}
                className={s.outline}
                onClick={() => setPropose(true)}
              >
                Propose change
              </button>
              {issue.status === "OPEN" ? (
                <>
                  <button
                    disabled={pending}
                    className={s.textButton}
                    onClick={() => setDismiss(true)}
                  >
                    Dismiss
                  </button>
                  <button
                    disabled={pending}
                    className={s.button}
                    onClick={() => void update(issue, "RESOLVED")}
                  >
                    Mark resolved
                  </button>
                </>
              ) : (
                <button
                  disabled={pending}
                  className={s.outline}
                  onClick={() => void update(issue, "OPEN")}
                >
                  Reopen
                </button>
              )}
            </div>
            {issue.note && <p className={s.notice}>{issue.note}</p>}
            <details className={s.history}>
              <summary>Review history ({issue.history.length})</summary>
              {issue.history.map((entry, index) => (
                <p key={index}>
                  {entry.status} · {entry.note} ·{" "}
                  {new Date(entry.at).toLocaleDateString("en-US")}
                </p>
              ))}
            </details>
          </aside>
        )}
      </div>
      {dismiss && issue && (
        <Modal title="Dismiss finding" onClose={() => setDismiss(false)}>
          <form
            className={s.form}
            onSubmit={(event) => {
              event.preventDefault();
              void update(
                issue,
                "DISMISSED",
                String(new FormData(event.currentTarget).get("reason")),
              );
            }}
          >
            <label>
              Reason
              <textarea name="reason" required maxLength={2000} />
            </label>
            <p className={s.muted}>
              Dismissal does not change confirmed Canon.
            </p>
            <button className={s.button} disabled={pending}>
              Confirm dismissal
            </button>
          </form>
        </Modal>
      )}
      {propose && issue && (
        <ProposalForm
          storyId={storyId}
          entityId={issue.entityId}
          anchor={issue.anchor}
          replaces={state.facts.find((f) => f.id === issue.factIds[0])}
          onClose={() => setPropose(false)}
        />
      )}
    </main>
  );
}
