import Redis from 'ioredis';

import logger from '../logger';

const queueStore = new Redis({ port: 6309 });

queueStore.on('connect', () => {
  logger.info('connected to queue store (redis:6309)');
});

export default queueStore;
