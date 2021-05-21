import express from 'express';
import expressSanitizer from 'express-sanitizer';
import path from 'path';

import expressJWT from 'express-jwt';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import bearerToken from 'express-bearer-token';

import cors from 'cors';

import config from './utils/config';
import cspConfig from './utils/csp-config';
import sentry from './utils/sentry';

import configController from './controllers/configController';
import appointmentsController from './controllers/appointmentsController';
import patientsController from './controllers/patientsController';
import psyListingController from './controllers/psyListingController';
import psyProfileController from './controllers/psyProfileController';
import loginController from './controllers/loginController';
import reimbursementController from './controllers/reimbursementController';
import testController from './controllers/testController';

const { appName } = config;

const app = express();

// Desactivate debug log for production as they are a bit too verbose
if (!config.activateDebug) {
  console.log('console.debug is not active - thanks to ACTIVATE_DEBUG_LOG env variable');
  console.debug = () => {};
}

app.use(cspConfig);

if (config.useCors) {
  app.use(cors({ origin: 'http://localhost:3000' }));
}

if (config.testEnvironment) {
  app.get('/test/psychologue/:email', testController.getPsychologist);
  app.post('/test/reset', testController.resetDB);
  app.delete('/test/psychologue/:email/convention', testController.removeConvention);
}

app.use(express.json());

app.use(bearerToken());

app.use('/static', express.static('static'));
app.use(express.static('./frontend/dist'));

// Mount express-sanitizer middleware here
app.use(expressSanitizer());

app.use('/api/*',
  expressJWT({
    secret: config.secret,
    algorithms: ['HS256'],
    getToken: (req) => req.token,
  }).unless({
    path: [
      '/api/config',
      '/api/trouver-un-psychologue',
      '/api/psychologue/sendMail',
      '/api/psychologue/login',
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
app.get('/api/config', speedLimiter, configController.getConfig);
app.get('/api/trouver-un-psychologue', speedLimiter, psyListingController.getPsychologists);

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

app.get('/api/appointments', appointmentsController.getAppointments);
app.post('/api/appointments',
  appointmentsController.createNewAppointmentValidators,
  appointmentsController.createNewAppointment);
app.delete('/api/appointments/:appointmentId',
  appointmentsController.deleteAppointmentValidators,
  appointmentsController.deleteAppointment);

app.get('/api/patients', patientsController.getPatients);
app.post('/api/patients',
  patientsController.createNewPatientValidators,
  patientsController.createNewPatient);
app.get('/api/patients/:patientId',
  patientsController.getPatientValidators, patientsController.getPatient);
app.put('/api/patients/:patientId',
  patientsController.editPatientValidators,
  patientsController.editPatient);
app.delete('/api/patients/:patientId',
  patientsController.deletePatientValidators,
  patientsController.deletePatient);

app.get('/api/psychologue/mes-remboursements', reimbursementController.reimbursement);
app.post('/api/psychologue/renseigner-convention',
  reimbursementController.updateConventionInfoValidators,
  reimbursementController.updateConventionInfo);

app.get('/api/psychologue/:psyId', psyProfileController.getPsyProfile);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

sentry.initCaptureConsoleWithHandler(app);

module.exports = app.listen(config.port, () => {
  console.log(`${appName} listening at http://localhost:${config.port}`);
});
