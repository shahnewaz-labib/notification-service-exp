import { Provider } from "../../types/provider";
import { ExponentialBackoffStrategy } from "../../utils/retryStrategies";
import { sendWithRetry } from "../../utils/sendWithRetry";

export const providerB: Provider = {
	url: "http://localhost:8072/api/sms/provider2",
	name: "Provider B",
	consume: async (data: any) => {
		console.log(`Provider B: ${data}`);

		const strategy = new ExponentialBackoffStrategy();
		await sendWithRetry(providerB.url, data, strategy);
	}
}
