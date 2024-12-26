import { Task } from "../config";
import { taskQueue } from "../taskQueue";

let id = 0;

export const emailService = {
	enqueueEmail: (subject: string, body: string, recipients: string[]) => {
		const task: Task = { id: id++, type: "email", data: { subject, body, recipients } };
		taskQueue.push(task);
		return task.id;
	},
};

