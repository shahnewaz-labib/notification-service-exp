import axios from "axios";
import { RetryStrategy } from "./retryStrategies";

export async function sendWithRetry(url: string, data: any, strategy: RetryStrategy) {
    await strategy.execute(async() => {
        await axios.post(url, data);
    })
}