import { Router } from "express";
import { emailController } from "../controllers/emailController";
import { validateRequest } from "../middlewares/validateRequest";
import { emailSchema } from "../schemas/emailSchema";

const emailRouter = Router();

emailRouter.post("/", validateRequest(emailSchema), emailController.sendEmail);

export default emailRouter;
