import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Step 3 scaffold table used only to validate Drizzle wiring.
// Domain tables (journals, accounts, trades, etc.) will be added in migration step.
export const systemMeta = sqliteTable("system_meta", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
});
