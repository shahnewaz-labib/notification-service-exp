import axios from 'axios';
import { Provider } from '../../types/provider';
import { providerConfig } from '../../config';

export const smsProviderC: Provider = {
  key: providerConfig.sms.providerC.key,
  url: providerConfig.sms.providerC.url,
  name: providerConfig.sms.providerC.name,
  consume: async (data: any) => {
    console.log(`Provider C: ${data}`);

    await axios.post(smsProviderC.url, data);
  },
};
