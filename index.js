require('dotenv').config();

const bodyParser = require('body-parser');
const express = require('express');
const expressSanitizer = require('express-sanitizer');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const expressJWT = require('express-jwt');
const rateLimit = require("express-rate-limit");
const slowDown = require("express-slow-down");
const cookieParser = require('cookie-parser');

const config = require('./utils/config');
const format = require('./utils/format');

const appName = config.appName;
const appDescription = 'Accompagnement psychologique pour les étudiants';
const appRepo = 'https://github.com/betagouv/sante-psy';
const contactEmail = 'contact-santepsyetudiants@beta.gouv.fr';

const app = express();
const landingController = require('./controllers/landingController');
const dashboardController = require('./controllers/dashboardController');
const appointmentsController = require('./controllers/appointmentsController');
const patientsController = require('./controllers/patientsController');
const psyListingController = require('./controllers/psyListingController');
const loginController = require('./controllers/loginController');

// Desactivate debug log for production as they are a bit too verbose
if( !config.activateDebug ) {
  console.log("console.debug is not active - thanks to ACTIVATE_DEBUG_LOG env variable");
  console.debug = function desactivateDebug() {};
}

app.use(bodyParser.urlencoded({ extended: true }))

app.use(flash());
app.use(cookieParser(config.secret));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/static', express.static('static'));
app.use('/gouvfr', express.static(
  path.join(__dirname, 'node_modules/@gouvfr/all/dist'))
);

app.use(session({
  secret: config.secret,
  resave: false,
  saveUninitialized: true
}));

app.use(flash());

// Mount express-sanitizer middleware here
app.use(expressSanitizer());


// Populate some variables for all views
app.use(function populate(req, res, next){
  res.locals.appName = appName;
  res.locals.appDescription = appDescription;
  res.locals.appRepo = appRepo;
  res.locals.page = req.url;
  res.locals.contactEmail = contactEmail;
  res.locals.errors = req.flash('error');
  res.locals.infos = req.flash('info');
  res.locals.successes = req.flash('success');
  next();
})

app.use(
  expressJWT({
    secret: config.secret,
    algorithms: ['HS256'],
    getToken: function fromHeaderOrQuerystring (req) {
      if( req.cookies !== undefined ) {
        return req.cookies.token;
      } else {
        return null;
      }
    }
  }).unless({
    path: [
      '/',
      '/psychologue/login',
      '/consulter-les-psychologues',
      '/mentions-legales',
      '/donnees-personnelles-et-gestion-des-cookies',
      '/faq',
    ],
  }),
);

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    // redirect to login and keep the requested url in the '?next=' query param
    if (req.method === 'GET') {
      req.flash(
        'error',
        `Vous n'êtes pas identifié pour accéder à cette page ou votre accès n'est plus valide\
         - la connexion est valide durant ${config.sessionDurationHours} heures`,
      );
      console.debug("No token - redirect to login");
      return res.redirect(`/psychologue/login`);
    }
  }

  return next(err);
});


app.locals.format = format
// prevent abuse
const rateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minute window
  max: 1000, // start blocking after X requests for windowMs time
  message: "Trop de requête venant de cette IP, veuillez essayer plus tard."
});
app.use(rateLimiter);

app.get('/', landingController.getLanding);

if (config.featurePsyList) {
  // prevent abuse for some rules
  const speedLimiter = slowDown({
    windowMs: 5 * 60 * 1000, // 5 minutes
    delayAfter: 100, // allow X requests per 5 minutes, then...
    delayMs: 500 // begin adding 500ms of delay per request above 100:
    // request # 101 is delayed by  500ms
    // request # 102 is delayed by 1000ms
    // request # 103 is delayed by 1500ms
    // etc.
  });
  app.get('/consulter-les-psychologues', speedLimiter, psyListingController.getPsychologist);
}

if (config.featurePsyPages) {
  app.get('/psychologue/login', loginController.getLogin);
  // prevent abuse for some rules
  const speedLimiterLogin = slowDown({
    windowMs: 5 * 60 * 1000, // 5 minutes
    delayAfter: 10, // allow X requests per 5 minutes, then...
    delayMs: 500 // begin adding 500ms of delay per request above 100:
  });
  app.post('/psychologue/login', speedLimiterLogin, loginController.postLogin);
  app.get('/psychologue/logout', loginController.getLogout);

  app.get('/psychologue/mes-seances', dashboardController.dashboard)
  app.get('/psychologue/nouvelle-seance', appointmentsController.newAppointment)
  app.post('/psychologue/creer-nouvelle-seance',
    ...appointmentsController.createNewAppointmentValidators,
    appointmentsController.createNewAppointment)
  app.post('/psychologue/api/supprimer-seance',
    appointmentsController.deleteAppointmentValidators,
    appointmentsController.deleteAppointment)
  app.get('/psychologue/nouveau-patient', patientsController.newPatient)
  app.post('/psychologue/api/creer-nouveau-patient',
    patientsController.createNewPatientValidators,
    patientsController.createNewPatient)
  app.get('/psychologue/modifier-patient', patientsController.getEditPatient)
  app.post('/psychologue/api/modifier-patient', patientsController.editPatient)
}

app.get('/mentions-legales', (req, res) => {
  res.render('legalNotice', {
    pageTitle: "Mentions Légales",
  });
})

app.get('/donnees-personnelles-et-gestion-des-cookies', (req, res) => {
  res.render('données-personnelles-et-gestion-des-cookies', {
    pageTitle: "Données personnelles",
  })
})

app.get('*', function redirect404(req, res){
  req.flash('error', "Cette page n'existe pas.")
  res.redirect('/');
});

module.exports = app.listen(config.port, () => {
  console.log(`${appName} listening at http://localhost:${config.port}`);
})
