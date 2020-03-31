import { plainToClass } from 'class-transformer';
import { Service } from 'typedi';

import { Repository } from '../../core/repository';
import { VerificationToken } from './verification-token.model';
import logger from '../../core/logger';

@Service()
export class VerificationTokenRepository extends Repository {
  async create(data: VerificationToken) {
    const result = await this.query(
      `
        INSERT INTO verification_tokens (user_id, token, expiry)
        VALUES ($1, $2, extract(epoch from (now() + '24 hours'::interval)) * 1000)
        RETURNING *
      `,
      [data.userId, data.token],
    );

    if (result.rowCount === 0) {
      return null;
    }

    return plainToClass(VerificationToken, result.rows[0]);
  }

  async remove(data: VerificationToken) {
    try {
      const result = await this.query(
        `
        DELETE FROM verification_tokens
        WHERE token = $1
      `,
        [data.token],
      );

      if (result.rowCount === 0) {
        return false;
      }

      return true;
    } catch (err) {
      logger.error(err);
      return Promise.reject(err);
    }
  }

  async findOne(token: string) {
    const result = await this.query(
      `
        SELECT * FROM verification_tokens
        WHERE token = $1
        LIMIT 1
      `,
      [token],
    );

    if (result.rowCount === 0) {
      return null;
    }

    return plainToClass(VerificationToken, result.rows[0]);
  }
}
