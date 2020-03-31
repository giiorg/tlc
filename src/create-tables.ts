import logger from './core/logger';
import getPoolConnection from './core/db';

async function createTables() {
  const pool = getPoolConnection();

  try {
    await pool.query(
      `
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

        CREATE TABLE IF NOT EXISTS users (
          id uuid NOT NULL UNIQUE PRIMARY KEY DEFAULT uuid_generate_v4(),
          first_name varchar(250) NOT NULL,
          last_name varchar(250) NOT NULL,
          email varchar(250) NOT NULL UNIQUE,
          password varchar(450) NOT NULL,
          verified boolean NOT NULL DEFAULT false,
          failed_login_attempts integer NOT NULL DEFAULT 0,
          blocked_until decimal
        );

        CREATE TABLE IF NOT EXISTS verification_tokens (
          user_id uuid NOT NULL PRIMARY KEY,
          token varchar(1000) NOT NULL,
          expiry decimal,
          CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        );

        CREATE INDEX IF NOT EXISTS idx_verification_tokens_token
        ON verification_tokens(token);
      `,
    );
  } catch (err) {
    logger.error(err.message);
  }
}

export default createTables;
