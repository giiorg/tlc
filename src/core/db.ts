import { PoolClient, Pool } from 'pg';
import logger from './logger';

let pool: Pool;

function getPoolConnection() {
  if (pool) {
    return pool;
  } else {
    pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASS,
      port: parseInt(process.env.DB_PORT, 10),
    });

    pool.on('connect', () => {
      logger.info('Connected to database');
    });

    pool.on('error', (err: Error, client: PoolClient) => {
      logger.error('Unexpected error on idle client', err);
      process.exit(-1);
    });

    return pool;
  }
}

export default getPoolConnection;
