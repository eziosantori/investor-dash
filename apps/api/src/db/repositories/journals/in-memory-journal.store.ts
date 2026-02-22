import type { Journal, UpdateJournalInput } from "@investor-dash/shared-types";

import type { JournalStore } from "./journal.repository.js";

// In-memory adapter used for local development until SQLite native bindings are enabled.
export function createInMemoryJournalStore(seed: Journal[] = []): JournalStore {
  const map = new Map<string, Journal>(seed.map((journal) => [journal.id, journal]));

  return {
    async list() {
      return Array.from(map.values()).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    },
    async findById(id: string) {
      return map.get(id) ?? null;
    },
    async insert(journal: Journal) {
      map.set(journal.id, journal);
    },
    async update(id: string, patch: UpdateJournalInput) {
      const current = map.get(id);
      if (!current) {
        return null;
      }

      const updated: Journal = {
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
