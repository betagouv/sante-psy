import express from 'express';

import psyProfileController from '../controllers/psyProfileController';
import conventionController from '../controllers/conventionController';
import access from '../utils/access';
import { emailValidator } from '../controllers/validators/studentValidators';

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

router.post(
  '/student-find',
  psyProfileController.findStudentValidators,
  psyProfileController.findStudent,
);

router.post(
  '/invite-student',
  emailValidator,
  psyProfileController.inviteStudent,
);

router.put('/seeTutorial', psyProfileController.seeTutorial);

router.put(
  '/',
  psyProfileController.updateValidators,
  psyProfileController.update,
);

export default router;
