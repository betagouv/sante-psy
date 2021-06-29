import express from 'express';

import testRouter from './test';
import protectedRouter from './protected';
import unprotectedRouter from './unprotected';

import config from '../utils/config';

const router = express.Router();

if (config.testEnvironment) {
  router.use('/test', testRouter);
}

router.use('/api', unprotectedRouter);
router.use('/api', protectedRouter);

export default router;
