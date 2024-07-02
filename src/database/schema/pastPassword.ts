import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { usersTable } from './users';
import { nanoid } from '@common/index';

export const pastPasswordTable = pgTable('past_passwords', {
  id: varchar('id').primaryKey().$defaultFn(nanoid),
  userId: uuid('user_id').references(() => usersTable.id, {
    onDelete: 'cascade',
  }),
  password: text('password'),
  createdAt: timestamp('created_at', {
    mode: 'date',
    precision: 3,
  }).defaultNow(),
});
