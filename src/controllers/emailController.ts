import { Request, Response } from 'express';
import { emailService } from '../services/emailService';

export const emailController = {
  sendEmail: (req: Request, res: Response) => {
    const { subject, body, recipients } = req.body.data;
    const taskId = emailService.enqueueEmail(subject, body, recipients);
    res
      .status(202)
      .json({ message: 'Email request is being processed.', taskId });
  },
};
