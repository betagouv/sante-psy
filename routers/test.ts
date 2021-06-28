import express from 'express';

import testController from '../controllers/testController';

import config from '../utils/config';

const router = express.Router();

if (config.testEnvironment) {
  router.get('/psychologist/:email', testController.getPsychologist);
  router.post('/reset', testController.resetDB);
  router.delete('/psychologist/:email/convention', testController.removeConvention);
}
export default router;
