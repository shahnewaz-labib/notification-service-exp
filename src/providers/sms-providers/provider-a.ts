import axios from 'axios';
import { Provider } from '../../types/provider';
import { providerConfig } from '../../config';

export const smsProviderA: Provider = {
  key: providerConfig.sms.providerA.key,
  url: providerConfig.sms.providerA.url,
  name: providerConfig.sms.providerA.name,
  consume: async (data: any) => {
    console.log(`Provider A: ${data}`);

    await axios.post(smsProviderA.url, data);
  },
};
