"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
  type ReactNode,
} from "react";
import { studioRepository } from "../data/local-repository";
import type { StudioSnapshot, StudioCommand } from "../data/contracts";
import s from "./studio.module.css";

interface StudioContextValue {
  state: StudioSnapshot;
  execute(command: StudioCommand): Promise<StudioSnapshot>;
  registerGuard(guard: () => Promise<boolean>): () => void;
  beforeNavigate(): Promise<boolean>;
}
const Context = createContext<StudioContextValue | null>(null);
export function StudioProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StudioSnapshot | null>(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const guardRef = useRef<(() => Promise<boolean>) | null>(null);
  const registerGuard = useCallback((guard: () => Promise<boolean>) => {
    guardRef.current = guard;
    return () => {
      if (guardRef.current === guard) guardRef.current = null;
    };
  }, []);
  const beforeNavigate = useCallback(
    () => (guardRef.current ? guardRef.current() : Promise.resolve(true)),
    [],
  );
  useEffect(() => {
    let active = true;
    const refresh = () =>
      studioRepository
        .getSnapshot()
        .then((snapshot) => {
          if (active) {
            setState(snapshot);
            setError("");
          }
        })
        .catch((reason) => {
          if (active)
            setError(
              reason instanceof Error
                ? reason.message
                : "Device storage is unavailable.",
            );
        });
    void refresh();
    const channel =
      typeof BroadcastChannel !== "undefined"
        ? new BroadcastChannel("inkflow-studio")
        : null;
    if (channel) channel.onmessage = () => void refresh();
    return () => {
      active = false;
      channel?.close();
    };
  }, [attempt]);
  const execute = useCallback(async (command: StudioCommand) => {
    const snapshot = await studioRepository.execute(command);
    setState(snapshot);
    if (typeof BroadcastChannel !== "undefined") {
      const channel = new BroadcastChannel("inkflow-studio");
      channel.postMessage("updated");
      channel.close();
    }
    return snapshot;
  }, []);
  if (!state)
    return (
      <div className={s.root}>
        <main id="main" className={s.loading}>
          <span className={s.kicker}>INKFLOW STUDIO</span>
          <h1>
            {error
              ? "Your workspace needs attention"
              : "Opening your workspace"}
          </h1>
          {error ? (
            <>
              <p role="alert">{error}</p>
              <button
                className={s.button}
                onClick={() => {
                  setError("");
                  setAttempt((value) => value + 1);
                }}
              >
                Retry
              </button>
            </>
          ) : (
            <div className={s.skeleton} aria-label="Loading workspace" />
          )}
        </main>
      </div>
    );
  return (
    <Context.Provider value={{ state, execute, registerGuard, beforeNavigate }}>
      {children}
    </Context.Provider>
  );
}
export function useStudio() {
  const context = useContext(Context);
  if (!context) throw new Error("StudioProvider is required.");
  return context;
}
