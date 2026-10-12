import type { StudioSnapshot } from "../data/contracts";
import { emptyIntelligence } from "./contracts";
export function migrateWorkspace(input: unknown): StudioSnapshot {
  if (!input || typeof input !== "object")
    throw new Error(
      "Saved workspace is unreadable. Your data has not been reset.",
    );
  const value = input as Record<string, unknown>;
  if (
    ![1, 2].includes(Number(value.version)) ||
    !["stories", "chapters", "entities", "facts", "issues"].every((key) =>
      Array.isArray(value[key]),
    )
  )
    throw new Error(
      "Saved workspace format is not supported. Your data has not been reset.",
    );
  if (value.version === 1)
    return {
      ...value,
      version: 2,
      intelligence: emptyIntelligence(),
    } as unknown as StudioSnapshot;
  const ai = value.intelligence as Record<string, unknown> | undefined;
  if (
    !ai ||
    !Object.keys(emptyIntelligence()).every((key) => Array.isArray(ai[key]))
  )
    throw new Error(
      "Saved Intelligence data is unreadable. Your data has not been reset.",
    );
  return input as StudioSnapshot;
}
