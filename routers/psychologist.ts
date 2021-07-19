import express from 'express';

import psyProfileController from '@controllers/psyProfileController';
import conventionController from '@controllers/conventionController';

const router = express.Router();

router.post('/convention',
  conventionController.conventionInfoValidators,
  conventionController.conventionInfo);

router.post('/activate', psyProfileController.activate);
router.post('/suspend',
  psyProfileController.suspendValidators,
  psyProfileController.suspend);

router.put('/',
  psyProfileController.editPsyProfilValidators,
  psyProfileController.editPsyProfile);

export default router;
