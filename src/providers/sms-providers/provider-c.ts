import { Provider } from "../../types/provider";
import { ExponentialBackoffStrategy } from "../../utils/retryStrategies";
import { sendWithRetry } from "../../utils/sendWithRetry";

export const providerC: Provider = {
	url: "http://localhost:8073/api/sms/provider3",
	name: "Provider C",
	consume: async (data: any) => {
		console.log(`Provider C: ${data}`);

		const strategy = new ExponentialBackoffStrategy();
		await sendWithRetry(providerC.url, data, strategy);
	}
}
