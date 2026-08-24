import express from 'express';

import psyProfileController from '../controllers/psyProfileController';
import conventionController from '../controllers/conventionController';
import access from '../utils/access';
import { emailValidator } from '../controllers/validators/studentValidators';
import {
  checkStudentEligibility,
  seeStudentCertificate,
} from '../controllers/studentEligibilityController';

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

router.get(
  '/check-student-eligibility/:univYear/:studentId',
  checkStudentEligibility,
);

router.get('/see-certificate/:univYear/:studentId', seeStudentCertificate);

export default router;
