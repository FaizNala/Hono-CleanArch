import { uuid, integer, pgTable, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './user.schema';
import { roles } from './role.schema';

export const userRoles = pgTable(
  'user_roles',
  {
    userId: uuid('user_id').notNull().references(() => users.id),
    roleId: integer('role_id').notNull().references(() => roles.id),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.roleId] }),
  ],
);

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRoles.userId],
    references: [users.id],
  }),
  role: one(roles, {
    fields: [userRoles.roleId],
    references: [roles.id],
  }),
}));