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

export const port = process.env.PORT || 3000;

