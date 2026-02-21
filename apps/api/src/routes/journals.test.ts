import { describe, expect, it } from "vitest";

import { buildApp } from "../app.js";
import { createInMemoryRepositories } from "../db/repositories/index.js";

// Covers the minimal CRUD flow for journal endpoints.
describe("journal routes", () => {
  it("supports create, list, get, update and delete", async () => {
    const app = buildApp({ repositories: createInMemoryRepositories() });

    const create = await app.inject({
      method: "POST",
      url: "/api/journals",
      payload: { name: "FTMO Journal", broker: "FTMO" },
    });
    expect(create.statusCode).toBe(201);
    const created = create.json() as { id: string; name: string; broker: string | null };
    expect(created.name).toBe("FTMO Journal");
    expect(created.broker).toBe("FTMO");

    const list = await app.inject({ method: "GET", url: "/api/journals" });
    expect(list.statusCode).toBe(200);
    const items = list.json() as Array<{ id: string }>;
    expect(items.length).toBe(1);

    const get = await app.inject({ method: "GET", url: `/api/journals/${created.id}` });
    expect(get.statusCode).toBe(200);

    const update = await app.inject({
      method: "PUT",
      url: `/api/journals/${created.id}`,
      payload: { name: "IBKR Journal", timezone: "Europe/Rome" },
    });
    expect(update.statusCode).toBe(200);
    const updated = update.json() as { name: string; timezone: string };
    expect(updated.name).toBe("IBKR Journal");
    expect(updated.timezone).toBe("Europe/Rome");

    const remove = await app.inject({ method: "DELETE", url: `/api/journals/${created.id}` });
    expect(remove.statusCode).toBe(204);

    const missing = await app.inject({ method: "GET", url: `/api/journals/${created.id}` });
    expect(missing.statusCode).toBe(404);

    await app.close();
  });

  it("rejects invalid create payload", async () => {
    const app = buildApp({ repositories: createInMemoryRepositories() });

    const response = await app.inject({
      method: "POST",
      url: "/api/journals",
      payload: {},
    });

    expect(response.statusCode).toBe(400);

    await app.close();
  });
});
