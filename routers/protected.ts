import express from 'express';
import expressJWT from 'express-jwt';

import psychologistRouter from './psychologist';
import patientsRouter from './patients';
import appointmentsRouter from './appointments';

import xsrfProtection from '@middlewares/xsrfProtection';
import refreshToken from '@middlewares/refreshToken';

import loginController from '@controllers/loginController';

import access from '@utils/access';
import config from '@utils/config';

const router = express.Router();

router.use(expressJWT({
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

router.post('/psychologist/logout', loginController.deleteToken);

router.use('/appointments', appointmentsRouter);
router.use('/patients', patientsRouter);
router.use('/psychologist/:psyId', access.checkPsyParam, psychologistRouter);

export default router;
