"use client";
import { useSyncExternalStore } from "react";
interface Preferences {
  theme: "dark" | "sepia" | "light";
  mode: "creative" | "intelligence";
  fontSize: number;
  lineHeight: number;
}
const defaults: Preferences = {
  theme: "dark",
  mode: "creative",
  fontSize: 19,
  lineHeight: 1.85,
};
const key = "inkflow:studio:ui:v1",
  eventName = "inkflow-editor-preferences";
let cached = "",
  value = defaults;
function snapshot() {
  let raw = "";
  try {
    raw = localStorage.getItem(key) ?? "";
  } catch {
    return value;
  }
  if (raw === cached) return value;
  cached = raw;
  try {
    const data = JSON.parse(raw);
    value = {
      theme: ["dark", "sepia", "light"].includes(data.theme)
        ? data.theme
        : "dark",
      mode: ["creative", "intelligence"].includes(data.mode)
        ? data.mode
        : "creative",
      fontSize: Math.min(24, Math.max(16, Number(data.fontSize) || 19)),
      lineHeight: Math.min(2.2, Math.max(1.5, Number(data.lineHeight) || 1.85)),
    };
  } catch {
    value = defaults;
  }
  return value;
}
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(eventName, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(eventName, callback);
  };
}
export function useEditorPreferences() {
  const preferences = useSyncExternalStore(subscribe, snapshot, () => defaults);
  function update(patch: Partial<Preferences>) {
    value = { ...preferences, ...patch };
    try {
      localStorage.setItem(key, JSON.stringify(value));
      cached = JSON.stringify(value);
    } catch {
      /* Writing preferences must not prevent editing. */
    }
    window.dispatchEvent(new Event(eventName));
  }
  return [preferences, update] as const;
}
