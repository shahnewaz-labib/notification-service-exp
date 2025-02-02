import axios from 'axios';
import { Provider } from '../../types/provider';
import { providerConfig } from '../../config';

export const emailProviderB: Provider = {
  key: providerConfig.email.providerB.key,
  url: providerConfig.email.providerB.url,
  name: 'Provider B',
  consume: async (data: any) => {
    console.log(`Provider B: ${data}`);

    await axios.post(emailProviderB.url, data);
  },
};
