import { z } from 'zod';

const bangladeshiPhoneRegex = /^(?:\+88|88)?(01[3-9]\d{8})$/;

export const smsSchema = z.object({
	id: z.string(),
	type: z.literal("sms"),
	data: z.object({
		phone: z.string().regex(bangladeshiPhoneRegex),
		text: z.string(),
	}),
});

export type SmsType = z.infer<typeof smsSchema>;
