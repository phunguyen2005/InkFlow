"use client";
import { useSyncExternalStore } from "react";
import { readStorage } from "../utils/reader-storage";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("inkflow-storage", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("inkflow-storage", callback);
  };
}

export function useLocalValue(key: string) {
  return useSyncExternalStore(
    subscribe,
    () => readStorage(key),
    () => null,
  );
}
