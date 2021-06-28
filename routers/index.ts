import express from 'express';

import testRouter from './test';
import protectedRouter from './protected';
import unprotectedRouter from './unprotected';

const router = express.Router();

router.use('/test', testRouter);
router.use('/api', unprotectedRouter);
router.use('/api', protectedRouter);

export default router;
