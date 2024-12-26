import { logState, processDeadLetterQueue, processTaskQueue } from "./taskQueue";
import app from "./app";

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Service API running on port ${port}`);
});

setInterval(logState, 5000);

processTaskQueue();
processDeadLetterQueue();
