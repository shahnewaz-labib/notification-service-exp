interface CircuitBreakerConfig {
  failureThresholdPercentage: number;
  successThresholdPercentage: number;
  halfOpenThresholdPercentage: number;
  halfOpenTimeout: number;
}

type ProviderState = {
  failureCount: number;
  successCount: number;
  attemptCount: number;
  halfOpenRequestCount: number;
  state: 'closed' | 'open' | 'half-open';
  lastFailureTime?: number;
  maxHalfOpenRequests: number;
};

export class CircuitBreaker {
  private failureThresholdPercentage: number;
  private successThresholdPercentage: number;
  private halfOpenThresholdPercentage: number;
  private halfOpenTimeout: number;
  private state: Map<string, ProviderState>;

  constructor(config: CircuitBreakerConfig) {
    this.failureThresholdPercentage = config.failureThresholdPercentage;
    this.successThresholdPercentage = config.successThresholdPercentage;
    this.halfOpenThresholdPercentage = config.halfOpenThresholdPercentage;
    this.halfOpenTimeout = config.halfOpenTimeout;
    this.state = new Map();
  }

  private open(providerName: string) {
    const providerState = this.state.get(providerName) || this.createInitialState();
    providerState.state = 'open';
    providerState.lastFailureTime = Date.now();
    providerState.maxHalfOpenRequests = Math.floor(
      (providerState.attemptCount * this.halfOpenThresholdPercentage) / 100
    );
    this.state.set(providerName, providerState);
    console.log(`[CBP] Circuit is open for provider: ${providerName}`);
  }

  private reset(providerName: string) {
    const providerState = this.state.get(providerName);
    if (!providerState) return;

    providerState.state = 'closed';
    providerState.failureCount = 0;
    providerState.successCount = 0;
    providerState.attemptCount = 0;
    providerState.halfOpenRequestCount = 0;
    providerState.maxHalfOpenRequests = 0;

    this.state.set(providerName, providerState);
    console.log(`[CBP] Circuit is reset(closed) for provider: ${providerName}`);
  }

  private halfOpen(providerName: string) {
    const providerState = this.state.get(providerName);
    if (!providerState) return;

    providerState.state = 'half-open';
    providerState.successCount = 0;
    providerState.attemptCount = 0;
    providerState.halfOpenRequestCount = 0;

    this.state.set(providerName, providerState);
    console.log(`[CBP] Circuit is half-open for provider: ${providerName}`);
  }

  private onSuccess(providerName: string) {
    const providerState = this.state.get(providerName) || this.createInitialState();
    providerState.successCount++;
    providerState.attemptCount++;

    if (providerState.state === 'half-open') {
      providerState.halfOpenRequestCount++;
      if (providerState.halfOpenRequestCount >= providerState.maxHalfOpenRequests) {
        const successPercentage = (providerState.successCount / providerState.attemptCount) * 100;
        if (successPercentage >= this.successThresholdPercentage) {
          this.reset(providerName);
        } else {
          this.open(providerName);
        }
      }
    } else {
      const successPercentage = (providerState.successCount / providerState.attemptCount) * 100;
      if (successPercentage >= this.successThresholdPercentage) {
        this.reset(providerName);
      }
    }

    this.state.set(providerName, providerState);
    console.log('[CBP] Success!');
  }

  private onFailure(providerName: string) {
    const providerState = this.state.get(providerName) || this.createInitialState();
    providerState.failureCount++;
    providerState.attemptCount++;

    if (providerState.state === 'half-open') {
      providerState.halfOpenRequestCount++;
      if (providerState.halfOpenRequestCount >= providerState.maxHalfOpenRequests) {
        const failurePercentage = (providerState.failureCount / providerState.attemptCount) * 100;
        if (failurePercentage >= this.failureThresholdPercentage) {
          this.open(providerName);
        } else {
          this.reset(providerName);
        }
      }
    } else {
      const failurePercentage = (providerState.failureCount / providerState.attemptCount) * 100;
      if (failurePercentage >= this.failureThresholdPercentage) {
        this.open(providerName);
      }
    }

    this.state.set(providerName, providerState);
    console.log('[CBP] Failure!');
  }

  public async fire(
    providerName: string,
    action: () => Promise<void>,
  ): Promise<void> {
    const providerState = this.state.get(providerName) || this.createInitialState();

    if (providerState.state === 'open') {
      const lastFailureTime = Date.now() - (providerState.lastFailureTime || 0);
      if (lastFailureTime > this.halfOpenTimeout) {
        this.halfOpen(providerName);
      } else {
        throw new Error(`Circuit is open for provider: ${providerName}`);
      }
    }

    try {
      await action();
      this.onSuccess(providerName);
    } catch (error) {
      this.onFailure(providerName);
      throw error;
    }
  }

  private createInitialState(): ProviderState {
    return {
      failureCount: 0,
      successCount: 0,
      attemptCount: 0,
      halfOpenRequestCount: 0,
      state: 'closed',
      maxHalfOpenRequests: 0,
    };
  }
}

