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
