import { Router } from "express";
import { smsController } from "../controllers/smsController";

const smsRouter = Router();

smsRouter.post("/", smsController.sendSms);

export default smsRouter;
