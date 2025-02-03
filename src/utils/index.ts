import { emailProviders, smsProviders } from '../providers';
import { Provider } from '../types/provider';

export async function getProviders(type: 'sms' | 'email'): Promise<Provider[]> {
  const providerPriorities = await getProviderPriorities(type);
  providerPriorities.sort((a, b) => a.priority - b.priority);

  const providers: Provider[] = providerPriorities.map((provider) => {
    if (type === 'sms') {
      return smsProviders[provider.provider_key];
    } else {
      return emailProviders[provider.provider_key];
    }
  });

  return providers;
}

async function getProviderPriorities(type: 'sms' | 'email') {
  const providerPriorities = [
    {
      id: 1,
      provider_type: 'sms',
      provider_name: 'smsProviderA',
      provider_key: 'sms-provider-a',
      priority: 2,
    },
    {
      id: 2,
      provider_type: 'sms',
      provider_name: 'smsProviderB',
      provider_key: 'sms-provider-b',
      priority: 1,
    },
    {
      id: 3,
      provider_type: 'sms',
      provider_name: 'smsProviderC',
      provider_key: 'sms-provider-c',
      priority: 3,
    },
    {
      id: 1,
      provider_type: 'email',
      provider_name: 'emailProviderA',
      provider_key: 'email-provider-a',
      priority: 2,
    },
    {
      id: 2,
      provider_type: 'email',
      provider_name: 'emailProviderB',
      provider_key: 'email-provider-b',
      priority: 1,
    },
    {
      id: 3,
      provider_type: 'email',
      provider_name: 'emailProviderC',
      provider_key: 'email-provider-c',
      priority: 3,
    },
  ];

  return providerPriorities.filter(
    (provider) => provider.provider_type === type,
  );
}
