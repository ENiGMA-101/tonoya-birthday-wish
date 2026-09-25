import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const wishes = pgTable("wishes", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Wish = typeof wishes.$inferSelect;
export type NewWish = typeof wishes.$inferInsert;
