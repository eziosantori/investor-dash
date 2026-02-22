import type { CreateJournalInput, Journal, UpdateJournalInput } from "@investor-dash/shared-types";

export interface JournalStore {
  list(): Promise<Journal[]>;
  findById(id: string): Promise<Journal | null>;
  insert(journal: Journal): Promise<void>;
  update(id: string, patch: UpdateJournalInput): Promise<Journal | null>;
  delete(id: string): Promise<boolean>;
}

export interface JournalRepository {
  list(): Promise<Journal[]>;
  findById(id: string): Promise<Journal | null>;
  create(input: CreateJournalInput): Promise<Journal>;
  update(id: string, patch: UpdateJournalInput): Promise<Journal | null>;
  delete(id: string): Promise<boolean>;
}

// Encapsulates journal domain defaults while delegating persistence to store.
export function createJournalRepository(
  store: JournalStore,
  createId: () => string = () => crypto.randomUUID(),
): JournalRepository {
  return {
    list() {
      return store.list();
    },
    findById(id) {
      return store.findById(id);
    },
    async create(input) {
      const now = new Date().toISOString();
      const journal: Journal = {
        id: createId(),
        name: input.name.trim(),
        broker: input.broker ?? null,
        baseCurrency: input.baseCurrency ?? "USD",
        timezone: input.timezone ?? "UTC",
        isActive: true,
        createdAt: now,
        updatedAt: now,
      };

      await store.insert(journal);
      return journal;
    },
    update(id, patch) {
      return store.update(id, patch);
    },
    delete(id) {
      return store.delete(id);
    },
  };
}
