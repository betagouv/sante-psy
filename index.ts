import bodyParser from 'body-parser';
import express from 'express';
import expressSanitizer from 'express-sanitizer';
import dotenv from 'dotenv';

import flash from 'connect-flash';
import expressJWT from 'express-jwt';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import csrf from 'csurf';

import config from './utils/config';
import date from './utils/date';
import cspConfig from './utils/csp-config';
import sentry from './utils/sentry';

import landingController from './controllers/landingController';
import dashboardController from './controllers/dashboardController';
import appointmentsController from './controllers/appointmentsController';
import patientsController from './controllers/patientsController';
import psyListingController from './controllers/psyListingController';
import loginController from './controllers/loginController';
import faqController from './controllers/faqController';
import reimbursementController from './controllers/reimbursementController';

dotenv.config();

const { appName } = config;
const appDescription = 'Accompagnement psychologique pour les étudiants';
const appRepo = 'https://github.com/betagouv/sante-psy';

const app = express();

// Desactivate debug log for production as they are a bit too verbose
if (!config.activateDebug) {
  console.log('console.debug is not active - thanks to ACTIVATE_DEBUG_LOG env variable');
  console.debug = () => {};
}

app.use(cspConfig);

app.use(bodyParser.urlencoded({ extended: true }));

app.use(flash());
app.use(cookieParser(config.secret));
app.set('view engine', 'ejs');
app.set('views', './views');
app.use('/static', express.static('static'));
app.use('/static/gouvfr', express.static('./node_modules/@gouvfr/dsfr/dist'));
app.use('/static/jquery', express.static('./node_modules/jquery/dist'));
app.use('/static/tabulator-tables', express.static('./node_modules/tabulator-tables/dist'));

// This session cookie (connect.sid) is only used for displaying the flash messages.
// The other session cookie (token) contains the authenticated user session.
app.use(cookieSession({
  secret: config.secret,
  maxAge: parseInt(config.sessionDurationHours) * 60 * 60 * 1000,
}));

app.use(flash());

if (config.useCSRF) {
  console.log('Using CSRF protection');
  app.use(csrf({ cookie: true }));
} else {
  console.log('NOT using CSRF protection due to env variable USE_CSRF - should only be used for test');
}
// Mount express-sanitizer middleware here
app.use(expressSanitizer());

// Populate some variables for all views
app.use((req, res, next) => {
  if (config.useCSRF) {
    res.locals._csrf = req.csrfToken();
  } else {
    res.locals._csrf = '';
  }
  res.locals.appName = appName;
  res.locals.appDescription = appDescription;
  res.locals.appRepo = appRepo;
  res.locals.page = req.url;
  res.locals.contactEmail = config.contactEmail;
  res.locals.errors = req.flash('error');
  res.locals.infos = req.flash('info');
  res.locals.successes = req.flash('success');
  res.locals.featureReimbursementPage = config.featureReimbursementPage;
  next();
});

app.use(
  expressJWT({
    secret: config.secret,
    algorithms: ['HS256'],
    getToken: function fromHeaderOrQuerystring(req) {
      if (req.cookies !== undefined) {
        return req.cookies.token;
      }
      return null;
    },
  }).unless({
    path: [
      '/',
      '/psychologue/login',
      '/trouver-un-psychologue',
      '/consulter-les-psychologues',
      '/mentions-legales',
      '/donnees-personnelles-et-gestion-des-cookies',
      '/faq',
    ],
  }),
);

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    const psychologueWorkspaceRegexp = new RegExp(/\/psychologue\//, 'g');
    if (psychologueWorkspaceRegexp.test(req.originalUrl)) {
      req.flash(
        'error',
        `Vous n'êtes pas identifié pour accéder à cette page ou votre accès n'est plus valide\
         - la connexion est valide durant ${config.sessionDurationHours} heures`,
      );
      console.log('No token - redirect to login');
      return res.redirect('/psychologue/login');
    }
    req.flash('error', "Cette page n'existe pas.");
    return res.redirect('/');
  } if (req.cookies === undefined) {
    req.flash('error', "Cette page n'existe pas.");
    res.redirect('/');
  } else if (err !== 'EBADCSRFTOKEN') { // handle CSRF token errors here
    console.warn(`CSRF token errors detected ${req.csrfToken()} but have ${res.req.body._csrf} in form data`);
    res.status(403);
    req.flash('error', 'Une erreur est survenue, pouvez-vous réssayer ?');
    return res.redirect('/psychologue/mes-seances');
  }

  return next(err);
});

