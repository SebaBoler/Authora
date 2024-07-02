import { nanoid } from '@common/index';
import { pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { usersTable } from './users';
import { relations } from 'drizzle-orm';

export const rolesTable = pgTable('roles', {
  id: varchar('id').primaryKey().$defaultFn(nanoid),
  name: varchar('name').unique(),
  description: varchar('description'),
  createdAt: timestamp('created_at', {
    mode: 'date',
    precision: 3,
  }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 }).$onUpdate(
    () => new Date(),
  ),
});

export const rolesTableRelations = relations(rolesTable, ({ many }) => ({
  users: many(usersTable),
}));

export type RoleModel = typeof rolesTable.$inferSelect;
export type InsertRoleModel = typeof rolesTable.$inferInsert;
