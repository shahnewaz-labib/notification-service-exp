import { backoffConfig, emailProviders, smsProviders, Task } from "../config";

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

