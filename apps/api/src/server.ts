import { buildApp } from "./app.js";
import { createInMemoryRepositories } from "./db/repositories/index.js";
import { instrumentSeed, journalSeed } from "./db/repositories/seed.js";

const HOST = process.env.HOST ?? "127.0.0.1";
const PORT = Number(process.env.PORT ?? 3001);

const SEED_DEMO_DATA = process.env.SEED_DEMO_DATA !== "false";

// Local development uses in-memory repositories until native SQLite bindings are enabled.
const app = buildApp({
  repositories: createInMemoryRepositories(
    SEED_DEMO_DATA
      ? {
          journalSeed,
          instrumentSeed,
        }
      : undefined,
  ),
});

const start = async () => {
  try {
    await app.listen({ host: HOST, port: PORT });
    app.log.info(`API listening on http://${HOST}:${PORT}`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

const shutdown = async () => {
  await app.close();
  process.exit(0);
};

process.on("SIGINT", () => {
  void shutdown();
});

process.on("SIGTERM", () => {
  void shutdown();
});

void start();
