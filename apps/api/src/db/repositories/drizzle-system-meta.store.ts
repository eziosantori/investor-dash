import type { DbClient } from "../client.js";
import { systemMeta } from "../schema.js";
import type { SystemMetaStore } from "./system-meta.repository.js";

export function createDrizzleSystemMetaStore(db: DbClient): SystemMetaStore {
  return {
    async findByKey(key) {
      const row = await db.query.systemMeta.findFirst({
        where: (table, operators) => operators.eq(table.key, key),
      });

      return row ? { key: row.key, value: row.value } : null;
    },
    async upsert(record) {
      await db
        .insert(systemMeta)
        .values({ key: record.key, value: record.value })
        .onConflictDoUpdate({
          target: systemMeta.key,
          set: { value: record.value },
        });
    },
  };
}
