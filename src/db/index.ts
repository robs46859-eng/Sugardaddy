import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema.ts';

const { Pool } = pg;

export const createPool = () => {
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
