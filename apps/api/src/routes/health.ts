import type { FastifyInstance } from "fastify";

export type HealthResponse = {
  status: "ok";
  service: "api";
  timestamp: string;
  uptime: number;
};

export async function registerHealthRoutes(app: FastifyInstance) {
  app.get("/api/health", async () => {
    const payload: HealthResponse = {
      status: "ok",
      service: "api",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };

    return payload;
  });
}
