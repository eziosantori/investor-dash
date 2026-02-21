import { describe, expect, it } from "vitest";

import { buildApp } from "./app.js";

describe("buildApp", () => {
  it("creates app and handles /api/health", async () => {
    const app = buildApp();

    const response = await app.inject({ method: "GET", url: "/api/health" });

    expect(response.statusCode).toBe(200);

    await app.close();
  });
});
