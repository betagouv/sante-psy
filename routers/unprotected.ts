import express from 'express';
import slowDown from 'express-slow-down';

import configController from '../controllers/configController';
import psyListingController from '../controllers/psyListingController';
import universitiesController from '../controllers/universityController';
import loginController from '../controllers/loginController';
import statisticsController from '../controllers/statisticsController';

import config from '../utils/config';
import psyProfileController from '../controllers/psyProfileController';
import contactController from '../controllers/contactController';

const router = express.Router();

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
router.use(speedLimiter);

router.get('/university', universitiesController.getAll);
router.get('/config', configController.getConfig);
// The reduced route is used by our front to optimise the big chunk of data download
router.get('/trouver-un-psychologue/reduced', psyListingController.getReducedActivePsychologists);
// The other route is open to the public to get all psys (do not delete !)
router.get('/trouver-un-psychologue', psyListingController.getFullActivePsychologists);

router.get('/connecteduser', loginController.connectedUser);

router.get('/statistics', statisticsController.getAll);
router.get('/psychologist/:psyId', psyProfileController.getPsyProfilValidators, psyProfileController.getPsyProfile);
router.post('/contact', contactController.sendValidators, contactController.send);

export default router;
