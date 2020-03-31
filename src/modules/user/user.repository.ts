import { plainToClass } from 'class-transformer';
import { QueryResult } from 'pg';
import { Service } from 'typedi';

import { Repository } from '../../core/repository';
import { SignUpInput } from '../auth/sign-up.input';
import logger from '../../core/logger';
import { User } from './user.model';

@Service()
export class UserRepository extends Repository {
  async checkEmailExists(email: string) {
    try {
      const result: QueryResult = await this.query(
        `
          SELECT count(*) FROM users
          WHERE email = lower($1)
          LIMIT 1
        `,
        [email.toLowerCase()],
      );

      return result?.rows[0]?.count > 0;
    } catch (err) {
      logger.error(err.message);
      return Promise.reject(err);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const result = await this.query(
        `
          SELECT id, email, password, verified, blocked_until
          FROM users
          WHERE email = lower($1)
          LIMIT 1
        `,
        [email.toLocaleLowerCase()],
      );

      if (result.rowCount === 0) {
        return null;
      }

      return plainToClass(User, result.rows[0]);
    } catch (err) {
      logger.error(err.message);
      return Promise.reject(err);
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      const result = await this.query(
        `
          SELECT id, first_name, last_name, email
          FROM users
          WHERE id = $1
          LIMIT 1
        `,
        [id],
      );

      if (result.rowCount === 0) {
        return null;
      }

      return plainToClass(User, result.rows[0]);
    } catch (err) {
      logger.error(err.message);
      return Promise.reject(err);
    }
  }

  async create(userData: SignUpInput): Promise<User | null> {
    try {
      const result = await this.query(
        `
          INSERT INTO users (first_name, last_name, email, password)
          VALUES ($1, $2, $3, $4)
          RETURNING *
        `,
        [
          userData.firstName,
          userData.lastName,
          userData.email,
          userData.password,
        ],
      );

      if (result.rowCount === 0) {
        return null;
      }

      return plainToClass(User, result.rows[0]);
    } catch (err) {
      logger.error(err.message);
      return Promise.reject(err);
    }
  }

  async setVerified(userId: string) {
    try {
      return await this.query(
        `
          UPDATE users
          SET verified=true
          WHERE id=$1
        `,
        [userId],
      );
    } catch (err) {
      logger.error(err.message);
      return Promise.reject(err);
    }
  }

  async increaseFailedAttempts(userId: string) {
    try {
      const result = await this.query(
        `
          UPDATE users
          SET failed_login_attempts=failed_login_attempts + 1
          WHERE id=$1
          RETURNING failed_login_attempts
        `,
        [userId],
      );

      if (result?.rows[0]?.failed_login_attempts % 5 === 0) {
        await this.query(
          `
            UPDATE users
            SET blocked_until = extract(epoch from (now() + '1 hour'::interval)) * 1000
            WHERE id=$1
          `,
          [userId],
        );
      }

      return result?.rowCount > 0;
    } catch (err) {
      logger.error(err.message);
      return Promise.reject(err);
    }
  }

  async resetFailedAttempts(userId: string) {
    try {
      const result = await this.query(
        `
        UPDATE users
        SET failed_login_attempts=0, blocked_until=null
        WHERE id=$1
      `,
        [userId],
      );

      return result?.rowCount > 0;
    } catch (err) {
      logger.error(err.message);
      return Promise.reject(err);
    }
  }
}
