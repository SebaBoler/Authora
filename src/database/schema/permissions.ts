import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { rolesTable } from './roles';
import { nanoid } from '@common/index';
import { usersTable } from './users';

export const permissionsTable = pgTable('permissions', {
  id: varchar('id').primaryKey().$defaultFn(nanoid),
  name: text('name'),
  description: text('description'),
  createdAt: timestamp('created_at', {
    mode: 'date',
    precision: 3,
  }).defaultNow(),
  createdBy: uuid('created_by').references(() => usersTable.id, {
    onDelete: 'set null',
  }),
  updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 }).$onUpdate(
    () => new Date(),
  ),
  updatedBy: uuid('updated_by').references(() => usersTable.id, {
    onDelete: 'set null',
  }),
});

export const permissionsTableRelations = relations(
  permissionsTable,
  ({ many }) => ({
    permissionsToRoles: many(rolesTable),
  }),
);

export type OrganizationModel = typeof permissionsTable.$inferSelect;
export type InsertOrganizationModel = typeof permissionsTable.$inferInsert;
