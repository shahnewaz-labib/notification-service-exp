export interface SmsTask {
	id: string;
	type: "sms";
	data: {
		phone: string;
		text: string;
	}
}

export interface EmailTask {
	id: string;
	type: "email";
	data: {
		subject: string;
		body: string;
		recipients: string[];
	}
}

export type Task = SmsTask | EmailTask;
