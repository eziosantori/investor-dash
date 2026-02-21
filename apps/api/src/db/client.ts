import path from "node:path";

import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

import * as schema from "./schema.js";

export type DbClient = ReturnType<typeof drizzle<typeof schema>>;

export function resolveDbPath() {
  return path.resolve(process.cwd(), "data", "trading-journal.db");
}

export function createDbConnection(filename = resolveDbPath()) {
  const sqlite = new Database(filename);
  const db = drizzle(sqlite, { schema });

  return { db, sqlite };
}
