import express from 'express';
import { expressjwt } from 'express-jwt';

import psychologistRouter from './psychologist';
import patientsRouter from './patients';
import universitiesRouter from './universities';
import appointmentsRouter from './appointments';

import xsrfProtection from '../middlewares/xsrfProtection';
import refreshToken from '../middlewares/refreshToken';

import psyLoginController from '../controllers/psyLoginController';

import access from '../utils/access';
import config from '../utils/config';

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

router.post('/psychologist/logout', psyLoginController.deletePsyToken);

router.use('/appointments', appointmentsRouter);
router.use('/patients', patientsRouter);
router.use('/universities', universitiesRouter);
router.use('/psychologist/:psyId', access.checkPsyParam, psychologistRouter);

export default router;
