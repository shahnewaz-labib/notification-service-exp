import { taskQueue } from '../tasks/taskQueue';
import { Task } from '../types/task';

import { v4 as uuidv4 } from 'uuid';

export const smsService = {
  enqueueSms: (phone: string, text: string) => {
    const id = uuidv4();
    const task: Task = { id: id, type: 'sms', data: { phone, text } };

    taskQueue.push(task);

    return task.id;
  },
};
