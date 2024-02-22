import express from 'express';
import slowDown from 'express-slow-down';

import configController from '../controllers/configController';
import psyListingController from '../controllers/psyListingController';
import loginController from '../controllers/loginController';
import statisticsController from '../controllers/statisticsController';

import config from '../utils/config';
import psyProfileController from '../controllers/psyProfileController';
import psyInactiveController from '../controllers/psyInactiveController';
import contactController from '../controllers/contactController';
import studentController from '../controllers/studentController';
import eligibilityController from '../controllers/eligibilityController';

const router = express.Router();

// prevent abuse for some rules
const speedLimiterLogin = slowDown({
  windowMs: 5 * 60 * 1000, // 5 minutes
  delayAfter: config.speedLimitation ? 10 : 10000, // allow X requests per 5 minutes, then...
  delayMs: 500, // begin adding 500ms of delay per request above 10:
});

router.post(
  '/psychologist/sendMail',
  speedLimiterLogin,
  loginController.emailValidators,
  loginController.sendMail,
);
router.post('/psychologist/login', speedLimiterLogin, loginController.login);

router.post(
  '/student/sendMail',
  speedLimiterLogin,
  studentController.mailValidator,
  studentController.sendStudentMail,
);

router.post(
  '/student/saveAnswer',
  speedLimiterLogin,
  studentController.answerValidator,
  studentController.saveAnswer,
);

router.delete(
  '/student/:studentId',
  speedLimiterLogin,
  studentController.unregister,
);

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

router.get('/config', configController.get);
// The reduced route is used by our front to optimise the big chunk of data download
router.get('/trouver-un-psychologue/reduced', psyListingController.getReducedActive);
// The other route is open to the public to get all psys (do not delete !)
router.get('/trouver-un-psychologue', psyListingController.getFullActive);

router.get('/connecteduser', loginController.connectedUser);

router.get('/statistics', statisticsController.getAll);
router.get('/psychologist/:psyId', psyProfileController.getValidators, psyProfileController.get);
router.post('/contact', contactController.sendValidators, contactController.send);
router.post('/psychologist/:token/inactive', psyInactiveController.suspendValidators, psyInactiveController.suspend);
router.post('/psychologist/:token/active', psyInactiveController.activate);
router.get('/eligibility', eligibilityController.getValidators, eligibilityController.get);
export default router;
