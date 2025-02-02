import axios from 'axios';
import { Provider } from '../../types/provider';

export const smsProviderC: Provider = {
  key: 'sms-provider-c',
  url: 'http://localhost:8073/api/sms/provider3',
  name: 'Provider C',
  consume: async (data: any) => {
    console.log(`Provider C: ${data}`);

    await axios.post(smsProviderC.url, data);
  },
};
