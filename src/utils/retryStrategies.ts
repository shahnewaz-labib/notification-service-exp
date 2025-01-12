import { backoffConfig } from '../config';

export interface RetryStrategy {
  execute<T>(action: () => Promise<T>): Promise<void>;
}

export class ExponentialBackoffStrategy implements RetryStrategy {
  async execute<T>(action: () => Promise<T>): Promise<void> {
    let delay = backoffConfig.initialDelay;
    let maxJitter = backoffConfig.maxJitter;
    let multiplier = backoffConfig.multiplier;
    let retries = backoffConfig.retries;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await action();
        return;
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
}
