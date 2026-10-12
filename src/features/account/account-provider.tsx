"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  ACCOUNT_KEY,
  emptyDeviceLibrary,
  migrateLegacyState,
  parseDeviceLibrary,
  type DeviceLibraryState,
  type LocalReview,
  type ReaderProgressState,
} from "./account-store";

type Collection = "savedStoryIds" | "followedStoryIds" | "followedAuthorIds";

interface AccountContextValue {
  ready: boolean;
  state: DeviceLibraryState;
  signIn(profile: { name: string; email: string }): void;
  signOut(): void;
  toggle(collection: Collection, id: string): void;
  updateProgress(storyId: string, progress: ReaderProgressState): void;
  saveReview(storyId: string, review: LocalReview): void;
}

const AccountContext = createContext<AccountContextValue | null>(null);

export function AccountProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(emptyDeviceLibrary);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const load = () => {
      try {
        const migrated = migrateLegacyState(
          parseDeviceLibrary(localStorage.getItem(ACCOUNT_KEY)),
        );
        setState(migrated);
        localStorage.setItem(ACCOUNT_KEY, JSON.stringify(migrated));
      } catch {
        setState(emptyDeviceLibrary);
      }
      setReady(true);
    };
    load();
    const onStorage = (event: StorageEvent) => {
      if (!event.key || event.key === ACCOUNT_KEY) load();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const commit = useCallback(
    (change: (current: DeviceLibraryState) => DeviceLibraryState) => {
      setState((current) => {
        const next = change(current);
        try {
          localStorage.setItem(ACCOUNT_KEY, JSON.stringify(next));
          window.dispatchEvent(new Event("inkflow-account"));
        } catch {
          // The in-memory experience remains usable when storage is unavailable.
        }
        return next;
      });
    },
    [],
  );

  const signIn = useCallback(
    (profile: { name: string; email: string }) =>
      commit((current) => ({ ...current, profile })),
    [commit],
  );
  const signOut = useCallback(
    () => commit((current) => ({ ...current, profile: null })),
    [commit],
  );
  const toggle = useCallback(
    (collection: Collection, id: string) =>
      commit((current) => ({
        ...current,
        [collection]: current[collection].includes(id)
          ? current[collection].filter((item) => item !== id)
          : [...current[collection], id],
      })),
    [commit],
  );
  const updateProgress = useCallback(
    (storyId: string, progress: ReaderProgressState) =>
      commit((current) => ({
        ...current,
        progress: { ...current.progress, [storyId]: progress },
      })),
    [commit],
  );
  const saveReview = useCallback(
    (storyId: string, review: LocalReview) =>
      commit((current) => ({
        ...current,
        reviews: { ...current.reviews, [storyId]: review },
      })),
    [commit],
  );

  const value = useMemo<AccountContextValue>(
    () => ({
      ready,
      state,
      signIn,
      signOut,
      toggle,
      updateProgress,
      saveReview,
    }),
    [ready, saveReview, signIn, signOut, state, toggle, updateProgress],
  );

  return (
    <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
  );
}

export function useAccount() {
  const value = useContext(AccountContext);
  if (!value) throw new Error("useAccount must be used inside AccountProvider");
  return value;
}
