import { Queue, QueueScheduler } from 'bullmq';

import queueStore from './store';

const emailsQueueScheduler = new QueueScheduler('emails', {
  connection: queueStore,
});
const emailsQueue = new Queue('emails', { connection: queueStore });

export default emailsQueue;
