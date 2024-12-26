import { backoffConfig, emailProviders, smsProviders } from "../config";

export async function exponentialBackoff<T>(
	action: () => Promise<T>,
) {
	let delay = backoffConfig.initialDelay;
	let maxJitter = backoffConfig.maxJitter;
	let multiplier = backoffConfig.multiplier;
	let retries = backoffConfig.retries;

	for (let attempt = 1; attempt <= retries; attempt++) {
		try {
			return await action();
		} catch (error) {
			if (attempt === backoffConfig.retries) {
				console.error(`f. No more R.`);
				throw error;
			}
			console.error(`R ${delay} ms...`);
			await new Promise((resolve) => setTimeout(resolve, delay));
			const jitter = delay * maxJitter * (Math.random() - 0.5) * 2;
			delay = delay * multiplier + jitter;
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

