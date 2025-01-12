import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

export const validateRequest = (schema: ZodSchema) => (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const result = schema.safeParse(req.body);
	if (!result.success) {
		res.status(400).json({
			errors: result.error.errors,
		});
		return;
	}

	next();
}
