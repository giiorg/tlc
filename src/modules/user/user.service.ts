import { Service } from 'typedi';

import { UserRepository } from './user.repository';
import { CacheService } from '../../core/cache.service';

@Service()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cacheService: CacheService,
  ) {}

  async getUser(id: string) {
    try {
      const cachedUser = await this.cacheService.get(id);

      if (cachedUser) {
        return cachedUser;
      }

      const user = await this.userRepository.findById(id);
      if (!user) {
        throw new Error(
          'Access denied! You need to be authorized to perform this action!',
        );
      }

      this.cacheService.set(id, user);

      return user;
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