app.locals.date = date;
// prevent abuse
const rateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minute window
  max: 1000, // start blocking after X requests for windowMs time
  message: 'Trop de requêtes venant de cette IP, veuillez réessayer plus tard.',
});
app.use(rateLimiter);

app.get('/', landingController.getLanding);

if (config.featurePsyList) {
  // prevent abuse for some rules
  const speedLimiter = slowDown({
    windowMs: 5 * 60 * 1000, // 5 minutes
    delayAfter: 100, // allow X requests per 5 minutes, then...
    delayMs: 500, // begin adding 500ms of delay per request above 100:
    // request # 101 is delayed by  500ms
    // request # 102 is delayed by 1000ms
    // request # 103 is delayed by 1500ms
    // etc.
  });
  app.get('/trouver-un-psychologue', speedLimiter, psyListingController.getPsychologist);
  app.get('/consulter-les-psychologues', speedLimiter, psyListingController.getPsychologist);
}

if (config.featurePsyPages) {
  app.get('/psychologue/login', loginController.getLogin);
  // prevent abuse for some rules
  const speedLimiterLogin = slowDown({
    windowMs: 5 * 60 * 1000, // 5 minutes
    delayAfter: 10, // allow X requests per 5 minutes, then...
    delayMs: 500, // begin adding 500ms of delay per request above 100:
  });
  app.post('/psychologue/login',
    speedLimiterLogin,
    loginController.emailValidators,
    loginController.postLogin);
  app.get('/psychologue/logout', loginController.getLogout);

  app.get('/psychologue/mes-seances', dashboardController.dashboard);
  app.post('/psychologue/mes-seances', dashboardController.dashboard);
  app.get('/psychologue/nouvelle-seance', appointmentsController.newAppointment);
  app.post('/psychologue/creer-nouvelle-seance',
    appointmentsController.createNewAppointmentValidators,
    appointmentsController.createNewAppointment);
  app.post('/psychologue/api/supprimer-seance',
    appointmentsController.deleteAppointmentValidators,
    appointmentsController.deleteAppointment);
  app.get('/psychologue/nouveau-patient', patientsController.newPatient);
  app.post('/psychologue/api/creer-nouveau-patient',
    patientsController.createNewPatientValidators,
    patientsController.createNewPatient);
  app.get('/psychologue/modifier-patient',
    patientsController.getEditPatientValidators,
    patientsController.getEditPatient);
  app.post('/psychologue/api/modifier-patient',
    patientsController.editPatientValidators,
    patientsController.editPatient);
  app.post('/psychologue/api/supprimer-patient',
    patientsController.deletePatientValidators,
    patientsController.deletePatient);

  if (config.featureReimbursementPage) {
    app.get('/psychologue/mes-remboursements', reimbursementController.reimbursement);
    app.post('/psychologue/api/renseigner-convention',
      reimbursementController.updateConventionInfoValidators,
      reimbursementController.updateConventionInfo);
  }
}

app.get('/faq', faqController.getFaq);

app.get('/mentions-legales', (req, res) => {
  res.render('legalNotice', {
    pageTitle: 'Mentions Légales',
  });
});

app.get('/donnees-personnelles-et-gestion-des-cookies', (req, res) => {
  res.render('données-personnelles-et-gestion-des-cookies', {
    pageTitle: 'Données personnelles',
  });
});

app.get('*', (req, res) => {
  if (req.cookies === undefined) {
    req.flash('error', "Cette page n'existe pas.");
    res.redirect('/');
  } else {
    req.flash('error', "Cette page n'existe pas.");
    res.redirect('/psychologue/mes-seances');
  }
});

sentry.initCaptureConsoleWithHandler(app);

module.exports = app.listen(config.port, () => {
  console.log(`${appName} listening at http://localhost:${config.port}`);
});
