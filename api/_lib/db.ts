import { Pool } from 'pg';

let pool: Pool | undefined;
export function db() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error('DATABASE_URL não configurada.');
    pool = new Pool({ connectionString, ssl: connectionString.includes('railway') || process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined, max: 5 });
  }
  return pool;
}
