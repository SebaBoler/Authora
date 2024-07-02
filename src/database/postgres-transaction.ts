import { PgTransaction } from 'drizzle-orm/pg-core';
import { NodePgQueryResultHKT } from 'drizzle-orm/node-postgres';
import { ExtractTablesWithRelations } from 'drizzle-orm';
import { databaseSchema } from './database-schema';

export type PostgresTransaction = PgTransaction<
  NodePgQueryResultHKT,
  typeof databaseSchema,
  ExtractTablesWithRelations<typeof databaseSchema>
>;
