import Redis from 'ioredis';

import logger from './logger';

const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT, 10),
});

redisClient.on('connect', () => {
  logger.info('Connected to redis');
});

redisClient.on('error', error => {
  logger.error(error);
});

export default redisClient;
