import { Provider } from '../types/provider';
import { emailProviderA } from './email-providers/provider-a';
import { emailProviderB } from './email-providers/provider-b';
import { emailProviderC } from './email-providers/provider-c';
import { smsProviderA } from './sms-providers/provider-a';
import { smsProviderB } from './sms-providers/provider-b';
import { smsProviderC } from './sms-providers/provider-c';

export const emailProviders: { [key: string]: Provider } = {};
export const smsProviders: { [key: string]: Provider } = {};

function registerEmailProvider(provider: Provider) {
  emailProviders[provider.key] = provider;
  console.log(`Registered email provider: ${provider.name}`);
}

function registerSmsProvider(provider: Provider) {
  smsProviders[provider.key] = provider;
  console.log(`Registered sms provider: ${provider.name}`);
}

registerEmailProvider(emailProviderA);
registerEmailProvider(emailProviderB);
registerEmailProvider(emailProviderC);

registerSmsProvider(smsProviderA);
registerSmsProvider(smsProviderB);
registerSmsProvider(smsProviderC);
