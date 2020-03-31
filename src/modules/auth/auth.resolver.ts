import { Resolver, Mutation, Arg } from 'type-graphql';
import { SignUpInput } from './sign-up.input';
import { AuthService } from './auth.service';
import logger from '../../core/logger';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(returns => String)
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
  ): Promise<string> {
    try {
      return await this.authService.authenticate(email, password);
    } catch (err) {
      logger.error(err.message, err);
      return Promise.reject(err);
    }
  }

  @Mutation(returns => Boolean)
  async signup(@Arg('input') input: SignUpInput): Promise<boolean> {
    try {
      return await this.authService.register(input);
    } catch (err) {
      logger.error(err.message, err);
      return Promise.reject(err);
    }
  }

  @Mutation(returns => Boolean)
  async verifyEmail(@Arg('token') token: string): Promise<boolean> {
    try {
      return await this.authService.verifyEmail(token);
    } catch (err) {
      logger.error(err.message, err);
      return Promise.reject(err);
    }
  }
}
