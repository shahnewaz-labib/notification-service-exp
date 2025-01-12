import axios from 'axios';
import { Provider } from '../../types/provider';

export const providerA: Provider = {
  url: 'http://localhost:8091/api/email/provider1',
  name: 'Provider A',
  consume: async (data: any) => {
    console.log(`Provider A: ${data}`);

    await axios.post(providerA.url, data);
  },
};
