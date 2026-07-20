import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema.ts';

const { Pool } = pg;

const isProduction = process.env.NODE_ENV === 'production';

export const createPool = () => {
  // In production, never fall back to localhost defaults — require explicit
  // configuration. The app degrades gracefully (offline mode) when getDb()
  // returns null, which is safer than silently connecting to a wrong DB.
  if (isProduction && (!process.env.SQL_HOST || !process.env.SQL_USER || !process.env.SQL_PASSWORD || !process.env.SQL_DB_NAME)) {
    throw new Error('Database env vars (SQL_HOST, SQL_USER, SQL_PASSWORD, SQL_DB_NAME) must be set in production.');
  }
  return new Pool({
    host: process.env.SQL_HOST || '127.0.0.1',
    user: process.env.SQL_USER || 'postgres',
    password: process.env.SQL_PASSWORD || 'postgres',
    database: process.env.SQL_DB_NAME || 'postgres',
    connectionTimeoutMillis: 15000,
  });
};

let dbClient: ReturnType<typeof drizzle> | null = null;
let dbPool: pg.Pool | null = null;

export function getDb() {
  if (!dbClient) {
    try {
      dbPool = createPool();

      dbPool.on('error', (err) => {
        console.error('Unexpected error on idle SQL pool client:', err);
      });

      dbClient = drizzle(dbPool, { schema });
    } catch (err) {
      console.error('Failed to initialize database pool:', err);
      return null;
    }
  }
  return dbClient;
}

export function getPool() {
  getDb();
  return dbPool;
}
