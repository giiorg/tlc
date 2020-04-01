import redisClient from './redis';

export class CacheService {
  async set(id: string, data: any) {
    return redisClient.set(id, JSON.stringify(data));
  }

  async get(id: string) {
    const cached = await redisClient.get(id);

    return cached ? JSON.parse(cached) : null;
  }
}
