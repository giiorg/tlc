import Redis from 'ioredis';

import logger from './logger';

const redisClient = new Redis({
  host: process.env.CACHE_HOST,
  port: parseInt(process.env.CACHE_PORT, 10),
});

redisClient.on('connect', () => {
  logger.info(
    `Connected to cache (redis - ${process.env.CACHE_HOST}:${process.env.CACHE_PORT})`,
  );
});

redisClient.on('error', error => {
  logger.error(error);
});

export default redisClient;
