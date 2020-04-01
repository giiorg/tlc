import Redis from 'ioredis';

import logger from '../logger';

const queueStore = new Redis({
  host: process.env.QUEUE_HOST,
  port: parseInt(process.env.QUEUE_PORT, 10),
});

queueStore.on('connect', () => {
  logger.info(
    `Connected to queue store (redis - ${process.env.QUEUE_HOST}:${process.env.QUEUE_PORT})`,
  );
});

export default queueStore;
