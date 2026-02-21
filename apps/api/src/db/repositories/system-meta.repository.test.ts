import { describe, expect, it } from "vitest";

import { createSystemMetaRepository, type SystemMetaRecord, type SystemMetaStore } from "./system-meta.repository.js";

function createInMemoryStore(): SystemMetaStore {
  const map = new Map<string, string>();

  return {
    async findByKey(key: string): Promise<SystemMetaRecord | null> {
      const value = map.get(key);
      return value === undefined ? null : { key, value };
    },
    async upsert(record: SystemMetaRecord): Promise<void> {
      map.set(record.key, record.value);
    },
  };
}

describe("systemMeta repository", () => {
  it("returns null for missing key", async () => {
    const repository = createSystemMetaRepository(createInMemoryStore());

    await expect(repository.getValue("missing")).resolves.toBeNull();
  });

  it("stores and updates a value", async () => {
    const repository = createSystemMetaRepository(createInMemoryStore());

    await repository.setValue("app.version", "0.1.0");
    await expect(repository.getValue("app.version")).resolves.toBe("0.1.0");

    await repository.setValue("app.version", "0.2.0");
    await expect(repository.getValue("app.version")).resolves.toBe("0.2.0");
  });
});
