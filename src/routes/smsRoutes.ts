import { Router } from "express";
import { smsController } from "../controllers/smsController";
import { validateRequest } from "../middlewares/validateRequest";
import { smsSchema } from "../schemas/smsSchema";

const smsRouter = Router();

smsRouter.post("/", validateRequest(smsSchema), smsController.sendSms);

export default smsRouter;
