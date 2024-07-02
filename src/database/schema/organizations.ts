import { nanoid } from '@common/index';
import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { usersTable } from './users';
import { relations } from 'drizzle-orm';

export const organizationsTable = pgTable('organizations', {
  id: varchar('id').primaryKey().$defaultFn(nanoid),
  name: text('name').unique(),
  createdAt: timestamp('created_at', {
    mode: 'date',
    precision: 3,
  }).defaultNow(),
  createdby: varchar('created_by').references(() => usersTable.id, {
    onDelete: 'set null',
  }),
  updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 }).$onUpdate(
    () => new Date(),
  ),
  updatedBy: varchar('updated_by').references(() => usersTable.id, {
    onDelete: 'set null',
  }),
});

export const organizationTableRelations = relations(
  organizationsTable,
  ({ many }) => ({
    users: many(usersTable),
  }),
);

export type OrganizationModel = typeof organizationsTable.$inferSelect;
export type InsertOrganizationModel = typeof organizationsTable.$inferInsert;
