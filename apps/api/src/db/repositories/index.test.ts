import { describe, expect, it, vi } from "vitest";

import type { DbClient } from "../client.js";
import { createInMemoryRepositories, createRepositories } from "./index.js";
import { instrumentSeed, journalSeed } from "./seed.js";

// Verifies repository container wiring without requiring a real DB connection.
describe("createRepositories", () => {
  it("exposes systemMeta repository functions", () => {
    const fakeDb = {
      query: {
        systemMeta: {
          findFirst: vi.fn(),
        },
      },
      insert: vi.fn().mockReturnValue({
        values: vi.fn().mockReturnValue({
          onConflictDoUpdate: vi.fn(),
        }),
      }),
    } as unknown as DbClient;

    const repositories = createRepositories(fakeDb);

    expect(repositories).toHaveProperty("systemMeta");
    expect(typeof repositories.systemMeta.getValue).toBe("function");
    expect(typeof repositories.systemMeta.setValue).toBe("function");
  });

  it("hydrates in-memory repositories with seed data", async () => {
    const repositories = createInMemoryRepositories({
      journalSeed,
      instrumentSeed,
    });

    const journals = await repositories.journals.list();
    const ftmoInstruments = await repositories.instruments.listByJournalId("journal-ftmo");
    const ibkrInstruments = await repositories.instruments.listByJournalId("journal-ibkr");

    expect(journals).toHaveLength(2);
    expect(ftmoInstruments.map((item) => item.ticker)).toEqual(["US100", "XAUUSD"]);
    expect(ibkrInstruments.map((item) => item.ticker)).toEqual(["AAPL"]);
  });
});
