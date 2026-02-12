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
import studentNewsletterController from '../controllers/studentNewsletterController';
import studentSignInController from '../controllers/studentSignInController';
import uploadCertificate from '../middlewares/uploadCertificate';

const router = express.Router();

// prevent abuse for some rules
const speedLimiterLogin = slowDown({
  windowMs: 5 * 60 * 1000, // 5 minutes
  delayAfter: config.speedLimitation ? 10 : 10000, // allow X requests per 5 minutes, then...
  delayMs: 500, // begin adding 500ms of delay per request above 10:
});

const speedLimiterSendCertificate = slowDown({
  windowMs: 60 * 60 * 1000, // 60 minutes time window
  delayAfter: 1, // allow 1 request per 60 minutes, then...
  delayMs: 2000, // begin adding 2000ms of delay per request above 1
  max: 3, // block requests after 3 attempts
});

router.post(
  '/auth/sendLoginMail',
  speedLimiterLogin,
  studentSignInController.emailValidator,
  loginController.sendUserLoginMail,
);

router.post(
  '/auth/login',
  speedLimiterLogin,
  loginController.userLogin,
);

router.get(
  '/auth/connected',
  speedLimiterLogin,
  loginController.userConnected,
);

router.post(
  '/psychologist/sendMail',
  speedLimiterLogin,
  loginController.emailValidators,
  loginController.sendMail,
);
router.post('/psychologist/login', speedLimiterLogin, loginController.login);

router.post(
  '/student/signInSecondStepMail',
  speedLimiterLogin,
  studentSignInController.emailValidator,
  studentSignInController.sendStudentSecondStepMail,
);

router.post(
  '/student/sendWelcomeMail',
  speedLimiterLogin,
  studentSignInController.emailValidator,
  studentSignInController.sendWelcomeMail,
);

router.post(
  '/student/signIn/:token',
  speedLimiterLogin,
  studentSignInController.verifyStudentToken
);

router.post(
  '/student/signIn',
  speedLimiterLogin,
  studentSignInController.studentSignInValidator,
  studentSignInController.signIn,
);

router.post(
  '/student/send-certificate',
  speedLimiterSendCertificate,
  uploadCertificate.single('file'),
  studentSignInController.sendCertificate,
);

router.post(
  '/student/sendLoginMail',
  speedLimiterLogin,
  loginController.sendMail,
);

router.post(
  '/studentNewsletter/sendStudentMail',
  speedLimiterLogin,
  studentNewsletterController.mailValidator,
  studentNewsletterController.sendStudentMail,
);

router.post(
  '/studentNewsletter/saveAnswer',
  speedLimiterLogin,
  studentNewsletterController.answerValidator,
  studentNewsletterController.saveAnswer,
);

router.delete(
  '/studentNewsletter/:studentId',
  speedLimiterLogin,
  studentNewsletterController.unregister,
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
router.get(
  '/trouver-un-psychologue/reduced',
  psyListingController.getValidators,
  psyListingController.getReducedActive,
);
// The other route is open to the public to get all psys (do not delete !)
router.get('/trouver-un-psychologue', psyListingController.getFullActive);

router.get('/statistics', statisticsController.getAll);
router.get('/psychologist/:psyId', psyProfileController.getValidators, psyProfileController.get);
router.post('/contact', contactController.sendValidators, contactController.send);
router.post('/psychologist/:token/inactive', psyInactiveController.suspendValidators, psyInactiveController.suspend);
router.post('/psychologist/:token/active', psyInactiveController.activate);

export default router;
