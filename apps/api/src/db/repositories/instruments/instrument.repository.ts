import type { CreateInstrumentInput, Instrument, UpdateInstrumentInput } from "@investor-dash/shared-types";

export interface InstrumentStore {
  listByJournalId(journalId: string): Promise<Instrument[]>;
  findById(id: string): Promise<Instrument | null>;
  insert(instrument: Instrument): Promise<void>;
  update(id: string, patch: UpdateInstrumentInput): Promise<Instrument | null>;
  delete(id: string): Promise<boolean>;
}

export interface InstrumentRepository {
  listByJournalId(journalId: string): Promise<Instrument[]>;
  findById(id: string): Promise<Instrument | null>;
  create(input: CreateInstrumentInput): Promise<Instrument>;
  update(id: string, patch: UpdateInstrumentInput): Promise<Instrument | null>;
  delete(id: string): Promise<boolean>;
}

// Encapsulates instrument defaults while delegating persistence to store.
export function createInstrumentRepository(
  store: InstrumentStore,
  createId: () => string = () => crypto.randomUUID(),
): InstrumentRepository {
  return {
    listByJournalId(journalId) {
      return store.listByJournalId(journalId);
    },
    findById(id) {
      return store.findById(id);
    },
    async create(input) {
      const now = new Date().toISOString();
      const instrument: Instrument = {
        id: createId(),
        journalId: input.journalId,
        ticker: input.ticker.trim().toUpperCase(),
        instrumentType: input.instrumentType.trim(),
        defaultLeverage: input.defaultLeverage,
        minLot: input.minLot,
        lotStep: input.lotStep,
        marketTimezone: input.marketTimezone.trim(),
        sessionOpenTime: input.sessionOpenTime,
        sessionCloseTime: input.sessionCloseTime,
        createdAt: now,
        updatedAt: now,
      };

      await store.insert(instrument);
      return instrument;
    },
    update(id, patch) {
      return store.update(id, patch);
    },
    delete(id) {
      return store.delete(id);
    },
  };
}
