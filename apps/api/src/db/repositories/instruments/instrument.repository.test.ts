import { describe, expect, it } from "vitest";

import { createInMemoryInstrumentStore } from "./in-memory-instrument.store.js";
import { createInstrumentRepository } from "./instrument.repository.js";

describe("instrument repository", () => {
  it("normalizes ticker/instrument fields on create", async () => {
    const repository = createInstrumentRepository(createInMemoryInstrumentStore(), () => "instrument-1");

    const created = await repository.create({
      journalId: "journal-ftmo",
      ticker: "  us100  ",
      instrumentType: "  index ",
      defaultLeverage: 20,
      minLot: 0.1,
      lotStep: 0.1,
      marketTimezone: "  Europe/Rome  ",
      sessionOpenTime: "08:00",
      sessionCloseTime: "22:00",
    });

    expect(created.id).toBe("instrument-1");
    expect(created.ticker).toBe("US100");
    expect(created.instrumentType).toBe("index");
    expect(created.marketTimezone).toBe("Europe/Rome");
  });

  it("returns instruments scoped by journal", async () => {
    const repository = createInstrumentRepository(createInMemoryInstrumentStore(), (() => {
      let count = 0;
      return () => `instrument-${++count}`;
    })());

    await repository.create({
      journalId: "journal-ftmo",
      ticker: "US100",
      instrumentType: "index",
      defaultLeverage: 20,
      minLot: 0.1,
      lotStep: 0.1,
      marketTimezone: "Europe/Rome",
      sessionOpenTime: "08:00",
      sessionCloseTime: "22:00",
    });

    await repository.create({
      journalId: "journal-ibkr",
      ticker: "AAPL",
      instrumentType: "equity",
      defaultLeverage: 2,
      minLot: 1,
      lotStep: 1,
      marketTimezone: "America/New_York",
      sessionOpenTime: "15:30",
      sessionCloseTime: "22:00",
    });

    const ftmoOnly = await repository.listByJournalId("journal-ftmo");

    expect(ftmoOnly).toHaveLength(1);
    expect(ftmoOnly[0]?.ticker).toBe("US100");

    const removed = await repository.delete("instrument-1");
    expect(removed).toBe(true);
  });
});
