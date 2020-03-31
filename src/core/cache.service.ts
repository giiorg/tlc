import { promisify } from 'util';

import redisClient from './redis';

const getAsync = promisify(redisClient.hget).bind(redisClient);
const setAsync = promisify(redisClient.hset).bind(redisClient);

export class CacheService {
  async set(namespace: string, id: string, data: any) {
    return setAsync(namespace, id, JSON.stringify(data));
  }

  async get(namespace: string, id: string) {
    const cached = await getAsync(namespace, id);

    if (cached) {
      return JSON.parse(cached);
    }

    return null;
  }
}
