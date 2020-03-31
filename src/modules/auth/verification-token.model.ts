import { Expose } from 'class-transformer';

export class VerificationToken {
  @Expose({ name: 'user_id' })
  userId: string;

  token: string;

  expiry?: number;
}
