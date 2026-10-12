import { openDB, type DBSchema } from "idb";
import { seedStudio } from "./fixtures";
import { applyCommand } from "./commands";
import type { StudioRepository, StudioSnapshot } from "./contracts";
import { migrateWorkspace } from "../intelligence/migration";

interface StudioDB extends DBSchema {
  workspace: { key: string; value: StudioSnapshot };
}
const databaseName = "inkflow-studio-v1";
let connection: ReturnType<typeof openDB<StudioDB>> | undefined;
function database() {
  connection ??= openDB<StudioDB>(databaseName, 2, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("workspace"))
        db.createObjectStore("workspace");
    },
    blocking() {
      connection?.then((db) => db.close());
      connection = undefined;
    },
  });
  return connection.catch((error) => {
    connection = undefined;
    throw error;
  });
}
export const studioRepository: StudioRepository = {
  async getSnapshot() {
    const db = await database();
    const transaction = db.transaction("workspace", "readwrite");
    const stored = await transaction.store.get("current");
    const snapshot = stored ? migrateWorkspace(stored) : seedStudio();
    if (!stored || Number(stored.version) !== 2)
      await transaction.store.put(snapshot, "current");
    await transaction.done;
    return snapshot;
  },
  async execute(command) {
    const db = await database();
    const transaction = db.transaction("workspace", "readwrite");
    try {
      const snapshot = await transaction.store.get("current");
      if (!snapshot) throw new Error("Workspace is not initialized.");
      const next = applyCommand(migrateWorkspace(snapshot), command);
      await transaction.store.put(next, "current");
      await transaction.done;
      return next;
    } catch (error) {
      try {
        transaction.abort();
      } catch {
        /* An aborted transaction is already closed. */
      }
      await transaction.done.catch(() => undefined);
      throw error;
    }
  },
};
