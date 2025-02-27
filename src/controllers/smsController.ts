import { Request, Response } from 'express';
import { smsService } from '../services/smsService';

export const smsController = {
  sendSms: (req: Request, res: Response) => {
    const { phone, text } = req.body.data;
    const taskId = smsService.enqueueSms(phone, text);
    res
      .status(202)
      .json({ message: 'SMS request is being processed.', taskId });
  },
};
