import { describe, expect, it, vi } from "vitest";

import type { DbClient } from "../client.js";
import { createRepositories } from "./index.js";

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
});
