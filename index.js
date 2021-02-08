require('dotenv').config();

const express = require('express')
const path = require('path')
const flash = require('connect-flash');
const session = require('express-session');
const config = require('./utils/config');

const appName = `Chèques d'Accompagnement Psychologique`
const appDescription = 'Suivi psychologique pour les étudiants'
const appRepo = 'https://github.com/betagouv/cheque-psy'
const contactEmail = 'contact-cheques-psy@beta.gouv.fr'
const port = process.env.PORT || 8080

const app = express();
const psyLinstingController = require('./controllers/psyListingController');

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use('/static', express.static('static'))
app.use('/gouvfr', express.static(path.join(__dirname, 'node_modules/@gouvfr/all/dist')))
app.use(session({
  secret: config.secret,
  resave: false,
  saveUninitialized: true
}))
app.use(session({ cookie: { maxAge: 300000, sameSite: 'lax' } })); // Only used for Flash not safe for others purposes
app.use(flash());

// Populate some variables for all views
app.use(function populate(req, res, next){
  res.locals.appName = appName
  res.locals.appDescription = appDescription
  res.locals.appRepo = appRepo
  res.locals.page = req.url
  res.locals.contactEmail = contactEmail
  res.locals.errors = req.flash('error')
  res.locals.infos = req.flash('info')
  res.locals.successes = req.flash('success')
  next()
})

app.get('/', (req, res) => {
  res.render('landing')
})

app.get('/consulter-les-psychologues', psyLinstingController.getPsychologist)

app.get('/mentions-legales', (req, res) => {
  res.render('legalNotice')
})

module.exports = app.listen(port, () => {
  console.log(`${appName} listening at http://localhost:${port}`)
})