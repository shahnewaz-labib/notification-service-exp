import { Router } from 'express';
import smsRouter from './smsRoutes';
import emailRouter from './emailRoutes';

const router = Router();

router.use('/sms', smsRouter);
router.use('/email', emailRouter);

export default router;
