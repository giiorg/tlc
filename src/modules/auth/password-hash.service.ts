import { Service } from 'typedi';
import bcrypt from 'bcrypt';

@Service()
export class PasswordHashService {
  private saltRounds: number = 10;

  hash(password: string) {
    return bcrypt.hash(password, this.saltRounds);
  }

  compare(plaintextPassword: string, hashedPassword: string) {
    return bcrypt.compare(plaintextPassword, hashedPassword);
  }
}
