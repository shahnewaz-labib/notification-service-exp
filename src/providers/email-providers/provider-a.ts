import { Provider } from "../../types/provider";
import { ExponentialBackoffStrategy } from "../../utils/retryStrategies";
import { sendWithRetry } from "../../utils/sendWithRetry";

export const providerA: Provider = {
  url: "http://localhost:8091/api/email/provider1",
  name: "Provider A",
  consume: async (data: any) => {
    console.log(`Provider A: ${data}`);

    const strategy = new ExponentialBackoffStrategy();
    await sendWithRetry(providerA.url, data, strategy);
  }
}
