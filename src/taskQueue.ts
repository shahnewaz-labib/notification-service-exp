import axios from "axios";
import { queue } from "async";
import { queueConfig } from "./config";
import { exponentialBackoff, getShuffledProviders } from "./utils";
import { Task } from "./types/task";

export let taskQueue: Task[] = [];
export let deadLetterQueue: Task[] = [];


export const taskProcessingQueue = queue(async (task: Task) => {
	const shuffledProviders = getShuffledProviders(task.type);

	for (const [index, provider] of shuffledProviders.entries()) {
		try {
			await exponentialBackoff(async () => {
				await axios.post(provider, task.data);
			});
			return;
		} catch (error) {
			console.error(`Q: F ${task.id} -> ${provider.split("/").pop()}`);

			if (index === shuffledProviders.length - 1) {
				console.error("Q: All F -> DLQ");
				deadLetterQueue.push(task);
			}
		}
	}
}, queueConfig.taskQueueLimit);

export const deadLetterProcessingQueue = queue(async (task: Task) => {
	const shuffledProviders = getShuffledProviders(task.type);

	for (const [index, provider] of shuffledProviders.entries()) {
		try {
			await exponentialBackoff(async () => {
				await axios.post(provider, task.data);
			});
			return;
		} catch (error) {
			console.error(`DLQ: Failed to send ${task.type} via ${provider}`);

			if (index === shuffledProviders.length - 1) {
				console.error("DLQ: Persistent failure, will retry later");
				deadLetterQueue.push(task);
			}
		}
	}
}, queueConfig.deadLetterQueueLimit);

export async function processTaskQueue() {
	while (true) {
		if (taskQueue.length === 0) {
			await new Promise((resolve) => setTimeout(resolve, queueConfig.taskQueueInterval));
			continue;
		}

		while (
			taskQueue.length > 0 &&
			taskProcessingQueue.running() < queueConfig.taskQueueLimit
		) {
			const task = taskQueue.shift();
			if (task) {
				taskProcessingQueue.push(task);
			}
		}

		await new Promise((resolve) => setTimeout(resolve, 100));
	}
}

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

export function logState() {
	const totalIncomingTasks =
		taskQueue.length +
		taskProcessingQueue.running() +
		deadLetterQueue.length +
		deadLetterProcessingQueue.running();

	console.log(`==== TASK FLOW METRICS ====`);
	console.log(`Total Tasks         : ${totalIncomingTasks}`);
	console.log(`Task Queue Size     : ${taskQueue.length}`);
	console.log(`Active Tasks        : ${taskProcessingQueue.running()}`);
	console.log(`Dead Letter Q Size  : ${deadLetterQueue.length}`);
	console.log(`Active DLQ Tasks    : ${deadLetterProcessingQueue.running()}`);
	console.log(`Task Queue Capacity : ${queueConfig.taskQueueLimit - taskProcessingQueue.running()}`);
	console.log(`DLQ Capacity        : ${queueConfig.deadLetterQueueLimit - deadLetterProcessingQueue.running()}`);
	console.log(`==========================`);
}
