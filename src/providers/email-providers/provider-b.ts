import axios from 'axios';
import { Provider } from '../../types/provider';

export const providerB: Provider = {
  url: 'http://localhost:8092/api/email/provider2',
  name: 'Provider B',
  consume: async (data: any) => {
    console.log(`Provider B: ${data}`);

    await axios.post(providerB.url, data);
  },
};
