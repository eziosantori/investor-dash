import type { DbClient } from "../client.js";

import { createDrizzleSystemMetaStore } from "./drizzle-system-meta.store.js";
import { createInMemoryJournalStore } from "./in-memory-journal.store.js";
import { createJournalRepository } from "./journal.repository.js";
import { createSystemMetaRepository } from "./system-meta.repository.js";

export interface Repositories {
  systemMeta: ReturnType<typeof createSystemMetaRepository>;
  journals: ReturnType<typeof createJournalRepository>;
}

export function createRepositories(db: DbClient): Repositories {
  return {
    systemMeta: createSystemMetaRepository(createDrizzleSystemMetaStore(db)),
    // Journals are temporarily in-memory until SQLite native runtime is enabled in this environment.
    journals: createJournalRepository(createInMemoryJournalStore()),
  };
}

export function createInMemoryRepositories(): Repositories {
  return {
    systemMeta: createSystemMetaRepository({
      async findByKey() {
        return null;
      },
      async upsert() {
        return undefined;
      },
    }),
    journals: createJournalRepository(createInMemoryJournalStore()),
  };
}
