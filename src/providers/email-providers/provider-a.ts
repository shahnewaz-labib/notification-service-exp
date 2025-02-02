import axios from 'axios';
import { Provider } from '../../types/provider';
import { providerConfig } from '../../config';

export const emailProviderA: Provider = {
  key: providerConfig.email.providerA.key,
  url: providerConfig.email.providerA.url,
  name: providerConfig.email.providerA.name,
  consume: async (data: any) => {
    console.log(`Provider A: ${data}`);

    await axios.post(emailProviderA.url, data);
  },
};
