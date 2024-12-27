import { z } from 'zod';

export const emailSchema = z.object({
	id: z.string(),
	type: z.literal("email"),
	data: z.object({
		subject: z.string().nonempty(),
		body: z.string().nonempty(),
		recipients: z.array(z.string().email()),
	}),
});

export type SmsType = z.infer<typeof emailSchema>;
