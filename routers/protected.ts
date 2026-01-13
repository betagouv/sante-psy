import express from 'express';
import { expressjwt } from 'express-jwt';

import psychologistRouter from './psychologist';
import patientsRouter from './patients';
import universitiesRouter from './universities';
import appointmentsRouter from './appointments';
import studentsRouter from './students';

import xsrfProtection from '../middlewares/xsrfProtection';
import refreshToken from '../middlewares/refreshToken';

import loginController from '../controllers/loginController';

import access from '../utils/access';
import config from '../utils/config';
import studentsController from '../controllers/studentsController';

const router = express.Router();

router.use(expressjwt({
  secret: config.secret,
  algorithms: ['HS256'],
  getToken: (req) => {
    if (req.cookies !== undefined) {
      return req.cookies.token;
    }
    return null;
  },
}));
router.use(xsrfProtection);
router.use(refreshToken);

router.post('/logout', loginController.deleteToken);

router.use('/appointments', appointmentsRouter);
router.use('/patients', patientsRouter);
router.use('/universities', universitiesRouter);
router.use('/psychologist/:psyId', access.checkPsyParam, psychologistRouter);
router.use('/student/:studentId', access.checkStudentParam, studentsRouter);

router.use('/student/:studentId/appointments', access.checkStudentParam, studentsController.getStudentAppointments);

export default router;
