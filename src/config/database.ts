import { Pool, PoolClient } from 'pg';
import { env } from './env';

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('Unexpected pool error:', err);
});

export const query = async (
  text: string,
  params?: any[],
): Promise<any> => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log(`Executed query in ${duration}ms - ${text.substring(0, 50)}...`);
    return result;
  } catch (err) {
    console.error('Database query error:', err);
    throw err;
  }
};

export const getClient = async (): Promise<PoolClient> => {
  return pool.connect();
};

export default pool;
