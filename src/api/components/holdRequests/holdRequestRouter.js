import { Router } from 'express';
import createRequest from './transferHoldRequestController.js';

const router = Router();

router.get('/createRequest', createRequest);

export default router;
