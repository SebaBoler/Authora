import { drizzle } from 'drizzle-orm/node-postgres';
import { env } from 'env';
import pg from 'pg';
import { sql } from 'drizzle-orm';

export const queryClient = new pg.Pool({
  connectionString: env.DATABASE_URL,
});

export const db = drizzle(queryClient, {
  logger: true,
});

export const coalesce = <T>(column: T, value: number) =>
  sql`COALESCE(${column}, ${value})`.mapWith(Number);
