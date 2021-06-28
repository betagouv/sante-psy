import express from 'express';
import expressSanitizer from 'express-sanitizer';

import expressJWT from 'express-jwt';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import cookieParser from 'cookie-parser';

import cors from 'cors';
import compression from 'compression';

import config from './utils/config';
import cspConfig from './utils/csp-config';
import sentry from './utils/sentry';
import access from './utils/access';

import errorManager from './middlewares/errorManager';
import xsrfProtection from './middlewares/xsrfProtection';

import configController from './controllers/configController';
import appointmentsController from './controllers/appointmentsController';
import patientsController from './controllers/patientsController';
import psyListingController from './controllers/psyListingController';
import psyProfileController from './controllers/psyProfileController';
import loginController from './controllers/loginController';
import testController from './controllers/testController';
import getIndex from './controllers/reactController';
import universitiesController from './controllers/universityController';
import conventionController from './controllers/conventionController';

const { appName } = config;

const app = express();

// Desactivate debug log for production as they are a bit too verbose
if (!config.activateDebug) {
  console.log('console.debug is not active - thanks to ACTIVATE_DEBUG_LOG env variable');
  console.debug = () => {};
}

app.use(cspConfig);
app.use(compression());

if (config.useCors) {
  app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
}

if (config.testEnvironment) {
  app.get('/test/psychologue/:email', testController.getPsychologist);
  app.post('/test/reset', testController.resetDB);
  app.delete('/test/psychologue/:email/convention', testController.removeConvention);
}

app.use(express.json());

app.use(cookieParser(config.secret));

app.use('/static', express.static('static'));
app.get('/', getIndex);
app.use(express.static('./frontend/dist'));

app.use(expressSanitizer());

app.use('/api/*',
  expressJWT({
    secret: config.secret,
    algorithms: ['HS256'],
    getToken: (req) => {
      if (req.cookies !== undefined) {
        return req.cookies.token;
      }
      return null;
    },
  }).unless({
    path: [
      '/api/university',
      '/api/config',
      '/api/trouver-un-psychologue',
      '/api/psychologue/sendMail',
      '/api/psychologue/login',
      '/api/connecteduser',
    ],
  }));

// prevent abuse
const rateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minute window
  max: config.speedLimitation ? 1000 : 10000, // start blocking after X requests for windowMs time
  message: 'Trop de requêtes venant de cette IP, veuillez réessayer plus tard.',
});
app.use(rateLimiter);

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

app.get('/api/university', universitiesController.getAll);
app.get('/api/config', speedLimiter, configController.getConfig);
app.get('/api/trouver-un-psychologue', speedLimiter, psyListingController.getActivePsychologists);

// prevent abuse for some rules
const speedLimiterLogin = slowDown({
  windowMs: 5 * 60 * 1000, // 5 minutes
  delayAfter: config.speedLimitation ? 10 : 10000, // allow X requests per 5 minutes, then...
  delayMs: 500, // begin adding 500ms of delay per request above 10:
});
app.post('/api/psychologue/sendMail',
  speedLimiterLogin,
  loginController.emailValidators,
  loginController.sendMail);
app.post('/api/psychologue/login', speedLimiterLogin, loginController.login);
app.get('/api/connecteduser', speedLimiter, loginController.connectedUser);

app.get('/api/psychologue/logout', speedLimiter, loginController.deleteToken);

app.get('/api/appointments', xsrfProtection, appointmentsController.getAppointments);
app.post('/api/appointments', xsrfProtection,
  appointmentsController.createNewAppointmentValidators,
  appointmentsController.createNewAppointment);
app.delete('/api/appointments/:appointmentId', xsrfProtection,
  appointmentsController.deleteAppointmentValidators,
  appointmentsController.deleteAppointment);

app.get('/api/patients', xsrfProtection, patientsController.getPatients);
app.post('/api/patients', xsrfProtection,
  patientsController.createNewPatientValidators,
  patientsController.createNewPatient);
app.get('/api/patients/:patientId', xsrfProtection,
  patientsController.getPatientValidators, patientsController.getPatient);
app.put('/api/patients/:patientId', xsrfProtection,
  patientsController.editPatientValidators,
  patientsController.editPatient);
app.delete('/api/patients/:patientId', xsrfProtection,
  patientsController.deletePatientValidators,
  patientsController.deletePatient);

app.post('/api/psychologue/renseigner-convention',
  xsrfProtection,
  conventionController.conventionInfoValidators,
  conventionController.conventionInfo);

app.post('/api/psychologue/:psyId/activate', xsrfProtection, access.checkPsyParam, psyProfileController.activate);
app.post('/api/psychologue/:psyId/suspend', xsrfProtection,
  [access.checkPsyParam, ...psyProfileController.suspendValidators],
  psyProfileController.suspend);
app.get('/api/psychologue/:psyId', xsrfProtection, access.checkPsyParam, psyProfileController.getPsyProfile);
app.put('/api/psychologue/:psyId', xsrfProtection,
  [access.checkPsyParam, ...psyProfileController.editPsyProfilValidators],
  psyProfileController.editPsyProfile);

app.get('*', getIndex);

app.use(errorManager);

sentry.initCaptureConsoleWithHandler(app);

const server = app.listen(config.port, () => {
  console.log(`${appName} listening at http://localhost:${config.port}`);
});

module.exports = server;
export default server;
