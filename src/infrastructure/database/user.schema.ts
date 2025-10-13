import { relations } from "drizzle-orm";
import { uuid, varchar, timestamp, pgTable, index } from "drizzle-orm/pg-core";
import { userRoles } from "./user-role.schema";

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    name: varchar("name", { length: 255 }).notNull(),
    password: varchar("password", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("users_email_idx").on(table.email),
    index("users_name_idx").on(table.name),
  ]
);

export const usersRelations = relations(users, ({ many }) => ({
  userRoles: many(userRoles),
}));