import { describe, expect, it } from "vitest";

import { buildApp } from "../app.js";

describe("GET /api/health", () => {
  it("returns expected health payload", async () => {
    const app = buildApp();

    const response = await app.inject({ method: "GET", url: "/api/health" });
    const json = response.json();

    expect(response.statusCode).toBe(200);
    expect(json.status).toBe("ok");
    expect(json.service).toBe("api");
    expect(typeof json.uptime).toBe("number");
    expect(Number.isNaN(Date.parse(json.timestamp))).toBe(false);

    await app.close();
  });
});
