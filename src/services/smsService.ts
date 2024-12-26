import { Task } from "../config";
import { taskQueue } from "../taskQueue";

let id = 0;

export const smsService = {
	enqueueSms: (phone: string, text: string) => {
		const task: Task = { id: id++, type: "sms", data: { phone, text } };
		taskQueue.push(task);
		return task.id;
	},
};

