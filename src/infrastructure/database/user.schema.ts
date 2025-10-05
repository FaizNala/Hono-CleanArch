import { relations } from 'drizzle-orm';
import { uuid, varchar, timestamp, pgTable } from 'drizzle-orm/pg-core';
import { userRoles } from './user-role.schema';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  userRoles: many(userRoles),
}));