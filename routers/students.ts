import express from 'express';

import access from '../utils/access';
import studentsController from '../controllers/studentsController';

const router = express.Router();

router.use(access.requireStudentRole);

router.use('/appointments', studentsController.getStudentAppointments);

export default router;
