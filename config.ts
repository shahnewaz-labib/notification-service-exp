import dotenv from "dotenv";

dotenv.config();

export const smsProviders: string[] = [
	"http://localhost:8071/api/sms/provider1",
	"http://localhost:8072/api/sms/provider2",
	"http://localhost:8073/api/sms/provider3"
];

export const emailProviders: string[] = [
	"http://localhost:8091/api/email/provider1",
	"http://localhost:8092/api/email/provider2",
	"http://localhost:8093/api/email/provider3"
]

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
