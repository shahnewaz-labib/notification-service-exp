import axios from 'axios';
import { Provider } from '../../types/provider';

export const providerC: Provider = {
  url: 'http://localhost:8093/api/email/provider3',
  name: 'Provider C',
  consume: async (data: any) => {
    console.log(`Provider C: ${data}`);

    await axios.post(providerC.url, data);
  },
};
