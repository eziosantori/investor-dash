import type { DbClient } from "../client.js";
import type { Instrument, Journal } from "@investor-dash/shared-types";

import { createInMemoryInstrumentStore } from "./instruments/in-memory-instrument.store.js";
import { createInstrumentRepository } from "./instruments/instrument.repository.js";
import { createInMemoryJournalStore } from "./journals/in-memory-journal.store.js";
import { createJournalRepository } from "./journals/journal.repository.js";
import { createDrizzleSystemMetaStore } from "./system-meta/drizzle-system-meta.store.js";
import { createSystemMetaRepository } from "./system-meta/system-meta.repository.js";

export interface Repositories {
  systemMeta: ReturnType<typeof createSystemMetaRepository>;
  journals: ReturnType<typeof createJournalRepository>;
  instruments: ReturnType<typeof createInstrumentRepository>;
}

type InMemoryRepositoryOptions = {
  journalSeed?: Journal[];
  instrumentSeed?: Instrument[];
};

export function createRepositories(db: DbClient): Repositories {
  return {
    systemMeta: createSystemMetaRepository(createDrizzleSystemMetaStore(db)),
    // Journals are temporarily in-memory until SQLite native runtime is enabled in this environment.
    journals: createJournalRepository(createInMemoryJournalStore()),
    // Instruments are temporarily in-memory until SQLite native runtime is enabled in this environment.
    instruments: createInstrumentRepository(createInMemoryInstrumentStore()),
  };
}

export function createInMemoryRepositories(options: InMemoryRepositoryOptions = {}): Repositories {
  const journalStore = createInMemoryJournalStore(options.journalSeed);
  const instrumentStore = createInMemoryInstrumentStore(options.instrumentSeed);

  return {
    systemMeta: createSystemMetaRepository({
      async findByKey() {
        return null;
      },
      async upsert() {
        return undefined;
      },
    }),
    journals: createJournalRepository(journalStore),
    instruments: createInstrumentRepository(instrumentStore),
  };
}
