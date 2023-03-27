import express from 'express';

import holdRequestRouter from './holdRequests/holdRequestRouter';

const router = express.Router();

router.use('/hold', holdRequestRouter);
export default router;
