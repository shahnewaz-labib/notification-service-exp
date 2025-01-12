export const queueConfig = {
  taskQueueInterval: 100,
  deadLetterQueueInterval: 10000,
  taskQueueLimit: 100,
  deadLetterQueueLimit: 100,
};

export const backoffConfig = {
  initialDelay: 500,
  multiplier: 1.5,
  maxJitter: 0.5,
  retries: 5,
};

export const circuitBreakerConfig = {
  failureThreshold: 3,
  successThreshold: 2,
  timeout: 1000,
  halfOpenTimeout: 5000,
};

export const port = process.env.PORT || 3000;
