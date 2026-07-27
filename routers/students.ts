import express from 'express';

import access from '../utils/access';
import { updateValidators } from '../controllers/validators/studentValidators';
import studentsController from '../controllers/studentsController';

const router = express.Router();

router.put(
  '/:studentId',
  access.checkStudentParam,
  updateValidators,
  studentsController.update,
);

router.use(access.requireStudentRole);

// Student routes will be added here as needed

export default router;
