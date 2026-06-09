import express from 'express';

import psyProfileController from '../controllers/psyProfileController';
import conventionController from '../controllers/conventionController';
import access from '../utils/access';

const router = express.Router();

router.use(access.requirePsyRole);

router.post(
  '/convention',
  conventionController.updateValidators,
  conventionController.update,
);

router.post('/activate', psyProfileController.activate);
router.post(
  '/suspend',
  psyProfileController.suspendValidators,
  psyProfileController.suspend,
);

router.put('/seeTutorial', psyProfileController.seeTutorial);

router.put(
  '/',
  psyProfileController.updateValidators,
  psyProfileController.update,
);

export default router;
