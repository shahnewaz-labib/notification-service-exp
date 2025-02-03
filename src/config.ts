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

export const providerConfig = {
  email: {
    providerA: {
      url: 'http://localhost:8091/api/email/provider1',
      key: 'email-provider-a',
      name: 'Provider A',
    },
    providerB: {
      url: 'http://localhost:8092/api/email/provider2',
      key: 'email-provider-b',
      name: 'Provider B',
    },
    providerC: {
      url: 'http://localhost:8093/api/email/provider3',
      key: 'email-provider-c',
      name: 'Provider C',
    },
  },
  sms: {
    providerA: {
      url: 'http://localhost:8071/api/sms/provider1',
      key: 'sms-provider-a',
      name: 'Provider A',
    },
    providerB: {
      url: 'http://localhost:8072/api/sms/provider2',
      key: 'sms-provider-b',
      name: 'Provider B',
    },
    providerC: {
      url: 'http://localhost:8073/api/sms/provider3',
      key: 'sms-provider-c',
      name: 'Provider C',
    },
  },
};

export const port = process.env.PORT || 3000;
