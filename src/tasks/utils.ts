import { getShuffledProviders } from "../utils";
import { taskProcessingQueue, taskQueue } from "./taskQueue";
import { deadLetterProcessingQueue, deadLetterQueue } from "./deadLetterQueue";
import { Task } from "../types/task";
import { queueConfig } from "../config";
import { Provider } from "../types/provider";

export async function processTask(task: Task) {
	const shuffledProviders: Provider[] = getShuffledProviders(task.type);

	for (const [index, provider] of shuffledProviders.entries()) {
		try {
			await provider.consume(task.data);
			return;
		} catch (error) {
			console.error(`Failed to process task ${task.id} with provider ${provider.name}`);

			if (index === shuffledProviders.length - 1) {
				console.error("All providers failed, moving task to dead letter queue");
				deadLetterQueue.push(task);
			}
		}
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

