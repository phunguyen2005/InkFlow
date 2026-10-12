"use client";
import Image from "next/image";
import { useState, useRef, useCallback } from "react";
import { Plus, Search, Pencil, X } from "lucide-react";
import { useStudio } from "../shared/studio-provider";
import { StudioLink } from "../shared/studio-link";
import { Modal } from "../shared/modal";
import { ProposalForm, SourceEvidence } from "./proposal-form";
import {
  ENTITY_TYPES,
  type CanonEntity,
  type CanonFact,
} from "../data/contracts";
import { chaptersFor, factsAsOf, evidenceMatches } from "../data/selectors";
import s from "../shared/studio.module.css";
import { usePanelFocus } from "../shared/use-panel-focus";
export function CanonLibrary({ storyId }: { storyId: string }) {
  const { state, execute } = useStudio();
  const [mobileInspect, setMobileInspect] = useState(false);
  const inspectorRef = useRef<HTMLElement>(null);
  const closeInspector = useCallback(() => setMobileInspect(false), []);
  usePanelFocus(mobileInspect, inspectorRef, closeInspector);
  const chapters = chaptersFor(state, storyId);
  const entities = state.entities.filter((e) => e.storyId === storyId);
  const [query, setQuery] = useState(""),
    [type, setType] = useState("ALL"),
    [selected, setSelected] = useState(entities[0]?.id ?? ""),
    [asOf, setAsOf] = useState(chapters[2]?.id ?? chapters[0]?.id ?? "");
  const [editing, setEditing] = useState<CanonEntity | null | undefined>(),
    [proposal, setProposal] = useState<CanonFact | null | undefined>(),
    [decision, setDecision] = useState<{
      fact: CanonFact;
      approve: boolean;
    } | null>(null),
    [error, setError] = useState(""),
    [pending, setPending] = useState(false);
  const entity = entities.find((e) => e.id === selected),
    visible = entities.filter(
      (e) =>
        (type === "ALL" || e.type === type) &&
        `${e.name} ${e.aliases.join(" ")}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    );
  const current = factsAsOf(state, storyId, asOf).filter(
      (f) => f.entityId === selected,
    ),
    all = state.facts.filter((f) => f.entityId === selected),
    proposals = all.filter((f) => f.status === "PROPOSED");
  if (!state.stories.some((story) => story.id === storyId))
    return (
      <main id="main" className={s.page}>
        <h1>Story not found</h1>
      </main>
    );
  function factRow(f: CanonFact) {
    return (
      <div key={f.id} className={s.fact}>
        <strong>{f.attribute}</strong>
        <p>{f.value}</p>
        <small>
          From Ch. {chapters.find((c) => c.id === f.fromChapterId)?.order}
          {f.untilChapterId
            ? ` until Ch. ${chapters.find((c) => c.id === f.untilChapterId)?.order} (exclusive)`
            : " onward"}{" "}
          · {f.status}
        </small>
        <SourceEvidence fact={f} />
        {f.source && (
          <>
            <small>
              {evidenceMatches(state, storyId, f.source)
                ? "Evidence available"
                : "Evidence changed or missing"}
            </small>
            <br />
            <StudioLink
              className={s.textButton}
              href={`/studio/stories/${storyId}/chapters/${f.source.chapterId}?block=${encodeURIComponent(f.source.blockId)}`}
            >
              Open source chapter
            </StudioLink>
          </>
        )}
        {f.status === "CONFIRMED" && (
          <button className={s.textButton} onClick={() => setProposal(f)}>
            Propose replacement
          </button>
        )}
        {f.status === "PROPOSED" && (
          <div className={s.actions}>
            <button
              className={s.outline}
              onClick={() => setDecision({ fact: f, approve: true })}
            >
              Approve
            </button>
            <button
              className={s.textButton}
              onClick={() => setDecision({ fact: f, approve: false })}
            >
              Reject
            </button>
          </div>
        )}
      </div>
    );
  }
  return (
    <main id="main" className={s.page}>
      <header className={s.pageHeader}>
        <div>
          <span className={s.kicker}>WORLD BIBLE</span>
          <h1>Canon Library</h1>
        </div>
        <button className={s.button} onClick={() => setEditing(null)}>
          <Plus size={16} />
          New entity
        </button>
      </header>
      <div className={s.toolbar}>
        <label className={s.search}>
          <Search size={16} />
          <input
            aria-label="Search Canon"
            placeholder="Search Canon..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <select
          aria-label="Entity type"
          className={s.select}
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="ALL">All types</option>
          {ENTITY_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <label>
          As of{" "}
          <select
            aria-label="Canon chapter"
            className={s.select}
            value={asOf}
            onChange={(e) => setAsOf(e.target.value)}
          >
            {chapters.map((c) => (
              <option key={c.id} value={c.id}>
                Chapter {c.order}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className={s.split}>
        <section className={s.entityGrid} aria-label="Canon entities">
          {visible.map((e) => (
            <button
              className={s.entity}
              key={e.id}
              aria-pressed={selected === e.id}
              onClick={() => {
                setSelected(e.id);
                setMobileInspect(true);
              }}
            >
              <div className={s.entityImage}>
                {e.portrait ? (
                  <Image src={e.portrait} alt="" fill sizes="200px" />
                ) : (
                  e.name.slice(0, 1)
                )}
              </div>
              <div className={s.entityText}>
                <strong>{e.name}</strong>
                <small>{e.type.replaceAll("_", " ")}</small>
              </div>
            </button>
          ))}
          {!visible.length && <p className={s.empty}>No matching entities.</p>}
        </section>
        <aside
          ref={inspectorRef}
          className={`${s.inspector} ${s.canonInspector} ${mobileInspect ? s.inspectorOpen : ""}`}
        >
          <button
            className={`${s.iconButton} ${s.inspectorClose}`}
            aria-label="Close entity details"
            onClick={() => setMobileInspect(false)}
          >
            <X size={18} />
          </button>
          {entity ? (
            <>
              <div className={s.actions}>
                <h2>{entity.name}</h2>
                <button
                  className={s.iconButton}
                  title="Edit entity"
                  aria-label="Edit entity"
                  onClick={() => setEditing(entity)}
                >
                  <Pencil size={15} />
                </button>
              </div>
              <p className={s.muted}>{entity.summary}</p>
              {entity.aliases.length > 0 && (
                <p className={s.muted}>
                  Also known as {entity.aliases.join(", ")}
                </p>
              )}
              {entity.relations.map((r) => (
                <p key={r.targetId}>
                  {r.label}:{" "}
                  <button
                    className={s.textButton}
                    onClick={() => setSelected(r.targetId)}
                  >
                    {entities.find((e) => e.id === r.targetId)?.name}
                  </button>
                </p>
              ))}
              <div className={s.sectionHeading}>
                <h3>Confirmed facts</h3>
                <button
                  className={s.textButton}
                  onClick={() => setProposal(null)}
                >
                  <Plus size={14} />
                  Propose fact
                </button>
              </div>
              {current.map(factRow)}
              {!current.length && (
                <p className={s.muted}>No confirmed facts at this chapter.</p>
              )}
              <h3>Pending proposals ({proposals.length})</h3>
              {proposals.map(factRow)}
              <details className={s.history}>
                <summary>
                  Fact history (
                  {
                    all.filter(
                      (f) => !current.includes(f) && f.status !== "PROPOSED",
                    ).length
                  }
                  )
                </summary>
                {all
                  .filter(
                    (f) => !current.includes(f) && f.status !== "PROPOSED",
                  )
                  .map(factRow)}
              </details>
            </>
          ) : (
            <div className={s.empty}>Select an entity.</div>
          )}
        </aside>
      </div>
      {editing !== undefined && (
        <EntityForm
          storyId={storyId}
          entity={editing}
          onClose={() => setEditing(undefined)}
        />
      )}
      {proposal !== undefined && entity && (
        <ProposalForm
          storyId={storyId}
          entityId={entity.id}
          replaces={proposal ?? undefined}
          onClose={() => setProposal(undefined)}
        />
      )}
      {decision && (
        <Modal
          title={
            decision.approve ? "Approve Canon change?" : "Reject proposal?"
          }
          onClose={() => {
            setDecision(null);
            setError("");
          }}
        >
          <p>
            {decision.fact.attribute}: {decision.fact.value}
          </p>
          <p className={s.notice}>
            {decision.approve
              ? "This updates confirmed Canon from the selected chapter. Earlier history is preserved."
              : "This proposal will remain in history as rejected."}
          </p>
          {error && (
            <p className={s.error} role="alert">
              {error}
            </p>
          )}
          <button
            disabled={pending}
            className={s.button}
            onClick={async () => {
              setPending(true);
              try {
                await execute({
                  type: "DECIDE_FACT",
                  storyId,
                  id: decision.fact.id,
                  approve: decision.approve,
                });
                setDecision(null);
              } catch (e) {
                setError(
                  e instanceof Error ? e.message : "Unable to update Canon.",
                );
              } finally {
                setPending(false);
              }
            }}
          >
            Confirm {decision.approve ? "approval" : "rejection"}
          </button>
        </Modal>
      )}
    </main>
  );
}
function EntityForm({
  storyId,
  entity,
  onClose,
}: {
  storyId: string;
  entity: CanonEntity | null;
  onClose: () => void;
}) {
  const { execute } = useStudio();
  const [error, setError] = useState(""),
    [pending, setPending] = useState(false);
  return (
    <Modal title={entity ? "Edit entity" : "New entity"} onClose={onClose}>
      <form
        className={s.form}
        onSubmit={async (event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          setPending(true);
          try {
            await execute({
              type: "SAVE_ENTITY",
              entity: {
                id: entity?.id ?? crypto.randomUUID(),
                storyId,
                name: String(data.get("name")),
                type: String(data.get("type")) as CanonEntity["type"],
                summary: String(data.get("summary")),
                aliases: String(data.get("aliases"))
                  .split(",")
                  .map((v) => v.trim())
                  .filter(Boolean),
                relations: entity?.relations ?? [],
                portrait: entity?.portrait,
              },
            });
            onClose();
          } catch (e) {
            setError(e instanceof Error ? e.message : "Unable to save entity.");
          } finally {
            setPending(false);
          }
        }}
      >
        <label>
          Name
          <input
            name="name"
            required
            maxLength={200}
            defaultValue={entity?.name}
          />
        </label>
        <label>
          Type
          <select name="type" defaultValue={entity?.type}>
            {ENTITY_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label>
          Aliases
          <input name="aliases" defaultValue={entity?.aliases.join(", ")} />
        </label>
        <label>
          Summary
          <textarea name="summary" defaultValue={entity?.summary} />
        </label>
        {error && (
          <p className={s.error} role="alert">
            {error}
          </p>
        )}
        <button className={s.button} disabled={pending}>
          Save entity
        </button>
      </form>
    </Modal>
  );
}
