import axios from 'axios';
import { Provider } from '../../types/provider';
import { providerConfig } from '../../config';

export const smsProviderB: Provider = {
  key: providerConfig.sms.providerB.key,
  url: providerConfig.sms.providerB.url,
  name: providerConfig.sms.providerB.name,
  consume: async (data: any) => {
    console.log(`Provider B: ${data}`);

    await axios.post(smsProviderB.url, data);
  },
};
