import { nanoid } from '@common/index';
import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { usersTable } from './users';

export const activationCodeTable = pgTable('activation_codes', {
  id: varchar('id').primaryKey().$defaultFn(nanoid),
  userId: uuid('user_id').references(() => usersTable.id),
  code: text('code').notNull(),
  createdAt: timestamp('created_at', {
    mode: 'date',
    precision: 3,
  }).defaultNow(),
});
