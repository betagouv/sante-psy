require('dotenv').config();

const bodyParser = require('body-parser');
// Dernière mise à jour: il y a 2 ans(https://www.npmjs.com/package/body-parser)
const express = require('express'); // Dernière mise à jour: il y a 1 an (https://www.npmjs.com/package/express)
const expressSanitizer = require('express-sanitizer');
// Dernière mise à jour: il y a 2 ans(https://www.npmjs.com/package/express-sanitizer)

const path = require('path'); // Dernière mise à jour: il y a 6 ans(https://www.npmjs.com/package/path)

const flash = require('connect-flash');
// Dernière mise à jour: il y a 8 ans(https://www.npmjs.com/package/connect-flash)
const expressJWT = require('express-jwt');
// Dernière mise à jour: il y a 9 mois(https://www.npmjs.com/package/express-jwt)
const rateLimit = require("express-rate-limit");
// Dernière mise à jour: il y a 2 mois(https://www.npmjs.com/package/express-rate-limit)

const slowDown = require("express-slow-down");
// Dernière mise à jour: il y a 4 mois(https://www.npmjs.com/package/express-slow-down)
const cookieParser = require('cookie-parser');
// Dernière mise à jour: il y a 1 an (https://www.npmjs.com/package/cookie-parser)
const cookieSession = require('cookie-session');
// Dernière mise à jour: il y a 1 an (https://www.npmjs.com/package/cookie-session)
const csrf = require('csurf');
// Dernière mise à jour: il y a 1 an (https://www.npmjs.com/package/csurf)

const config = require('./utils/config');
const format = require('./utils/format');
const cspConfig = require('./utils/csp-config');
const sentry = require('./utils/sentry'); // Attention à ne pas logger des infos sensibles


const appName = config.appName;
const appDescription = 'Accompagnement psychologique pour les étudiants';
// Ces 2 valeurs en dur pourraient être stockées dans la config elles aussi
const appRepo = 'https://github.com/betagouv/sante-psy';

const app = express();
// express se base sur de nombreux middlewares dont la majorité n'est plus maintenue.
// C'est une lib de petit scope. Très populaire. Pourtant elle implémente un javascript dépassé (basé sur les callbacks)
// Aujourd'hui, Fastify(https://www.fastify.io/), Adonis (https://adonisjs.com/), libs au grand scope
// ou encore Nest (framework fullstack) sont optimisés.
// Implémentent du Javascript moderne. Et surtout, elle permettent aux devs de concentrer ses efforts sur le code métier
// Plutôt que sur l'échafaudage du routeur et de ses middlewares.

// J'apprécie particulièrement, ici, la séparation des responsabilités
const landingController = require('./controllers/landingController');
const dashboardController = require('./controllers/dashboardController');
const appointmentsController = require('./controllers/appointmentsController');
const patientsController = require('./controllers/patientsController');
const psyListingController = require('./controllers/psyListingController');
const loginController = require('./controllers/loginController');
const faqController = require('./controllers/faqController');
const reimbursementController = require('./controllers/reimbursementController');

// Desactivate debug log for production as they are a bit too verbose
if( !config.activateDebug ) {
  // Il existe des alternatives paramétrables en fonction de l'environnement et des variables d'environnement Node.js
  // [Roarr](https://www.npmjs.com/package/roarr#roarr-node-js-environment-variables)
  // [Pino](https://github.com/pinojs/pino/blob/HEAD/docs/help.md#debug)
  // [Winston](https://www.npmjs.com/package/winston#usage)
  console.log("console.debug is not active - thanks to ACTIVATE_DEBUG_LOG env variable");
  console.debug = function desactivateDebug() {};
}

app.use(cspConfig);
// Ici, avec Adonis, par exemple, la stratégie de sécurité du contenu peut être gérée sans lib supplémentaire

app.use(bodyParser.urlencoded({ extended: true }))
// Adonis embarque son propre body parser (https://adonisjs.com/docs/4.1/request#_setting_up_bodyparser)

app.use(flash());
app.use(cookieParser(config.secret));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/static', express.static('static'));
app.use('/static/gouvfr', express.static(
  path.join(__dirname, 'node_modules/@gouvfr/all/dist'))
);
app.use('/static/jquery', express.static(
  path.join(__dirname, 'node_modules/jquery/dist'))
);
app.use('/static/tabulator-tables', express.static(
  path.join(__dirname, 'node_modules/tabulator-tables/dist'))
);

// This session cookie (connect.sid) is only used for displaying the flash messages.
// The other session cookie (token) contains the authenticated user session.
app.use(cookieSession({ // Adonis embarque un support de session : https://adonisjs.com/docs/4.1/sessions
  secret: config.secret,
  resave: false,
  saveUninitialized: true,
  maxAge: parseInt(config.sessionDurationHours) * 60 * 60 * 1000
}));

