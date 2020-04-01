import Container from 'typedi';
import Redis from 'ioredis';
import { Worker } from 'bullmq';
import dotenv from 'dotenv';

dotenv.config();

import logger from './core/logger';
import { MailerService } from './modules/auth/mailer.service';

const queueStore = new Redis({ port: 6309 });

queueStore.on('connect', () => {
  logger.info('workers connected to queue store (redis:6309)');
});

const queueName = 'emails';

const worker = new Worker(
  queueName,
  async job => {
    try {
      const { user, verificationToken } = job.data;

      const mailerService = Container.get(MailerService);

      await mailerService.sendVerification(user, verificationToken);

      console.log(job.data);
    } catch (err) {
      console.log('err', err);
      throw new Error(err);
    }
  },
  { connection: queueStore },
);

worker.on('completed', job => {
  console.log(`${job.id} has completed!`);
});

worker.on('failed', (job, err) => {
  console.log(`${job.id} has failed with ${err.message}`);
});
