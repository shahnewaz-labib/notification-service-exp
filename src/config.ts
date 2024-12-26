import dotenv from "dotenv";

dotenv.config();

const smsProviders: string[] = [
	"http://localhost:8071/api/sms/provider1",
	"http://localhost:8072/api/sms/provider2",
	"http://localhost:8073/api/sms/provider3"
];

const emailProviders: string[] = [
	"http://localhost:8091/api/email/provider1",
	"http://localhost:8092/api/email/provider2",
	"http://localhost:8093/api/email/provider3"
]

export interface Task {
	id: number;
	type: "sms" | "email";
	data: {
		phone: string;
		text: string;
	} | {
		subject: string;
		body: string;
		recipients: string[];
	};
}

export const queueConfig = {
	taskQueueInterval: 100,
	deadLetterQueueInterval: 1000,
	taskQueueLimit: 100,
	deadLetterQueueLimit: 100,
}

export const backoffConfig = {
	initialDelay: 500,
	multiplier: 1.5,
	maxJitter: 0.5,
	retries: 5,
};

export async function exponentialBackoff(fn: Function, task: Task) {
	let delay = backoffConfig.initialDelay;

	for (let attempt = 1; attempt <= backoffConfig.retries; attempt++) {
		try {
			return await fn();
		} catch (error) {
			if (attempt === backoffConfig.retries) {
				console.error(`${task.id} Att ${attempt} f. No more retries.`);
				throw error;
			}
			console.error(`${task.id} Att ${attempt} failed. R ${delay} ms...`);
			await new Promise((resolve) => setTimeout(resolve, delay));
			const jitter = delay * backoffConfig.maxJitter * (Math.random() - 0.5) * 2;
			delay = delay * backoffConfig.multiplier + jitter;
		}
	}
}

export function getShuffledProviders(type: "sms" | "email") {
	let shuffledProviders = type === "sms" ? smsProviders : emailProviders;
	for (let i = shuffledProviders.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffledProviders[i], shuffledProviders[j]] = [shuffledProviders[j], shuffledProviders[i]];
	}
	return shuffledProviders;
}

