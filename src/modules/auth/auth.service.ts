import { Service } from 'typedi';
import crypto from 'crypto';

import { SignUpInput } from './sign-up.input';
import { UserRepository } from '../user/user.repository';
import { PasswordHashService } from './password-hash.service';
import { VerificationTokenRepository } from './verification-token.repository';
import { JwtService } from './jwt.service';
import { MailerService } from './mailer.service';
import { SearchService } from '../user/search.service';
import logger from '../../core/logger';

@Service()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly verificationTokenRepository: VerificationTokenRepository,
    private readonly jwtService: JwtService,
    private readonly passwordHashService: PasswordHashService,
    private readonly mailerService: MailerService,
    private readonly searchService: SearchService,
  ) {}

  async authenticate(email: string, password: string): Promise<string> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (!user.verified) {
      throw new Error('Please, first verify your email');
    }

    if (user.blockedUntil > Date.now()) {
      throw new Error(
        'Your account has been block due to failed login attempts. Please, try again later',
      );
    }

    const isPasswordValid = await this.passwordHashService.compare(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      await this.userRepository.increaseFailedAttempts(user.id);
      throw new Error('Invalid credentials');
    }

    const payload = {
      userId: user.id,
    };

    await this.userRepository.resetFailedAttempts(user.id);

    return this.jwtService.sign(payload);
  }

  async register({
    email,
    password,
    firstName,
    lastName,
  }: SignUpInput): Promise<boolean> {
    const emailExists = await this.userRepository.checkEmailExists(email);
    if (emailExists) {
      throw new Error(
        `The user with the email "${email}" is already registered`,
      );
    }

    const hashedPassword = await this.passwordHashService.hash(password);

    const user = await this.userRepository.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    if (!user) {
      throw new Error('Can not create the user in database');
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');

    const savedToken = await this.verificationTokenRepository.create({
      userId: user.id,
      token: verificationToken,
    });

    if (!savedToken) {
      throw new Error('Can not create the verification token in database');
    }

    logger.info(`Email verification token: ${verificationToken}`);

    await this.mailerService.sendVerification(user, verificationToken);

    this.searchService.index('users', user);

    return true;
  }

  async verifyEmail(token: string): Promise<boolean> {
    const savedToken = await this.verificationTokenRepository.findOne(token);

    if (!savedToken) {
      throw new Error('The verification token does not exist or expired');
    }

    // TODO: API needs a mechanism to re-send confirmation emails
    if (Date.now() > savedToken.expiry) {
      // TODO: It will be better to move clearing expired tokens into cron job
      this.verificationTokenRepository.remove(savedToken);
      throw new Error('The verification token does not exist or expired');
    }

    // TODO: for production sending emails should be queued
    await this.userRepository.setVerified(savedToken.userId);

    this.verificationTokenRepository.remove(savedToken);

    return true;
  }
}
