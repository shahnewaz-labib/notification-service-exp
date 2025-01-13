interface CircuitBreakerConfig {
  failureThreshold: number;
  successThreshold: number;
  timeout: number;
  halfOpenTimeout: number;
}

export class CircuitBreaker {
  private failureThreshold: number;
  private successThreshold: number;
  private halfOpenTimeout: number;
  private state: Map<
    string,
    {
      failureCount: number;
      successCount: number;
      state: 'closed' | 'open' | 'half-open';
      lastFailureTime?: number;
    }
  >;

  constructor(config: CircuitBreakerConfig) {
    this.failureThreshold = config.failureThreshold;
    this.successThreshold = config.successThreshold;
    this.halfOpenTimeout = config.halfOpenTimeout;
    this.state = new Map();
  }

  private open(providerName: string) {
    const providerState = this.state.get(providerName) || {
      failureCount: 0,
      successCount: 0,
      state: 'closed',
    };
    providerState.state = 'open';

    this.state.set(providerName, providerState);

    console.log(`[CBP] Circuit is open for provider: ${providerName}`);
  }

  private reset(providerName: string) {
    const providerState = this.state.get(providerName);
    if (!providerState) return;

    providerState.state = 'closed';
    providerState.failureCount = 0;
    providerState.successCount = 0;

    this.state.set(providerName, providerState);

    console.log(`[CBP] Circuit is reset(closed) for provider: ${providerName}`);
  }

  private halfOpen(providerName: string) {
    const providerState = this.state.get(providerName);
    if (!providerState) return;

    providerState.state = 'half-open';
    providerState.successCount = 0;

    this.state.set(providerName, providerState);

    console.log(`[CBP] Circuit is half-open for provider: ${providerName}`);
  }

  private onSuccess(providerName: string) {
    const providerState = this.state.get(providerName) || {
      failureCount: 0,
      successCount: 0,
      state: 'closed',
    };
    providerState.successCount++;

    if (providerState?.successCount >= this.successThreshold) {
      this.reset(providerName);
    }
    this.state.set(providerName, providerState);

    console.log('[CBP] Success!');
  }

  private onFailure(providerName: string) {
    const providerState = this.state.get(providerName) || {
      failureCount: 0,
      successCount: 0,
      state: 'closed',
      lastFailureTime: Date.now(),
    };
    providerState.failureCount++;

    if (providerState?.failureCount >= this.failureThreshold) {
      this.open(providerName);
      providerState.lastFailureTime = Date.now();
    }
    this.state.set(providerName, providerState);

    console.log('[CBP] Failure!');
  }

  public async fire(
    providerName: string,
    action: () => Promise<void>,
  ): Promise<void> {
    const providerState = this.state.get(providerName) || {
      failureCount: 0,
      successCount: 0,
      state: 'closed',
    };

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
}
