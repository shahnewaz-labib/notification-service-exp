import { queue } from "async";
import { queueConfig } from "../config";
import { Task } from "../types/task";
import { processTask } from "./utils";

export const taskQueue: Task[] = [];

export const taskProcessingQueue = queue(processTask, queueConfig.taskQueueLimit);

export async function processTaskQueue() {
	while (true) {
		while (
			taskQueue.length > 0 &&
			taskProcessingQueue.running() < queueConfig.taskQueueLimit
		) {
			const task = taskQueue.shift();
			if (task) {
				taskProcessingQueue.push(task);
			}
		}

		await new Promise((resolve) => setTimeout(resolve, queueConfig.taskQueueInterval));
	}
}

