import type { DbClient } from "../client.js";

import { createDrizzleSystemMetaStore } from "./drizzle-system-meta.store.js";
import { createSystemMetaRepository } from "./system-meta.repository.js";

export interface Repositories {
  systemMeta: ReturnType<typeof createSystemMetaRepository>;
}

export function createRepositories(db: DbClient): Repositories {
  return {
    systemMeta: createSystemMetaRepository(createDrizzleSystemMetaStore(db)),
  };
}
