import express from 'express';
import slowDown from 'express-slow-down';

import configController from '../controllers/configController';
import psyListingController from '../controllers/psyListingController';
import universitiesController from '../controllers/universityController';
import loginController from '../controllers/loginController';

import config from '../utils/config';

const router = express.Router();

// prevent abuse for some rules
const speedLimiter = slowDown({
  windowMs: 5 * 60 * 1000, // 5 minutes
  delayAfter: config.speedLimitation ? 100 : 10000, // allow X requests per 5 minutes, then...
  delayMs: 500, // begin adding 500ms of delay per request above 100:
  // request # 101 is delayed by  500ms
  // request # 102 is delayed by 1000ms
  // request # 103 is delayed by 1500ms
  // etc.
});

router.get('/university', speedLimiter, universitiesController.getAll);
router.get('/config', speedLimiter, configController.getConfig);
router.get('/trouver-un-psychologue', speedLimiter, psyListingController.getActivePsychologists);

// prevent abuse for some rules
const speedLimiterLogin = slowDown({
  windowMs: 5 * 60 * 1000, // 5 minutes
  delayAfter: config.speedLimitation ? 10 : 10000, // allow X requests per 5 minutes, then...
  delayMs: 500, // begin adding 500ms of delay per request above 10:
});

router.post('/psychologist/sendMail',
  speedLimiterLogin,
  loginController.emailValidators,
  loginController.sendMail);
router.post('/psychologist/login', speedLimiterLogin, loginController.login);
router.get('/connecteduser', speedLimiter, loginController.connectedUser);

export default router;
