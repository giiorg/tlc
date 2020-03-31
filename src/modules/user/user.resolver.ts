import { Resolver, Query, Ctx, Authorized } from 'type-graphql';

import { User } from './user.model';
import { Context } from '../auth/context.interface';

@Resolver()
export class UserResolver {
  @Authorized()
  @Query(returns => User)
  async me(@Ctx() context: Context): Promise<User> {
    return context.user;
  }
}
