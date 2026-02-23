import { describe, expect, it } from "vitest";

import { createInMemoryJournalStore } from "./in-memory-journal.store.js";
import { createJournalRepository } from "./journal.repository.js";

describe("journal repository", () => {
  it("applies defaults and trims name on create", async () => {
    const repository = createJournalRepository(createInMemoryJournalStore(), () => "journal-1");

    const created = await repository.create({
      name: "  FTMO Journal  ",
    });

    expect(created.id).toBe("journal-1");
    expect(created.name).toBe("FTMO Journal");
    expect(created.baseCurrency).toBe("USD");
    expect(created.timezone).toBe("UTC");
    expect(created.isActive).toBe(true);
  });

  it("updates and deletes entities via underlying store", async () => {
    const repository = createJournalRepository(createInMemoryJournalStore(), () => "journal-2");

    await repository.create({ name: "IBKR" });

    const updated = await repository.update("journal-2", {
      broker: "IBKR",
      timezone: "America/New_York",
      isActive: false,
    });

    expect(updated?.broker).toBe("IBKR");
    expect(updated?.timezone).toBe("America/New_York");
    expect(updated?.isActive).toBe(false);

    await expect(repository.delete("journal-2")).resolves.toBe(true);
    await expect(repository.findById("journal-2")).resolves.toBeNull();
  });
});
