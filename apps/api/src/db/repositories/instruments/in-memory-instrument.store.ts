import type { Instrument, UpdateInstrumentInput } from "@investor-dash/shared-types";

import type { InstrumentStore } from "./instrument.repository.js";

// In-memory adapter used for local development until SQLite native bindings are enabled.
export function createInMemoryInstrumentStore(seed: Instrument[] = []): InstrumentStore {
  const map = new Map<string, Instrument>(seed.map((instrument) => [instrument.id, instrument]));

  return {
    async listByJournalId(journalId: string) {
      return Array.from(map.values())
        .filter((instrument) => instrument.journalId === journalId)
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    },
    async findById(id: string) {
      return map.get(id) ?? null;
    },
    async insert(instrument: Instrument) {
      map.set(instrument.id, instrument);
    },
    async update(id: string, patch: UpdateInstrumentInput) {
      const current = map.get(id);
      if (!current) {
        return null;
      }

      const updated: Instrument = {
        ...current,
        ...patch,
        updatedAt: new Date().toISOString(),
      };

      map.set(id, updated);
      return updated;
    },
    async delete(id: string) {
      return map.delete(id);
    },
  };
}
