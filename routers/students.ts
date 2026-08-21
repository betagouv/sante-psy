import express from 'express';

import access from '../utils/access';
import { updateValidators } from '../controllers/validators/studentValidators';
import studentsController from '../controllers/studentsController';
import uploadCertificate from '../middlewares/uploadCertificate';

const router = express.Router();

router.put(
  '/:studentId',
  access.checkStudentParam,
  updateValidators,
  studentsController.update,
);

router.put(
  '/:studentId/certificate/:univYear',
  access.checkStudentParam,
  uploadCertificate.single('file'),
  studentsController.updateCertificate,
);

router.use(access.requireStudentRole);

// Student routes will be added here as needed

export default router;