app.use(flash()); // L'alternative d'Adonis : https://adonisjs.com/docs/4.1/sessions#_flash_messages

if (config.useCSRF) {
  console.log("Using CSRF protection");
  app.use(csrf({ cookie: true }));
} else {
  console.log('NOT using CSRF protection due to env variable USE_CSRF - should only be used for test');
}
// Mount express-sanitizer middleware here
app.use(expressSanitizer()); // Adonis et son sanitizer : https://adonisjs.com/docs/4.1/validator#_sanitizing_user_input


// Populate some variables for all views
// Adonis le permet avec les objets globaux : https://adonisjs.com/docs/4.1/views#_globals_2
app.use(function populate(req, res, next){
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
})

app.use(
  expressJWT({
    // Adonis embarque aussi un authentificateur JWT : https://adonisjs.com/docs/4.1/authentication#_jwt
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
      console.log("No token - redirect to login");
      return res.redirect(`/psychologue/login`);
    } else {
      req.flash('error', "Cette page n'existe pas.");
      return res.redirect(`/`);
    }
  } else if( req.cookies === undefined ) {
    req.flash('error', "Cette page n'existe pas.");
    res.redirect('/');
  } else if (err !== 'EBADCSRFTOKEN') { // handle CSRF token errors here
    console.warn(`CSRF token errors detected ${req.csrfToken()} but have ${res.req.body._csrf} in form data`);
    res.status(403);
    req.flash('error', "Une erreur est survenue, pouvez-vous réssayer ?");
    return res.redirect(`/psychologue/mes-seances`);
  }

  return next(err);
});


app.locals.format = format
// prevent abuse
const rateLimiter = rateLimit({
// Il semblerait que cette fonctionnalité ne soit pas intégrée dans Adonis. Des libs dédiées existent.
  windowMs: 5 * 60 * 1000, // 5 minute window
  max: 1000, // start blocking after X requests for windowMs time
  message: "Trop de requête venant de cette IP, veuillez essayer plus tard."
});
app.use(rateLimiter);

app.get('/', landingController.getLanding);

if (config.featurePsyList) {
  // prevent abuse for some rules
  const speedLimiter = slowDown({ // Les options réutilisées pourraient être stockées dans une constante.
    windowMs: 5 * 60 * 1000, // 5 minutes
    delayAfter: 100, // allow X requests per 5 minutes, then...
    delayMs: 500 // begin adding 500ms of delay per request above 100:
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
    delayMs: 500 // begin adding 500ms of delay per request above 100:
  });
  // J'apprécie le fait que les routes soient regroupées par ressource
  app.post('/psychologue/login',
    speedLimiterLogin,
    loginController.emailValidators,
    loginController.postLogin);
  app.get('/psychologue/logout', loginController.getLogout);

  app.get('/psychologue/mes-seances', dashboardController.dashboard)
  app.get('/psychologue/nouvelle-seance', appointmentsController.newAppointment)
  app.post('/psychologue/creer-nouvelle-seance',
    appointmentsController.createNewAppointmentValidators,
    appointmentsController.createNewAppointment)
  app.post('/psychologue/api/supprimer-seance',
    appointmentsController.deleteAppointmentValidators,
    appointmentsController.deleteAppointment)
  app.get('/psychologue/nouveau-patient', patientsController.newPatient)
  app.post('/psychologue/api/creer-nouveau-patient',
    patientsController.createNewPatientValidators,
    patientsController.createNewPatient)
  app.get('/psychologue/modifier-patient',
    patientsController.getEditPatientValidators,
    patientsController.getEditPatient)
  app.post('/psychologue/api/modifier-patient',
    patientsController.editPatientValidators,
    patientsController.editPatient)

  if (config.featureReimbursementPage) {
    app.get('/psychologue/mes-remboursements', reimbursementController.reimbursement)
    app.post('/psychologue/api/renseigner-convention',
      reimbursementController.updateConventionInfoValidators,
      reimbursementController.updateConventionInfo
    )
  }
}

app.get('/faq', faqController.getFaq);

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

// J'apprécie la centralisation des redirections de 404
app.get('*', function redirect404(req, res){
  if( req.cookies === undefined ) {
    req.flash('error', "Cette page n'existe pas.")
    res.redirect('/');
  } else {
    req.flash('error', "Cette page n'existe pas.")
    return res.redirect(`/psychologue/mes-seances`);
  }
});


sentry.initCaptureConsoleWithHandler(app);

module.exports = app.listen(config.port, () => {
  console.log(`${appName} listening at http://localhost:${config.port}`);
})
