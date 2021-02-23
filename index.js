require('dotenv').config();

const bodyParser = require('body-parser');
const express = require('express');
const expressSanitizer = require('express-sanitizer');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const expressJWT = require('express-jwt');

const config = require('./utils/config');
const format = require('./utils/format');
const cookie = require('./utils/cookie');

const dbLoginToken = require('./db/loginToken');

const appName = `Santé Psy Étudiants`;
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
const logoutController = require('./controllers/logoutController');

// Desactivate debug log for production as they are a bit too verbose
if( !config.activateDebug ) {
  console.log("console.debug is not active - thanks to ACTIVATE_DEBUG_LOG env variable");
  console.debug = function desactivateDebug() {};
}

app.use(bodyParser.urlencoded({ extended: true }))

app.use(flash());
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
app.locals.format = format

app.use(
  expressJWT({
    secret: config.secret,
    algorithms: ['HS256'],
    getToken: function fromHeaderOrQuerystring (req) { //@TODO fix me
      console.log(" req.cookies",  req.cookies);
      console.log(" req.user",  req.user);
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
        "Vous n'êtes pas identifié pour accéder à cette page (ou votre accès n'est plus valide)",
      );
      console.debug("No token - redirect to login");
      return res.redirect(`/psychologue/login`);
    }
  }
  return next(err);
});

app.get('/', landingController.getLanding);

if (config.featurePsyList) {
  app.get('/consulter-les-psychologues', psyListingController.getPsychologist);
}

if (config.featurePsyPages) {
  app.get('/psychologue/login', loginController.getLogin);
  app.post('/psychologue/login', loginController.postLogin);
  app.get('/psychologue/logout', logoutController.getLogout);

  app.get('/mes-seances', dashboardController.dashboard)
  app.get('/nouvelle-seance', appointmentsController.newAppointment)
  app.post('/creer-nouvelle-seance', appointmentsController.createNewAppointment)
  app.get('/nouveau-patient', patientsController.newPatient)
  app.post('/creer-nouveau-patient', patientsController.createNewPatient)
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

module.exports = app.listen(config.port, () => {
  console.log(`${appName} listening at http://localhost:${config.port}`);
})
