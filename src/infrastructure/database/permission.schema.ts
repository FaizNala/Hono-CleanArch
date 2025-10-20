import { relations } from "drizzle-orm";
import { varchar, pgTable, serial, timestamp, index } from "drizzle-orm/pg-core";
import { rolePermissions } from "./role-permission.schema";

export const permissions = pgTable(
  "permissions",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("permissions_name_idx").on(table.name)
  ]
);

export const permissionsRelations = relations(permissions, ({ many }) => ({
  rolePermissions: many(rolePermissions),
}));