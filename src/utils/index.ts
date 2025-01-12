import { emailProviders } from "../providers/email-providers";
import { smsProviders } from "../providers/sms-providers";
import { Provider } from "../types/provider";

export function getShuffledProviders(type: "sms" | "email"): Provider[] {
	let providers = type === "sms" ? [...smsProviders] : [...emailProviders];
	for (let i = providers.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[providers[i], providers[j]] = [providers[j], providers[i]];
	}
	return providers;
}
