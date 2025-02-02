import axios from 'axios';
import { Provider } from '../../types/provider';
import { providerConfig } from '../../config';

export const emailProviderC: Provider = {
  key: providerConfig.email.providerC.key,
  url: providerConfig.email.providerC.url,
  name: providerConfig.email.providerC.name,
  consume: async (data: any) => {
    console.log(`Provider C: ${data}`);

    await axios.post(emailProviderC.url, data);
  },
};
