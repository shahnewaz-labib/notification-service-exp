import axios from "axios";
import express from "express";
import { queue } from 'async';
import { queueConfig, Task } from "./config";
import { smsProviders, emailProviders, exponentialBackoff } from "./config";

let taskQueue: Task[] = [];
let deadLetterQueue: Task[] = [];

function getShuffledProviders(type: "sms" | "email") {
	let shuffledProviders = type === "sms" ? smsProviders : emailProviders;
	for (let i = shuffledProviders.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffledProviders[i], shuffledProviders[j]] = [shuffledProviders[j], shuffledProviders[i]];
	}
	return shuffledProviders;
}

async function processTaskQueue() {
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

async function processDeadLetterQueue() {
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

const taskProcessingQueue = queue(async (task: Task) => {
	const shuffledProviders = getShuffledProviders(task.type);

	for (const [index, provider] of shuffledProviders.entries()) {
		try {
			await exponentialBackoff(async () => {
				await axios.post(provider, task.data);
			}, task);
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

const deadLetterProcessingQueue = queue(async (task: Task) => {
	const shuffledProviders = getShuffledProviders(task.type);

	for (const [index, provider] of shuffledProviders.entries()) {
		try {
			await exponentialBackoff(async () => {
				await axios.post(provider, task.data);
			}, task);
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

// EXPRESS APP
const app = express();
app.use(express.json());

let id = 0;

app.post("/sms", (req, res) => {
	const { phone, text } = req.body;
	if (!phone || !text) {
		return res.status(400).json({ error: "Invalid input" });
	}
	taskQueue.push({ id: id++, type: "sms", data: { phone, text } });
	res.status(202).json({ message: "SMS request is being processed." });
});

app.post("/email", (req, res) => {
	const { subject, body, recipients } = req.body;
	if (!subject || !body || !Array.isArray(recipients)) {
		return res.status(400).json({ error: "Invalid input" });
	}
	taskQueue.push({ id: id++, type: "email", data: { subject, body, recipients } });
	res.status(202).json({ message: "Email request is being processed." });
});

function logState() {
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

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Service API running on port ${port}`);
});

setInterval(logState, 5000);

processTaskQueue();
processDeadLetterQueue();
