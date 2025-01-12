import { taskQueue } from '../tasks/taskQueue';
import { Task } from '../types/task';

import { v4 as uuidv4 } from 'uuid';

export const emailService = {
  enqueueEmail: (subject: string, body: string, recipients: string[]) => {
    const id = uuidv4();
    const task: Task = {
      id: id,
      type: 'email',
      data: { subject, body, recipients },
    };

    taskQueue.push(task);

    return task.id;
  },
};
