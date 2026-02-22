import Fastify from "fastify";

import type { Repositories } from "./db/repositories/index.js";
import { registerHealthRoutes } from "./routes/health.js";
import { registerInstrumentRoutes } from "./routes/instruments.js";
import { registerJournalRoutes } from "./routes/journals.js";

type BuildAppOptions = {
  repositories?: Repositories;
};

export function buildApp(options: BuildAppOptions = {}) {
  const app = Fastify({ logger: false });

  if (options.repositories) {
    app.decorate("repos", options.repositories);
  }

  void registerHealthRoutes(app);
  void registerJournalRoutes(app);
  void registerInstrumentRoutes(app);

  return app;
}
