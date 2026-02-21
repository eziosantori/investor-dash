import { describe, expect, it } from "vitest";

import { createDbConnection, resolveDbPath } from "./client.js";

describe("db client", () => {
  it("resolves a local sqlite path", () => {
    const dbPath = resolveDbPath();

    expect(dbPath.endsWith("data/trading-journal.db") || dbPath.endsWith("data\\trading-journal.db")).toBe(true);
  });

  it("exports a db connection factory function", () => {
    expect(typeof createDbConnection).toBe("function");
  });
});
