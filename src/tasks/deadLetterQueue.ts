import { queue } from 'async';
import { Task } from '../types/task';
import { dlqProcessTask } from './utils';
import { queueConfig } from '../config';

export let deadLetterQueue: Task[] = [];

export const deadLetterProcessingQueue = queue(
  dlqProcessTask,
  queueConfig.deadLetterQueueLimit,
);

export async function processDeadLetterQueue() {
  while (true) {
    while (
      deadLetterQueue.length > 0 &&
      deadLetterProcessingQueue.running() < queueConfig.deadLetterQueueLimit
    ) {
      const task = deadLetterQueue.shift();
      if (task) {
        deadLetterProcessingQueue.push(task);
      }
    }

    await new Promise((resolve) =>
      setTimeout(resolve, queueConfig.deadLetterQueueInterval),
    );
  }
}
