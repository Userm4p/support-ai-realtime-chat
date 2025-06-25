import { Router } from 'express';
import messages from './messages';

const router = Router();

router.use('/messages', messages);

export { router };
