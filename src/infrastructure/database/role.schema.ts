import { relations } from 'drizzle-orm';
import { varchar, pgTable, serial } from 'drizzle-orm/pg-core';
import { userRoles } from './user-role.schema';

export const roles = pgTable('roles', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
});

export const rolesRelations = relations(roles, ({ many }) => ({
  userRoles: many(userRoles),
}));