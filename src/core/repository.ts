import logger from './logger';
import { Pool } from 'pg';
import getPoolConnection from './db';

export class Repository {
  private pool: Pool;

  constructor() {
    this.pool = getPoolConnection();
  }

  async query(text: string, values?: any[]) {
    try {
      return await this.pool.query(text, values);
    } catch (err) {
      logger.error(err.message);
      return Promise.reject(err);
    }
  }
}
