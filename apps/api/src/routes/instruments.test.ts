import { describe, expect, it } from "vitest";

import { buildApp } from "../app.js";
import { createInMemoryRepositories } from "../db/repositories/index.js";

describe("instrument routes", () => {
  it("supports create, list, get, update and delete", async () => {
    const app = buildApp({ repositories: createInMemoryRepositories() });

    const journalResponse = await app.inject({
      method: "POST",
      url: "/api/journals",
      payload: { name: "FTMO Journal" },
    });
    const journal = journalResponse.json() as { id: string };

    const create = await app.inject({
      method: "POST",
      url: "/api/instruments",
      payload: {
        journalId: journal.id,
        ticker: "us100",
        instrumentType: "index",
        defaultLeverage: 20,
        minLot: 0.1,
        lotStep: 0.1,
        marketTimezone: "Europe/Rome",
        sessionOpenTime: "08:00",
        sessionCloseTime: "22:00",
      },
    });

    expect(create.statusCode).toBe(201);
    const created = create.json() as { id: string; ticker: string };
    expect(created.ticker).toBe("US100");

    const list = await app.inject({ method: "GET", url: `/api/instruments?journalId=${journal.id}` });
    expect(list.statusCode).toBe(200);
    const items = list.json() as Array<{ id: string }>;
    expect(items.length).toBe(1);

    const get = await app.inject({ method: "GET", url: `/api/instruments/${created.id}` });
    expect(get.statusCode).toBe(200);

    const update = await app.inject({
      method: "PUT",
      url: `/api/instruments/${created.id}`,
      payload: { defaultLeverage: 30, sessionCloseTime: "21:30" },
    });
    expect(update.statusCode).toBe(200);
    const updated = update.json() as { defaultLeverage: number; sessionCloseTime: string };
    expect(updated.defaultLeverage).toBe(30);
    expect(updated.sessionCloseTime).toBe("21:30");

    const remove = await app.inject({ method: "DELETE", url: `/api/instruments/${created.id}` });
    expect(remove.statusCode).toBe(204);

    const missing = await app.inject({ method: "GET", url: `/api/instruments/${created.id}` });
    expect(missing.statusCode).toBe(404);

    await app.close();
  });

  it("rejects invalid payloads", async () => {
    const app = buildApp({ repositories: createInMemoryRepositories() });

    const create = await app.inject({
      method: "POST",
      url: "/api/instruments",
      payload: { ticker: "US100" },
    });
    expect(create.statusCode).toBe(400);

    const list = await app.inject({ method: "GET", url: "/api/instruments" });
    expect(list.statusCode).toBe(400);

    const update = await app.inject({
      method: "PUT",
      url: "/api/instruments/non-existent",
      payload: {},
    });
    expect(update.statusCode).toBe(400);

    await app.close();
  });
});
