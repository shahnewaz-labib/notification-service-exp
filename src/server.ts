import express, { Request, Response, Express, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const randomFail = () => {
  if (Math.random() < 0.5) {
    throw new Error('Random failure occurred');
  }
};

const bangladeshiPhoneRegex = /^(?:\+88|88)?(01[3-9]\d{8})$/;

const validateSmsBody = (req: Request, res: Response, next: Function) => {
  const { phone, text } = req.body;

  if (!phone || !bangladeshiPhoneRegex.test(phone)) {
    return res.status(400).json({ error: 'Invalid or missing phone number' });
  }

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({ error: 'Invalid or missing text' });
  }

  return next();
};

const validateEmailBody = (req: Request, res: Response, next: Function) => {
  const { subject, body, recipients } = req.body;

  if (!subject || typeof subject !== 'string' || subject.trim().length === 0) {
    return res.status(400).json({ error: 'Invalid or missing subject' });
  }

  if (!body || typeof body !== 'string' || body.trim().length === 0) {
    return res.status(400).json({ error: 'Invalid or missing body' });
  }

  if (!Array.isArray(recipients) || recipients.length === 0) {
    return res
      .status(400)
      .json({ error: 'Invalid or missing recipients list' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  for (const email of recipients) {
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ error: `Invalid email in recipients: ${email}` });
    }
  }

  return next();
};

function validateBody(type: 'sms' | 'email') {
  if (type === 'sms') {
    return validateSmsBody;
  }

  if (type === 'email') {
    return validateEmailBody;
  }

  return (_req: Request, _res: Response, next: NextFunction) => next();
}

let total = 0;
function registerApi(app: Express, type: 'sms' | 'email', index: number) {
  // SMS APIs
  app.post(
    `/api/${type}/provider${index}`,
    validateBody(type),
    (req: Request, res: Response) => {
      try {
        randomFail();
        console.log(
          new Date().toISOString(),
          `Sending ${type} via Provider ${index}:`,
          req.body,
        );

        res.status(200).json({
          message: `${type.toUpperCase()} sent via Provider ${index}`,
        });
        total++;
        console.log(total);
      } catch (error) {
        res.status(500).json({
          error: `Failed to send ${type} via Provider ${index}`,
        });
      }
    },
  );
}

for (let index = 1; index < 4; index++) {
  const smsApp = express();
  const smsPort = process.env[`PORT_SMS_${index}`] || 8070 + index;

  const emailApp = express();
  const emailPort = process.env[`PORT_EMAIL_${index}`] || 8090 + index;

  smsApp.use(express.json());
  emailApp.use(express.json());

  registerApi(smsApp, 'sms', index);
  registerApi(emailApp, 'email', index);

  smsApp.listen(smsPort, () => {
    console.log(`SMS Provider ${index} running on port ${smsPort}`);
  });
  emailApp.listen(emailPort, () => {
    console.log(`Email Provider ${index} running on port ${emailPort}`);
  });
}
