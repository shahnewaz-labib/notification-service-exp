import axios from 'axios';
import { Provider } from '../../types/provider';

export const emailProviderC: Provider = {
  key: 'email-provider-c',
  url: 'http://localhost:8093/api/email/provider3',
  name: 'Provider C',
  consume: async (data: any) => {
    console.log(`Provider C: ${data}`);

    await axios.post(emailProviderC.url, data);
  },
};
