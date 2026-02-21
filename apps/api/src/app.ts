import Fastify from "fastify";

import { registerHealthRoutes } from "./routes/health.js";

export function buildApp() {
  const app = Fastify({ logger: false });

  void registerHealthRoutes(app);

  return app;
}
