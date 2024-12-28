import { queue } from "async";
import { Task } from "../types/task";
import { processTask } from "./utils";
import { queueConfig } from "../config";

export let deadLetterQueue: Task[] = [];

export const deadLetterProcessingQueue = queue(processTask, queueConfig.deadLetterQueueLimit);

export async function processDeadLetterQueue() {
	while (true) {
		if (deadLetterQueue.length === 0) {
			await new Promise((resolve) => setTimeout(resolve, queueConfig.deadLetterQueueInterval));
			continue;
		}

		while (
			deadLetterQueue.length > 0 &&
			deadLetterProcessingQueue.running() < queueConfig.deadLetterQueueLimit
		) {
			const task = deadLetterQueue.shift();
			if (task) {
				deadLetterProcessingQueue.push(task);
			}
		}

		await new Promise((resolve) => setTimeout(resolve, 100));
	}
}
