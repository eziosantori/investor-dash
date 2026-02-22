import type { DbClient } from "../client.js";

import { createDrizzleSystemMetaStore } from "./drizzle-system-meta.store.js";
import { createInMemoryInstrumentStore } from "./in-memory-instrument.store.js";
import { createInMemoryJournalStore } from "./in-memory-journal.store.js";
import { createInstrumentRepository } from "./instrument.repository.js";
import { createJournalRepository } from "./journal.repository.js";
import { createSystemMetaRepository } from "./system-meta.repository.js";

export interface Repositories {
  systemMeta: ReturnType<typeof createSystemMetaRepository>;
  journals: ReturnType<typeof createJournalRepository>;
  instruments: ReturnType<typeof createInstrumentRepository>;
}

export function createRepositories(db: DbClient): Repositories {
  return {
    systemMeta: createSystemMetaRepository(createDrizzleSystemMetaStore(db)),
    // Journals are temporarily in-memory until SQLite native runtime is enabled in this environment.
    journals: createJournalRepository(createInMemoryJournalStore()),
    // Instruments are temporarily in-memory until SQLite native runtime is enabled in this environment.
    instruments: createInstrumentRepository(createInMemoryInstrumentStore()),
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
    instruments: createInstrumentRepository(createInMemoryInstrumentStore()),
  };
}
