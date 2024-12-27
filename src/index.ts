import app from "./app";
import { port } from "./config";
import { processDeadLetterQueue } from "./tasks/deadLetterQueue";
import { processTaskQueue } from "./tasks/taskQueue";
import { logState } from "./tasks/utils";

app.listen(port, () => {
	console.log(`Service API running on port ${port}`);
});

setInterval(logState, 5000);

processTaskQueue();
processDeadLetterQueue();
