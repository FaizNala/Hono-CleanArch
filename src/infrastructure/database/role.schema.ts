import { relations } from "drizzle-orm";
import { varchar, pgTable, serial, timestamp, index } from "drizzle-orm/pg-core";
import { userRoles } from "./user-role.schema";

export const roles = pgTable(
"roles",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("roles_name_idx").on(table.name)
  ]
);

export const rolesRelations = relations(roles, ({ many }) => ({
  userRoles: many(userRoles),
}));
