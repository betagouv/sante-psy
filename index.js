require('dotenv').config();

const bodyParser = require("body-parser")
const express = require('express');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');

const config = require('./utils/config');
const format = require('./utils/format');

const appName = `Santé Psy Étudiants`;
const appDescription = 'Accompagnement psychologique pour les étudiants';
const appRepo = 'https://github.com/betagouv/sante-psy';
const contactEmail = 'contact-santepsyetudiants@beta.gouv.fr';

const app = express();
const landingController = require('./controllers/landingController');
const appointmentsController =
  require('./controllers/appointmentsController')
const psyListingController = require('./controllers/psyListingController');

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

app.get('/', landingController.getLanding);

if (config.featurePsyList) {
  app.get('/consulter-les-psychologues', psyListingController.getPsychologist);
}

if (config.FEATURE_PSY_PAGES) {
  app.get('/mes-rendez-vous', appointmentsController.myAppointments)
  app.get('/nouveau-rendez-vous', appointmentsController.newAppointment)
  app.post('/creer-nouveau-rendez-vous', appointmentsController.createNewAppointment)
}

app.get('/mentions-legales', (req, res) => {
  res.render('legalNotice');
})

app.get('/donnees-personnelles-et-gestion-des-cookies', (req, res) => {
  res.render('données-personnelles-et-gestion-des-cookies')
})

module.exports = app.listen(config.port, () => {
  console.log(`${appName} listening at http://localhost:${config.port}`);
})
