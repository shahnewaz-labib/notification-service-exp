import { Router } from "express";
import { emailController } from "../controllers/emailController";

const emailRouter = Router();

emailRouter.post("/", emailController.sendEmail);

export default emailRouter;
